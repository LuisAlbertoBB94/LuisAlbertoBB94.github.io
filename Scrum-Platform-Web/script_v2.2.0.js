// ============================================
// SCRUM PLATFORM - SCRIPT MEJORADO v2.2.0
// Con mejor manejo de errores y recuperación
// ============================================

let activeSprintId = null;
let chartsInstance = {};

// --- Recuperación Robusta de Storage ---
function getSprintsFromStorage() {
    try {
        const stored = localStorage.getItem('scrumSprints');
        if (!stored) return [];
        
        const sprints = JSON.parse(stored);
        if (!Array.isArray(sprints)) return [];
        
        // Validar cada elemento
        let dirty = false;
        const cleaned = sprints.filter(sprint => {
            if (!sprint || typeof sprint !== 'object') {
                dirty = true;
                return false;
            }
            if (!sprint.id) {
                sprint.id = 'sprint_' + (sprint.name ? sprint.name.replace(/\s+/g, '_') : Math.random().toString(36).slice(2)) + '_' + Date.now();
                dirty = true;
            }
            return true;
        });
        
        if (dirty) localStorage.setItem('scrumSprints', JSON.stringify(cleaned));
        return cleaned;
    } catch (err) {
        console.error("❌ Error leyendo localStorage:", err);
        return [];
    }
}

function saveSprints(sprints) {
    try {
        localStorage.setItem('scrumSprints', JSON.stringify(sprints));
        console.log("✅ Datos guardados en localStorage");
    } catch (err) {
        console.error("❌ Error guardando datos:", err);
        alert("⚠️ No se pudo guardar. localStorage puede estar lleno.");
    }
}

// --- Recuperación desde data.js ---
function getSystemDataFromJs() {
    console.log("🔄 Intentando cargar desde data.js...");
    if (typeof sprintsDataCSV === 'undefined' || !sprintsDataCSV) {
        console.warn("⚠️ sprintsDataCSV no está definida");
        return [];
    }
    
    try {
        const lines = sprintsDataCSV.trim().split('\n');
        if (lines.length < 2) return [];
        
        const newMap = {};
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(x => x ? x.replace(/"/g, '').trim() : '');
            
            if (row.length < 10) continue;
            const [id, proj, sec, start, end, pP, tN, resp, pt, stat, prog] = row;
            
            if (!id) continue;
            
            if (!newMap[id]) {
                newMap[id] = {
                    id,
                    name: proj || 'Sin Nombre',
                    status: sec || 'Planificado',
                    start: start || '',
                    end: end || '',
                    pointsPlanned: parseInt(pP) || 0,
                    tasks: []
                };
            }
            
            if (tN) {
                newMap[id].tasks.push({
                    name: tN,
                    responsible: resp || 'N/A',
                    points: parseInt(pt) || 0,
                    status: stat || 'To Do',
                    progress: parseInt(prog) || 0
                });
            }
        }
        
        const result = Object.values(newMap);
        console.log(`✅ Cargados ${result.length} sprints desde data.js`);
        return result;
    } catch (err) {
        console.error("❌ Error parsing CSV:", err);
        return [];
    }
}

function resetDataFromJs() {
    if (!confirm('🔄 ¿Restaurar datos desde data.js? Se perderán cambios no guardados.')) return;
    
    try {
        const baseSprints = getSystemDataFromJs();
        if (baseSprints.length === 0) {
            alert("❌ No hay datos en data.js para restaurar");
            return;
        }
        
        // Intentar preservar bitácoras
        const oldSprints = getSprintsFromStorage();
        baseSprints.forEach(bS => {
            const oldS = oldSprints.find(o => o.id === bS.id);
            if (oldS && oldS.bitacora) bS.bitacora = oldS.bitacora;
        });
        
        saveSprints(baseSprints);
        activeSprintId = baseSprints.length > 0 ? baseSprints[0].id : null;
        
        alert('✅ Datos restaurados correctamente');
        location.reload();
    } catch (err) {
        console.error("❌ Error durante reset:", err);
        alert('❌ Error al restaurar datos');
    }
}

// --- Navigation ---
function setupPlatformNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const tabId = item.dataset.tab;
            const pane = document.getElementById(tabId);
            if (pane) pane.classList.add('active');

            const titleMap = {
                'dashboard-home': 'Resumen General',
                'sprint-detail': 'Avance de Sprint',
                'team-view': 'Gestión de Equipo',
                'bitacora-presentation': 'Bitácora Scrum & Presentación',
                'admin-panel': 'Panel de Administración'
            };
            document.getElementById('currentViewTitle').textContent = titleMap[tabId] || 'Plataforma';

            refreshActiveView(tabId);
        });
    });
}

function refreshActiveView(tabId) {
    try {
        if (tabId === 'dashboard-home') renderGlobalDashboard();
        if (tabId === 'sprint-detail') renderSprintDetail();
        if (tabId === 'team-view') renderTeamView();
        if (tabId === 'bitacora-presentation') { renderBitacora(); loadPresentationSlide(1); }
        if (tabId === 'admin-panel') renderAdminPanel();
    } catch (err) {
        console.error(`❌ Error en tab ${tabId}:`, err);
    }
}

function getActiveSprint() {
    const sprints = getSprintsFromStorage();
    return sprints.find(s => s.id === activeSprintId) || null;
}

// --- Dashboard Home ---
function renderGlobalDashboard() {
    try {
        const sprints = getSprintsFromStorage();
        let totalPlanned = 0;
        let totalCompleted = 0;

        sprints.forEach(s => {
            totalPlanned += (parseInt(s.pointsPlanned) || 0);
            (s.tasks || []).forEach(t => {
                if (t.status === 'Done') totalCompleted += (parseInt(t.points) || 0);
            });
        });

        document.getElementById('globalTotalSprints').textContent = sprints.length;
        document.getElementById('globalSPPlanned').textContent = totalPlanned;
        document.getElementById('globalSPCompleted').textContent = totalCompleted;

        const perc = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

        // Velocidad
        const completados = sprints.filter(s => s.status === 'Completado' || s.status === 'Done').slice(-3);
        let avgVel = 0;
        let velHistoryNames = [];
        let velHistoryValues = [];

        if (completados.length > 0) {
            let sumVal = 0;
            completados.forEach(s => {
                const pt = (s.tasks || []).reduce((sum, t) => t.status === 'Done' ? sum + (parseInt(t.points) || 0) : sum, 0);
                sumVal += pt;
                velHistoryNames.push(s.name.substring(0, 10) + '...');
                velHistoryValues.push(pt);
            });
            avgVel = Math.round(sumVal / completados.length);
        }
        document.getElementById('avgVelocityValue').textContent = avgVel;

        renderCharts(totalCompleted, totalPlanned - totalCompleted, velHistoryNames, velHistoryValues);

        // Tabla de sprints
        let tableHtml = `<table style="width:100%; border-collapse: collapse; font-size:0.85rem;">
            <thead style="background:#edf2f7; text-align:left;">
                <tr>
                    <th style="padding:0.75rem;">Sprint</th>
                    <th style="padding:0.75rem;">Fechas</th>
                    <th style="padding:0.75rem;">Estado</th>
                    <th style="padding:0.75rem;">SP</th>
                </tr>
            </thead>
            <tbody>`;
        
        sprints.forEach(s => {
            const spP = parseInt(s.pointsPlanned) || 0;
            const spC = (s.tasks || []).reduce((sum, t) => t.status === 'Done' ? sum + (parseInt(t.points) || 0) : sum, 0);
            tableHtml += `<tr style="border-bottom:1px solid #edf2f7;">
                <td style="padding:0.75rem; font-weight:600;">${s.name}</td>
                <td style="padding:0.75rem;"><span class="date-badge">${s.start || '?'} → ${s.end || '?'}</span></td>
                <td style="padding:0.75rem;">${s.status}</td>
                <td style="padding:0.75rem;">${spC} / ${spP}</td>
            </tr>`;
        });
        tableHtml += '</tbody></table>';
        document.getElementById('sprintsSummaryTable').innerHTML = tableHtml;
    } catch (err) {
        console.error("❌ Error renderizando dashboard:", err);
        document.getElementById('sprintsSummaryTable').innerHTML = '<p style="color:red;">Error descargando datos</p>';
    }
}

function renderCharts(completed, pending, vNames, vValues) {
    try {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js no cargado');
            return;
        }

        if (chartsInstance.burn) chartsInstance.burn.destroy();
        if (chartsInstance.vel) chartsInstance.vel.destroy();

        const ctxBurn = document.getElementById('burnupChart')?.getContext('2d');
        if (ctxBurn) {
            chartsInstance.burn = new Chart(ctxBurn, {
                type: 'doughnut',
                data: {
                    labels: ['Completados', 'Restantes'],
                    datasets: [{
                        data: [completed, pending > 0 ? pending : 0],
                        backgroundColor: ['#c0a062', '#edf2f7'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }

        const ctxVel = document.getElementById('velocityChart')?.getContext('2d');
        if (ctxVel) {
            if (vNames.length === 0) { vNames = ['Sin datos']; vValues = [0]; }
            chartsInstance.vel = new Chart(ctxVel, {
                type: 'bar',
                data: {
                    labels: vNames,
                    datasets: [{
                        label: 'Story Points',
                        data: vValues,
                        backgroundColor: '#2b6cb0',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    } catch (err) {
        console.error("❌ Error renderizando gráficos:", err);
    }
}

// --- Sprint Details ---
function renderSprintDetail() {
    try {
        const sprint = getActiveSprint();
        if (!sprint) return;
        
        document.getElementById('sprintDetailName').textContent = sprint.name;
        document.getElementById('sprintDetailDates').textContent = `${sprint.start || '?'} → ${sprint.end || '?'}`;

        const tasks = sprint.tasks || [];
        const planned = parseInt(sprint.pointsPlanned) || 0;
        const comp = tasks.reduce((sum, t) => t.status === 'Done' ? sum + (parseInt(t.points) || 0) : sum, 0);
        const p = planned > 0 ? Math.round((comp / planned) * 100) : 0;

        document.getElementById('sprintDetailPerc').textContent = p + '%';
        document.getElementById('sprintDetailBar').style.width = p + '%';

        const renderTask = (t, icon, bg, bcol) => `<div style="padding:0.5rem; background:${bg}; margin-bottom:0.4rem; border-left:4px solid ${bcol}; font-size:0.85rem;">${icon} <strong>${t.name}</strong> (${t.points} SP) - ${t.responsible}</div>`;

        document.getElementById('sprintTasksDone').innerHTML = tasks.filter(t => t.status === 'Done').map(t => renderTask(t, '✅', '#f0fff4', '#38a169')).join('') || '<p>0</p>';
        document.getElementById('sprintTasksTodo').innerHTML = tasks.filter(t => t.status !== 'Done').map(t => renderTask(t, '⏳', '#fffaf0', '#dd6b20')).join('') || '<p>0</p>';
    } catch (err) {
        console.error("❌ Error en sprint detail:", err);
    }
}

// --- Team View ---
function renderTeamView() {
    try {
        const sprint = getActiveSprint();
        if (!sprint) return;
        
        let lP = 0, lC = 0, lList = [], aP = 0, aC = 0, aList = [];

        (sprint.tasks || []).forEach(t => {
            const pt = parseInt(t.points) || 0;
            const done = t.status === 'Done';
            const ui = `<div style="padding:0.4rem; background:#edf2f7; margin-bottom:0.3rem; border-radius:4px;">${done ? '✅' : '⏳'} ${t.name} (${pt} SP)</div>`;
            
            if (t.responsible === 'Luis') { lP += pt; if (done) lC += pt; lList.push(ui); }
            else if (t.responsible === 'Alfred') { aP += pt; if (done) aC += pt; aList.push(ui); }
            else if (t.responsible === 'Ambos') {
                const h = pt / 2; lP += h; aP += h; if (done) { lC += h; aC += h; }
                const duo = ui.replace('⏳', '👥⏳').replace('✅', '👥✅');
                lList.push(duo); aList.push(duo);
            }
        });

        const f = v => v % 1 === 0 ? v : v.toFixed(1);
        document.getElementById('luisPoints').textContent = `${f(lC)} / ${f(lP)}`;
        document.getElementById('alfredPoints').textContent = `${f(aC)} / ${f(aP)}`;
        document.getElementById('luisBar').style.width = (lP > 0 ? (lC / lP) * 100 : 0) + '%';
        document.getElementById('alfredBar').style.width = (aP > 0 ? (aC / aP) * 100 : 0) + '%';
        document.getElementById('luisTasks').innerHTML = lList.join('');
        document.getElementById('alfredTasks').innerHTML = aList.join('');
    } catch (err) {
        console.error("❌ Error en team view:", err);
    }
}

// --- Bitácora & Presentación ---
function renderBitacora() {
    try {
        const sprint = getActiveSprint();
        if (!sprint) return;
        
        document.getElementById('bitacoraSprintName').textContent = sprint.name;
        const notes = sprint.bitacora || {};
        document.getElementById('notePlanning').value = notes.planning || '';
        document.getElementById('noteStandups').value = notes.standup || '';
        document.getElementById('noteRetro').value = notes.retro || '';
    } catch (err) {
        console.error("❌ Error renderizando bitácora:", err);
    }
}

function saveBitacora() {
    try {
        const sprints = getSprintsFromStorage();
        const sprint = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        
        sprint.bitacora = {
            planning: document.getElementById('notePlanning').value,
            standup: document.getElementById('noteStandups').value,
            retro: document.getElementById('noteRetro').value
        };
        saveSprints(sprints);
        alert('✅ Notas guardadas');
    } catch (err) {
        console.error("❌ Error guardando notas:", err);
        alert('❌ Error al guardar');
    }
}

let currentSlideIdx = 1;
function loadPresentationSlide(n) {
    try {
        currentSlideIdx = n;
        document.getElementById('slideCounter').textContent = `${n} / 3`;
        
        const sprint = getActiveSprint();
        const c = document.getElementById('presentationSlides');
        if (!sprint) {
            c.innerHTML = '<p>No hay Sprint seleccionado</p>';
            return;
        }

        const sprints = getSprintsFromStorage();
        const gtP = sprints.reduce((a, b) => a + (parseInt(b.pointsPlanned) || 0), 0);
        const gtC = sprints.reduce((a, b) => a + (b.tasks || []).reduce((x, t) => t.status === 'Done' ? x + (parseInt(t.points) || 0) : x, 0), 0);
        const gp = gtP > 0 ? Math.round((gtC / gtP) * 100) : 0;

        const sP = parseInt(sprint.pointsPlanned) || 0;
        const sC = (sprint.tasks || []).reduce((x, t) => t.status === 'Done' ? x + (parseInt(t.points) || 0) : x, 0);
        const sp = sP > 0 ? Math.round((sC / sP) * 100) : 0;

        let html = '';
        if (n === 1) {
            html = `<div><h3 style="color:#a0aec0;font-size:1.5rem;text-align:center;">STATUS PROYECTO GLOBAL</h3><div style="font-size:5rem; text-align:center; color:white; font-weight:800; margin: 1rem 0;">${gp}%</div><p style="text-align:center;color:#cbd5e0;">Total: ${gtC} / ${gtP} SP</p></div>`;
        } else if (n === 2) {
            html = `<div><h3 style="color:#c0a062;font-size:2rem;text-align:center;">${sprint.name}</h3><span style="display:block;text-align:center;background:#2d3748;border-radius:20px;padding:0.2rem 1rem;max-width:200px;margin: 1rem auto;font-weight:700;">${sp}% Completado</span><div style="display:flex; justify-content:space-around; margin-top:3rem; gap:2rem;"><div style="background:#2d3748;padding:1.5rem;border-radius:8px;" >Planificado<br><strong style="font-size:2rem;">${sP}</strong></div><div style="background:#2d3748;padding:1.5rem;border-radius:8px;">Realizado<br><strong style="font-size:2rem;">${sC}</strong></div></div></div>`;
        } else if (n === 3) {
            const nts = sprint.bitacora || {};
            html = `<div style="width:100%;text-align:left;"><h3 style="color:#c0a062;border-bottom:1px solid #4a5568;padding-bottom:1rem;margin-bottom:1rem;">Notas</h3><p style="color:#a0aec0;font-size:0.8rem;">Planning & Standups</p><p style="background:#2d3748;padding:1rem;border-radius:8px;margin-bottom:1rem;">${nts.planning || '-'} <br> ${nts.standup || '-'}</p><p style="color:#a0aec0;font-size:0.8rem;">Retro & Acciones</p><p style="background:#2d3748;padding:1rem;border-radius:8px;">${nts.retro || '-'}</p></div>`;
        }
        c.innerHTML = `<div style="width:100%; animation:fadeIn 0.3s;">${html}</div>`;
    } catch (err) {
        console.error("❌ Error en presentación:", err);
    }
}

function nextSlide() { if (currentSlideIdx < 3) loadPresentationSlide(currentSlideIdx + 1); }
function previousSlide() { if (currentSlideIdx > 1) loadPresentationSlide(currentSlideIdx - 1); }

// --- Admin Panel ---
function renderAdminPanel() {
    try {
        const sprint = getActiveSprint();
        if (!sprint) {
            document.getElementById('adminName').value = '';
            return;
        }
        
        document.getElementById('adminName').value = sprint.name || '';
        document.getElementById('adminStatus').value = sprint.status || 'En Desarrollo';
        document.getElementById('adminStart').value = sprint.start || '';
        document.getElementById('adminEnd').value = sprint.end || '';
        document.getElementById('adminSP').value = sprint.pointsPlanned || 0;

        const tc = document.getElementById('adminTasksContainer');
        tc.innerHTML = '';
        (sprint.tasks || []).forEach((t, i) => {
            tc.innerHTML += `<div style="display:flex; gap:0.5rem; background:rgba(0,0,0,0.3); padding:0.8rem; border:1px solid rgba(255,255,255,0.08); border-radius:8px; margin-bottom:0.8rem; align-items:center; flex-wrap:wrap;">
                <input type="text" value="${t.name}" onchange="adminUpdateTask(${i},'name',this.value)" style="flex:1; min-width:200px; padding:0.5rem; background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:6px; font-family:'Outfit';">
                <select onchange="adminUpdateTask(${i},'responsible',this.value)" style="padding:0.5rem; background:rgba(15,23,42,0.9); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:6px; font-family:'Outfit';"><option ${t.responsible === 'Luis' ? 'selected' : ''}>Luis</option><option ${t.responsible === 'Alfred' ? 'selected' : ''}>Alfred</option><option ${t.responsible === 'Ambos' ? 'selected' : ''}>Ambos</option></select>
                <select onchange="adminUpdateTask(${i},'status',this.value)" style="padding:0.5rem; background:rgba(15,23,42,0.9); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:6px; font-family:'Outfit';"><option ${t.status === 'To Do' ? 'selected' : ''}>To Do</option><option ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option><option ${t.status === 'Done' ? 'selected' : ''}>Done</option></select>
                <input type="number" value="${t.points}" onchange="adminUpdateTask(${i},'points',this.value)" style="width:70px; padding:0.5rem; background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:6px; font-family:'Outfit';">
                <button onclick="adminDeleteTask(${i})" style="background:transparent; border:none; cursor:pointer; font-size:1.1rem; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Borrar">❌</button>
            </div>`;
        });
    } catch (err) {
        console.error("❌ Error en admin panel:", err);
    }
}

function adminSaveSprint() {
    try {
        const sprints = getSprintsFromStorage();
        const sprint = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;

        sprint.name = document.getElementById('adminName').value;
        sprint.status = document.getElementById('adminStatus').value;
        sprint.start = document.getElementById('adminStart').value;
        sprint.end = document.getElementById('adminEnd').value;
        sprint.pointsPlanned = parseInt(document.getElementById('adminSP').value) || 0;

        saveSprints(sprints);
        alert('✅ Sprint actualizado');
        initSprintSelector();
    } catch (err) {
        console.error("❌ Error guardando sprint:", err);
        alert('❌ Error al guardar');
    }
}

function adminCreateNewSprint() {
    try {
        const id = 'sprint_new_' + Date.now();
        const sprints = getSprintsFromStorage();
        sprints.push({
            id, name: 'Nuevo Sprint', status: 'Planificado', start: '', end: '', pointsPlanned: 10, tasks: []
        });
        saveSprints(sprints);
        activeSprintId = id;
        initSprintSelector();
        renderAdminPanel();
    } catch (err) {
        console.error("❌ Error creando sprint:", err);
    }
}

function adminDeleteSprint() {
    if (!confirm('¿Eliminar este Sprint completamente?')) return;
    try {
        let sprints = getSprintsFromStorage();
        sprints = sprints.filter(s => s.id !== activeSprintId);
        saveSprints(sprints);
        activeSprintId = sprints.length > 0 ? sprints[0].id : null;
        initSprintSelector();
        renderAdminPanel();
    } catch (err) {
        console.error("❌ Error eliminando sprint:", err);
    }
}

function adminAddTask() {
    try {
        const sprints = getSprintsFromStorage();
        const sprint = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        if (!sprint.tasks) sprint.tasks = [];
        sprint.tasks.push({ name: 'Nueva Tarea', responsible: 'Luis', status: 'To Do', points: 3 });
        saveSprints(sprints);
        renderAdminPanel();
    } catch (err) {
        console.error("❌ Error agregando tarea:", err);
    }
}

function adminUpdateTask(idx, field, value) {
    try {
        const sprints = getSprintsFromStorage();
        const sprint = sprints.find(s => s.id === activeSprintId);
        if (!sprint || !sprint.tasks[idx]) return;
        
        if (field === 'points') sprint.tasks[idx][field] = parseInt(value) || 0;
        else sprint.tasks[idx][field] = value;
        saveSprints(sprints);
    } catch (err) {
        console.error("❌ Error actualizando tarea:", err);
    }
}

function adminDeleteTask(idx) {
    try {
        const sprints = getSprintsFromStorage();
        const sprint = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        sprint.tasks.splice(idx, 1);
        saveSprints(sprints);
        renderAdminPanel();
    } catch (err) {
        console.error("❌ Error eliminando tarea:", err);
    }
}

function exportProgressToCSV() {
    try {
        const select = document.getElementById('globalSprintSelect');
        if (!select) return;
        const sprint = getSprintsFromStorage().find(s => s.id === select.value);
        if (!sprint) return;

        let csv = 'Tarea,Responsable,SP,Estado\n';
        (sprint.tasks || []).forEach(t => { csv += `"${t.name}","${t.responsible}","${t.points}","${t.status}"\n`; });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Sprint_${sprint.name?.replace(/\s+/g, '_')}.csv`;
        link.click();
    } catch (err) {
        console.error("❌ Error exportando CSV:", err);
    }
}

function initSprintSelector() {
    try {
        const select = document.getElementById('globalSprintSelect');
        if (!select) return;
        
        const sprints = getSprintsFromStorage();
        select.innerHTML = sprints.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

        if (!sprints.find(s => s.id === activeSprintId) && sprints.length > 0) {
            activeSprintId = sprints[0].id;
        }
        if (activeSprintId && select.value !== activeSprintId) {
            select.value = activeSprintId;
        }

        select.removeEventListener('change', _onSprintChange);
        select.addEventListener('change', _onSprintChange);
    } catch (err) {
        console.error("❌ Error inicializando selector:", err);
    }
}

function _onSprintChange(e) {
    activeSprintId = e.target.value;
    const activeTabObj = document.querySelector('.nav-item.active');
    if (activeTabObj) refreshActiveView(activeTabObj.dataset.tab);
}

// --- Inicialización ROBUSTA ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Iniciando Scrum Platform v2.2.0...");
    
    try {
        // Paso 1: Intentar cargar desde localStorage con validación estricta
        console.log("📦 Paso 1: Verificar localStorage...");
        let sprints = getSprintsFromStorage();
        
        // Paso 2: Si localStorage está vacío, cargar desde data.js
        if (sprints.length === 0) {
            console.log("⚠️ localStorage vacío, cargando desde data.js...");
            sprints = getSystemDataFromJs();
            
            if (sprints.length > 0) {
                console.log(`✅ Cargados ${sprints.length} sprints desde data.js`);
                saveSprints(sprints);
            } else {
                console.error("❌ No hay datos en data.js tampoco");
            }
        } else {
            console.log(`✅ Cargados ${sprints.length} sprints desde localStorage`);
        }

        // Paso 3: Inicializar UI
        console.log("🎨 Paso 3: Inicializar interfaz...");
        initSprintSelector();
        setupPlatformNavigation();
        
        // Paso 4: Mostrar vista por defecto
        console.log("📊 Paso 4: Mostrar dashboard...");
        renderGlobalDashboard();
        
        console.log("✅ ¡Plataforma lista!");
        
    } catch (err) {
        console.error("❌ ERROR CRÍTICO:", err);
        console.error("Stack:", err.stack);
        
        // Intento final de recuperación
        console.log("🔄 Intentando recuperación de emergencia...");
        const emergencySprints = getSystemDataFromJs();
        if (emergencySprints.length > 0) {
            try {
                saveSprints(emergencySprints);
                alert('⚠️ Se detectó un error. Sistema restaurado desde data.js. Por favor, recarga la página.');
                location.reload();
            } catch (salvageErr) {
                alert('❌ Error crítico: No se pudo recuperar los datos. Por favor, limpia el cache del navegador (Ctrl+Shift+Del) e intenta nuevamente.');
                console.error("Salvage failed:", salvageErr);
            }
        } else {
            alert('❌ Error crítico sin posibilidad de recuperación: El archivo data.js está vacío o corrupto.');
        }
    }
});

// Agregar manejo global de errores no capturados
window.addEventListener('error', function(event) {
    console.error('🔴 Error no capturado:', event.error);
});

// Prevenir errores silenciosos en promesas
window.addEventListener('unhandledrejection', function(event) {
    console.error('🔴 Promise rechazada no manejada:', event.reason);
});
