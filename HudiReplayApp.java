package com.metering.plane.hudi;

import com.metering.plane.hudi.service.HudiReplayService;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;

import java.io.File;
import java.time.Instant;

public class HudiReplayApp {

    public static void main(String[] args) {
        String tenantId;
        String startTimeStr;
        String endTimeStr;
        String evidenceVaultUri;
        String hudiTableUri;
        boolean isLocalRun = false;

        if (args.length >= 5) {
            tenantId = args[0];
            startTimeStr = args[1];
            endTimeStr = args[2];
            evidenceVaultUri = args[3];
            hudiTableUri = args[4];
        } else {
            isLocalRun = true;
            tenantId = "tenant-alpha";
            startTimeStr = "2026-10-05T00:00:00Z";
            endTimeStr = "2026-10-05T23:59:59Z";

            String tempRoot = new File(System.getProperty("java.io.tmpdir"), "metering-hudi-demo").getAbsolutePath();
            evidenceVaultUri = tempRoot + "/evidence_vault";
            hudiTableUri = tempRoot + "/hudi_ledger";
            System.out.println("Running in LOCAL OFFLINE mode. Data directory: " + tempRoot);
        }

        SparkSession.Builder sessionBuilder = SparkSession.builder()
                .appName("HudiReplayApp-" + tenantId)
                .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
                .config("spark.sql.hive.convertMetastoreParquet", "false");

        if (isLocalRun) {
            sessionBuilder.master("local[*]")
                    .config("spark.ui.enabled", "false");
        }

        SparkSession spark = sessionBuilder.getOrCreate();

        try {
            if (isLocalRun) {
                bootstrapLocalTestData(spark, evidenceVaultUri);
            }

            HudiReplayService replayService = new HudiReplayService(
                    spark, evidenceVaultUri, hudiTableUri, !isLocalRun
            );

            System.out.println("Initiating Replay for Tenant: " + tenantId);
            long committed = replayService.executeReplay(
                    tenantId, 
                    Instant.parse(startTimeStr), 
                    Instant.parse(endTimeStr)
            );
            System.out.println("Replay completed successfully. Records upserted: " + committed);

            if (isLocalRun) {
                System.out.println("\n--- Querying Upserted Hudi Table Locally ---");
                Dataset<Row> resultDf = spark.read().format("org.apache.hudi").load(hudiTableUri);
                resultDf.select(
                        "ledger_record_key", 
                        "raw_quantity", 
                        "billable_quantity", 
                        "status", 
                        "partition_date"
                ).show(false);
            }

        } finally {
            spark.stop();
        }
    }

    private static void bootstrapLocalTestData(SparkSession spark, String path) {
        System.out.println("Generating synthetic cold-path evidence records at: " + path);
        Dataset<Row> syntheticData = spark.sql(
            "SELECT 'evt-001' AS event_id, 'tenant-alpha' AS tenant_id, 'compute_ms' AS meter_id, " +
            "TIMESTAMP '2026-10-05 10:15:00' AS event_timestamp, 'hash-a1' AS payload_hash, '{}' AS raw_payload " +
            "UNION ALL " +
            "SELECT 'evt-002', 'tenant-alpha', 'compute_ms', TIMESTAMP '2026-10-05 10:45:00', 'hash-a2', '{}' " +
            "UNION ALL " +
            "SELECT 'evt-003', 'tenant-alpha', 'compute_ms', TIMESTAMP '2026-10-05 11:05:00', 'hash-a3', '{}'"
        );
        syntheticData.write().mode(SaveMode.Overwrite).parquet(path);
    }
}
