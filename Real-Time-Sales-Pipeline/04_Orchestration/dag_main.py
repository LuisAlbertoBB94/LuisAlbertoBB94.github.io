"""
DAG: retail_sales_pipeline_orchestrator
DESCRIPTION: Real-time ETL Orchestration (Anonymized)
"""

from airflow import DAG
from airflow.contrib.operators import dataproc_operator
from airflow.providers.google.cloud.operators.dataproc import ClusterGenerator
from airflow.models import Variable
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago
from airflow.utils.trigger_rule import TriggerRule
from datetime import timedelta
import ast
import pendulum

# --- CONFIGURATION ---
local_tz = pendulum.timezone("America/Mexico_City")
start_date_utc = days_ago(1).astimezone(local_tz)

default_args = {
    "owner": "Data-Engineering-Team",
    "depends_on_past": False,
    "start_date": start_date_utc,
    "retries": 1,
}

dag = DAG(
    "retail_sales_pipeline_realtime",
    default_args=default_args,
    description="Automated Retail ETL Pipeline (SAP to BigQuery)",
    schedule_interval="0 7-22 * * *", 
    catchup=False,
)

# 1. Infrastructure: Dynamic Dataproc Cluster
CLUSTER_CONFIG = ClusterGenerator(
    project_id="corporate-data-lake-prd",
    zone="us-central1-a",
    master_machine_type="e2-standard-4",
    worker_machine_type="e2-standard-4",
    num_workers=2,
    idle_delete_ttl=3600,
).make()

create_cluster = dataproc_operator.DataprocCreateClusterOperator(
    task_id="provision_infra_cluster",
    dag=dag,
    cluster_name="pipeline-cluster-{{ ds_nodash }}",
    region="us-central1",
    cluster_config=CLUSTER_CONFIG,
)

# 2. Extraction Step
extract_task = BashOperator(
    task_id="extract_from_sap_hana",
    dag=dag,
    bash_command="gcloud dataproc jobs submit pig --cluster=pipeline-cluster-{{ ds_nodash }} --region=us-central1 -e='sh extract_logic.sh landing-bucket staging-bucket'",
)

# 3. Cleanup
delete_cluster = dataproc_operator.DataprocClusterDeleteOperator(
    task_id="deprovision_infra_cluster",
    dag=dag,
    region="us-central1",
    cluster_name="pipeline-cluster-{{ ds_nodash }}",
    trigger_rule=TriggerRule.ALL_DONE,
)

create_cluster >> extract_task >> delete_cluster
