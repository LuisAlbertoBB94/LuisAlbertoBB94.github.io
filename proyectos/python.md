---
layout: project # Usa un layout personalizado
title: "Análisis Predictivo de Ventas"
date: 2024-03-15
image: /assets/images/proyectos/ventas-dashboard.jpg
technologies:
  - Python
  - Pandas
  - Power BI
github_url: https://github.com/LuisAlbertoBB94/analisis-ventas
---

## Objetivo
Desarrollé un modelo predictivo para ventas minoristas con **85% de precisión** usando:
- Limpieza de datos con Pandas
- Visualización interactiva en Power BI

## Resultados Clave
✅ Reducción del 30% en tiempo de análisis  
✅ Dashboard ejecutivo con KPIs estratégicos

```python
# Código de ejemplo
import pandas as pd
from sklearn.linear_model import LinearRegression

data = pd.read_csv("ventas.csv")
model = LinearRegression().fit(data[['feature']], data['target'])