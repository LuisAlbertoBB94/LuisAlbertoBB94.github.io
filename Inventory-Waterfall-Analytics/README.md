# Inventory Waterfall Analytics 📉

Welcome to the **Inventory Waterfall (Burn-down) Analytics** project! This repository contains a standalone, anonymized Python application that projects when inventory levels will hit zero and visually graphs the resulting impact on a daily sales budget.

## 🎯 What does it do?

In retail and supply chain analytics, simply knowing your "Total Stock" is not enough. You need to know **when** you will run out of fast-moving products.

This application runs a **30-day projection engine** that:
1. Calculates the expected daily consumption for every single Item/SKU.
2. Depletes the physical stock day by day.
3. Groups the logic by `Category` to show how much **Revenue Capacity (%)** remains.

When the lines drop rapidly (Waterfalling), it indicates a critical shortfall risk—meaning the business won't have enough product to fulfill the daily authorized sales budget.

## 🛠️ Step-by-Step Setup

### 1. Requirements

Make sure you have Python 3.8+ installed. Install the minimum required libraries:
```bash
pip install -r requirements.txt
```

### 2. Generate Local Data
To maintain privacy and a seamless plug-and-play experience, you do NOT need a database connection. Simply run the generator script:
```bash
python generate_dummy_data.py
```
This will randomly generate a `inventory_status.csv` simulating 500 items, different target velocities, locations, and unit pricing.

### 3. Run the Dashboard
Deploy the interactive web app locally using Streamlit:
```bash
streamlit run app.py
```

## 📊 The Math Explained

For each day $d$ from $0$ to $30$:
$$ RemainingStock_d = max(0, CurrentStock - (DailyTargetSales \times d)) $$
$$ CapacityFraction_d = \frac{RemainingStock_d}{DailyTargetSales} \quad (\text{Bounded between 0 and 1}) $$
$$ AchievableRevenue_d = DailyTargetRevenue \times CapacityFraction_d $$

Summing `AchievableRevenue` per Category allows us to visualize precisely what percentage of the budget we can meet before products bleed out.

---
**Author:** Luis Alberto (Lead AI/Data Architect)  
*Built for educational and portfolio demonstration purposes.*
