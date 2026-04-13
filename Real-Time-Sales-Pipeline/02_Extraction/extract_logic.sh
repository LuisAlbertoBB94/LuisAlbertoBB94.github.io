#!/bin/bash
# ==============================================================================
# Script: extract_logic.sh
# Purpose: SAP HANA Incremental Extraction via Spark (Anonymized)
# ==============================================================================

if [ $# -lt 2 ]; then
    echo "Usage: sh extract_logic.sh [landing_bucket] [staging_bucket]"
    exit 1
fi

landing_bucket=$1
staging_bucket=$2
project_id="corporate-data-lake-prd"
tables_file="config/target_tables.json"

# Set environment variables for the Spark App
export LANDING_BUCKET="$landing_bucket"
export STAGING_BUCKET="$staging_bucket"
export PROJECT_ID="$project_id"
export TABLES_FILE="$tables_file"

# Run Spark-Submit for SAP Extraction
# Using SAP HANA JDBC Driver (ngdbc) and BigQuery Connector
spark-submit \
    --master yarn \
    --deploy-mode client \
    --conf spark.scheduler.mode=FAIR \
    --jars jars/spark-bigquery-with-dependencies.jar,jars/ngdbc.jar \
    src/main_extractor.py
