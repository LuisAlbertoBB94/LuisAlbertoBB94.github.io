import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import os

# ============================================================
# app.py — Stock Burn-down (Waterfall) Analytics
# A demonstration of predicting budget loss due to stock-outs
# ============================================================

st.set_page_config(
    page_title="Inventory Waterfall Analytics",
    page_icon="📉",
    layout="wide"
)

st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
  html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
  .main  { background-color: #0d1117; color: #c9d1d9; }
  .block-container { padding-top: 2rem; padding-bottom: 2rem; }
  .section-header {
    font-size: 1.1rem; font-weight: 600; color: #58a6ff;
    border-left: 4px solid #1f6feb; padding-left: 12px;
    margin: 30px 0 15px 0; text-transform: uppercase; letter-spacing: 0.8px;
  }
</style>
""", unsafe_allow_html=True)

st.title("📉 Inventory Waterfall & Risk Analytics")
st.markdown("This application projects the **Burn-down** of inventory over the next 30 days to identify exactly when stock-outs start eating into our sales budget.")

@st.cache_data
def load_data():
    try:
        # Resolve the absolute path relative to this script
        base_path = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_path, "inventory_status.csv")
        
        if not os.path.exists(file_path):
            st.warning(f"File not found: {file_path}")
            return pd.DataFrame()
            
        return pd.read_csv(file_path)
    except Exception as e:
        st.error(f"Error loading CSV: {e}")
        return pd.DataFrame()

df = load_data()

if df is None or df.empty:
    st.error("⚠️ Database unavailable or Data not found!")
    st.info("Ensure 'inventory_status.csv' is present in the repository and has been pushed.")
    st.stop()

# --- Sidebar Filters ---
with st.sidebar:
    st.header("🔍 Filters")
    categories = df["Category"].unique().tolist()
    selected_cats = st.multiselect("Select Categories", options=categories, default=categories)
    
    locations = df["LocationID"].unique().tolist()
    selected_locs = st.multiselect("Select Locations", options=locations, default=locations)

# Apply filters
filtered_df = df[df["Category"].isin(selected_cats) & df["LocationID"].isin(selected_locs)].copy()

if filtered_df.empty:
    st.warning("No data matches the selected filters.")
    st.stop()

# --- KPI Section ---
st.markdown('<div class="section-header">Macro Overview</div>', unsafe_allow_html=True)

total_items = filtered_df["ItemCode"].nunique()
total_stock = filtered_df["CurrentStockUnits"].sum()
total_target = filtered_df["MonthlyTargetUnits"].sum()

c1, c2, c3 = st.columns(3)
c1.metric("Monitored Items", f"{total_items:,}")
c2.metric("Total Physical Units", f"{int(total_stock):,}")
c3.metric("Monthly Target Units", f"{int(total_target):,}")

st.divider()

# --- Waterfall Logic ---
st.markdown('<div class="section-header">🔮 30-Day Revenue Loss Projection (Waterfall)</div>', unsafe_allow_html=True)
st.info("The chart below visualizes what percentage of our **Daily Authorized Budget** we can actually fulfill based on currently available physical stock by Category.")

def generate_burn_down(forecast_df: pd.DataFrame, days: int = 30) -> pd.DataFrame:
    df_copy = forecast_df.copy()
    
    # Calculate exact daily targets
    df_copy["DailyTargetUnits"] = df_copy["MonthlyTargetUnits"] / 30.0
    df_copy["DailyTargetRevenue"] = df_copy["DailyTargetUnits"] * df_copy["UnitPrice"]
    
    results = []
    hoy = pd.Timestamp.today().normalize()
    
    for d in range(days + 1):
        # Subtract the daily depletion from the current physical stock
        temp_inv = (df_copy["CurrentStockUnits"] - (df_copy["DailyTargetUnits"] * d)).clip(lower=0)
        
        # Calculate what fraction of the daily target we can cover
        # If stock >= daily target, fraction is 1.0 (100%). If stock is halfway, 0.5. If 0 stock, 0.0.
        capacity_fraction = (temp_inv / df_copy["DailyTargetUnits"].replace(0, np.nan)).clip(lower=0, upper=1.0).fillna(0)
        
        # The actual revenue we manage to capture before hitting out of stock
        achievable_revenue = df_copy["DailyTargetRevenue"] * capacity_fraction
        
        # Aggregate by Category
        day_df = pd.DataFrame({
            "Category": df_copy["Category"],
            "AchievableRevenue": achievable_revenue,
            "TargetRevenue": df_copy["DailyTargetRevenue"]
        })
        
        daily_cat = day_df.groupby("Category").sum().reset_index()
        
        # Ratio of achievable vs target
        daily_cat["Fulfillment Capacity (%)"] = (daily_cat["AchievableRevenue"] / daily_cat["TargetRevenue"].replace(0, np.nan)) * 100
        daily_cat["DayIndex"] = d
        daily_cat["Date"] = hoy + pd.Timedelta(days=d)
        
        results.append(daily_cat)
        
    return pd.concat(results)

with st.spinner("Calculating burn-down stress points..."):
    burn_df = generate_burn_down(filtered_df)

fig_burn = px.line(
    burn_df, 
    x="DayIndex", 
    y="Fulfillment Capacity (%)", 
    color="Category",
    title="Burn-Down: Revenue Fulfillment Drop-off Over 30 Days",
    labels={"DayIndex": "Days From Now", "Fulfillment Capacity (%)": "Sales Capacity (%)"},
    template="plotly_dark",
    color_discrete_sequence=px.colors.qualitative.Pastel
)
fig_burn.update_yaxes(range=[0, 105])
fig_burn.update_layout(
    hovermode="x unified",
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

st.plotly_chart(fig_burn, use_container_width=True)

st.markdown("""
> ***How to read this chart:*** 
> At Day 0, we can fulfill ~100% of the target sales. As days pass and we do not receive new shipments, fast-moving items will deplete heavily down to 0, restricting the amount of budget we can clear. If a line drops precipitously early on, it indicates a drastic **shortfall** risk on your best selling SKUs.
""")
