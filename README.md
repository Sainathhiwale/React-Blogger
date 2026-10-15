# Metering Hudi Replay Pipeline

A production-ready Apache Hudi transaction data lake pipeline on Apache Spark 3.5 and Java 17 for usage metering replays.

## Features
- **Local Development**: Runs out of the box using `local[*]` with automatic synthetic data bootstrapping.
- **AWS EMR Serverless**: Fully configured profile to shade and build uber-JARs targeting Glue Catalog & S3.
- **ACID Upserts**: Copy-on-Write idempotent window updates on S3/local filesystem.

## Quick Start (Local Run)
```bash
# 1. Run unit & integration tests
mvn clean test

# 2. Run local demo execution
mvn exec:java -Dexec.mainClass="com.metering.plane.hudi.HudiReplayApp"
```

## Build for AWS EMR Serverless
```bash
mvn clean package -Pemr -DskipTests
```
The output jar will be in `target/metering-hudi-replay-1.0.0.jar`.
