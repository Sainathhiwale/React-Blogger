package com.metering.plane.hudi.service;

import com.metering.plane.hudi.config.HudiConfigBuilder;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;
import static org.apache.spark.sql.functions.*;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;

public class HudiReplayService implements Serializable {
    private static final long serialVersionUID = 1L;

    private final SparkSession spark;
    private final String evidenceVaultUri;
    private final String hudiTableUri;
    private final boolean isCloudDeployment;

    public HudiReplayService(SparkSession spark, String evidenceVaultUri, 
                             String hudiTableUri, boolean isCloudDeployment) {
        this.spark = Objects.requireNonNull(spark);
        this.evidenceVaultUri = Objects.requireNonNull(evidenceVaultUri);
        this.hudiTableUri = Objects.requireNonNull(hudiTableUri);
        this.isCloudDeployment = isCloudDeployment;
    }

    public long executeReplay(String tenantId, Instant start, Instant end) {
        Timestamp startTs = Timestamp.from(start);
        Timestamp endTs = Timestamp.from(end);

        Dataset<Row> rawEvidence = spark.read()
                .parquet(evidenceVaultUri)
                .filter(col("tenant_id").equalTo(lit(tenantId))
                        .and(col("event_timestamp").geq(lit(startTs)))
                        .and(col("event_timestamp").lt(lit(endTs))));

        Dataset<Row> aggregatedLedger = rawEvidence
                .groupBy(
                        col("tenant_id"),
                        col("meter_id"),
                        window(col("event_timestamp"), "1 hour").getField("start").as("window_start"),
                        window(col("event_timestamp"), "1 hour").getField("end").as("window_end")
                )
                .agg(count("event_id").cast("double").as("raw_quantity"))
                .withColumn("billable_quantity", col("raw_quantity"))
                .withColumn("status", lit("RECONCILED"))
                .withColumn("ledger_record_key", 
                        concat_ws("::", col("tenant_id"), col("meter_id"), col("window_start").cast("string")))
                .withColumn("partition_date", date_format(col("window_start"), "yyyy-MM-dd"))
                .withColumn("last_updated_at", current_timestamp().cast("long"));

        long rowsToCommit = aggregatedLedger.count();
        if (rowsToCommit == 0) {
            return 0L;
        }

        Map<String, String> hudiOptions = new HudiConfigBuilder(
                "canonical_ledger",
                "ledger_record_key",
                "partition_date",
                "last_updated_at"
        ).withGlueSync(isCloudDeployment, "metering").build();

        aggregatedLedger.write()
                .format("org.apache.hudi")
                .options(hudiOptions)
                .mode(SaveMode.Append)
                .save(hudiTableUri);

        return rowsToCommit;
    }
}
