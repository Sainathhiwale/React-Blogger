package com.metering.plane.hudi.config;

import java.util.HashMap;
import java.util.Map;

public final class HudiConfigBuilder {

    private final String tableName;
    private final String recordKeyField;
    private final String partitionPathField;
    private final String precombineField;
    private boolean enableGlueSync = false;
    private String glueDatabase = "metering";

    public HudiConfigBuilder(String tableName, String recordKeyField, 
                             String partitionPathField, String precombineField) {
        this.tableName = tableName;
        this.recordKeyField = recordKeyField;
        this.partitionPathField = partitionPathField;
        this.precombineField = precombineField;
    }

    public HudiConfigBuilder withGlueSync(boolean enable, String database) {
        this.enableGlueSync = enable;
        this.glueDatabase = database;
        return this;
    }

    public Map<String, String> build() {
        Map<String, String> opts = new HashMap<>();
        opts.put("hoodie.table.name", tableName);
        opts.put("hoodie.datasource.write.table.type", "COPY_ON_WRITE");
        opts.put("hoodie.datasource.write.operation", "upsert");
        opts.put("hoodie.datasource.write.recordkey.field", recordKeyField);
        opts.put("hoodie.datasource.write.partitionpath.field", partitionPathField);
        opts.put("hoodie.datasource.write.precombine.field", precombineField);

        opts.put("hoodie.clean.automatic", "true");
        opts.put("hoodie.clean.async", "false");
        opts.put("hoodie.cleaner.commits.retained", "3");

        if (enableGlueSync) {
            opts.put("hoodie.datasource.hive_sync.enable", "true");
            opts.put("hoodie.datasource.hive_sync.mode", "hms");
            opts.put("hoodie.datasource.hive_sync.database", glueDatabase);
            opts.put("hoodie.datasource.hive_sync.table", tableName);
            opts.put("hoodie.datasource.hive_sync.partition_fields", partitionPathField);
            opts.put("hoodie.datasource.hive_sync.partition_extractor_class", 
                     "org.apache.hudi.hive.MultiPartKeysValueExtractor");
        } else {
            opts.put("hoodie.datasource.hive_sync.enable", "false");
        }

        return opts;
    }
}
