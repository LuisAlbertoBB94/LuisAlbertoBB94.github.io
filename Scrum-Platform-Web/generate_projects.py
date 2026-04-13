import json

projects = [
    {
        'id': 'project_costos_ecommerce_v1',
        'name': 'Costos & Ajustes E-commerce',
        'description': 'Recuperación, correcciones operativas y ajustes multi-reporte',
        'color': '#0057b8',
        'status': 'Completado',
        'sprints': [
            {
                'id': 'sprint_1', 'name': 'Sprint 1: Recuperación Costos', 'status': 'Completado',
                'start': '2026-01-01', 'end': '2026-02-17', 'pointsPlanned': 18,
                'tasks': [
                    {'name':'Finalización de arquitectura y saneamiento de datos en E-commerce','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-03'},
                    {'name':'Resolución de incidencia de costos nulos y corrección de duplicidad','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-03'},
                    {'name':'Generación de la nueva lógica de asignación de costos','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-13'},
                    {'name':'Realización de pruebas de integridad y congruencia de la nueva lógica','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-16'},
                    {'name':'Validación y pase a productivo de la nueva lógica de asignación de costos','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-16'},
                    {'name':'Actualización de licencia de acceso para Ximena Paola De Los Santos Roque','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-17'}
                ]
            },
            {
                'id': 'sprint_2', 'name': 'Sprint 2: Correcciones Operativas', 'status': 'Completado',
                'start': '2026-02-13', 'end': '2026-04-09', 'pointsPlanned': 24,
                'tasks': [
                    {'name':'OC Resurtido VTEX','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-02-16'},
                    {'name':'Modificación OC costo 0','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-02-16'},
                    {'name':'Diagnóstico 59 SKUs','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-19'},
                    {'name':'SKUs sin costo SAP','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-02-26'},
                    {'name':'Omisión ZREC','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-03-19'},
                    {'name':'Modificación KASKEY','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-03-19'},
                    {'name':'Cubo paralelo','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-03-12'},
                    {'name':'Alineación E-commerce','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-04-09'}
                ]
            },
            {
                'id': 'sprint_3', 'name': 'Sprint 3: Ajustes Generales multi-reporte', 'status': 'Completado',
                'start': '2026-03-01', 'end': '2026-04-08', 'pointsPlanned': 27,
                'tasks': [
                    {'name':'Ventas Anto','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-03-10'},
                    {'name':'Reasignación PyMes','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-03-10'},
                    {'name':'T998/T999','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-03-30'},
                    {'name':'Liberación Consolidado','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-04-02'},
                    {'name':'Unificación SKU','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-04-06'},
                    {'name':'Validación SKU','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-03-31'},
                    {'name':'Actualización Ppto','responsible':'Alfred','points':3,'status':'Done','progress':100,'completionDate':'2026-04-08'},
                    {'name':'Reto Tec tablas','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-04-07'},
                    {'name':'Reto Tec marca','responsible':'Luis','points':3,'status':'Done','progress':100,'completionDate':'2026-04-07'}
                ]
            }
        ]
    },
    {
        'id': 'p2', 'name': 'Consolidado de Ventas: Tiendas Iguales y Tiendas Totales', 'description': 'Proyecto que consolida los temas de tiendas iguales y totales',
        'color': '#cc0000', 'status': 'Completado',
        'sprints': [
            {
                'id': 'p2_s1', 'name': 'Sprint 1: Implementación Inicial', 'status': 'Completado', 'start': '2025-12-15', 'end': '2026-01-16', 'pointsPlanned': 6,
                'tasks': [
                    {'name': 'Consolidado Version Jairo', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Consolidado Tiendas iguales', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p2_s2', 'name': 'Sprint 2: Ajustes y Cuadre', 'status': 'Completado', 'start': '2026-01-12', 'end': '2026-01-29', 'pointsPlanned': 9,
                'tasks': [
                    {'name': 'Planchar montos Cubo - Consolidado', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Agregar costos Ecommerce en Cubo', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Dashboard Tiendas iguales Periodo', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100}
                ]
            }
        ]
    },
    {
        'id': 'p3', 'name': 'Dashboard de Lealtad MaxPuntos: Redenciones y Acumulación (Segmento 3)', 'description': 'Temas de MaxPuntos Redenciones',
        'color': '#10b981', 'status': 'Completado',
        'sprints': [
            {
                'id': 'p3_s1', 'name': 'Sprint 1: Desarrollo Consultas Base', 'status': 'Completado', 'start': '2025-12-01', 'end': '2025-12-05', 'pointsPlanned': 15,
                'tasks': [
                    {'name': 'Desarrollo de Vistas Detalle', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Ajuste de filtros en consultas', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Actualización inicial de dashboard', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Identificación y Corrección de Puntos Acumulados', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Actualización extracciones y subida', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p3_s2', 'name': 'Sprint 2: Estabilización y Adición', 'status': 'Completado', 'start': '2025-12-02', 'end': '2025-12-10', 'pointsPlanned': 12,
                'tasks': [
                    {'name': 'Agregar campo Correo EMAIL', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Investigación usuarios registrados no cargados', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Ajuste de Alias en visualización', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Resolver la columna ABC', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p3_s3', 'name': 'Sprint 3: Extracción Específica', 'status': 'Completado', 'start': '2026-01-05', 'end': '2026-02-24', 'pointsPlanned': 9,
                'tasks': [
                    {'name': 'Listado de cupones y redenciones 2025', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Guardar el query ext. MaxPuntos', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Extracción redenciones cupón 15339', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100}
                ]
            }
        ]
    },
    {
        'id': 'p4', 'name': 'Dashboard de Faltantes y Gestión de Productos TOP (100, 500, 900)', 'description': 'Dashboard Faltantes - Productos TOP',
        'color': '#f59e0b', 'status': 'Completado',
        'sprints': [
            {
                'id': 'p4_s1', 'name': 'Sprint 1: Datos', 'status': 'Completado', 'start': '2026-02-01', 'end': '2026-03-09', 'pointsPlanned': 12,
                'tasks': [
                    {'name': 'Obtener acceso a BD', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Compartir reporte inicial faltantes', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Crear directorio de tiendas', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Dashboard por cada tienda', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p4_s2', 'name': 'Sprint 2: Acceso', 'status': 'Completado', 'start': '2026-03-20', 'end': '2026-04-06', 'pointsPlanned': 9,
                'tasks': [
                    {'name': 'Validación de acceso a Dash', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Acceso 81 sucursales', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Actualización indicador semanal', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p4_s3', 'name': 'Sprint 3: Revisión', 'status': 'Completado', 'start': '2026-04-06', 'end': '2026-04-10', 'pointsPlanned': 12,
                'tasks': [
                    {'name': 'Falla datos presupuesto', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Sesión para revisar cálculos', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Aplicación de cambios', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Revisión final dashboard', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100}
                ]
            }
        ]
    },
    {
        'id': 'p5', 'name': 'Consolidado de Ventas: Reajuste de Ventas Antolín / Globales', 'description': 'Reajuste de Línea de Negocio',
        'color': '#8b5cf6', 'status': 'Completado',
        'sprints': [
            {
                'id': 'p5_s1', 'name': 'Sprint 1: Inicial', 'status': 'Completado', 'start': '2026-01-26', 'end': '2026-02-20', 'pointsPlanned': 9,
                'tasks': [
                    {'name': 'Validación inicial consolidado', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Habilitar filtro de línea negocio', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Revisión facturas Antolín', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p5_s2', 'name': 'Sprint 2: Reajustes', 'status': 'Completado', 'start': '2026-03-01', 'end': '2026-03-30', 'pointsPlanned': 9,
                'tasks': [
                    {'name': 'Aplicación modificaciones Antolín', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Envío reportes ambiente prueba', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Reasignación y devolución Depto 50', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p5_s3', 'name': 'Sprint 3: Liberación', 'status': 'Completado', 'start': '2026-03-30', 'end': '2026-04-07', 'pointsPlanned': 12,
                'tasks': [
                    {'name': 'Validación tableros prueba', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Aprobación reportes', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Liberación a prod', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Alinear LN', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100}
                ]
            }
        ]
    },
    {
        'id': 'p6', 'name': 'Dashboard WFM_SAP: Venta y Clientes por Hora', 'description': 'Análisis Detallado',
        'color': '#ec4899', 'status': 'Completado',
        'sprints': [
            {
                'id': 'p6_s1', 'name': 'Sprint 1: Liberación', 'status': 'Completado', 'start': '2026-04-01', 'end': '2026-04-06', 'pointsPlanned': 6,
                'tasks': [
                    {'name': 'Liberación WFM_SAP', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Hojas nuevas Clientes/Ventas x Hora', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p6_s2', 'name': 'Sprint 2: Observaciones', 'status': 'Completado', 'start': '2026-04-06', 'end': '2026-04-10', 'pointsPlanned': 3,
                'tasks': [
                    {'name': 'Cambio nombre WFM_SAP descriptivo', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100}
                ]
            }
        ]
    },
    {
        'id': 'p7', 'name': 'Automatización de Reporte Logístico: ZSOPTRAP2', 'description': 'Tramos 2 Logística',
        'color': '#0ea5e9', 'status': 'Completado',
        'sprints': [
            {
                'id': 'p7_s1', 'name': 'Sprint 1: Contexto', 'status': 'Completado', 'start': '2026-03-10', 'end': '2026-04-09', 'pointsPlanned': 9,
                'tasks': [
                    {'name': 'Definición del problema', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Objetivo y alcance automatización', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Requerimientos técnicos Arturo', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p7_s2', 'name': 'Sprint 2: Reuniones', 'status': 'Completado', 'start': '2026-04-10', 'end': '2026-04-21', 'pointsPlanned': 6,
                'tasks': [
                    {'name': 'Reunión automatización', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Reunión contexto y revisión', 'responsible':'Ambos', 'points':3, 'status':'Done', 'progress':100}
                ]
            }
        ]
    },
    {
        'id': 'p8', 'name': 'Cubo de Ventas SAP: Separación y Consolidado Tiendas Iguales vs Totales', 'description': 'Lógica de separación y unificación',
        'color': '#64748b', 'status': 'Activo',
        'sprints': [
            {
                'id': 'p8_s1', 'name': 'Sprint 1: Definición', 'status': 'Completado', 'start': '2025-11-11', 'end': '2026-02-12', 'pointsPlanned': 15,
                'tasks': [
                    {'name': 'Definir separación TI vs TT', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Validar datos de consolidado', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Activar licencia y acceso inicial', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Documentar reglas de cálculo', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Validación inicial', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p8_s2', 'name': 'Sprint 2: Ajustes', 'status': 'En Desarrollo', 'start': '2026-03-01', 'end': '2026-04-30', 'pointsPlanned': 15,
                'tasks': [
                    {'name': 'Definir aperturas parciales', 'responsible':'Luis', 'points':3, 'status':'In Progress', 'progress':30},
                    {'name': 'Revisar reporte Jairo y Rafa', 'responsible':'Luis', 'points':3, 'status':'To Do', 'progress':0},
                    {'name': 'Corregir descripciones de SKU', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Reintegrar número semana', 'responsible':'Alfred', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Permisos tablas Tableau', 'responsible':'Luis', 'points':3, 'status':'Done', 'progress':100}
                ]
            }
        ]
    },
    {
        'id': 'p9', 'name': 'Dashboard de Ventas: Meses Sin Intereses (MSI)', 'description': 'Diferenciación de Pagos (Contado/Diferido)',
        'color': '#0057b8', 'status': 'Activo',
        'sprints': [
            {
                'id': 'p9_s1', 'name': 'Sprint 1: Reportes Iniciales', 'status': 'Completado', 'start': '2025-06-01', 'end': '2026-03-01', 'pointsPlanned': 6,
                'tasks': [
                    {'name': 'Extracción MSI inicial', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100},
                    {'name': 'Informes MSI varios', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p9_s2', 'name': 'Sprint 2: Detalle', 'status': 'Completado', 'start': '2026-03-01', 'end': '2026-03-30', 'pointsPlanned': 3,
                'tasks': [
                    {'name': 'Pestaña de Detalle', 'responsible':'N/A', 'points':3, 'status':'Done', 'progress':100}
                ]
            },
            {
                'id': 'p9_s3', 'name': 'Sprint 3: Contado vs Diferido', 'status': 'En Desarrollo', 'start': '2026-04-01', 'end': '2026-04-30', 'pointsPlanned': 6,
                'tasks': [
                    {'name': 'Modificar dashboard actual', 'responsible':'Luis', 'points':3, 'status':'To Do', 'progress':0},
                    {'name': 'Análisis requerimientos pago', 'responsible':'Luis', 'points':3, 'status':'In Progress', 'progress':40}
                ]
            }
        ]
    }
]

html_str = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>🔄 Restaurar Todos los Proyectos Scrum Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; gap: 2rem; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 3rem; max-width: 520px; width: 90%; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.5); }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
        .subtitle { color: #94a3b8; font-size: 1rem; margin-bottom: 2rem; }
        .btn { display: inline-block; background: linear-gradient(135deg, #0057b8, #003d82); color: white; padding: 1rem 2.5rem; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1rem; transition: all 0.2s; border: none; cursor: pointer; width: 100%; margin-top:2rem;}
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,87,184,0.4); }
    </style>
</head>
<body>
<div class="card">
    <div class="icon">🚀</div>
    <h1>Inicializando Todos los Proyectos</h1>
    <p class="subtitle">Limpiando datos y estructurando TODO el portafolio (9 Proyectos).</p>
    <button class="btn" id="goBtn" onclick="runRecovery()">✅ Formatear e Ingestar Data</button>
</div>

<script>
const PILOT_PROJECTS = """ + json.dumps(projects, separators=(',', ':')) + """;

function runRecovery() {
    localStorage.removeItem('scrumSprints');
    localStorage.removeItem('scrumSprints_backup');
    localStorage.removeItem('scrumProjects');
    localStorage.removeItem('scrumProjects_backup');

    const dataStr = JSON.stringify(PILOT_PROJECTS);
    localStorage.setItem('scrumProjects', dataStr);
    localStorage.setItem('scrumProjects_backup', dataStr);

    window.location.href = 'index.html';
}
</script>
</body>
</html>
"""

with open(r'c:\Users\lbb0085566\Desktop\Agente Arquitecto Datos\Proyecto BigQuery\Scrum_Platform\restore-pilot.html', 'w', encoding='utf-8') as f:
    f.write(html_str)
