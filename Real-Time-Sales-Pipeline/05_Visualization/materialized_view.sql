-- ================================================================
-- BIGQUERY SEMANTIC LAYER: Sales Performance View
-- PURPOSE: Unified view for Looker Studio (Anonymized)
-- ================================================================

CREATE OR REPLACE VIEW `project.semantic_layer.vw_sales_performance` AS

WITH
    Daily_Transactions AS (
        SELECT
            store_id,
            transaction_date,
            net_sales_amt,
            tax_amt,
            quantity_sold,
            unit_cost
        FROM
            `project.model_layer.fact_ticket_detail`
        WHERE
            status_code NOT IN ('VOID', 'RETURN')
    )

SELECT
    T.*,
    (T.net_sales_amt - T.unit_cost) AS gross_margin,
    CURRENT_TIMESTAMP() AS processed_at
FROM
    Daily_Transactions T;
