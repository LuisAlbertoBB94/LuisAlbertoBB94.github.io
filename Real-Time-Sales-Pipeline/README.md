# 🚀 Real-Time ETL Pipeline Architecture
### Leading a Data-Driven Revolution in Retail Sales Analytics

[![Tech Stack](https://img.shields.io/badge/GCP-Composer%20%7C%20Dataproc%20%7C%20BigQuery-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![Language](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tool](https://img.shields.io/badge/Apache_Airflow-Orchestration-017CEE?style=for-the-badge&logo=apache-airflow&logoColor=white)](https://airflow.apache.org/)

---

## 📖 Project Overview
In a high-intensity retail environment, the difference between a profit and a loss often lies in **Data Latency**. This project demonstrates the implementation of a full-scale, real-time data pipeline designed to synchronize critical sales data from **SAP HANA** to **Google BigQuery** for immediate BI consumption.

> [!NOTE]
> **Key Achievement**: Reduced sales reporting latency from 24 hours to **<1 hour**, enabling real-time store performance tracking and inventory protection.

---

## 🛠️ Technical Architecture

This pipeline follows a modular "Step-by-Step" tutorial structure to ensure scalability and ease of maintenance.

### 1. **Infrastructure (Transient Clusters)**
To optimize costs, I implemented **Ephemeral Dataproc Clusters**. Instead of keeping expensive processing power running 24/7, the pipeline provisions a cluster on-demand, executes the workload, and terminates it automatically.
*   **Location**: [`/01_Infrastructure`](./01_Infrastructure/)

### 2. **Hybrid Extraction (SAP HANA Connector)**
Using Spark with custom JDBC drivers, we perform incremental extractions from SAP HANA. The logic handles late-arriving data and ensures high-fidelity synchronization with the source of truth.
*   **Location**: [`/02_Extraction`](./02_Extraction/)

### 3. **High-Performance Transformation**
Raw data is processed through multiple zones (**Landing → Staging → Model**). We use Spark logic to scrub sensitive data, calculate retail margins, and aggregate metrics (loyalty, payments, promotions).
*   **Location**: [`/03_Transformation`](./03_Transformation/)

### 4. **Orchestration (Cloud Composer/Airflow)**
A robust Directed Acyclic Graph (DAG) schedules the pipeline to run every hour. It includes built-in retries, failure alerts, and parallel task execution.
*   **Location**: [`/04_Orchestration`](./04_Orchestration/)

### 5. **Semantic Layer & BI (BigQuery)**
Final materialization into a semantic layer optimized for **Looker Studio**. The logic includes a 7-day high-performance window for real-time dashboards and a full historical partition for deep analytics.
*   **Location**: [`/05_Visualization`](./05_Visualization/)

---

## 💡 Business Impact
*   **Real-Time Monitoring**: Store managers can see sales performance minutes after a ticket is closed.
*   **Cost Efficiency**: 40% reduction in cloud compute costs by using transient vs. persistent clusters.
*   **Data Parity**: 100% financial alignment between legacy systems and the new cloud data lake.

---

## 👤 Author
**Luis Barrag??n**
*Senior BI Lead | PhD in Engineering*

*This project is a sanitized version of professional implementations, designed for educational and architectural demonstration purposes.*
