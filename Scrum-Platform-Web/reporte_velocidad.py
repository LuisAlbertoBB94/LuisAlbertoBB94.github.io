#!/usr/bin/env python3
import re
from datetime import datetime

# Leer data.js y extraer CSV
with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const sprintsDataCSV = `([^`]+)`', content, re.DOTALL)
if not match:
    print("No se pudo extraer CSV")
    exit(1)
csv_content = match.group(1).strip()
lines = csv_content.split('\n')

# Parsear
sprint_map = {}
for i, line in enumerate(lines):
    if i == 0:
        continue  # header
    parts = [p.strip() for p in line.split(',')]
    if len(parts) < 6:
        continue
    sprint_id = parts[0]
    if not sprint_id:
        continue
    # Crear sprint si no existe
    if sprint_id not in sprint_map:
        sprint_map[sprint_id] = {
            'id': sprint_id,
            'name': parts[1],
            'status': parts[2],
            'start': parts[3],
            'end': parts[4],
            'pointsPlanned': int(parts[5]) if parts[5].isdigit() else 0,
            'tasks': []
        }
    # Si hay tarea (columna 6 en adelante)
    if len(parts) >= 10 and parts[6]:
        task = {
            'name': parts[6],
            'responsible': parts[7],
            'points': int(parts[8]) if parts[8].isdigit() else 0,
            'status': parts[9],
            'progress': int(parts[10]) if len(parts) > 10 and parts[10].isdigit() else 0
        }
        sprint_map[sprint_id]['tasks'].append(task)

sprints = list(sprint_map.values())
print(f'Total sprints encontrados: {len(sprints)}')
print('=' * 60)

# Función para convertir fecha DD/MM/YYYY a objeto datetime, fallback a datetime.min
def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%d/%m/%Y')
    except:
        return datetime.min

# Cálculos excluyendo tareas con status "Pendiente"
total_planned = 0
total_completed = 0
completed_sprints = []  # sprints con al menos una tarea Done

for s in sprints:
    sprint_planned = 0
    sprint_completed = 0
    for t in s['tasks']:
        if t['status'] != 'Pendiente':
            sprint_planned += t['points']
        if t['status'] == 'Done':
            sprint_completed += t['points']
    total_planned += sprint_planned
    total_completed += sprint_completed
    if sprint_completed > 0:
        completed_sprints.append({
            'sprint': s,
            'planned': sprint_planned,
            'completed': sprint_completed,
            'start': s['start'],
            'end': s['end']
        })

global_progress = round((total_completed / total_planned) * 100) if total_planned > 0 else 0

print('METRICAS GLOBALES (excluyendo tareas "Pendiente")')
print(f'  • Total de Story Points planeados (sin pendientes): {total_planned}')
print(f'  • Total de Story Points completados (Done): {total_completed}')
print(f'  • Avance global: {global_progress}%')
print()

# Velocidad por sprint (promedio de puntos completados en últimos 3 sprints con tareas completadas)
completed_sprints_sorted = sorted(completed_sprints, key=lambda x: parse_date(x['start']))
last_3 = completed_sprints_sorted[-3:] if len(completed_sprints_sorted) >= 3 else completed_sprints_sorted

avg_velocity = 0
if last_3:
    total_points = sum(item['completed'] for item in last_3)
    avg_velocity = round(total_points / len(last_3))

print('VELOCIDAD POR SPRINT')
print(f'  • Sprints con tareas completadas: {len(completed_sprints_sorted)}')
print(f'  • Últimos 3 sprints con completados:')
for idx, item in enumerate(last_3, start=1):
    print(f'      {idx}. {item["sprint"]["name"]}: {item["completed"]} SP completados')
print(f'  • Velocidad promedio (SP/sprint): {avg_velocity}')
print()

# Velocidad por día (considerando duración de cada sprint)
def days_between(start_str, end_str):
    start = parse_date(start_str)
    end = parse_date(end_str)
    if start == datetime.min or end == datetime.min:
        return 7  # fallback
    diff = end - start
    return max(1, diff.days)

total_days = 0
for item in last_3:
    days = days_between(item['start'], item['end'])
    total_days += days

avg_velocity_per_day = 0
if total_days > 0:
    total_points = sum(item['completed'] for item in last_3)
    avg_velocity_per_day = total_points / total_days

print('VELOCIDAD POR TIEMPO')
print(f'  • Duración total de los últimos {len(last_3)} sprints: {total_days} días')
print(f'  • Velocidad promedio (SP/día): {avg_velocity_per_day:.2f}')
print()

# Desglose detallado por sprint
print('DETALLE POR SPRINT')
for s in sprints:
    sprint_planned = sum(t['points'] for t in s['tasks'] if t['status'] != 'Pendiente')
    sprint_completed = sum(t['points'] for t in s['tasks'] if t['status'] == 'Done')
    progress = round((sprint_completed / sprint_planned) * 100) if sprint_planned > 0 else 0
    print(f'  • {s["name"]} ({s["status"]})')
    print(f'      Planeado (sin pendientes): {sprint_planned} SP')
    print(f'      Completado: {sprint_completed} SP')
    print(f'      Progreso: {progress}%')
    # Tareas pendientes
    pendientes = [t for t in s['tasks'] if t['status'] == 'Pendiente']
    if pendientes:
        print(f'      Tareas pendientes (excluidas): {len(pendientes)}')
        for t in pendientes:
            print(f'          - {t["name"]} ({t["points"]} SP)')
    print()

# Resumen final
print('=' * 60)
print('RESUMEN EJECUTIVO')
print(f'Avance Global: {global_progress}%')
print(f'SP Completados: {total_completed}')
print(f'Velocidad (SP/sprint): {avg_velocity}')
print(f'Velocidad (SP/día): {avg_velocity_per_day:.2f}')
print(f'Sprints activos (sin completar): {len([s for s in sprints if s["status"] != "Completado"])}')