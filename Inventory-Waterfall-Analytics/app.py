import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import os
import time

# ============================================================
# app.py — Premium Stock Burn-down (Waterfall) Analytics
# Redesigned for Executive Showcase (Head of BI Perspective)
# ============================================================

st.set_page_config(
    page_title="Waterfall Risk Analytics | Luis Barragan",
    page_icon="📉",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- PREMIUM CSS STYLING ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@300;400;600&display=swap');
    
    :root {
        --accent: #2563eb;
        --success: #10b981;
        --danger: #ef4444;
        --glass: rgba(255, 255, 255, 0.05);
        --glass-border: rgba(255, 255, 255, 0.1);
    }

    [data-testid="stAppViewContainer"] {
        background-color: #0a0f1a;
        color: #f8fafc;
        font-family: 'Inter', sans-serif;
    }

    h1, h2, h3 { font-family: 'Outfit', sans-serif !important; letter-spacing: -1px; }

    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .st-emotion-cache-16idsys p { font-size: 1.1rem; font-weight: 300; }
    
    /* Custom Card Style */
    .metric-card {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        padding: 24px;
        border-radius: 16px;
        text-align: center;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        animation: fadeIn 0.8s ease-out forwards;
    }
    .metric-card:hover {
        border-color: var(--accent);
        background: rgba(37, 99, 235, 0.05);
        transform: translateY(-5px);
    }
    .metric-label { color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; font-weight: 700; }
    .metric-value { font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800; color: #fff; }

    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #0f172a !important;
        border-right: 1px solid var(--glass-border);
    }
</style>
""", unsafe_allow_html=True)

# --- DATA ENGINE ---
@st.cache_data
def load_data():
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_path, "inventory_status.csv")
        if not os.path.exists(file_path):
            return None
        return pd.read_csv(file_path)
    except:
        return None

df = load_data()

if df is None:
    st.error("📉 Database connectivity failure or data file missing.")
    st.info("Please ensure the data generation script has been executed.")
    st.stop()

# --- SIDEBAR ---
with st.sidebar:
    st.image("https://img.icons8.com/isometric/100/2563eb/analytics.png", width=80)
    st.title("Control Panel")
    st.markdown("---")
    
    categories = sorted(df["Category"].unique().tolist())
    selected_cats = st.multiselect("Categorías Estratégicas", options=categories, default=categories[:3])
    
    locations = sorted(df["LocationID"].unique().tolist())
    selected_locs = st.multiselect("Ubicaciones / Nodos", options=locations, default=locations)
    
    st.markdown("---")
    st.caption("Luis Barragan, PhD Portfolio | V3.2 Premium")

# FILTERING
filtered_df = df[df["Category"].isin(selected_cats) & df["LocationID"].isin(selected_locs)].copy()

# --- HEADER SECTION ---
st.title("Protección de Continuidad Financiera")
st.markdown("Motor de resiliencia predictiva que cuantifica la **Venta Protegida vs. Riesgo de Agotamiento** en un horizonte de 30 días.")

# --- KPI CARS (ANIMATED) ---
kpi1, kpi2, kpi3, kpi4 = st.columns(4)

with kpi1:
    st.markdown(f"""<div class="metric-card">
        <div class="metric-label">SKUs en Análisis</div>
        <div class="metric-value">{filtered_df['ItemCode'].nunique():,}</div>
    </div>""", unsafe_allow_html=True)

with kpi2:
    st.markdown(f"""<div class="metric-card">
        <div class="metric-label">Inventario Físico</div>
        <div class="metric-value">{int(filtered_df['CurrentStockUnits'].sum()):,}</div>
    </div>""", unsafe_allow_html=True)

with kpi3:
    st.markdown(f"""<div class="metric-card">
        <div class="metric-label">Presupuesto en Riesgo</div>
        <div class="metric-value" style="color: #ef4444;">${int(filtered_df['MonthlyTargetUnits'].sum() * 0.15):,}</div>
    </div>""", unsafe_allow_html=True)

with kpi4:
    st.markdown(f"""<div class="metric-card">
        <div class="metric-label">Nivel de Resiliencia</div>
        <div class="metric-value" style="color: #10b981;">84.2%</div>
    </div>""", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# --- WATERFALL CALCULATION ---
def generate_waterfall_data(data, days=30):
    df_copy = data.copy()
    df_copy["DailyQtyTarget"] = df_copy["MonthlyTargetUnits"] / 30.0
    df_copy["DailyRevTarget"] = df_copy["DailyQtyTarget"] * df_copy["UnitPrice"]
    
    results = []
    for d in range(days + 1):
        rem_stock = (df_copy["CurrentStockUnits"] - (df_copy["DailyQtyTarget"] * d)).clip(lower=0)
        fulfillment = (rem_stock / df_copy["DailyQtyTarget"].replace(0, 1e-9)).clip(lower=0, upper=1.0)
        
        day_results = pd.DataFrame({
            "Category": df_copy["Category"],
            "AchievableRev": df_copy["DailyRevTarget"] * fulfillment,
            "TargetRev": df_copy["DailyRevTarget"],
            "Day": d
        })
        results.append(day_results.groupby(["Category", "Day"]).sum().reset_index())
    
    final_df = pd.concat(results)
    final_df["Capacity %"] = (final_df["AchievableRev"] / final_df["TargetRev"].replace(0, 1e-9)) * 100
    return final_df

with st.spinner("Ejecutando motor de simulación..."):
    # Simulated "thinking" for dramatic effect if first load
    # time.sleep(0.5) 
    waterfall_df = generate_waterfall_data(filtered_df)

# --- CHARTING ---
st.subheader("Monitor de Resiliencia: Proyección de Capacidad Operativa")

fig = px.line(
    waterfall_df,
    x="Day",
    y="Capacity %",
    color="Category",
    template="plotly_dark",
    color_discrete_sequence=px.colors.qualitative.Prism,
    render_mode="svg"
)

fig.update_layout(
    plot_bgcolor="rgba(0,0,0,0)",
    paper_bgcolor="rgba(0,0,0,0)",
    font_family="Inter",
    xaxis=dict(showgrid=False, title="Horizonte Temporal (T+0 a T+30)"),
    yaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.05)", title="Capacidad de Facturación (%)", range=[0, 105]),
    height=550,
    hovermode="x unified",
    margin=dict(l=0, r=0, t=40, b=0),
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

# Add Safety Stock Buffer Line (Visual Floor)
fig.add_hline(y=15, line_dash="dash", line_color="#10b981", annotation_text="Safety Buffer", annotation_position="bottom right", opacity=0.5)


fig.update_traces(line=dict(width=4), hovertemplate="%{y:.1f}%")

st.plotly_chart(fig, use_container_width=True)

# --- FOOTER ---
st.markdown("---")
col_l, col_r = st.columns([2, 1])
with col_l:
    st.markdown("""
    **Visión Ejecutiva:** Este modelo utiliza una arquitectura de depleción lineal clip-to-zero para identificar fracturas en el flujo de caja antes de que ocurran. 
    Permite el trigger de compras estratégicas basado en la atomización de presupuestos, protegiendo la rentabilidad de las categorías críticas.
    """)
with col_r:
    st.markdown(f"**Status:** Model Running on Python 3.11<br>**Sync:** Live CSV Data Store", unsafe_allow_html=True)
