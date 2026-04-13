// ============================================================
// AREA & PRIORITY CONFIG (Dynamic - backed by localStorage)
// Color ONLY comes from Area. Priority uses its own badge system
// (border + text) to avoid visual conflict.
// ============================================================
const DEFAULT_AREA_CONFIG = {
    'Comercial':               { color: '#0057b8', emoji: '🔵' },
    'Dirección General':       { color: '#6d28d9', emoji: '🟣' },
    'Operaciones':             { color: '#ea580c', emoji: '🟠' },
    'Servicios Empresariales': { color: '#0ea5e9', emoji: '🩵' },
    'Infraestructura':         { color: '#475569', emoji: '⚫' },
    'Ecommerce':               { color: '#10b981', emoji: '🟢' },
    'Lealtad':                 { color: '#f59e0b', emoji: '🟡' },
    'BI Interno':              { color: '#ec4899', emoji: '🧠' },
};

const DEFAULT_TEAM_CONFIG = [
    { name: 'Luis',   role: 'BI Lead',        color: '#0057b8' },
    { name: 'Alfred', role: 'Data Engineer',  color: '#cc0000' },
    { name: 'Ambos',  role: 'Colaboración',   color: '#10b981' },
];

const AREA_STORAGE_KEY  = 'scrumAreaConfig';
const TEAM_STORAGE_KEY  = 'scrumTeamConfig';
const PLAT_NAME_KEY     = 'scrumPlatformName';
const PLAT_SUBTITLE_KEY = 'scrumPlatformSubtitle';

function getAreaConfig() {
    try {
        const raw = localStorage.getItem(AREA_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
        }
    } catch(e) {}
    // Seed defaults on first load
    localStorage.setItem(AREA_STORAGE_KEY, JSON.stringify(DEFAULT_AREA_CONFIG));
    return { ...DEFAULT_AREA_CONFIG };
}

function saveAreaConfig(cfg) {
    localStorage.setItem(AREA_STORAGE_KEY, JSON.stringify(cfg));
}

function getTeamConfig() {
    try {
        const raw = localStorage.getItem(TEAM_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch(e) {}
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(DEFAULT_TEAM_CONFIG));
    return [...DEFAULT_TEAM_CONFIG];
}

function saveTeamConfig(team) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
}

// Keep AREA_CONFIG as live alias for backward compatibility
let AREA_CONFIG = getAreaConfig();

const PRIORITY_CONFIG = {
    'Crítico':   { label: 'P1 · Crítico',   border: '#ef4444', text: '#dc2626', bg: '#fef2f2' },
    'Urgente':   { label: 'P2 · Urgente',   border: '#f97316', text: '#ea580c', bg: '#fff7ed' },
    'Normal':    { label: 'P3 · Normal',    border: '#94a3b8', text: '#64748b', bg: '#f8fafc' },
    'Diferible': { label: 'P4 · Diferible', border: '#3b82f6', text: '#1d4ed8', bg: '#eff6ff' },
};

function getAreaColor(area) {
    const cfg = getAreaConfig();
    return (cfg[area] || {}).color || '#0057b8';
}

function getPriorityBadgeHtml(priority) {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Normal'];
    return `<span style="display:inline-flex;align-items:center;padding:0.18rem 0.55rem;border-radius:20px;font-size:0.68rem;font-weight:700;letter-spacing:0.3px;border:1.5px solid ${cfg.border};color:${cfg.text};background:${cfg.bg};">${cfg.label}</span>`;
}

function getAreaBadgeHtml(area) {
    const cfg = getAreaConfig()[area];
    if (!cfg) return '';
    return `<span style="display:inline-flex;align-items:center;gap:0.25rem;padding:0.18rem 0.55rem;border-radius:20px;font-size:0.68rem;font-weight:700;letter-spacing:0.3px;border:1.5px solid ${cfg.color}40;color:${cfg.color};background:${cfg.color}12;">${cfg.emoji} ${area}</span>`;
}

// Global Sorting Helper for Projects
function helperSortProjects(projects) {
    if (!projects) return [];
    return [...projects].sort((a, b) => {
        const idA = a.displayId || '';
        const idB = b.displayId || '';
        // Natural sort (numeric if possible)
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
    });
}

// --- STORAGE MANAGER ---
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'scrumProjects';
        this.LEGACY_KEY  = 'scrumSprints';
        this.BACKUP_KEY  = 'scrumProjects_backup';
    }

    log(msg) { console.log('[StorageManager]', msg); }

    // ---------- PROJECTS ----------
    getProjects() {
        try {
            // 1) Try new Projects key
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw !== null) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    // Auto-migration: Assign displayId if missing
                    let changed = false;
                    parsed.forEach((p, idx) => {
                        if (!p.displayId) {
                            p.displayId = (idx + 1).toString();
                            changed = true;
                        }
                    });
                    if (changed) this.saveProjects(parsed);

                    this.log(`✅ Loaded ${parsed.length} projects from localStorage`);
                    return helperSortProjects(parsed);
                }
            }

            // 2) Migrate legacy scrumSprints → wrap in one Project
            const legacy = localStorage.getItem(this.LEGACY_KEY);
            if (legacy) {
                const sprints = JSON.parse(legacy);
                if (Array.isArray(sprints) && sprints.length > 0) {
                    this.log('⚠️ Migrating legacy scrumSprints to Projects');
                    const project = {
                        id: 'project_legacy_migrated',
                        name: 'Portafolio General',
                        description: 'Datos migrados automáticamente',
                        color: '#0057b8',
                        status: 'Activo',
                        sprints
                    };
                    const projects = [project];
                    this.saveProjects(projects);
                    return projects;
                }
            }

            // 3) Return empty array if no data exists
            return [];
        } catch (err) {
            this.log('❌ getProjects error: ' + err.message);
            return [];
        }
    }

    saveProjects(projects) {
        try {
            const str = JSON.stringify(projects);
            localStorage.setItem(this.STORAGE_KEY, str);
            localStorage.setItem(this.BACKUP_KEY, str);
            this.log(`💾 Saved ${projects.length} projects`);
        } catch (err) {
            this.log('❌ saveProjects error: ' + err.message);
        }
    }

    // ---------- LEGACY SPRINT HELPERS (keep backward compat) ----------
    getSprints() {
        // Returns sprints of the ACTIVE project
        const projects = this.getProjects();
        const proj = projects.find(p => p.id === activeProjectId) || projects[0];
        return proj ? (proj.sprints || []) : [];
    }

    saveSprints(sprints) {
        const projects = this.getProjects();
        const idx = projects.findIndex(p => p.id === activeProjectId);
        if (idx !== -1) {
            projects[idx].sprints = sprints;
        } else if (projects.length > 0) {
            projects[0].sprints = sprints;
        }
        this.saveProjects(projects);
    }

    // Parse data.js (CSV) into a single Project > Sprints structure
    parseDataJs() {
        try {
            if (typeof sprintsDataCSV === 'undefined' || !sprintsDataCSV) return [];

            const lines = sprintsDataCSV.trim().split('\n');
            const sprintMap = {};

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i]
                    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
                    .map(x => x ? x.replace(/"/g, '').trim() : '');

                if (row.length < 5) continue;

                const [id, name, status, start, end, pointsPlanned, taskName, responsible, points, taskStatus] = row;
                if (!id) continue;

                if (!sprintMap[id]) {
                    sprintMap[id] = {
                        id,
                        name: name || 'Sprint',
                        status: status || 'Planificado',
                        start: parseToStandardDate(start),
                        end: parseToStandardDate(end),
                        pointsPlanned: parseInt(pointsPlanned) || 0,
                        tasks: [],
                        bitacora: { planning: '', standup: '', retro: '' }
                    };
                }

                if (taskName) {
                    sprintMap[id].tasks.push({
                        name: taskName,
                        responsible: responsible || 'N/A',
                        points: parseInt(points) || 0,
                        status: taskStatus || 'To Do',
                        progress: taskStatus === 'Done' ? 100 : 0,
                        completionDate: ''
                    });
                }
            }

            const sprints = Object.values(sprintMap);
            if (sprints.length === 0) return [];

            return [{
                id: 'project_from_datajs',
                name: 'Portafolio General',
                description: 'Cargado desde data.js',
                color: '#0057b8',
                status: 'Activo',
                sprints
            }];
        } catch (err) {
            console.error('[StorageManager] Error parsing data.js:', err);
            return [];
        }
    }

    ensureIds(sprints) {
        let modified = false;
        sprints.forEach((sprint, idx) => {
            if (!sprint.id) {
                sprint.id = `sprint_${sprint.name?.replace(/\s+/g, '_') || idx}_${Date.now()}`;
                modified = true;
            }
        });
        if (modified) this.saveSprints(sprints);
        return sprints;
    }

    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.BACKUP_KEY);
        localStorage.removeItem(this.LEGACY_KEY); // <--- ESTO FALTABA
        localStorage.setItem(this.STORAGE_KEY, '[]'); // Forzamos un array vacío para que no cargue data.js
        this.log('🗑️ Storage deep cleared');
    }
}

// --- GLOBAL STATE ---
const storage = new StorageManager();
let activeProjectId = null;
let activeSprintId  = null;
let chartsInstance  = {};
let currentSlideIdx = 1;

// --- DATE HELPERS ---
function parseToStandardDate(dateStr) {
    if (!dateStr) return '';
    try {
        dateStr = dateStr.trim();
        if (!dateStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const d = new Date(dateStr + 'T00:00:00');
            if (!isNaN(d.getTime())) return dateStr;
        }
        const dmyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (dmyMatch) {
            const [, day, month, year] = dmyMatch;
            const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            if (!isNaN(d.getTime())) return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
        }
        const dmyShortMatch = dateStr.match(/^(\d{2})-([a-zA-Z]{3})-(\d{2})$/);
        if (dmyShortMatch) {
            const [, day, monthStr, year] = dmyShortMatch;
            const monthMap = {
                'ene':'01','feb':'02','mar':'03','abr':'04','may':'05','jun':'06',
                'jul':'07','ago':'08','sep':'09','oct':'10','nov':'11','dic':'12',
                'jan':'01','apr':'04','aug':'08','dec':'12'
            };
            const monthNum = monthMap[monthStr.toLowerCase()] || '01';
            const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
            const d = new Date(fullYear, parseInt(monthNum) - 1, parseInt(day));
            if (!isNaN(d.getTime())) {
                return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            }
        }
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        }
        return dateStr;
    } catch (e) { return dateStr; }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const s = parseToStandardDate(dateStr);
        if (!s) return '';
        const [y, m, d] = s.split('-');
        if (y && m && d) return `${d}/${m}/${y}`;
        return dateStr;
    } catch (e) { return dateStr; }
}

// --- SAFE GETTERS (Project-scoped) ---
function getProjects() {
    const projects = storage.getProjects();
    projects.forEach(p => { if (!p.id) p.id = `project_${Date.now()}_${Math.random()}`; });
    return projects;
}

function getActiveProject() {
    if (activeProjectId === 'ALL') {
        const projects = getProjects();
        let allSprints = [];
        projects.forEach((p, pIdx) => {
            (p.sprints || []).forEach(s => {
                let sCopy = { ...s };
                const pAcr = p.name.substring(0, 8);
                sCopy.name = `[${pAcr}] ${s.name}`;
                sCopy.projectId = p.id;
                allSprints.push(sCopy);
            });
        });
        return {
            id: 'ALL',
            name: 'Portafolio Completo',
            sprints: allSprints,
            color: '#1e293b' // neutral dark
        };
    }

    const projects = getProjects();
    if (!activeProjectId && projects.length > 0) activeProjectId = projects[0].id;
    return projects.find(p => p.id === activeProjectId) || projects[0] || null;
}

function getSprints() {
    const proj = getActiveProject();
    if (!proj) return [];
    if (!proj.sprints) proj.sprints = [];
    return storage.ensureIds(proj.sprints);
}

function getActiveSprint() {
    const sprints = getSprints();
    if (!activeSprintId && sprints.length > 0) activeSprintId = sprints[0].id;
    return sprints.find(s => s.id === activeSprintId) || null;
}

function saveSprints(sprints) {
    if (activeProjectId === 'ALL') {
        alert('⚠️ Estás en la vista "TODO EL PORTAFOLIO". No se pueden editar tareas en este modo. Seleccione un proyecto específico para realizar cambios.');
        return;
    }
    storage.saveSprints(sprints);
}

function saveProjects(projects) {
    if (activeProjectId === 'ALL') {
         alert('⚠️ No se pueden editar proyectos desde la Vista Global.');
         return;
    }
    storage.saveProjects(projects);
}

// ============================================================
// PROJECT SELECTOR INIT
// ============================================================
function initProjectSelector() {
    try {
        const select = document.getElementById('globalProjectSelect');
        if (!select) return;
        const projects = getProjects().filter(p => p.status !== 'Cerrado');
        
        let html = `<option value="ALL">🌟 TODO EL PORTAFOLIO</option>`;
        html += projects.map(p => `<option value="${p.id}">[${p.displayId || '—'}] ${p.name}</option>`).join('');
        select.innerHTML = html;

        if (!activeProjectId) {
            activeProjectId = 'ALL';
        }
        select.value = activeProjectId;

        // Reset sprint context when project changes
        function onProjectChange(e) {
            activeProjectId = e.target.value;
            activeSprintId = null;
            initSprintSelector();
            const activeTab = document.querySelector('.nav-item.active');
            refreshActiveView(activeTab ? activeTab.dataset.tab : 'dashboard-home');
        }
        select.removeEventListener('change', onProjectChange);
        select.addEventListener('change', onProjectChange);
    } catch (err) {
        console.error('[ProjectSelector] Error:', err);
    }
}

// ============================================================
// SPRINT SELECTOR INIT
// ============================================================
function initSprintSelector() {
    try {
        const select = document.getElementById('globalSprintSelect');
        if (!select) return;

        const allSprints  = getSprints();
        const activeSps   = allSprints.filter(s => s.status !== 'Completado');
        const closedSps   = allSprints.filter(s => s.status === 'Completado');

        let html = '';
        if (activeSps.length > 0) {
            html += `<optgroup label="🚀 Sprints Activos">`;
            html += activeSps.map(s => {
                return `<option value="${s.id}">${s.name || 'Sin Nombre'}</option>`;
            }).join('');
            html += `</optgroup>`;
        }
        if (closedSps.length > 0) {
            html += `<optgroup label="📚 Histórico">`;
            html += closedSps.map(s => {
                return `<option value="${s.id}">[CERRADO] ${s.name || 'Sin Nombre'}</option>`;
            }).join('');
            html += `</optgroup>`;
        }


        select.innerHTML = html || '<option value="">Sin Sprints</option>';

        if (!activeSprintId || !allSprints.find(s => s.id === activeSprintId)) {
            activeSprintId = activeSps.length > 0 ? activeSps[0].id
                           : closedSps.length > 0  ? closedSps[0].id
                           : null;
        }
        if (activeSprintId) select.value = activeSprintId;

        select.removeEventListener('change', _onSprintChange);
        select.addEventListener('change', _onSprintChange);

    } catch (err) {
        console.error('[InitSelector] Error:', err);
    }
}

function _onSprintChange(e) {
    try {
        activeSprintId = e.target.value;
        const activeTabObj = document.querySelector('.nav-item.active');
        if (activeTabObj) refreshActiveView(activeTabObj.dataset.tab);
    } catch (err) { console.error('[SprintChange] Error:', err); }
}

// ============================================================
// NAVIGATION
// ============================================================
function setupPlatformNavigation() {
    try {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.hasAttribute('onclick')) return; // handled by inline JS
                
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                item.classList.add('active');
                const tabId = item.dataset.tab;
                
                if (tabId === 'admin-panel' && window.activeProjectId === 'ALL') {
                    alert('Para administrar Sprints debes seleccionar un proyecto específico.');
                    // Force switch to first project
                    const select = document.getElementById('globalProjectSelect');
                    if (select.options.length > 1) {
                        select.selectedIndex = 1;
                        select.dispatchEvent(new Event('change'));
                    }
                    return;
                }

                const pane = document.getElementById(tabId);
                if (pane) pane.classList.add('active');
                const titleMap = {
                    'dashboard-home':       'Resumen del Portafolio',
                    'projects-view':        'Gestión de Proyectos',
                    'team-analytics':       'Analytics de Equipo',
                    'project-analytics':    'Analytics del Proyecto',
                    'bitacora-presentation':'Bitácora & Presentación',
                    'admin-panel':          'Panel de Administración'
                };
                if (document.getElementById('currentViewTitle')) {
                    document.getElementById('currentViewTitle').textContent = titleMap[tabId] || 'Plataforma';
                }
                refreshActiveView(tabId);
            });
        });
    } catch (err) { console.error('[Navigation] Error:', err); }
}

function refreshActiveView(tabId) {
    try {
        if (tabId === 'dashboard-home')        renderGlobalDashboard();
        if (tabId === 'projects-view')         renderProjectsView();
        if (tabId === 'team-analytics')        renderTeamAnalytics();
        if (tabId === 'project-analytics')     renderProjectAnalytics();
        if (tabId === 'bitacora-presentation') { renderBitacora(); loadPresentationSlide(1); }
        if (tabId === 'admin-panel')           renderAdminPanel();
    } catch (err) { console.error('[RefreshView] Error in', tabId, err); }
}

// ============================================================
// DASHBOARD HOME — Portfolio-scoped (All Projects)
// ============================================================
function renderGlobalDashboard() {
    try {
        const projects = getProjects();

        // Update project title in header to indicate Global
        const projTitle = document.getElementById('currentProjectTitle');
        if (projTitle) projTitle.textContent = projects.length + ' Proyectos en Portafolio';

        let totalPlanned = 0, totalCompleted = 0;
        let allActiveSprints = [];
        let allClosedSprints = [];
        let allSprints = []; // Para las gráficas de velocidad

        projects.forEach(p => {
            (p.sprints || []).forEach(s => {
                let spC = 0;
                let spP = parseInt(s.pointsPlanned) || 0;
                
                // Fallback: Si puntos planeados es 0, sumamos el valor de las tareas
                if (spP === 0 && (s.tasks || []).length > 0) {
                    spP = s.tasks.reduce((sum, t) => sum + (parseInt(t.points) || 0), 0);
                }
                
                totalPlanned += spP;
                (s.tasks || []).forEach(t => {
                    if (t.status === 'Done') spC += parseInt(t.points) || 0;
                });
                totalCompleted += spC;

                let sObj = { ...s, projectName: p.name, projectColor: p.color || '#0057b8', spC: spC, spP: spP, projId: p.id };
                allSprints.push(sObj);

                if (s.status === 'Completado') allClosedSprints.push(sObj);
                else allActiveSprints.push(sObj);
            });
        });

        document.getElementById('globalTotalSprints').textContent  = allSprints.length;
        document.getElementById('globalSprintsDone').textContent   = allClosedSprints.length; // <--- NUEVO
        document.getElementById('globalSPCompleted').textContent    = totalCompleted;
        document.getElementById('globalSPPlanned').textContent      = totalPlanned;

        // Velocity last 5 Sprints from ALL projects
        const sprintsWithPts = allSprints.filter(s => s.spC > 0).slice(-5);
        const velNames  = sprintsWithPts.length > 0 ? sprintsWithPts.map(s => (s.projectName.substring(0,8) + ' ' + s.name)) : ['Sin datos'];
        const velValues = sprintsWithPts.length > 0 ? sprintsWithPts.map(s => s.spC) : [0];

        renderCharts(totalCompleted, totalPlanned - totalCompleted, velNames, velValues);

        // Sprint tables
        const renderTable = (list, containerId) => {
            let html = `<table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                <thead style="background:#edf2f7; color:#1e293b; text-align:left;"><tr>
                    <th style="padding:0.75rem;">Proyecto</th>
                    <th style="padding:0.75rem;">Sprint</th>
                    <th style="padding:0.75rem;">Fechas</th>
                    <th style="padding:0.75rem;">Estado</th>
                    <th style="padding:0.75rem;">Progreso</th>
                    <th style="padding:0.75rem; text-align:right;">Acción</th>
                </tr></thead><tbody>`;

            if (list.length === 0) {
                html += `<tr><td colspan="6" style="padding:2rem; text-align:center; color:var(--text-muted);">No hay sprints en esta categoría</td></tr>`;
            } else {
                list.forEach(s => {
                    const pct = s.spP > 0 ? Math.round((s.spC / s.spP) * 100) : 0;
                    html += `<tr style="border-bottom:1px solid #334155;">
                        <td style="padding:0.75rem;">
                            <div style="display:flex; align-items:center; gap:0.5rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <div style="width:10px; height:10px; border-radius:50%; background:${s.projectColor}; flex-shrink: 0;"></div>
                                <strong title="${s.projectName}">${s.projectName}</strong>
                            </div>
                        </td>
                        <td style="padding:0.75rem; font-weight:600; color:var(--text-light);">${s.name}</td>
                        <td style="padding:0.75rem;"><span class="date-badge" style="font-size:0.7rem; padding:0.2rem 0.5rem;">${formatDate(s.start) || '?'} → ${formatDate(s.end) || '?'}</span></td>
                        <td style="padding:0.75rem;"><span class="status-badge ${s.status === 'Completado' ? 'status-done-bg' : 'status-progress-bg'}" style="font-size:0.7rem;">${s.status}</span></td>
                        <td style="padding:0.75rem;">
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <div style="flex:1; height:6px; background:#334155; border-radius:3px; overflow:hidden;">
                                    <div style="width:${pct}%; height:100%; background:${s.projectColor};"></div>
                                </div>
                                <span style="font-size:0.75rem;">${pct}%</span>
                            </div>
                        </td>
                        <td style="padding:0.75rem; text-align:right;">
                            <button onclick="
                                document.getElementById('globalProjectSelect').value = '${s.projId}';
                                document.getElementById('globalProjectSelect').dispatchEvent(new Event('change'));
                                window.setTimeout(() => goToAdminSprint('${s.id}'), 100);
                            " style="padding:0.3rem 0.6rem; font-size:0.7rem; background:${s.projectColor}33; color:${s.projectColor}; border:1px solid ${s.projectColor}; border-radius:4px; cursor:pointer; font-weight:600;">⚙️ Gestionar</button>
                        </td>
                    </tr>`;
                });
            }
            html += '</tbody></table>';
            document.getElementById(containerId).innerHTML = html;
        };

        renderTable(allActiveSprints, 'activeSprintsTable');
        renderTable(allClosedSprints, 'closedSprintsTable');

    } catch (err) { console.error('[Dashboard] Render error:', err); }
}

function renderCharts(completed, pending, names, values) {
    try {
        if (typeof Chart === 'undefined') return;
        const sprints = getSprints();
        const recentSprints = sprints.slice(-5);
        const perfNames   = recentSprints.map((s, i) => `#${sprints.indexOf(s) + 1} ${s.name}`);
        const perfPlanned = recentSprints.map(s => parseInt(s.pointsPlanned) || 0);
        const perfDone    = recentSprints.map(s => (s.tasks || []).reduce((a, t) => t.status === 'Done' ? a + (parseInt(t.points) || 0) : a, 0));

        if (chartsInstance.burn) chartsInstance.burn.destroy();
        if (chartsInstance.perf) chartsInstance.perf.destroy();

        const ctxBurn = document.getElementById('burnupChart')?.getContext('2d');
        if (ctxBurn) {
            chartsInstance.burn = new Chart(ctxBurn, {
                type: 'doughnut',
                data: { labels: ['Completado','Restante'], datasets: [{ data: [completed, pending > 0 ? pending : 0], backgroundColor: ['#0057b8','#e2e8f0'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
            });
        }

    } catch (err) { console.error('[Charts] Error:', err); }
}

// ============================================================
// PROJECTS VIEW — Overview of ALL projects
// ============================================================
function renderProjectsView() {
    try {
        const projects = getProjects();
        const container = document.getElementById('projectsGrid');
        if (!container) return;

        if (projects.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:4rem; color:var(--text-muted);">
                <div style="font-size:3rem; margin-bottom:1rem;">📋</div>
                <p>No hay proyectos creados todavía.</p>
                <button class="btn-primary" onclick="adminCreateNewProject()" style="margin-top:1.5rem;">➕ Crear Primer Proyecto</button>
            </div>`;
            return;
        }

        container.innerHTML = projects.map(p => {
            const sprints     = p.sprints || [];
            const displayId   = p.displayId || '—';
            const totalSP = sprints.reduce((a, s) => {
                let p = parseInt(s.pointsPlanned) || 0;
                if (p === 0 && (s.tasks || []).length > 0) {
                    p = s.tasks.reduce((sum, t) => sum + (parseInt(t.points) || 0), 0);
                }
                return a + p;
            }, 0);
            
            const doneSP = sprints.reduce((a, s) => {
                return a + (s.tasks || []).reduce((sum, t) => t.status === 'Done' ? sum + (parseInt(t.points) || 0) : sum, 0);
            }, 0);

            const pct = totalSP > 0 ? Math.round((doneSP / totalSP) * 100) : 0;
            const statusClass = p.status === 'Activo' ? 'status-progress-bg' : p.status === 'Completado' || p.status === 'Cerrado' ? 'status-done-bg' : 'status-pending-bg';
            const activeSps   = sprints.filter(s => s.status !== 'Completado').length;
            const completedSps = sprints.filter(s => s.status === 'Completado').length;
            const isActive    = p.id === activeProjectId;
            const color       = getAreaColor(p.area) || p.color || '#0057b8';

            return `<div class="glass-card project-card ${isActive ? 'project-card--active' : ''}" 
                        style="border-left: 5px solid ${color}; cursor:pointer;"
                        onclick="switchToProject('${p.id}')">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                    <div style="display:flex; flex-direction:column; gap:0.4rem; flex:1; min-width:0;">
                        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                            <span style="background:#f0f4f8; padding:1px 6px; border-radius:4px; font-size:0.65rem; font-weight:800; border:1px solid #e2e8f0; color:#475569; flex-shrink:0;">ID: ${displayId}</span>
                            <h3 style="margin:0; font-size:1.05rem; color:var(--text-main);">${p.name}</h3>
                        </div>
                        <div style="display:flex; gap:0.35rem; flex-wrap:wrap; align-items:center;">
                            ${getAreaBadgeHtml(p.area)}
                            ${p.description ? `<span style="color:var(--text-muted); font-size:0.8rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">· ${p.description}</span>` : ''}
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.35rem; flex-shrink:0; margin-left:0.75rem;">
                        <span class="status-badge ${statusClass}" style="font-size:0.68rem;">${p.status}</span>
                        ${getPriorityBadgeHtml(p.priority)}
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.8rem; margin-bottom:1.2rem;">
                    <div style="text-align:center; background:#f8fafc; border-radius:8px; padding:0.8rem;">
                        <div style="font-size:1.4rem; font-weight:800; color:${color};">${sprints.length}</div>
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Sprints</div>
                    </div>
                    <div style="text-align:center; background:#f8fafc; border-radius:8px; padding:0.8rem;">
                        <div style="font-size:1.4rem; font-weight:800; color:#10b981;">${completedSps}</div>
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Cerrados</div>
                    </div>
                    <div style="text-align:center; background:#f8fafc; border-radius:8px; padding:0.8rem;">
                        <div style="font-size:1.4rem; font-weight:800; color:#f59e0b;">${activeSps}</div>
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Activos</div>
                    </div>
                </div>

                <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                        <span style="font-size:0.8rem; color:var(--text-muted);">Avance Global</span>
                        <span style="font-size:0.8rem; font-weight:700; color:${color};">${pct}% — ${doneSP}/${totalSP} SP</span>
                    </div>
                    <div style="height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                        <div style="width:${pct}%; height:100%; background:${color}; border-radius:4px; transition:width 0.8s;"></div>
                    </div>
                </div>

                <div style="margin-top:1.2rem; display:flex; gap:0.5rem;">
                    <button onclick="event.stopPropagation(); switchToProject('${p.id}')" 
                            class="btn-primary" style="flex:1; padding:0.6rem; font-size:0.8rem; background:${color};">
                        📊 Ver Dashboard
                    </button>
                    <button onclick="event.stopPropagation(); editProject('${p.id}')"
                            style="padding:0.6rem 1rem; border:1px solid #e2e8f0; background:white; border-radius:8px; cursor:pointer; font-size:0.8rem;">
                        ✏️
                    </button>
                    <button onclick="event.stopPropagation(); deleteProject('${p.id}')"
                            style="padding:0.6rem 1rem; border:1px solid #fee2e2; background:#fff5f5; color:#ef4444; border-radius:8px; cursor:pointer; font-size:0.8rem;">
                        🗑️
                    </button>
                </div>
            </div>`;
        }).join('');
    } catch (err) { console.error('[ProjectsView] Error:', err); }
}

function switchToProject(projectId) {
    activeProjectId = projectId;
    activeSprintId  = null;
    document.getElementById('globalProjectSelect').value = projectId;
    initSprintSelector();

    // Navigate to dashboard-home
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const homeNav  = document.querySelector('[data-tab="dashboard-home"]');
    const homePane = document.getElementById('dashboard-home');
    if (homeNav)  homeNav.classList.add('active');
    if (homePane) homePane.classList.add('active');
    document.getElementById('currentViewTitle').textContent = 'Resumen del Proyecto';
    renderGlobalDashboard();
}

// ============================================================
// PROJECT CRUD (Modal)
// ============================================================
function adminCreateNewProject() {
    const projects = getProjects();
    // Suggest next ID
    const nextId = projects.length > 0 ? (Math.max(...projects.map(p => parseInt(p.displayId) || 0)) + 1).toString() : "1";

    document.getElementById('modalTitle').textContent = '➕ Nuevo Proyecto';
    document.getElementById('modalProjectId').value = '';
    document.getElementById('modalProjectDisplayId').value = nextId;
    document.getElementById('modalProjectName').value = '';
    document.getElementById('modalProjectDesc').value = '';
    document.getElementById('modalProjectStatus').value = 'Activo';
    
    _populateAreaSelect('modalProjectArea', '');
    if (document.getElementById('modalProjectPriority')) document.getElementById('modalProjectPriority').value = 'Normal';

    document.getElementById('projectModal').classList.add('open');
}

function editProject(projectId) {
    const projects = getProjects();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    
    document.getElementById('modalTitle').textContent = '✏️ Editar Proyecto';
    document.getElementById('modalProjectId').value = proj.id;
    document.getElementById('modalProjectDisplayId').value = proj.displayId || '';
    document.getElementById('modalProjectName').value = proj.name;
    document.getElementById('modalProjectDesc').value = proj.description || '';
    document.getElementById('modalProjectStatus').value = proj.status || 'Activo';
    
    _populateAreaSelect('modalProjectArea', proj.area || '');
    if (document.getElementById('modalProjectPriority')) document.getElementById('modalProjectPriority').value = proj.priority || 'Normal';

    document.getElementById('projectModal').classList.add('open');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('open');
}

function saveProjectFromModal() {
    const id = document.getElementById('modalProjectId').value;
    const displayId = document.getElementById('modalProjectDisplayId').value.trim() || '0';
    const name = document.getElementById('modalProjectName').value.trim();
    const desc = document.getElementById('modalProjectDesc').value.trim();
    const status = document.getElementById('modalProjectStatus').value;
    const area     = document.getElementById('modalProjectArea')?.value     || '';
    const priority = document.getElementById('modalProjectPriority')?.value || 'Normal';
    const color    = getAreaColor(area);
    
    if (!name) {
        alert('❌ El nombre del proyecto es obligatorio.');
        return;
    }
    
    const projects = getProjects();
    
    if (id) {
        // Edit
        const proj = projects.find(p => p.id === id);
        if (proj) {
            proj.displayId = displayId;
            proj.name      = name;
            proj.description = desc;
            proj.status    = status;
            proj.area      = area;
            proj.priority  = priority;
            proj.color     = color;
        }
    } else {
        // Create
        const newId = `project_${Date.now()}`;
        projects.push({
            id: newId,
            displayId,
            name,
            description: desc,
            area,
            priority,
            color,
            status,
            sprints: []
        });
        activeProjectId = newId;
        activeSprintId = null;
    }
    
    saveProjects(projects);
    closeProjectModal();
    initProjectSelector();
    initSprintSelector();
    if (id) renderProjectsView(); else refreshActiveView('projects-view');
}

// Area/Priority — color is derived from AREA_CONFIG, no swatch click handler needed.

// Helper: populate the area <select> dynamically
function _populateAreaSelect(selectId, selectedValue) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const cfg = getAreaConfig();
    let html = '<option value="">— Sin área —</option>';
    Object.entries(cfg).forEach(([name, data]) => {
        html += `<option value="${name}" ${selectedValue === name ? 'selected' : ''}>${data.emoji} ${name}</option>`;
    });
    sel.innerHTML = html;
}

// ============================================================
// CONFIG TABS (Áreas / Equipo / Sprints / General)
// ============================================================
function switchConfigTab(tab) {
    ['general','sprints','areas','team'].forEach(t => {
        const pane = document.getElementById('cfg-' + t);
        const btn  = document.getElementById('cfgTab-' + t);
        if (!pane || !btn) return;
        if (t === tab) {
            pane.style.display = '';
            btn.style.color    = 'var(--primary)';
            btn.style.fontWeight = '700';
            btn.style.borderBottom = '3px solid var(--primary)';
        } else {
            pane.style.display = 'none';
            btn.style.color    = 'var(--text-muted)';
            btn.style.fontWeight = '600';
            btn.style.borderBottom = '3px solid transparent';
        }
    });
    if (tab === 'areas')   renderAreasConfig();
    if (tab === 'team')    renderTeamConfig();
    if (tab === 'sprints') renderAdminPanel();
    if (tab === 'general') _loadGeneralTab();
}

// ============================================================
// GENERAL CONFIG — Platform Name
// ============================================================
function getPlatformName() {
    return localStorage.getItem(PLAT_NAME_KEY) || 'BI Analytics';
}
function getPlatformSubtitle() {
    return localStorage.getItem(PLAT_SUBTITLE_KEY) || 'EMPRESA LÍDER EN RETAIL';
}

function applyPlatformName() {
    const name = getPlatformName();
    const el = document.getElementById('platformNameHeader');
    if (el) el.textContent = name;
    document.title = name + ' — Scrum Platform';
}

function _loadGeneralTab() {
    const nameInput = document.getElementById('platformNameInput');
    const subtitleInput = document.getElementById('platformSubtitleInput');
    const preview = document.getElementById('platformNamePreview');
    if (nameInput) nameInput.value = getPlatformName();
    if (subtitleInput) subtitleInput.value = getPlatformSubtitle();
    if (preview) preview.textContent = getPlatformName();
}

function updatePlatformNamePreview() {
    const val = document.getElementById('platformNameInput')?.value || 'BI Analytics';
    const preview = document.getElementById('platformNamePreview');
    if (preview) preview.textContent = val;
}

function savePlatformName() {
    const val = (document.getElementById('platformNameInput')?.value || '').trim();
    if (!val) { alert('❌ El nombre no puede estar vacío.'); return; }
    localStorage.setItem(PLAT_NAME_KEY, val);
    applyPlatformName();
    updatePlatformNamePreview();
    alert('✅ Nombre guardado: "' + val + '"\nSe actualizó el header. El Reporte Ejecutivo lo mostrará al reabrir.');
}

function savePlatformSubtitle() {
    const val = (document.getElementById('platformSubtitleInput')?.value || '').trim();
    if (!val) { alert('❌ El subtítulo no puede estar vacío.'); return; }
    localStorage.setItem(PLAT_SUBTITLE_KEY, val);
    alert('✅ Subtítulo guardado: "' + val + '"\nEl Reporte Ejecutivo lo mostrará al reabrir.');
}

// ============================================================
// AREAS CONFIG (CRUD)
// ============================================================
function renderAreasConfig() {
    try {
        const cfg = getAreaConfig();
        const container = document.getElementById('areasListContainer');
        if (!container) return;
        if (Object.keys(cfg).length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:2rem;">No hay áreas configuradas. Crea la primera.</p>`;
            return;
        }
        container.innerHTML = Object.entries(cfg).map(([name, data]) => `
            <div style="display:flex; align-items:center; gap:1rem; padding:1rem 1.2rem; background:#f8fafc; border:1px solid var(--border-glass); border-radius:12px; border-left:5px solid ${data.color};">
                <span style="font-size:1.5rem;">${data.emoji}</span>
                <div style="flex:1;">
                    <div style="font-weight:700; color:var(--text-main); font-size:1rem;">${name}</div>
                    <span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.75rem;font-weight:600;padding:0.15rem 0.6rem;border-radius:20px;background:${data.color}15;color:${data.color};border:1.5px solid ${data.color}40;margin-top:0.3rem;">${data.emoji} ${name}</span>
                </div>
                <div style="display:flex;align-items:center;gap:0.4rem;">
                    <div style="width:20px;height:20px;border-radius:50%;background:${data.color};border:2px solid #e2e8f0;"></div>
                    <code style="font-size:0.75rem;color:var(--text-muted);">${data.color}</code>
                </div>
                <div style="display:flex;gap:0.5rem;">
                    <button onclick="openAreaModal('${name.replace(/'/g, "\\'")}')"
                        style="padding:0.45rem 0.9rem;border:1px solid ${data.color};background:${data.color}15;color:${data.color};border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;">✏️ Editar</button>
                    <button onclick="deleteArea('${name.replace(/'/g, "\\'")}')"
                        style="padding:0.45rem 0.9rem;border:1px solid #fee2e2;background:#fef2f2;color:#ef4444;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;">🗑️</button>
                </div>
            </div>
        `).join('');
    } catch(err) { console.error('[RenderAreas]', err); }
}

function openAreaModal(areaName) {
    const cfg  = getAreaConfig();
    const data = areaName ? cfg[areaName] : null;
    document.getElementById('areaModalTitle').textContent = data ? '✏️ Editar Área' : '🏢 Nueva Área de Negocio';
    document.getElementById('areaModalKey').value   = areaName || '';
    document.getElementById('areaModalName').value  = areaName || '';
    document.getElementById('areaModalEmoji').value = data?.emoji || '🔵';
    document.getElementById('areaModalColor').value      = data?.color || '#0057b8';
    document.getElementById('areaModalColorHex').value   = data?.color || '#0057b8';
    updateAreaPreview();
    document.getElementById('areaModal').classList.add('open');

    // Live preview listeners
    document.getElementById('areaModalColor').oninput = () => {
        document.getElementById('areaModalColorHex').value = document.getElementById('areaModalColor').value;
        updateAreaPreview();
    };
    document.getElementById('areaModalName').oninput  = updateAreaPreview;
    document.getElementById('areaModalEmoji').oninput = updateAreaPreview;
}

function updateAreaPreview() {
    const name  = document.getElementById('areaModalName').value  || 'Mi Área';
    const emoji = document.getElementById('areaModalEmoji').value || '🔵';
    const color = document.getElementById('areaModalColor').value  || '#0057b8';
    const badge = document.getElementById('areaPreviewBadge');
    if (!badge) return;
    badge.textContent = `${emoji} ${name}`;
    badge.style.background = color + '15';
    badge.style.color      = color;
    badge.style.border     = `1.5px solid ${color}40`;
}

function syncColorFromHex() {
    const hex = document.getElementById('areaModalColorHex').value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        document.getElementById('areaModalColor').value = hex;
        updateAreaPreview();
    }
}

function pickAreaColor(color) {
    document.getElementById('areaModalColor').value    = color;
    document.getElementById('areaModalColorHex').value = color;
    updateAreaPreview();
}

function saveAreaFromModal() {
    const oldKey = document.getElementById('areaModalKey').value.trim();
    const name   = document.getElementById('areaModalName').value.trim();
    const emoji  = document.getElementById('areaModalEmoji').value.trim() || '🔵';
    const color  = document.getElementById('areaModalColor').value || '#0057b8';
    if (!name) { alert('❌ El nombre del área es obligatorio.'); return; }
    const cfg = getAreaConfig();
    // If renaming, remove old key
    if (oldKey && oldKey !== name) delete cfg[oldKey];
    cfg[name] = { color, emoji };
    saveAreaConfig(cfg);
    // Refresh the live alias
    AREA_CONFIG = cfg;
    closeAreaModal();
    renderAreasConfig();
    alert(`✅ Área "${name}" guardada`);
}

function closeAreaModal() {
    document.getElementById('areaModal').classList.remove('open');
}

function deleteArea(name) {
    if (!confirm(`¿Eliminar el área "${name}"? Los proyectos que la usen no se verán afectados.`)) return;
    const cfg = getAreaConfig();
    delete cfg[name];
    saveAreaConfig(cfg);
    AREA_CONFIG = cfg;
    renderAreasConfig();
}

// ============================================================
// TEAM CONFIG (CRUD)
// ============================================================
function renderTeamConfig() {
    try {
        const team = getTeamConfig();
        const container = document.getElementById('teamMembersContainer');
        if (!container) return;
        if (team.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:2rem; grid-column:1/-1;">No hay integrantes. Agrega el primero.</p>`;
            return;
        }
        container.innerHTML = team.map((m, idx) => `
            <div style="background:white;border:1px solid var(--border-glass);border-radius:14px;padding:1.2rem;border-top:4px solid ${m.color};box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.8rem;">
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                        <div style="width:40px;height:40px;border-radius:50%;background:${m.color}20;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;color:${m.color};border:2px solid ${m.color}40;">👤</div>
                        <div>
                            <div style="font-weight:800;font-size:1rem;color:var(--text-main);">${m.name}</div>
                            <div style="font-size:0.78rem;color:var(--text-muted);">${m.role || 'Sin rol'}</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:0.4rem;">
                        <button onclick="openTeamMemberModal(${idx})" style="padding:0.35rem 0.7rem;border:1px solid ${m.color};background:${m.color}15;color:${m.color};border-radius:7px;cursor:pointer;font-size:0.78rem;font-weight:700;">✏️</button>
                        <button onclick="deleteTeamMember(${idx})" style="padding:0.35rem 0.7rem;border:1px solid #fee2e2;background:#fef2f2;color:#ef4444;border-radius:7px;cursor:pointer;font-size:0.78rem;font-weight:700;">🗑️</button>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <div style="width:12px;height:12px;border-radius:50%;background:${m.color};"></div>
                    <code style="font-size:0.72rem;color:var(--text-muted);">${m.color}</code>
                </div>
            </div>
        `).join('');
    } catch(err) { console.error('[RenderTeam]', err); }
}

function openTeamMemberModal(idx) {
    const team = getTeamConfig();
    const m = idx !== null ? team[idx] : null;
    document.getElementById('teamMemberModalTitle').textContent = m ? '✏️ Editar Integrante' : '👤 Nuevo Integrante';
    document.getElementById('teamMemberModalKey').value  = idx !== null ? String(idx) : '';
    document.getElementById('teamMemberName').value      = m?.name  || '';
    document.getElementById('teamMemberRole').value      = m?.role  || '';
    document.getElementById('teamMemberColor').value     = m?.color || '#0057b8';
    _updateMemberColorPreview(m?.name || 'Nuevo Integrante', m?.color || '#0057b8');
    document.getElementById('teamMemberColor').oninput = () => {
        _updateMemberColorPreview(document.getElementById('teamMemberName').value || 'Integrante', document.getElementById('teamMemberColor').value);
    };
    document.getElementById('teamMemberName').oninput = () => {
        _updateMemberColorPreview(document.getElementById('teamMemberName').value || 'Integrante', document.getElementById('teamMemberColor').value);
    };
    document.getElementById('teamMemberModal').classList.add('open');
}

function _updateMemberColorPreview(name, color) {
    const el = document.getElementById('teamMemberColorPreview');
    if (!el) return;
    el.textContent = name;
    el.style.background = color + '15';
    el.style.color      = color;
}

function saveTeamMemberFromModal() {
    const idxStr = document.getElementById('teamMemberModalKey').value;
    const name   = document.getElementById('teamMemberName').value.trim();
    const role   = document.getElementById('teamMemberRole').value.trim();
    const color  = document.getElementById('teamMemberColor').value || '#0057b8';
    if (!name) { alert('❌ El nombre es obligatorio.'); return; }
    const team = getTeamConfig();
    const newMember = { name, role, color };
    if (idxStr !== '') {
        team[parseInt(idxStr)] = newMember;
    } else {
        team.push(newMember);
    }
    saveTeamConfig(team);
    closeTeamMemberModal();
    renderTeamConfig();
    alert(`✅ Integrante "${name}" guardado`);
}

function closeTeamMemberModal() {
    document.getElementById('teamMemberModal').classList.remove('open');
}

function deleteTeamMember(idx) {
    const team = getTeamConfig();
    if (!confirm(`¿Eliminar a "${team[idx]?.name}" del equipo?`)) return;
    team.splice(idx, 1);
    saveTeamConfig(team);
    renderTeamConfig();
}

function deleteProject(projectId) {
    if (!confirm('¿Eliminar este proyecto y TODOS sus sprints? Esta acción no se puede deshacer.')) return;
    let projects = getProjects();
    projects = projects.filter(p => p.id !== projectId);
    saveProjects(projects);
    if (activeProjectId === projectId) {
        activeProjectId = projects.length > 0 ? projects[0].id : null;
        activeSprintId  = null;
    }
    initProjectSelector();
    initSprintSelector();
    renderProjectsView();
}

// ============================================================
// SPRINT DETAIL
// ============================================================


// ============================================================
// TEAM VIEW
// ============================================================


// ============================================================
// EXECUTIVE REPORT
// ============================================================
function renderExecutiveReport() {
    try {
        const sprints = getSprints();
        const sprint  = getActiveSprint();
        const proj    = getActiveProject();

        let totalPlanned = 0, totalCompleted = 0;
        sprints.forEach(s => {
            let p = parseInt(s.pointsPlanned) || 0;
            if (p === 0 && (s.tasks || []).length > 0) {
                p = s.tasks.reduce((sum, t) => sum + (parseInt(t.points) || 0), 0);
            }
            totalPlanned += p;
            (s.tasks || []).forEach(t => { if (t.status === 'Done') totalCompleted += parseInt(t.points) || 0; });
        });
        const globalProgress = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

        const sprintsWithCompleted = [];
        sprints.forEach(s => {
            const cp = (s.tasks || []).reduce((a, t) => t.status === 'Done' ? a + (parseInt(t.points) || 0) : a, 0);
            if (cp > 0) sprintsWithCompleted.push(cp);
        });
        let avgVel = 0;
        if (sprintsWithCompleted.length > 0) {
            const last3 = sprintsWithCompleted.slice(-3);
            avgVel = Math.round(last3.reduce((a, b) => a + b, 0) / last3.length);
        }

        document.getElementById('execProgressValue').textContent  = globalProgress + '%';
        document.getElementById('execCompletedSP').textContent    = totalCompleted;
        document.getElementById('execVelocity').textContent       = avgVel;
        document.getElementById('execCurrentSprint').textContent  = sprint ? sprint.name : '-';

        // Chart
        try {
            if (chartsInstance.exec) chartsInstance.exec.destroy();
            const last5        = sprints.slice(-5);
            const chartNames   = last5.map((s, i) => `#${sprints.indexOf(s) + 1} ${s.name}`);
            const chartPlanned = last5.map(s => parseInt(s.pointsPlanned) || 0);
            const chartDone    = last5.map(s => (s.tasks || []).reduce((a, t) => t.status === 'Done' ? a + (parseInt(t.points) || 0) : a, 0));
            const ctxExec = document.getElementById('execChart')?.getContext('2d');
            if (ctxExec) {
                chartsInstance.exec = new Chart(ctxExec, {
                    type: 'bar',
                    data: { labels: chartNames, datasets: [
                        { label: 'Planeado',  data: chartPlanned, backgroundColor: '#e2e8f0', borderRadius: 4 },
                        { label: 'Realizado', data: chartDone,    backgroundColor: '#cc0000', borderRadius: 4 }
                    ]},
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }
                });
            }
        } catch (e) { console.error('[ExecChart]', e); }

        // Sprint details
        let detailsHtml = '';
        sprints.slice(-5).reverse().forEach(s => {
            const spP = parseInt(s.pointsPlanned) || 0;
            const spC = (s.tasks || []).reduce((a, t) => t.status === 'Done' ? a + (parseInt(t.points) || 0) : a, 0);
            const pct = spP > 0 ? Math.round((spC / spP) * 100) : 0;
            const statusColor = pct === 100 ? '#10b981' : pct >= 80 ? '#f59e0b' : '#ef4444';
            detailsHtml += `<div style="background:rgba(0,0,0,0.04); padding:1rem; border-radius:8px; border-left:4px solid ${statusColor};">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div><strong>${s.name}</strong><p style="color:var(--text-muted); font-size:0.85rem;">${formatDate(s.start)} → ${formatDate(s.end)}</p></div>
                    <div style="text-align:right;"><p style="color:${statusColor}; font-weight:700; font-size:1.5rem;">${pct}%</p><p style="color:var(--text-muted); font-size:0.85rem;">${spC}/${spP} SP</p></div>
                </div>
            </div>`;
        });
        document.getElementById('execSprintDetails').innerHTML = detailsHtml;

        // Critical tasks
        let criticalHtml = '';
        sprints.forEach(s => {
            (s.tasks || []).filter(t => t.status !== 'Done').slice(0, 3).forEach(t => {
                criticalHtml += `<div style="background:rgba(239,68,68,0.1); padding:0.75rem; border-radius:8px; border-left:4px solid #ef4444;">
                    <strong>${t.name}</strong> — ${s.name}
                    <p style="color:var(--text-muted); font-size:0.85rem;">Responsable: ${t.responsible} | ${t.points} SP</p>
                </div>`;
            });
        });
        document.getElementById('execCriticalTasks').innerHTML = criticalHtml || '<p style="color:var(--text-muted);">✅ Sin tareas pendientes críticas</p>';
    } catch (err) { console.error('[ExecutiveReport] Error:', err); }
}

// ============================================================
// BITÁCORA
// ============================================================
function renderBitacora() {
    try {
        const sprint = getActiveSprint();
        if (!sprint) return;
        document.getElementById('bitacoraSprintName').textContent = sprint.name;
        const notes = sprint.bitacora || {};
        document.getElementById('notePlanning').value  = notes.planning || '';
        document.getElementById('noteStandups').value  = notes.standup  || '';
        document.getElementById('noteRetro').value     = notes.retro    || '';
        document.getElementById('dailyNoteDate').value = new Date().toISOString().split('T')[0];

        const dailyLog    = notes.dailyLog || [];
        const historyHtml = dailyLog.sort((a, b) => new Date(b.date) - new Date(a.date)).map((n, i) => `
            <div style="background:white; padding:1rem; border-radius:10px; border:1px solid #e2e8f0; position:relative;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <span class="date-badge" style="font-size:0.75rem;">${formatDate(n.date)}</span>
                    <span style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-muted);">${n.type || 'General'}</span>
                </div>
                <p style="font-size:0.9rem; white-space:pre-wrap;">${n.text}</p>
                <button onclick="deleteDailyNote(${i})" style="position:absolute;top:5px;right:5px;background:none;border:none;cursor:pointer;font-size:0.8rem;opacity:0.3;">❌</button>
            </div>`).join('');
        document.getElementById('dailyLogHistory').innerHTML = historyHtml || '<p style="text-align:center; color:var(--text-muted); font-size:0.85rem;">No hay notas registradas aún</p>';

        let tasksHtml = '';
        (sprint.tasks || []).forEach((t, i) => {
            const isCompleted  = t.status === 'Done';
            const completedDate = t.completionDate || '';
            tasksHtml += `<div style="display:flex; gap:1rem; background:${isCompleted ? '#f0fdf4' : '#f8fafc'}; padding:1rem; border-radius:8px; border-left:4px solid ${isCompleted ? '#10b981' : '#cbd5e1'}; align-items:center; margin-bottom:0.5rem;">
                <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="bitacoraMarkTaskDone(${i}, this.checked)" style="cursor:pointer;">
                <div style="flex:1;"><strong>${t.name}</strong> (${t.points} SP) • ${t.responsible}
                    ${completedDate ? `<p style="color:#10b981; font-size:0.85rem;">✓ Completado: ${completedDate}</p>` : ''}
                </div>
                ${isCompleted ? `<input type="date" value="${completedDate}" onchange="bitacoraUpdateCompletionDate(${i}, this.value)" style="padding:0.4rem; border:1px solid var(--border-glass); border-radius:4px;">` : ''}
            </div>`;
        });
        document.getElementById('bitacoraTasksList').innerHTML = tasksHtml || '<p>No hay tareas en este sprint</p>';
    } catch (err) { console.error('[Bitacora] Render error:', err); }
}

function addDailyNote() {
    try {
        const text = document.getElementById('dailyNoteText').value.trim();
        const date = document.getElementById('dailyNoteDate').value;
        const type = document.getElementById('dailyNoteType').value;
        if (!text) return;
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        if (!sprint.bitacora)          sprint.bitacora = {};
        if (!sprint.bitacora.dailyLog) sprint.bitacora.dailyLog = [];
        sprint.bitacora.dailyLog.push({ date, text, type });
        saveSprints(sprints);
        document.getElementById('dailyNoteText').value = '';
        renderBitacora();
    } catch (err) { console.error('[AddDailyNote]', err); }
}

function deleteDailyNote(idx) {
    try {
        if (!confirm('¿Borrar esta nota?')) return;
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint || !sprint.bitacora?.dailyLog) return;
        sprint.bitacora.dailyLog.sort((a, b) => new Date(b.date) - new Date(a.date));
        sprint.bitacora.dailyLog.splice(idx, 1);
        saveSprints(sprints);
        renderBitacora();
    } catch (err) { console.error('[DeleteDailyNote]', err); }
}

function bitacoraMarkTaskDone(idx, checked) {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint || !sprint.tasks[idx]) return;
        if (checked && sprint.tasks[idx].status !== 'Done') {
            sprint.tasks[idx].status         = 'Done';
            sprint.tasks[idx].completionDate = new Date().toISOString().split('T')[0];
        } else if (!checked) {
            sprint.tasks[idx].status         = 'To Do';
            sprint.tasks[idx].completionDate = '';
        }
        saveSprints(sprints);
        renderBitacora();
        renderExecutiveReport();
    } catch (err) { console.error('[MarkTaskDone]', err); }
}

function bitacoraUpdateCompletionDate(idx, date) {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint || !sprint.tasks[idx]) return;
        sprint.tasks[idx].completionDate = date;
        saveSprints(sprints);
        renderBitacora();
    } catch (err) { console.error('[UpdateCompletionDate]', err); }
}

function saveBitacora() {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        if (!sprint.bitacora) sprint.bitacora = {};
        sprint.bitacora.planning = document.getElementById('notePlanning').value;
        sprint.bitacora.standup  = document.getElementById('noteStandups').value;
        sprint.bitacora.retro    = document.getElementById('noteRetro').value;
        saveSprints(sprints);
        alert('✅ Notas del Sprint Guardadas');
        loadPresentationSlide(currentSlideIdx);
    } catch (err) { console.error('[SaveBitacora] Error:', err); alert('❌ Error al guardar'); }
}

// ============================================================
// PRESENTATION SLIDES
// ============================================================
function loadPresentationSlide(n) {
    try {
        currentSlideIdx = n;
        document.getElementById('slideCounter').textContent = `${n} / 4`;
        const sprint  = getActiveSprint();
        const c       = document.getElementById('presentationSlides');
        if (!sprint) { c.innerHTML = '<p>No hay Sprint Seleccionado</p>'; return; }
        const sprints = getSprints();
        const gtP = sprints.reduce((a, b) => a + (parseInt(b.pointsPlanned) || 0), 0);
        const gtC = sprints.reduce((a, b) => a + (b.tasks || []).reduce((x, t) => t.status === 'Done' ? x + (parseInt(t.points) || 0) : x, 0), 0);
        const gp  = gtP > 0 ? Math.round((gtC / gtP) * 100) : 0;
        const completed = sprints.filter(s => s.status === 'Completado').slice(-3);
        let avgVel = 0;
        if (completed.length > 0) {
            let sum = 0;
            completed.forEach(s => { sum += (s.tasks || []).reduce((x, t) => t.status === 'Done' ? x + (parseInt(t.points) || 0) : x, 0); });
            avgVel = Math.round(sum / completed.length);
        }
        const sP = parseInt(sprint.pointsPlanned) || 0;
        const sC = (sprint.tasks || []).reduce((x, t) => t.status === 'Done' ? x + (parseInt(t.points) || 0) : x, 0);
        const sp = sP > 0 ? Math.round((sC / sP) * 100) : 0;
        let html = '';
        if (n === 1) {
            html = `<div style="text-align:center;">
                <h3 style="color:var(--text-muted);font-size:1.5rem;">📊 STATUS PROYECTO GLOBAL</h3>
                <div style="font-size:5rem; color:var(--primary); font-weight:800; margin:1rem 0;">${gp}%</div>
                <p style="color:var(--text-muted);">Total Completado: ${gtC} / ${gtP} SP</p>
                <p style="color:var(--text-muted); margin-top:2rem; font-size:0.9rem;">Velocidad Promedio: ${avgVel} SP</p>
            </div>`;
        } else if (n === 2) {
            html = `<div style="text-align:center;">
                <h3 style="color:var(--primary);font-size:2rem;">${sprint.name}</h3>
                <span style="display:block;background:#f1f5f9;color:var(--text-main);border-radius:20px;padding:0.2rem 1rem;max-width:200px;margin:1rem auto;font-weight:700;">${sp}% Completado</span>
                <div style="display:flex;justify-content:space-around;margin-top:3rem;gap:2rem;">
                    <div style="background:#f1f5f9;padding:1.5rem;border-radius:8px;">Planificado<br><strong style="font-size:2rem;">${sP}</strong></div>
                    <div style="background:#f1f5f9;padding:1.5rem;border-radius:8px;">Realizado<br><strong style="font-size:2rem;">${sC}</strong></div>
                </div>
            </div>`;
        } else if (n === 3) {
            const nts = sprint.bitacora || {};
            html = `<div style="width:100%;text-align:left;">
                <h3 style="color:var(--primary);border-bottom:1px solid #cbd5e1;padding-bottom:1rem;margin-bottom:1rem;">📝 Notas Scrum</h3>
                <p style="color:var(--text-muted);font-size:0.8rem;text-transform:uppercase;">Planning & Standups</p>
                <p style="background:#f1f5f9;padding:1rem;border-radius:8px;margin-bottom:1rem;">${nts.planning || '-'} <br> ${nts.standup || '-'}</p>
                <p style="color:var(--text-muted);font-size:0.8rem;text-transform:uppercase;">Retrospectiva & Acciones</p>
                <p style="background:#f1f5f9;padding:1rem;border-radius:8px;">${nts.retro || '-'}</p>
            </div>`;
        } else if (n === 4) {
            const doneTasks  = (sprint.tasks || []).filter(t => t.status === 'Done').length;
            const totalTasks = (sprint.tasks || []).length;
            html = `<div style="text-align:center;">
                <h3 style="color:#10b981;font-size:1.5rem;">✅ Tareas Completadas</h3>
                <div style="font-size:4rem;color:#10b981;font-weight:800;margin:1rem 0;">${doneTasks}</div>
                <p style="font-size:1.2rem;">de ${totalTasks} tareas</p>
                <div style="display:flex;justify-content:space-around;margin-top:3rem;">
                    <div style="background:#f1f5f9;padding:1.5rem;border-radius:8px;">📊 Efectividad<br><strong style="font-size:2rem;color:#10b981;">${totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) : 0}%</strong></div>
                </div>
            </div>`;
        }
        c.innerHTML = `<div style="width:100%;animation:fadeIn 0.3s;">${html}</div>`;
    } catch (err) { console.error('[LoadSlide] Error:', err); }
}

function nextSlide()     { if (currentSlideIdx < 4) loadPresentationSlide(currentSlideIdx + 1); }
function previousSlide() { if (currentSlideIdx > 1) loadPresentationSlide(currentSlideIdx - 1); }

// ============================================================
// ADMIN PANEL — Sprint CRUD
// ============================================================
function renderAdminPanel() {
    try {
        const proj  = getActiveProject();
        const projEl = document.getElementById('adminCurrentProject');
        if (projEl) projEl.textContent = proj ? proj.name : '-';

        const sprint = getActiveSprint();
        if (!sprint) { document.getElementById('adminName').value = ''; return; }

        document.getElementById('adminName').value   = sprint.name         || '';
        document.getElementById('adminStatus').value = sprint.status       || 'En Desarrollo';
        document.getElementById('adminStart').value  = parseToStandardDate(sprint.start) || '';
        document.getElementById('adminEnd').value    = parseToStandardDate(sprint.end)   || '';
        document.getElementById('adminSP').value     = sprint.pointsPlanned || 0;

        // Build dynamic member options from team config
        const teamMembers = getTeamConfig();
        const memberOptions = teamMembers
            .map(m => `<option value="${m.name}">${m.name}${m.role ? ' · ' + m.role : ''}</option>`)
            .join('');

        const tc = document.getElementById('adminTasksContainer');
        tc.innerHTML = '';
        (sprint.tasks || []).forEach((t, i) => {
            const opts = teamMembers.map(m =>
                `<option value="${m.name}" ${t.responsible === m.name ? 'selected' : ''}>${m.name}</option>`
            ).join('');
            tc.innerHTML += `<div style="display:flex; gap:1rem; background:#f0f0f0; padding:1rem; border:1px solid #ddd; border-radius:12px; margin-bottom:0.8rem; align-items:center;">
                <input type="text" value="${t.name}" onchange="adminUpdateTask(${i},'name',this.value)" style="flex:2; padding:0.6rem; background:white; border:1px solid #ddd; border-radius:8px; outline:none; font-family:'Outfit';">
                <select onchange="adminUpdateTask(${i},'responsible',this.value)" style="padding:0.6rem; background:white; border:1px solid #ddd; border-radius:8px; outline:none; font-family:'Outfit';">${opts}</select>
                <select onchange="adminUpdateTask(${i},'status',this.value)" style="padding:0.6rem; background:white; border:1px solid #ddd; border-radius:8px; outline:none; font-family:'Outfit';">
                    <option ${t.status === 'To Do'      ? 'selected' : ''}>To Do</option>
                    <option ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option ${t.status === 'Done'       ? 'selected' : ''}>Done</option>
                    <option ${t.status === 'Pendiente'  ? 'selected' : ''}>Pendiente</option>
                </select>
                <input type="number" value="${t.points}" onchange="adminUpdateTask(${i},'points',this.value)" style="width:80px; padding:0.6rem; background:white; border:1px solid #ddd; border-radius:8px; outline:none; font-family:'Outfit';">
                <button onclick="adminDeleteTask(${i})" style="background:transparent; border:none; cursor:pointer; font-size:1.2rem;" title="Borrar">❌</button>
            </div>`;
        });
    } catch (err) { console.error('[AdminPanel] Render error:', err); }
}

function adminSaveSprint() {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        sprint.name          = document.getElementById('adminName').value   || 'Sin Nombre';
        sprint.status        = document.getElementById('adminStatus').value;
        sprint.start         = document.getElementById('adminStart').value;
        sprint.end           = document.getElementById('adminEnd').value;
        sprint.pointsPlanned = parseInt(document.getElementById('adminSP').value) || 0;
        saveSprints(sprints);
        alert('✅ Sprint actualizado');
        initSprintSelector();
    } catch (err) { console.error('[AdminSave] Error:', err); alert('❌ Error al guardar'); }
}

function adminCreateNewSprint() {
    try {
        const id      = `sprint_${Date.now()}`;
        const sprints = getSprints();
        sprints.push({ id, name: 'Nuevo Sprint', status: 'Planificado', start: '', end: '', pointsPlanned: 10, tasks: [], bitacora: { planning: '', standup: '', retro: '' } });
        saveSprints(sprints);
        activeSprintId = id;
        initSprintSelector();
        renderAdminPanel();
    } catch (err) { console.error('[AdminCreate] Error:', err); alert('❌ Error al crear'); }
}

function adminDeleteSprint() {
    try {
        if (!confirm('¿Eliminar este sprint?')) return;
        let sprints = getSprints();
        sprints     = sprints.filter(s => s.id !== activeSprintId);
        saveSprints(sprints);
        activeSprintId = sprints.length > 0 ? sprints[0].id : null;
        initSprintSelector();
        renderAdminPanel();
    } catch (err) { console.error('[AdminDelete] Error:', err); alert('❌ Error al eliminar'); }
}

function adminAddTask() {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        if (!sprint.tasks) sprint.tasks = [];
        const team = getTeamConfig();
        const defaultResponsible = team.length > 0 ? team[0].name : 'Luis';
        sprint.tasks.push({ name: 'Nueva Tarea', responsible: defaultResponsible, status: 'To Do', points: 3, progress: 0, completionDate: '' });
        saveSprints(sprints);
        renderAdminPanel();
    } catch (err) { console.error('[AdminAddTask] Error:', err); }
}

function adminUpdateTask(idx, field, value) {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint || !sprint.tasks[idx]) return;
        sprint.tasks[idx][field] = field === 'points' ? (parseInt(value) || 0) : value;
        saveSprints(sprints);
    } catch (err) { console.error('[AdminUpdateTask] Error:', err); }
}

function adminDeleteTask(idx) {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint || !sprint.tasks) return;
        sprint.tasks.splice(idx, 1);
        saveSprints(sprints);
        renderAdminPanel();
    } catch (err) { console.error('[AdminDeleteTask] Error:', err); }
}

function adminSetStatus(status) {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        sprint.status = status;
        saveSprints(sprints);
        document.getElementById('adminStatus').value = status;
        initSprintSelector();
        refreshActiveView('admin-panel');
        alert(`✅ Sprint marcado como ${status}`);
    } catch (err) { console.error('[AdminSetStatus]', err); }
}

function goToAdminSprint(sprintId) {
    try {
        activeSprintId = sprintId;
        const selector = document.getElementById('globalSprintSelect');
        if (selector) selector.value = sprintId;
        const adminNavItem = document.querySelector('.nav-item[data-tab="admin-panel"]');
        if (adminNavItem) adminNavItem.click();
        else renderAdminPanel();
    } catch (err) { console.error('[GoToAdmin] Error:', err); }
}

// --- DANGER ZONE FUNCTIONS ---
function adminDeleteProject() {
    try {
        if (activeProjectId === 'ALL') {
            alert('❌ No puedes borrar el portafolio completo desde aquí. Selecciona un proyecto específico.');
            return;
        }
        if (!confirm('¿ESTÁS SEGURO? Se borrará TODO el proyecto activo y sus sprints. Esta acción no se puede deshacer.')) return;
        
        let projects = getProjects();
        projects = projects.filter(p => p.id !== activeProjectId);
        saveProjects(projects);
        
        activeProjectId = projects.length > 0 ? projects[0].id : 'ALL';
        location.reload(); // Recarga para limpiar estado global
    } catch (err) { alert('❌ Error al borrar proyecto: ' + err.message); }
}

function adminResetAllData() {
    try {
        if (!confirm('⚠️ ¡ATENCIÓN! Esto borrará absolutamente TODOS los proyectos, sprints y tareas del sistema. ¿Deseas continuar?')) return;
        if (!confirm('ÚLTIMA ADVERTENCIA: Se perderán todos los datos locales. ¿Estás 100% seguro?')) return;
        
        storage.clear();
        alert('✨ Sistema Limpio. La plataforma se reiniciará.');
        location.reload();
    } catch (err) { alert('❌ Error al resetear: ' + err.message); }
}

// ============================================================
// REPORTS & DATA EXPORT
// ============================================================
function generateGlobalActiveReport() {
    try {
        const allSprints    = getSprints();
        const activeSprints = allSprints.filter(s => s.status !== 'Completado');
        const proj          = getActiveProject();
        if (activeSprints.length === 0) { alert('⚠️ No hay sprints activos'); return; }

        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`<html><head><title>Reporte Global - ${proj?.name || 'Proyecto'}</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body { font-family:'Outfit',sans-serif; padding:40px; color:#1e293b; background:#fff; }
                .no-print { text-align:right; margin-bottom:20px; }
                .header { border-bottom:4px solid #0057b8; padding-bottom:15px; margin-bottom:30px; }
                .header h1 { margin:0; color:#0057b8; font-size:2rem; }
                .sprint-block { margin-bottom:50px; border:1px solid #e2e8f0; border-radius:12px; padding:25px; page-break-inside:avoid; }
                .sprint-header { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:10px; margin-bottom:15px; }
                .sprint-id { background:#0057b8; color:white; padding:4px 10px; border-radius:6px; font-weight:700; font-size:0.8rem; }
                .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; margin-bottom:20px; }
                .stat-box { background:#f8fafc; padding:10px; border-radius:8px; text-align:center; }
                .stat-val { font-size:1.2rem; font-weight:700; color:#0057b8; }
                table { width:100%; border-collapse:collapse; margin-top:10px; }
                th { font-size:0.7rem; text-transform:uppercase; text-align:left; padding:8px; border-bottom:2px solid #e2e8f0; color:#64748b; }
                td { padding:8px; border-bottom:1px solid #f1f5f9; font-size:0.85rem; }
                @media print { .no-print { display:none; } }
            </style></head><body>
            <div class="no-print"><button onclick="window.print()" style="padding:10px 25px;background:#cc0000;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;">🖨️ Imprimir / PDF</button></div>
            <div class="header"><h1>${proj?.name || 'Reporte Global'}: Sprints Activos</h1><p style="color:#64748b;">Estado al ${new Date().toLocaleDateString()}</p></div>
            ${activeSprints.map(s => {
                const idx = allSprints.indexOf(s) + 1;
                const spP = parseInt(s.pointsPlanned) || 0;
                const spC = (s.tasks || []).reduce((a, t) => t.status === 'Done' ? a + (parseInt(t.points) || 0) : a, 0);
                const pct = spP > 0 ? Math.round((spC / spP) * 100) : 0;
                return `<div class="sprint-block">
                    <div class="sprint-header">
                        <div style="display:flex;align-items:center;gap:10px;"><span class="sprint-id">#${idx}</span><h2 style="margin:0;font-size:1.3rem;">${s.name}</h2></div>
                        <span style="font-weight:700;color:#10b981;">${pct}% completado</span>
                    </div>
                    <div class="stats-row">
                        <div class="stat-box"><div style="font-size:0.6rem;color:#64748b;text-transform:uppercase;">Fechas</div><div style="font-size:0.9rem;">${formatDate(s.start)} — ${formatDate(s.end)}</div></div>
                        <div class="stat-box"><div style="font-size:0.6rem;color:#64748b;text-transform:uppercase;">Story Points</div><div class="stat-val">${spC} / ${spP}</div></div>
                        <div class="stat-box"><div style="font-size:0.6rem;color:#64748b;text-transform:uppercase;">Estado</div><div class="stat-val" style="font-size:1rem;color:#f59e0b;">${s.status}</div></div>
                    </div>
                    <table><thead><tr><th>Tarea</th><th>Responsable</th><th>SP</th><th>Estatus</th></tr></thead><tbody>
                        ${(s.tasks || []).map(t => `<tr><td><strong>${t.name}</strong></td><td>${t.responsible}</td><td>${t.points}</td><td>${t.status}</td></tr>`).join('')}
                    </tbody></table>
                </div>`;
            }).join('')}
            <footer style="margin-top:40px;text-align:center;color:#94a3b8;font-size:0.7rem;border-top:1px solid #e2e8f0;padding-top:20px;">Scrum Platform PRO</footer>
        </body></html>`);
        reportWindow.document.close();
    } catch (err) { console.error('[GlobalReport]', err); alert('❌ Error al generar reporte'); }
}

function generatePrintableReport() {
    try {
        const sprint = getActiveSprint();
        if (!sprint) return;
        const spP = parseInt(sprint.pointsPlanned) || 0;
        const spC = (sprint.tasks || []).reduce((a, t) => t.status === 'Done' ? a + (parseInt(t.points) || 0) : a, 0);
        const pct = spP > 0 ? Math.round((spC / spP) * 100) : 0;
        const dailyLog = (sprint.bitacora?.dailyLog || []).sort((a, b) => new Date(a.date) - new Date(b.date));

        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`<html><head><title>Reporte Sprint - ${sprint.name}</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body{font-family:'Outfit',sans-serif;padding:40px;color:#2c3e50;line-height:1.6;}
                .header{border-bottom:3px solid #0057b8;padding-bottom:20px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:flex-end;}
                .header h1{margin:0;color:#0057b8;}
                .stats-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:40px;}
                .stat-card{border:1px solid #e2e8f0;padding:15px;border-radius:8px;text-align:center;}
                .stat-value{font-size:24px;font-weight:700;color:#0057b8;}
                h2{border-left:5px solid #cc0000;padding-left:15px;margin-top:40px;}
                table{width:100%;border-collapse:collapse;margin-top:15px;}
                th{background:#f8fafc;text-align:left;padding:12px;border-bottom:2px solid #e2e8f0;font-size:0.8rem;text-transform:uppercase;}
                td{padding:12px;border-bottom:1px solid #f1f5f9;font-size:0.9rem;}
                @media print{.no-print{display:none;}}
            </style></head><body>
            <div class="no-print" style="margin-bottom:20px;text-align:right;">
                <button onclick="window.print()" style="padding:10px 20px;background:#0057b8;color:white;border:none;border-radius:5px;cursor:pointer;">🖨️ Imprimir</button>
            </div>
            <div class="header">
                <div><p style="text-transform:uppercase;letter-spacing:2px;font-size:0.7rem;color:#64748b;margin-bottom:5px;">Reporte de Sprint</p><h1>${sprint.name}</h1><p>${formatDate(sprint.start)} — ${formatDate(sprint.end)}</p></div>
                <div style="text-align:right;"><span style="font-size:40px;font-weight:800;color:#10b981;">${pct}%</span><p style="margin:0;color:#64748b;">Progreso Total</p></div>
            </div>
            <div class="stats-grid">
                <div class="stat-card"><div style="font-size:0.7rem;color:#64748b;text-transform:uppercase;">Estado</div><div class="stat-value">${sprint.status}</div></div>
                <div class="stat-card"><div style="font-size:0.7rem;color:#64748b;text-transform:uppercase;">SP Planeados</div><div class="stat-value">${spP}</div></div>
                <div class="stat-card"><div style="font-size:0.7rem;color:#64748b;text-transform:uppercase;">SP Realizados</div><div class="stat-value" style="color:#10b981;">${spC}</div></div>
            </div>
            <h2>✅ Tareas</h2>
            <table><thead><tr><th>Tarea</th><th>Responsable</th><th>SP</th><th>Estado</th></tr></thead><tbody>
                ${(sprint.tasks || []).map(t => `<tr><td><strong>${t.name}</strong></td><td>${t.responsible}</td><td>${t.points}</td><td>${t.status}</td></tr>`).join('')}
            </tbody></table>
            <h2>📝 Bitácora</h2>
            <div style="background:#f8fafc;padding:20px;border-radius:8px;margin-bottom:20px;">
                <p><strong>Planning:</strong> ${sprint.bitacora?.planning || 'Sin notas'}</p>
                <p><strong>Standups:</strong> ${sprint.bitacora?.standup || 'Sin notas'}</p>
                <p><strong>Retro:</strong> ${sprint.bitacora?.retro || 'Sin notas'}</p>
            </div>
            ${dailyLog.length > 0 ? `<h2>📅 Log Diario</h2>${dailyLog.map(n => `<div style="margin-bottom:15px;padding-bottom:10px;border-bottom:1px dashed #e2e8f0;"><strong style="color:#64748b;font-size:0.8rem;">${formatDate(n.date)} — ${n.type}</strong><p style="margin-top:5px;">${n.text.replace(/\n/g,'<br>')}</p></div>`).join('')}` : ''}
            <footer style="margin-top:50px;text-align:center;font-size:0.7rem;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:20px;">Generado por Scrum Platform PRO — ${new Date().toLocaleString()}</footer>
        </body></html>`);
        reportWindow.document.close();
    } catch (err) { console.error('[GenerateReport]', err); alert('❌ Error al generar el reporte'); }
}

function downloadAllData() {
    try {
        const projects  = getProjects();
        const timestamp = new Date().toLocaleString('es-MX');
        const data      = { exported: timestamp, version: '4.0', totalProjects: projects.length, projects };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `scrum-platform-respaldo-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(`✅ Respaldo descargado: ${projects.length} proyectos`);
    } catch (err) { alert('❌ Error al descargar: ' + err.message); }
}

function downloadBackup() {
    try {
        const backup = localStorage.getItem(storage.BACKUP_KEY);
        if (!backup) { alert('⚠️ No hay respaldo disponible'); return; }
        const blob = new Blob([backup], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `scrum-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Respaldo descargado');
    } catch (err) { alert('❌ Error: ' + err.message); }
}

function importTasksFromDocument() {
    try {
        const input    = document.createElement('input');
        input.type     = 'file';
        input.accept   = '.json,.csv,.txt';
        input.onchange = (e) => {
            const file   = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => parseAndImportTasks(event.target.result, file.name);
            reader.readAsText(file);
        };
        input.click();
    } catch (err) { console.error('[ImportModal]', err); alert('❌ Error al abrir dialogo'); }
}

function parseAndImportTasks(content, fileName) {
    try {
        const sprints = getSprints();
        const sprint  = sprints.find(s => s.id === activeSprintId);
        if (!sprint) return;
        let newTasks = [];
        try {
            const json = JSON.parse(content);
            // Handle new v4.0 format: { projects: [...] }
            if (json.projects && Array.isArray(json.projects)) {
                if (confirm(`✅ Se detectó un respaldo completo con ${json.projects.length} proyectos. ¿Deseas RESTAURAR TODO (reemplazará los datos actuales)?`)) {
                    saveProjects(json.projects);
                    alert('✅ Restauración completa exitosa');
                    activeProjectId = null;
                    activeSprintId  = null;
                    initProjectSelector();
                    initSprintSelector();
                    refreshActiveView('dashboard-home');
                }
                return;
            }
            // Handle legacy sprints array
            if (Array.isArray(json)) {
                if (json.length > 0 && json[0].tasks !== undefined) {
                    // It's an array of sprints — migrate
                    if (confirm(`Se detectó respaldo con ${json.length} sprints. ¿Restaurar como sprints en el proyecto actual?`)) {
                        saveSprints(json);
                        alert('✅ Sprints restaurados');
                        initSprintSelector();
                        refreshActiveView('dashboard-home');
                    }
                    return;
                }
                newTasks = json.map(t => ({
                    name: t.name || t.tarea || '',
                    responsible: t.responsible || t.responsable || 'N/A',
                    points: parseInt(t.points || t.sp || 0) || 0,
                    status: t.status === 'Done' || t.status === 'Completado' ? 'Done' : 'To Do',
                    completionDate: t.completionDate || '',
                    progress: 0
                }));
            }
        } catch (e) {
            const lines = content.trim().split('\n');
            if (lines.length > 1) {
                const headers = lines[0].split(',').map(h => h.toLowerCase().trim());
                for (let i = 1; i < lines.length; i++) {
                    const values  = lines[i].split(',').map(v => v.trim());
                    if (values.length >= 2) {
                        const nameIdx   = headers.findIndex(h => h.includes('name') || h.includes('tarea'));
                        const respIdx   = headers.findIndex(h => h.includes('responsible') || h.includes('responsable'));
                        const spIdx     = headers.findIndex(h => h.includes('sp') || h.includes('points'));
                        const statusIdx = headers.findIndex(h => h.includes('status') || h.includes('estado'));
                        const dateIdx   = headers.findIndex(h => h.includes('date') || h.includes('fecha'));
                        newTasks.push({
                            name: values[Math.max(0, nameIdx)] || values[0] || '',
                            responsible: values[respIdx] || 'N/A',
                            points: parseInt(values[spIdx]) || 0,
                            status: (values[statusIdx] || '').toLowerCase().includes('done') ? 'Done' : 'To Do',
                            completionDate: values[dateIdx] || '',
                            progress: 0
                        });
                    }
                }
            }
        }

        if (newTasks.length > 0) {
            sprint.tasks = (sprint.tasks || []).concat(newTasks);
            saveSprints(sprints);
            alert(`✅ Importadas ${newTasks.length} tareas desde ${fileName}`);
            renderAdminPanel();
            renderBitacora();
            renderSprintDetail();
        } else {
            alert('⚠️ No se encontraron tareas en el archivo');
        }
    } catch (err) { console.error('[ParseImport]', err); alert('❌ Error al importar: ' + err.message); }
}

function exportProgressToCSV() {
    try {
        const sprint = getActiveSprint();
        if (!sprint) { alert('⚠️ Selecciona un Sprint primero'); return; }
        let csv = 'Tarea,Responsable,SP,Estado,Fecha_Completacion\n';
        (sprint.tasks || []).forEach(t => {
            csv += `"${t.name}","${t.responsible}","${t.points}","${t.status}","${t.completionDate || ''}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href     = URL.createObjectURL(blob);
        link.download = `Sprint_${sprint.name?.replace(/\s+/g,'_') || 'export'}.csv`;
        link.click();
    } catch (err) { console.error('[ExportCSV] Error:', err); alert('❌ Error al exportar'); }
}

function reloadFromDataJs() {
    try {
        if (!confirm('¿Restaurar desde data.js? Se perderán cambios locales.')) return;
        const fromDataJs = storage.parseDataJs();
        if (fromDataJs.length === 0) { alert('⚠️ No se encontró data.js'); return; }
        saveProjects(fromDataJs);
        activeProjectId = null;
        activeSprintId  = null;
        alert('✅ Restaurado desde data.js');
        initProjectSelector();
        initSprintSelector();
        refreshActiveView('dashboard-home');
    } catch (err) { console.error('[ReloadDataJs] Error:', err); alert('❌ Error: ' + err.message); }
}

// ============================================================
// TEAM ANALYTICS
// ============================================================
function renderTeamAnalytics() {
    try {
        const sprints = getSprints();
        if (sprints.length === 0) return;

        // Build member dataset across all sprints
        const members = {};
        let totalProjTasks = 0;
        let totalProjDoneTasks = 0;

        sprints.forEach((s, idx) => {
            const spIdx = idx + 1;
            (s.tasks || []).forEach(t => {
                const isDone = t.status === 'Done';
                const pts = parseInt(t.points) || 0;
                totalProjTasks++;
                if (isDone) totalProjDoneTasks++;

                // Split half if "Ambos"
                const assignees = t.responsible === 'Ambos' ? ['Luis', 'Alfred'] : [t.responsible];
                const ptVal = t.responsible === 'Ambos' ? pts / 2 : pts;

                assignees.forEach(member => {
                    if (member === 'N/A' || !member) return;
                    if (!members[member]) {
                        members[member] = { totalPt: 0, donePt: 0, taskCount: 0, sprints: {} };
                    }
                    members[member].taskCount++;
                    members[member].totalPt += ptVal;
                    if (isDone) members[member].donePt += ptVal;

                    if (!members[member].sprints[spIdx]) members[member].sprints[spIdx] = 0;
                    if (isDone) members[member].sprints[spIdx] += ptVal;
                });
            });
        });

        // 1. KPI Bar
        const htmlKpi = `
            <div class="kpi-chip"><div class="val">${totalProjTasks}</div><div class="lbl">Tareas Totales</div></div>
            <div class="kpi-chip"><div class="val">${totalProjTasks > 0 ? Math.round((totalProjDoneTasks/totalProjTasks)*100) : 0}%</div><div class="lbl">Tasa de Cierre</div></div>
            <div class="kpi-chip"><div class="val">${members['Luis'] ? members['Luis'].taskCount : 0}</div><div class="lbl">Asignadas a Luis</div></div>
            <div class="kpi-chip"><div class="val">${members['Alfred'] ? members['Alfred'].taskCount : 0}</div><div class="lbl">Asignadas a Alfred</div></div>
        `;
        document.getElementById('teamKpiBar').innerHTML = htmlKpi;

        // Labels for charts
        const sprintLabels = sprints.map((_, i) => `S${i+1}`);
        const luSprints = sprintLabels.map((_, i) => members['Luis']?.sprints[i+1] || 0);
        const alSprints = sprintLabels.map((_, i) => members['Alfred']?.sprints[i+1] || 0);

        // 2. Trend Chart (Line)
        if (chartsInstance.teamTrend) chartsInstance.teamTrend.destroy();
        chartsInstance.teamTrend = new Chart(document.getElementById('teamTrendChart'), {
            type: 'line',
            data: {
                labels: sprintLabels,
                datasets: [
                    { label: 'Luis', data: luSprints, borderColor: '#0057b8', backgroundColor: 'rgba(0,87,184,0.1)', fill: true, tension: 0.4 },
                    { label: 'Alfred', data: alSprints, borderColor: '#cc0000', backgroundColor: 'rgba(204,0,0,0.1)', fill: true, tension: 0.4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 3. Task Distribution (Pie/Doughnut)
        if (chartsInstance.teamDist) chartsInstance.teamDist.destroy();
        chartsInstance.teamDist = new Chart(document.getElementById('teamDistChart'), {
            type: 'doughnut',
            data: {
                labels: ['Luis', 'Alfred'],
                datasets: [{
                    data: [
                        members['Luis']?.taskCount || 0,
                        members['Alfred']?.taskCount || 0
                    ],
                    backgroundColor: ['#0057b8', '#cc0000']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });





        // 5. NUEVA: Tendencia Temporal Acumulada
        const timeLabels = sprints.map(s => s.end || s.name);
        const luCumulative = [];
        const alCumulative = [];
        let luSum = 0, alSum = 0;
        
        sprints.forEach((s, idx) => {
            luSum += members['Luis']?.sprints[idx+1] || 0;
            alSum += members['Alfred']?.sprints[idx+1] || 0;
            luCumulative.push(luSum);
            alCumulative.push(alSum);
        });

        if (chartsInstance.teamTime) chartsInstance.teamTime.destroy();
        chartsInstance.teamTime = new Chart(document.getElementById('teamTimeChart'), {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    { 
                        label: 'Luis (Acumulado)', 
                        data: luCumulative, 
                        borderColor: '#0057b8', 
                        backgroundColor: 'rgba(0,87,184,0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    { 
                        label: 'Alfred (Acumulado)', 
                        data: alCumulative, 
                        borderColor: '#cc0000', 
                        backgroundColor: 'rgba(204,0,0,0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Story Points Acumulados' } },
                    x: { title: { display: true, text: 'Línea de Tiempo (Fin de Sprint)' } }
                }
            }
        });

        // 6. PERFILES INDIVIDUALES (RESTAURADOS Y MEJORADOS)
        const renderMemberCard = (memberId, data, color) => {
            if (!data) return;
            const statsContainer = document.getElementById(`memberStats${memberId}`);
            if (!statsContainer) return;

            const pct = data.totalPt > 0 ? Math.round((data.donePt / data.totalPt) * 100) : 0;
            statsContainer.innerHTML = `
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:1rem;">
                    <div style="background:#f8fafc; padding:0.8rem; border-radius:8px; text-align:center;">
                        <div style="font-size:1.2rem; font-weight:800; color:${color};">${data.donePt}</div>
                        <div style="font-size:0.6rem; color:var(--text-muted); text-transform:uppercase;">SP Done</div>
                    </div>
                    <div style="background:#f8fafc; padding:0.8rem; border-radius:8px; text-align:center;">
                        <div style="font-size:1.2rem; font-weight:800; color:${color};">${data.taskCount}</div>
                        <div style="font-size:0.6rem; color:var(--text-muted); text-transform:uppercase;">Tareas</div>
                    </div>
                    <div style="background:#f8fafc; padding:0.8rem; border-radius:8px; text-align:center;">
                        <div style="font-size:1.2rem; font-weight:800; color:${color};">${pct}%</div>
                        <div style="font-size:0.6rem; color:var(--text-muted); text-transform:uppercase;">Eficacia</div>
                    </div>
                </div>
            `;

            const chartId = `memberChart${memberId}`;
            const canvas = document.getElementById(chartId);
            if (!canvas) return;

            if (chartsInstance[`member${memberId}`]) chartsInstance[`member${memberId}`].destroy();
            
            const memberSprintData = sprintLabels.map((_, i) => data.sprints[i+1] || 0);
            
            chartsInstance[`member${memberId}`] = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: sprintLabels,
                    datasets: [{
                        label: 'Desempeño SP',
                        data: memberSprintData,
                        borderColor: color,
                        backgroundColor: color + '22',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
                }
            });
        };

        renderMemberCard('Luis', members['Luis'], '#0057b8');
        renderMemberCard('Alfred', members['Alfred'], '#cc0000');

    } catch (err) { console.error('[RenderTeamAnalytics]', err); }
}

// ============================================================
// PROJECT ANALYTICS
// ============================================================
function renderProjectAnalytics() {
    try {
        const sprints = getSprints();
        const proj = getActiveProject();
        if (!proj) return;

        let totalP = 0, totalD = 0;
        const velData = [];
        const burnupPlan = [];
        const burnupReal = [];
        let accPlan = 0, accReal = 0;

        sprints.forEach(s => {
            const ptP = parseInt(s.pointsPlanned) || 0;
            const ptD = (s.tasks||[]).reduce((a,t) => t.status === 'Done' ? a + (parseInt(t.points)||0) : a, 0);
            
            totalP += ptP;
            totalD += ptD;
            
            accPlan += ptP;
            burnupPlan.push(accPlan);
            
            accReal += ptD;
            burnupReal.push(accReal);

            velData.push(ptD);
        });

        // 1. KPI Bar
        const progress = totalP > 0 ? Math.round((totalD/totalP)*100) : 0;
        const avgVel = velData.length > 0 ? Math.round(totalD / velData.length) : 0;
        
        document.getElementById('projectKpiBar').innerHTML = `
            <div class="kpi-chip"><div class="val">${sprints.length}</div><div class="lbl">Sprints</div></div>
            <div class="kpi-chip"><div class="val" style="color:#10b981;">${progress}%</div><div class="lbl">Avance Global</div></div>
            <div class="kpi-chip"><div class="val">${avgVel}</div><div class="lbl">Pt. Velocidad Media</div></div>
            <div class="kpi-chip"><div class="val">${totalD} / ${totalP}</div><div class="lbl">Story Points</div></div>
        `;

        const sNames = sprints.map((_, i) => `S${i+1}`);



        // 3. Burnup Chart (Line Area)
        if (chartsInstance.prJ_burn) chartsInstance.prJ_burn.destroy();
        chartsInstance.prJ_burn = new Chart(document.getElementById('projBurnupChart'), {
            type: 'line', data: { labels: sNames, datasets: [
                { label: 'Alcance Planteado', data: burnupPlan, borderColor: '#64748b', borderDash: [5,5], fill: false },
                { label: 'Avance Real (Burn-Up)', data: burnupReal, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.1 }
            ] }, options: { responsive: true, maintainAspectRatio: false }
        });



        // 5. Status Chart (Donut)
        const comps = sprints.filter(s => s.status === 'Completado').length;
        const acts = sprints.filter(s => s.status !== 'Completado').length;
        if (chartsInstance.prJ_stat) chartsInstance.prJ_stat.destroy();
        chartsInstance.prJ_stat = new Chart(document.getElementById('projStatusChart'), {
            type: 'doughnut', data: { labels: ['Completados', 'Activos/Planificados'], datasets: [{ data: [comps, acts], backgroundColor: ['#10b981', '#f59e0b'] } ] },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 6. NUEVA: Velocidad por Fecha
        const todayStr = new Date().toISOString().split('T')[0];
        const dateLabels = sprints.map(s => {
            const date = s.end || s.endDate || todayStr;
            // Si la fecha es futura, retornamos hoy para la etiqueta (o la filtramos)
            return new Date(date) > new Date() ? todayStr : date;
        });
        if (chartsInstance.prJ_timeVel) chartsInstance.prJ_timeVel.destroy();
        chartsInstance.prJ_timeVel = new Chart(document.getElementById('projTimeTrendChart'), {
            type: 'line',
            data: {
                labels: dateLabels,
                datasets: [{
                    label: 'Volumen de Entrega (SP)',
                    data: velData,
                    borderColor: proj.color || '#0057b8',
                    backgroundColor: (proj.color || '#0057b8') + '33',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'SP Completados' } },
                    x: { title: { display: true, text: 'Fecha de Entrega' } }
                }
            }
        });

    } catch (err) { console.error('[RenderProjAnalytics]', err); }
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Scrum Platform PRO v4.0 Initializing...');
    try {
        // Seed area & team configs if not present
        AREA_CONFIG = getAreaConfig();
        getTeamConfig();

        // Apply saved platform name to header
        applyPlatformName();

        const projects = getProjects();
        console.log(`✅ Loaded ${projects.length} projects`);
        if (projects.length > 0) activeProjectId = projects[0].id;

        initProjectSelector();
        initSprintSelector();
        setupPlatformNavigation();
        renderGlobalDashboard();
        console.log('✅ Scrum Platform PRO v4.0 ready!');
    } catch (err) {
        console.error('🆘 CRITICAL ERROR:', err);
        try {
            const fallback = storage.parseDataJs();
            if (fallback.length > 0) {
                storage.saveProjects(fallback);
                console.log('⚠️ Recuperado desde data.js. Recargando...');
                setTimeout(() => location.reload(), 1000);
                return;
            }
        } catch (recoveryErr) { console.error('❌ Recuperación fallida:', recoveryErr); }
        alert('❌ Error crítico. Por favor limpia el caché del navegador y recarga.');
    }
});

window.addEventListener('error', (event) => { console.error('🔴 Global Error:', event.error); });
window.addEventListener('unhandledrejection', (event) => { console.error('🔴 Unhandled Rejection:', event.reason); });
