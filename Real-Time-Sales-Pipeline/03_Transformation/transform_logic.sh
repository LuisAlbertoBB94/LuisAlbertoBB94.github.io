#!/bin/bash
# ==============================================================================
# Script: transform_logic.sh
# Purpose: Clean and Transform Staging Data to Production Model (Anonymized)
# ==============================================================================

if [ $# -lt 2 ]; then
    echo "Usage: sh transform_logic.sh [staging_bucket] [model_bucket]"
    exit 1
fi

staging_bucket=$1
model_bucket=$2
tmp_bq_bucket="gs://corporate-tmp-bq"

# Environment Setup
export STAGING_BUCKET="$staging_bucket"
export MODEL_BUCKET="$model_bucket"
export TMP_BQ_BUCKET="$tmp_bq_bucket"

# Run Spark Transformer
spark-submit \
    --master yarn \
    --deploy-mode client \
    --conf spark.sql.broadcastTimeout=2000 \
    --jars jars/spark-bigquery-with-dependencies.jar \
    src/staging_to_model.py
