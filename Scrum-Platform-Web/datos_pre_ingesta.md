# Estructura Preliminar de Proyectos (Pre-Ingesta)

He normalizado el formato para que **TODOS** los proyectos mantengan exactamente la misma nomenclatura. Eliminé los prefijos "Tarea N -" de aquellos donde venía mezclado, para que al inyectarlos al sistema visual de Scrum se lean únicamente como la acción a realizar.

---

### Mapeo de Proyectos (Homologado)

#### 1. Actualización y Mejora: Reporte de Recuperación de Costos E Commerce OPMX
* **Color Sugerido:** `#0057b8` (Azul Profundo)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Despliegue de Lógica de Costos** (03-feb-26 a 16-feb-26)
    * `[Done]` Compartir reporte y archivos de detalle (Jose Alfredo / 1 SP) ✓ 03-feb-26
    * `[Done]` Validar visualización en Dashboard Tableau prueba (Ximena / 5 SP) ✓ 13-feb-26
    * `[Done]` Pedir a Resurtido ID de pedido VTEX en vendedor (Ximena / 3 SP) ✓ 13-feb-26
    * `[Done]` Modificar OC con costo 0 para recuperar costos (Ximena, Maricela / 5 SP) ✓ 13-feb-26
    * `[Done]` Dar OK para pase de lógica a productivo (Ximena / 5 SP) ✓ 16-feb-26
    * `[Done]` Desplegar nueva lógica de costos a productivo (Jose Alfredo / 8 SP) ✓ 16-feb-26
  * **Sprint 2: Diagnóstico Post-Productivo y Alineación con CUBO** (18-feb-26 a 12-mar-26)
    * `[Done]` Detectar 59 SKUs sin costo tras despliegue (Ximena / 5 SP) ✓ 18-feb-26
    * `[Done]` Realizar diagnóstico de causa raíz costo nulo (Jose Alfredo / 8 SP) ✓ 18-feb-26
    * `[Done]` Revisar 6 facturas sin costo de origen en SAP (Guillermo / 8 SP) ✓ 19-feb-26
    * `[Done]` Revisar pedidos sin referencia y SKUs de servicio (Ximena, Guillermo / 5 SP) ✓ 04-mar-26
    * `[Done]` Confirmar aplicación de correcciones en paralelo (Luis / 1 SP) ✓ 12-mar-26
  * **Sprint 3: Casos Persistentes y Sincronización Final** (19-mar-26 a 09-abr-26)
    * `[Done]` Omitir transacciones ZREC y 9REC (Ximena / 5 SP) ✓ 19-mar-26
    * `[Done]` Modificar pedidos específicos KASKEY, T007 (Ximena / 3 SP) ✓ 19-mar-26
    * `[Done]` Revisar SKUs de servicio Membresías con Memo (Ximena, Guillermo / 5 SP) ✓ 19-mar-26
    * `[Done]` Validar con Memo costo no visualizado (Ximena, Guillermo / 5 SP) ✓ 19-mar-26
    * `[Done]` Mantener reporte con recuperación manual constante (Jose Alfredo / 8 SP) ✓ 30-mar-26
    * `[Done]` Decisión: Casos persistentes e inviabilidad de fuentes (Ambos / 13 SP) ✓ 07-abr-26
    * `[Done]` Alinear dashboard e-commerce con Cubo y Consolidado (Luis / 13 SP) ✓ 07-abr-26
    * `[Done]` Confirmar dashboard actualizado y cuadre (Luis / 1 SP) ✓ 09-abr-26

#### 2. Consolidado de Ventas: Tiendas Iguales y Tiendas Totales
* **Color Sugerido:** `#cc0000` (Rojo)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Implementación Inicial** (15-dic-25 a 16-ene-26)
    * `[Done]` Consolidado Version Jairo (Luis / 3 SP) ✓ 16-ene-26
    * `[Done]` Consolidado Tiendas iguales (Luis / 3 SP) ✓ 31-dic-25
  * **Sprint 2: Ajustes y Cuadre de Montos** (12-ene-26 a 29-ene-26)
    * `[Done]` Planchar montos Cubo - Consolidado (Luis / 3 SP) ✓ 24-ene-26
    * `[Done]` Agregar costos Ecommerce en Cubo (Luis / 3 SP) ✓ 29-ene-26
    * `[Done]` Dashboard Tiendas iguales Periodo (Alfred / 3 SP) ✓ 29-ene-26

#### 2. Dashboard de Lealtad MaxPuntos: Redenciones y Acumulación
* **Color Sugerido:** `#10b981` (Verde Esmeralda)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Desarrollo y Ajuste de Consultas Base** (01-dic-25 a 02-dic-25)
    * `[Done]` Desarrollo de Vistas Detalle (Ambos / 3 SP) ✓ 02-dic-25
    * `[Done]` Ajuste de filtros en consultas (Ambos / 3 SP) ✓ 02-dic-25
    * `[Done]` Actualización inicial de dashboard (Alfred / 3 SP) ✓ 02-dic-25
    * `[Done]` Identificación y Corrección de Puntos Acumulados (Ambos / 3 SP) ✓ 02-dic-25
    * `[Done]` Actualización extracciones y subida de dashboard (Alfred / 3 SP) ✓ 02-dic-25
  * **Sprint 2: Estabilización y Adición de Campos** (02-dic-25 a 10-dic-25)
    * `[Done]` Agregar campo Correo EMAIL (Ambos / 3 SP) ✓ 10-dic-25
    * `[Done]` Investigación de usuarios no cargados (Ambos / 3 SP) ✓ 10-dic-25
    * `[Done]` Ajuste de Alias en visualización (Ambos / 3 SP) ✓ 10-dic-25
    * `[Done]` Resolver la columna ABC en dashboard (Ambos / 3 SP) ✓ 10-dic-25
  * **Sprint 3: Tareas de Extracción** (05-ene-26 a 24-feb-26)
    * `[Done]` Listado de cupones y redenciones 2025 (Luis / 3 SP) ✓ 12-ene-26
    * `[Done]` Guardar query extracción MaxPuntos (Luis / 3 SP) ✓ 10-ene-26
    * `[Done]` Extracción redenciones cupón 15339 (Luis / 3 SP) ✓ 24-feb-26

#### 3. Dashboard de Faltantes y Gestión de Productos TOP (100, 500, 900)
* **Color Sugerido:** `#f59e0b` (Naranja)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Desarrollo e Integración de Datos** (19-feb-26 a 09-mar-26)
    * `[Done]` Obtener acceso BD etiquetas TOP (Luis / 3 SP) ✓ 19-feb-26
    * `[Done]` Compartir reporte inicial faltantes TOP (Luis / 3 SP) ✓ 19-feb-26
    * `[Done]` Crear directorio de tiendas (Ambos / 3 SP) ✓ 27-feb-26
    * `[Done]` Desarrollar Dashboard por tienda (Alfred / 3 SP) ✓ 09-mar-26
  * **Sprint 2: Despliegue y Acceso** (20-mar-26 a 06-abr-26)
    * `[Done]` Solicitud y validación de acceso al Dashboard (Alfred / 3 SP) ✓ 20-mar-26
    * `[Done]` Acceso a las 81 sucursales (N/A / 3 SP) ✓ 23-mar-26
    * `[Done]` Actualización de indicador semanal faltantes (N/A / 3 SP) ✓ 06-abr-26
  * **Sprint 3: Revisión y Corrección de Cálculos** (06-abr-26 a 10-abr-26)
    * `[Done]` Resolución falla de datos presupuesto (N/A / 3 SP) ✓ 06-abr-26
    * `[Done]` Sesión revisión cálculos del reporte (Ambos / 3 SP) ✓ 06-abr-26
    * `[Done]` Aplicación de cambios validados (N/A / 3 SP) ✓ 08-abr-26
    * `[Done]` Revisión final del Dashboard de Faltantes (Ambos / 3 SP) ✓ 10-abr-26

#### 4. Consolidado de Ventas: Reajuste Ventas Antolín / Globales
* **Color Sugerido:** `#8b5cf6` (Morado)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Consolidado Inicial y Filtros** (26-ene-26 a 20-feb-26)
    * `[Done]` Revisión de facturas Antolín en Cubo (Alfred / 3 SP) ✓ 26-ene-26
    * `[Done]` Envío y validación inicial del consolidado (Luis / 3 SP) ✓ 13-feb-26
    * `[Done]` Habilitar filtro de línea de negocio (Luis / 3 SP) ✓ 20-feb-26
  * **Sprint 2: Aplicación de Reajustes** (10-mar-26 a 30-mar-26)
    * `[Done]` Aplicación de modificaciones Ventas Antolín (Luis / 3 SP) ✓ 10-mar-26
    * `[Done]` Envío de reportes ambiente de prueba (Luis / 3 SP) ✓ 10-mar-26
    * `[Done]` Reasignación de Ventas y Devolución Depto 50 (Luis / 3 SP) ✓ 30-mar-26
    * `[Done]` Recuperación T998/T999 canales digitales (Luis / 3 SP) ✓ 30-mar-26
  * **Sprint 3: Validación Final y Liberación** (30-mar-26 a 07-abr-26)
    * `[Done]` Validación de tableros de prueba Reajustados (N/A / 3 SP) ✓ 30-mar-26
    * `[Done]` Aprobación final de reportes funcionales (N/A / 3 SP) ✓ 30-mar-26
    * `[Done]` Liberar cambios estructurales a producción (N/A / 3 SP) ✓ 02-abr-26
    * `[Done]` Alinear Líneas de Negocio con distribución (Luis / 3 SP) ✓ 07-abr-26

#### 5. Dashboard WFM_SAP: Venta y Clientes por Hora
* **Color Sugerido:** `#ec4899` (Rosa)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Liberación y Estructura** (06-abr-26 a 06-abr-26)
    * `[Done]` Liberación de la versión actualizada WFM_SAP (Alfred / 3 SP) ✓ 06-abr-26
    * `[Done]` Integración de Hojas nuevas Clientes/Ventas x Hora (Alfred / 3 SP) ✓ 06-abr-26
  * **Sprint 2: Observaciones Pendientes** (06-abr-26 a 10-abr-26)
    * `[Done]` Resolución de observación sobre Link de Plataforma (Alfred / 3 SP) ✓ 06-abr-26

#### 6. Automatización de Reporte Logístico: ZSOPTRAP2 / Tramos 2
* **Color Sugerido:** `#0ea5e9` (Azul Claro)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Contexto y Planeación** (10-mar-26 a 19-mar-26)
    * `[Done]` Definición técnica del Problema de Múltiples Fuentes (Luis / 3 SP) ✓ 19-mar-26
    * `[Done]` Definición de Objetivo para modelo estructurado (Luis / 3 SP) ✓ 10-mar-26
    * `[Done]` Solicitud y establecimiento de requerimientos con Arturo (Luis / 3 SP) ✓ 19-mar-26
  * **Sprint 2: Reuniones de Coordinación** (15-abr-26 a 21-abr-26)
    * `[Done]` Ejecución de Reunión para Automatización (Luis / 3 SP) ✓ 15-abr-26
    * `[Done]` Ejecución de Reunión de Contexto y Revisión Tramos (Ambos / 3 SP) ✓ 21-abr-26

#### 7. Cubo de Ventas SAP: Separación Tiendas Iguales vs Totales (Pedro)
* **Color Sugerido:** `#64748b` (Gris Pizarra)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Definición Lógica y Alcance** (11-nov-25 a 13-feb-26)
    * `[Done]` Definir la lógica de separación TI vs TT (Luis / 3 SP) ✓ 11-nov-25
    * `[Done]` Activar licencias y otorgar acceso inicial (Luis / 3 SP) ✓ 05-ene-26
    * `[Done]` Validar datos del consolidado (Luis / 3 SP) ✓ 06-ene-26
    * `[Done]` Documentar detalladamente las reglas de cálculo (Luis / 3 SP) ✓ 03-feb-26
    * `[Done]` Ejecutar la validación inicial de dashboards (Luis / 3 SP) ✓ 12-feb-26
  * **Sprint 2: Correcciones Post-Validación** (09-mar-26 a 30-abr-26)
    * `[Done]` Definir lógica y exclusiones para tiendas con cierre parcial (Luis / 3 SP) ✓ 15-abr-26
    * `[Done]` Revisar reporte y criterios de negocio con Jairo/Rafa (Luis / 3 SP) ✓ 20-abr-26
    * `[Done]` Reintegrar el número de semana faltante (Alfred / 3 SP) ✓ 17-mar-26
    * `[Done]` Corregir y unificar las descripciones históricas de SKU (Alfred / 3 SP) ✓ 06-abr-26
    * `[Done]` Revisar permisos de acceso a las tablas de Tableau (Luis / 3 SP) ✓ 06-abr-26

#### 8. Dashboard de Ventas: Meses Sin Intereses (MSI)
* **Color Sugerido:** `#0057b8` (Azul Profundo)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Reportes Iniciales** (01-jun-25 a 15-mar-26)
    * `[Done]` Extracción inicial de la información de MSI (N/A / 3 SP) ✓ 15-jul-25
    * `[Done]` Solicitud y entrega de informes MSI para periodos (N/A / 3 SP) ✓ 15-mar-26
  * **Sprint 2: Actualización y Detalle** (30-mar-26 a 30-mar-26)
    * `[Done]` Desarrollar pestaña de Detalle Tabulación Cruzada (N/A / 3 SP) ✓ 30-mar-26
  * **Sprint 3: Requerimiento "Contado vs. Diferido"** (07-abr-26 a 30-abr-26)
    * `[Done]` Modificar dashboard actual para separar contado/diferido (Luis / 3 SP) ✓ 25-abr-26
    * `[Done]` Análisis de requerimientos técnicos y entrega final (Luis / 3 SP) ✓ 30-abr-26
#### 9. Agente de Cubo de Ventas
* **Color Sugerido:** `#3b82f6` (Azul Brillante)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Estructura, Orquestación y Conexiones Base** (08-feb-26 a 31-mar-26)
    * `[Done]` Definir información a tratar (Luis / 3 SP) ✓
    * `[Done]` Crear proyecto en Cloud Run con interfaz (Luis / 3 SP) ✓
    * `[Done]` Crear diagrama de orquestación (Luis / 3 SP) ✓
    * `[Done]` Implementar API de Gemini 2.5 (Luis / 3 SP) ✓
    * `[Done]` Implementar el Control de Usuario (Luis / 3 SP) ✓
    * `[Done]` Crear Arquitectura ETL Base (Luis / 3 SP) ✓
    * `[Done]` Ejecutar Pruebas de estrés (Alfred / 3 SP) ✓
    * `[Done]` Integrar flujo de Maxpuntos al Agente (Luis / 3 SP) ✓
    * `[Done]` Crear ETL específico para generar tabla conjunta en BQ (Luis / 3 SP) ✓
    * `[Done]` Probar ecosistema del ETL en otra computadora (Alfred / 1 SP) ✓
    * `[Done]` Crear relación matricial entre Maxpuntos y Cubo de ventas (Luis / 3 SP) ✓
    * `[Done]` Desarrollar script de prueba para cargar Maxpuntos los Lunes (Alfred / 1 SP) ✓
#### 10. Análisis de Rentabilidad por SKU Tiendas Advantage
* **Color Sugerido:** `#14b8a6` (Turquesa)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Análisis, Modelado Matemático y Piloto** (23-feb-26 a 10-abr-26)
    * `[Done]` Identificar tablas de inventarios y de facturaciones (Luis / 3 SP) ✓
    * `[Done]` Identificar tablas de catálogo de tiendas e infra (Luis / 3 SP) ✓
    * `[Done]` Definir el modelo matemático de rentabilidad 50/70 (Luis / 3 SP) ✓
    * `[Done]` Implementar módulo de Inventario Inteligente (Luis / 3 SP) ✓
    * `[Done]` Implementar Algoritmo de Matriz BCG (Luis / 3 SP) ✓
    * `[Done]` Ejecutar el Análisis Inteligente de Proyecciones (Luis / 3 SP) ✓
    * `[Done]` Subir artefactos de proyecto a entorno Cloud Run (Luis / 3 SP) ✓
    * `[Done]` Ejecutar Prueba Piloto Integral sobre tienda Advantage (Luis / 3 SP) ✓
    * `[Done]` Validar y limpiar el plano de arquitectura que enviará Jorge (Luis / 3 SP) ✓
    * `[Done]` Realizar Pruebas de estrés para filtros y períodos (Luis / 3 SP) ✓
#### 11. Toolkit SAP - GCP: Configuración de Streaming y Migración
* **Color Sugerido:** `#f97316` (Naranja Oscuro)
* **Status:** Completado
* **Sprints:**
  * **Sprint 1: Configuración Inicial del Entorno** (06-oct-25 a 06-oct-25)
    * `[Done]` Configuración entorno de calidad en SAP GCP (Ambos / 3 SP) ✓ 06-oct-25
    * `[Done]` Ajustes y activación de cadena de procesos (Ambos / 3 SP) ✓ 06-oct-25
    * `[Done]` Activación del destino RFC en la fuente de datos (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Revisión profunda de logs en transacción SLG1 (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Validación de configuración y autenticación del sistema (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Disminución de periodo de replicación a un minuto (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Evaluación/Diagnóstico de inactividad en cuenta de servicio (N/A / 3 SP) ✓ 06-oct-25
  * **Sprint 2: Resolución de Problemas y Acuerdos de Migración** (06-oct-25 a 04-mar-26)
    * `[Done]` Verificar permisos de Firewall sobre URLs necesarias (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Chequeo de permisos nativos de la cuenta de servicio (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Forzar configuración de conexión a protocolo HTTP 2 (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Recabar y referenciar captura de pantalla de error IT (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Consolidar y compartir documentación nativa para BigQuery (N/A / 3 SP) ✓ 06-oct-25
    * `[Done]` Solicitar reunión con René para mapeo de tablas (Luis / 3 SP) ✓ 17-feb-26
    * `[Done]` Consensuar alcance de migración S4 y CAR (N/A / 3 SP) ✓ 17-feb-26
    * `[Done]` Recibir y emitir seguimiento de la propuesta técnica técnica de René (N/A / 3 SP) ✓ 04-mar-26
