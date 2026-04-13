# 📊 Explicación - Velocidad de Sprint

## ¿Qué es la Velocidad?

La **velocidad de sprint** es una métrica Scrum que mide cuántos **Story Points (SP)** completa tu equipo en promedio por sprint.

## Cálculo en Scrum Platform

### Fórmula Utilizada:

```
Velocidad Promedio = Promedio de los últimos 3 sprints con tareas completadas
                   = (Total SP completados en Sprint N-2 + Sprint N-1 + Sprint N) / 3
```

### Pasos del Cálculo:

1. **Identifica sprints con tareas completadas**
   - Busca todos los sprints que tengan al menos 1 tarea con estado "Done"
   
2. **Calcula SP completados por sprint**
   - Para cada sprint: suma todos los SP de las tareas con estado "Done"
   
3. **Toma los últimos 3 sprints**
   - Usa solo los 3 sprints más recientes que tengan tareas completadas
   
4. **Calcula el promedio**
   - Suma los SP completados de esos 3 sprints
   - Divide entre 3

### Ejemplo Práctico:

| Sprint | Tareas Done | SP Completados |
|--------|------------|-----------------|
| Sprint 5 | 3 | 25 SP |
| Sprint 6 | 2 | 20 SP |
| Sprint 7 | 4 | 30 SP |

**Velocidad Promedio = (25 + 20 + 30) / 3 = 25 SP/Sprint**

## ¿Por qué aparece vacío (0)?

La velocidad puede mostrar 0 en estos casos:

1. **No hay 3 sprints con tareas completadas**
   - Si solo tienes 1-2 sprints con tareas "Done", se promedian los que existan
   
2. **Todas las tareas están "In Progress" o "To Do"**
   - No hay tareas finalizadas (Done) que contar
   
3. **Los SP completados son muy bajos**
   - La mayoría de tareas aún están en progreso

## Verificación en Dashboard:

Para ver el cálculo exacto:
1. Abre las **Developer Tools** (F12)
2. Ve a la pestaña **Console**
3. Busca el mensaje: `DEBUG Velocidad: { sprintsTotal: X, sprintsWithCompleted: Y, avgVel: Z }`
4. Analiza los valores:
   - `sprintsTotal`: Número total de sprints
   - `sprintsWithCompleted`: Sprints que tienen tareas Done
   - `avgVel`: Velocidad calculada

## Cómo Mejorar la Velocidad:

- ✅ Completa más tareas al 100% (estado "Done")
- ✅ Estima mejor los SP de las tareas
- ✅ Reduce las tareas "In Progress" sin terminar
- ✅ Enfócate en calidad antes de cantidad

---

**Última actualización**: 10 de Marzo de 2026
