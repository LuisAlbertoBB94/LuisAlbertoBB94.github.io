# Reporte Ejecutivo: Estrategia de Lealtad y Analítica Predictiva en Ecommerce
**Rol:** Head of Data  
**Periodo de Ejecución:** Febrero 16, 2026 - Abril 24, 2026  

---

## 1. Visión Estratégica y Resumen Ejecutivo
Como Head of Data, lideré la evolución analítica del ecosistema de Ecommerce de la compañía. El objetivo principal fue transicionar de un modelo de "reporte transaccional" (cuánto vendemos) a un modelo de **Customer Lifetime Value y Retención** (quién nos compra, cada cuánto y cuál es su riesgo de abandono).

El producto final es un ecosistema compuesto por un **Data Cube (Customer 360)**, un modelo de clustering con IA desplegado en la nube, y un **Dashboard Estratégico** que parametriza de forma dinámica la Tasa de Recompra, Frecuencia y Ritmo de Vida de los usuarios.

---

## 2. Retos de Negocio y Soluciones de Ingeniería de Datos

Durante el desarrollo, identificamos falencias en cómo el negocio medía la lealtad. Implementamos las siguientes soluciones técnicas:

### Reto 1: Falsa Frecuencia Promedio (Efecto Carrito Múltiple)
* **Problema:** Un cliente con 5 productos en una sola compra era contado como "5 visitas", distorsionando la métrica de lealtad.
* **Solución (Head of Data):** Creación de una llave única concatenada y uso de Expresiones de Nivel de Detalle (LOD) para contar eventos transaccionales reales.
* **Fórmula Core:**
    ```tableau
    // ID Único Transaccional
    [Email Cliente] + LEFT(STR([Numero Pedido]), LEN(STR([Numero Pedido])) - 2) + STR([Fecha Pedido])
    
    // Frecuencia Real por Cliente
    { FIXED [Email Cliente] : COUNTD([ID_Factura_Unico]) }
    ```

### Reto 2: Parametrización Dinámica del Tiempo
* **Problema:** Los líderes de negocio necesitaban evaluar la frecuencia bajo distintas ópticas (Mensual para Marketing, Anual para Finanzas).
* **Solución:** Desarrollo de un modelo de denominadores dinámicos que ajusta el cálculo de la frecuencia según la "lente" seleccionada en la interfaz, sin duplicar el modelo de datos.
* **Fórmula Core:**
    ```tableau
    // Frecuencia Dinámica
    { FIXED [Email Cliente] : COUNTD([ID_Factura_Unico]) } / { FIXED [Email Cliente] : COUNTD([Periodo Dinamico]) }
    ```

### Reto 3: Distorsión del "Ritmo de Compra" (Cluster Effect)
* **Problema:** Clientes con alto volumen en un solo día reflejaban un ritmo de "compras cada 3 días" cuando en realidad visitaban la tienda una vez al trimestre.
* **Solución:** Cambiar el enfoque de *Transacciones* a *Ciclo de Visita Real*, calculando el delta de tiempo entre días distintos de actividad.
* **Fórmula Core:**
    ```tableau
    DATEDIFF('day', MIN([Fecha]), MAX([Fecha])) / (COUNTD([Fecha]) - 1)
    ```

### Reto 4: Saneamiento de Datos B2B vs B2C
* **Problema:** Cuentas corporativas masivas sesgaban las proyecciones de comportamiento del cliente minorista.
* **Solución:** Implementación de flujos de limpieza e inyección de *Context Filters* en la arquitectura de visualización para aislar los comportamientos atípicos.

---

## 3. Roadmap de Implementación (Agile Sprints)
El proyecto se ejecutó en 5 Sprints bajo un marco ágil, integrando ingeniería de datos, analítica avanzada y MLOps.

* **Sprint 1: Arquitectura y Limpieza de Datos (16 Feb – 27 Feb)**
    * Conexión a fuentes transaccionales (Data Lake).
    * Normalización de llaves de cruce y limpieza de identificadores (Email+Pedido).
    * Filtrado de Outliers y bots corporativos.
* **Sprint 2: Motor Analítico y LODs (02 Mar – 13 Mar)**
    * Desarrollo de métricas multidimensionales (Frecuencia, Tasa de Recompra, Ticket Promedio por Segmento).
    * Parametrización dinámica del modelo (Año/Semestre/Mes).
    * Auditoría matemática de resultados.
* **Sprint 3: Customer 360 Data Cube (16 Mar – 27 Mar)**
    * Construcción de una vista agregada plana (Flat Table) enfocada en el ADN del cliente.
    * Optimización de consultas de 15s a <2s.
* **Sprint 4: IA, Predictibilidad y Cloud Run (30 Mar – 10 Abr)**
    * **IA & Clustering:** K-Means para segmentación de valor vs. comportamiento.
    * **Modelo de Churn:** Algoritmo probabilístico de riesgo de abandono basado en el Ritmo Histórico.
    * **MLOps:** Containerización con Docker y despliegue de API serverless en **Google Cloud Run** para predicciones en tiempo real.
* **Sprint 5: Interfaz Estratégica de Negocio (13 Abr – 24 Abr)**
    * Diseño UX/UI del Dashboard Directivo (Layout corporativo, KPIs directos, segmentaciones de color estratégico).
    * Integración de las predicciones de Cloud Run al BI.
    * Entrega a Stakeholders y documentación.

---

## 4. Impacto en el Negocio (ROI de los Datos)
Gracias a la implementación de este ecosistema analítico, la compañía ahora cuenta con:
1.  **Segmentación Accionable:** Visibilidad clara de la distribución de clientes (Ocasional vs. Recurrente vs. Leal), conociendo que la *Tasa de Recompra* general es del **18.55%**.
2.  **Optimización de Inversión (CAC):** Capacidad de dirigir campañas de retención específicas para el segmento "En desarrollo", guiados por su Ritmo natural de días.
3.  **Proactividad vs Reactividad:** La integración de Cloud Run permite identificar y accionar sobre la probabilidad de abandono *antes* de que el cliente cumpla su ciclo de fuga.
