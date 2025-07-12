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



---

### **4. `_layouts/project.html` (Layout Personalizado)**
```html
---
layout: default
---
<article class="project">
  <header>
    <h1>{{ page.title }}</h1>
    <div class="meta">
      <span class="date">{{ page.date | date: "%B %Y" }}</span>
      <div class="tags">
        {% for tech in page.technologies %}
          <span class="tag">{{ tech }}</span>
        {% endfor %}
      </div>
    </div>
  </header>

  <div class="content">
    {{ content }}
  </div>

  {% if page.github_url %}
  <a href="{{ page.github_url }}" class="github-button">
    <i class="fab fa-github"></i> Ver en GitHub
  </a>
  {% endif %}
</article>