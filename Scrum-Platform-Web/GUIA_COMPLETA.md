# 📋 Guía Completa - Scrum Platform PRO

## 1️⃣ Formato de Fechas

### ¿Cómo funciona?
Las fechas se normalizan automáticamente al formato **DD/MM/YYYY** en toda la plataforma para mayor claridad.

### Entrada de fechas
- **Formato aceptado**: `DD/MM/YYYY` o `DD-MMM-YY` (como en data.js)
- **Ejemplo**: `15/03/2026` o `15-mar-26`

### Dónde ves las fechas
- ✅ Panel de Sprints (lista principal)
- ✅ Detalle de Sprint (sección superior)
- ✅ Reporte Ejecutivo (en pantalla)
- ✅ Reporte Ejecutivo Fullscreen (pantalla completa)

---

## 2️⃣ Sistema de Respaldo Automático

Tu data **se respalda automáticamente** en localStorage con un sistema de 3 niveles:

### Niveles de Protección
1. **Almacenamiento Principal** (`scrumSprints`)
   - Tus datos actuales
   - Se actualiza al guardar

2. **Respaldo Automático** (`scrumSprints_backup`)
   - Se crea automáticamente antes de sobrescribir datos
   - Útil si ocurre un error

3. **data.js** (archivo de base de datos)
   - Base de datos original
   - Se usa como último recurso

### ¿Se borra al actualizar la página?
**NO** ❌ Los datos se guardan en localStorage del navegador.

**Cuando pierdes datos:**
- Limpias el caché/historial del navegador
- Usas navegación privada/incógnito
- Limpias manualmente localStorage

---

## 3️⃣ Botones de Respaldo en Panel Admin

### 📤 Importar Tareas
Carga tareas desde un archivo JSON o CSV

### 💾 Descargar Todo (JSON)
Descarga **TODOS** tus sprints en formato JSON
- Incluye todos los datos
- Fácil de compartir
- Puedes cargar este archivo en cualquier momento

### 💿 Descargar Respaldo
Descarga el último respaldo automático de localStorage
- Es una copia de seguridad
- Útil si cometiste un error

### ⏮️ Restaurar Último Respaldo
Carga los datos del respaldo automático
- ⚠️ Sobrescribe cambios actuales
- Úsalo si algo salió mal

### ℹ️ Ver Respaldo Disponible
Muestra información sobre:
- Cantidad de sprints actuales
- Cantidad de sprints en respaldo
- Tamaño en KB

### 🔄 Auto-Reparar (data.js)
Restaura los datos originales desde data.js
- ⚠️ Requiere confirmación
- Preserva los comentarios/bitácora locales

---

## 4️⃣ Velocidad de Sprint

### ¿Qué es?
Promedio de Story Points completados en los últimos 3 sprints.

### Cálculo
```
Velocidad = (SP completados Sprint N-2 + Sprint N-1 + Sprint N) / 3
```

### ¿Por qué aparece vacío (0)?
- No hay tareas con status "Done" (Completado)
- Menos de 3 sprints tienen tareas completadas
- Los SP completados son muy bajos

### Cómo revisar el cálculo
1. Abre **Developer Tools** (F12)
2. Ve a **Console**
3. Busca: `⚡ Velocidad: X desde Y sprints`

---

## 5️⃣ Reporte Ejecutivo

### Versión Dashboard (en la plataforma)
- Integrado en la pestaña "📊 Reporte Ejecutivo"
- Lado izquierdo con sidebar
- Botón "🖥️ Pantalla Completa"

### Versión Fullscreen (pantalla completa)
- Abre en nueva ventana/pestaña
- Sin sidebar
- Optimized para presentaciones
- Botón impresora para PDF

### Datos mostrados
- **Avance Global**: % de todos los SP completados
- **SP Completados**: Total de puntos done
- **Velocidad Promedio**: Promedio últimos 3 sprints
- **Sprint Actual**: Sprint seleccionado
- **Gráfico**: Últimos 5 sprints
- **Detalle de Sprints**: Los 5 sprints más recientes
- **Tareas Pendientes**: Tareas que falta completar

---

## 6️⃣ Solución de Problemas

### Reporte Ejecutivo no muestra nada
✅ **Solución**: Espera 1-2 segundos a que cargue
- Abre DevTools (F12) → Console
- Busca mensajes en rojo para identificar el error

### Fechas se ven mal
✅ **Solución**: Se normalizan automáticamente a DD/MM/YYYY
- Si vez "09-feb-26", déjalo así al guardar
- El sistema lo convierte automáticamente

### "Sistema recuperado desde data.js"
✅ **Normal**: Significa que se detectó un error y se recuperó automáticamente
- No aparece en alert (solo en console)
- Los datos se restauran automáticamente

### Perdí mis datos
✅ **Paso 1**: Abre Panel Admin → "ℹ️ Ver Respaldo Disponible"
✅ **Paso 2**: Si hay respaldo → "⏮️ Restaurar Último Respaldo"
✅ **Paso 3**: Si no funciona → "🔄 Auto-Reparar (data.js)"

---

## 7️⃣ Flujo Típico de Uso

1. **Crear Sprint** → Ingresa nombre, fechas (formato: DD/MM/YYYY), SP planeados
2. **Agregar Tareas** → Panel Admin → "Agregar Tarea"
3. **Actualizar Progreso** → Cambia status a "Done" cuando se completa
4. **Ver Velocidad** → Se calcula automáticamente en Reporte Ejecutivo
5. **Hacer Respaldo** → Op cional, pero "💾 Descargar Todo" es recomendado

---

## 8️⃣ Best Practices

✅ **Descarga JSON regularmente** (semanal o quincenal)
✅ **Guarda tu JSON en la nube** (OneDrive, Google Drive, etc)
✅ **Revisa la velocidad** en cada retrospectiva
✅ **Completa tareas** (cambiar a "Done") no dejarlas "In Progress"
✅ **Usa fechas claras** (DD/MM/YYYY para menos confusión)

---

**Última actualización**: 10 de Marzo de 2026  
**Versión**: 3.1 - Sistema Mejorado de Respaldos
