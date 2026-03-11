// ═══════════════════════════════════════════════════════════════════════════
//  F1 LIVE TIMING TOWER — SillyTavern Extension v3.0.0
//  Author : Th3ssa
//  Repo   : https://github.com/Th3ssa/f1-timing-tower
//  Target : SillyTavern 1.12.x (ES module)
// ═══════════════════════════════════════════════════════════════════════════

import { eventSource, event_types } from '../../../../script.js';

// ─── TEAM COLORS (2026 AU Grid) ─────────────────────────────────────────────
const TEAM_COLORS = {
    redbull: '#3671C6', rbr: '#3671C6', oracle: '#3671C6',
    ferrari: '#DC0000', scuderia: '#DC0000',
    mclaren: '#FF8000', papaya: '#FF8000',
    mercedes: '#00D2BE', amg: '#00D2BE',
    audi: '#C0C0C0',
    cadillac: '#003DA5',
    aston: '#006F62', astonmartin: '#006F62',
    alpine: '#FF87BC',
    williams: '#005AFF',
    haas: '#B6BABD', tgrhaas: '#B6BABD',
    vcarb: '#6692FF', rb: '#6692FF', racingbulls: '#6692FF',
    'racing bulls': '#6692FF', visacashapprb: '#6692FF',
    default: '#888888',
};

const TIRE_COLORS = {
    S: '#E8002D', M: '#FFF200', H: '#EBEBEB', I: '#39B54A', W: '#0067FF',
};

const FLAG_CONFIG = {
    green:     { bg: '#061a06', border: '#39FF14', color: '#39FF14', label: 'GREEN FLAG',                   freeze: false },
    yellow:    { bg: '#1a1500', border: '#FFE400', color: '#FFE400', label: '⚠ YELLOW FLAG',                freeze: false },
    blue:      { bg: '#00001a', border: '#4488FF', color: '#88BBFF', label: '🔵 BLUE FLAG',                 freeze: false },
    red:       { bg: '#1a0000', border: '#FF2800', color: '#FF5555', label: '🔴 RED FLAG — RACE SUSPENDED', freeze: true  },
    sc:        { bg: '#1a0e00', border: '#FFA500', color: '#FFB347', label: '🚗 SAFETY CAR DEPLOYED',       freeze: true  },
    vsc:       { bg: '#1a1200', border: '#FFD700', color: '#FFD700', label: '🚗 VIRTUAL SAFETY CAR',        freeze: true  },
    chequered: { bg: '#111111', border: '#FFFFFF', color: '#FFFFFF', label: '🏁 CHEQUERED FLAG',            freeze: false },
};

// ─── STATE ───────────────────────────────────────────────────────────────────
let state = {
    frozen: false, flag: 'green', flagMsg: '',
    lap: 0, totalLaps: 0, drivers: [], prevPos: {}, hasData: false,
};

// ─── TOWER HTML ──────────────────────────────────────────────────────────────
function injectTower() {
    if (document.getElementById('f1-tower')) return;
    document.body.insertAdjacentHTML('beforeend', `
        <div id="f1-tower">
            <div id="f1-tower-header">
                <div id="f1-tower-logo">
                    <span>🏎</span>
                    <div>
                        <span id="f1-tower-title">F1 LIVE TIMING</span>
                        <span id="f1-tower-subtitle">Awaiting race data…</span>
                    </div>
                </div>
                <div id="f1-tower-controls">
                    <button id="f1-btn-collapse">▼</button>
                    <button id="f1-btn-close">✕</button>
                </div>
            </div>
            <div id="f1-tower-flag-banner" style="display:none">
                <div id="f1-flag-inner"><span id="f1-flag-text"></span></div>
            </div>
            <div id="f1-tower-body">
                <div id="f1-tower-lap" style="display:none">
                    <span id="f1-lap-label">LAP</span>
                    <span id="f1-lap-value">—</span>
                </div>
                <div id="f1-tower-table">
                    <div class="f1-row f1-header-row">
                        <span class="f1-col f1-col-pos">P</span>
                        <span class="f1-col f1-col-bar"></span>
                        <span class="f1-col f1-col-driver">Driver</span>
                        <span class="f1-col f1-col-gap">Gap</span>
                        <span class="f1-col f1-col-tire">Tyre</span>
                        <span class="f1-col f1-col-sectors">S1 S2 S3</span>
                        <span class="f1-col f1-col-pit">Pit</span>
                    </div>
                    <div id="f1-tower-rows">
                        <div id="f1-tower-waiting">
                            <p>Awaiting timing data</p>
                            <div>
                                <span class="f1-dot"></span>
                                <span class="f1-dot"></span>
                                <span class="f1-dot"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="f1-frozen-notice">⏸ Updates paused</div>
            </div>
        </div>
        <button id="f1-tower-reopen">🏎 TIMING</button>
    `);

    makeDraggable();

    document.getElementById('f1-btn-collapse').addEventListener('click', () => {
        const tower = document.getElementById('f1-tower');
        const collapsed = tower.classList.toggle('f1-collapsed');
        document.getElementById('f1-btn-collapse').textContent = collapsed ? '▲' : '▼';
    });
    document.getElementById('f1-btn-close').addEventListener('click', () => {
        document.getElementById('f1-tower').style.display = 'none';
        document.getElementById('f1-tower-reopen').style.display = 'block';
    });
    document.getElementById('f1-tower-reopen').addEventListener('click', () => {
        document.getElementById('f1-tower').style.display = '';
        document.getElementById('f1-tower-reopen').style.display = 'none';
    });
}

// ─── DRAG (mouse + touch) ────────────────────────────────────────────────────
function makeDraggable() {
    const tower  = document.getElementById('f1-tower');
    const header = document.getElementById('f1-tower-header');
    let dragging = false, startX, startY, origLeft, origTop;

    const onStart = (cx, cy) => {
        dragging = true;
        startX = cx; startY = cy;
        const r = tower.getBoundingClientRect();
        origLeft = r.left; origTop = r.top;
        tower.style.right = 'auto'; tower.style.bottom = 'auto';
    };
    const onMove = (cx, cy) => {
        if (!dragging) return;
        tower.style.left = (origLeft + cx - startX) + 'px';
        tower.style.top  = (origTop  + cy - startY) + 'px';
    };
    const onEnd = () => { dragging = false; };

    header.addEventListener('mousedown', e => { if (e.target.tagName !== 'BUTTON') { onStart(e.clientX, e.clientY); e.preventDefault(); } });
    header.addEventListener('touchstart', e => { if (e.target.tagName !== 'BUTTON') { const t = e.touches[0]; onStart(t.clientX, t.clientY); } }, { passive: true });
    document.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }, { passive: true });
    document.addEventListener('mouseup',  onEnd);
    document.addEventListener('touchend', onEnd);
}

// ─── ST EVENT HOOKS ──────────────────────────────────────────────────────────
function bindEvents() {
    eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, onMessage);
    eventSource.on(event_types.MESSAGE_SWIPED, onMessage);
}

function onMessage(msgIndex) {
    const sel = (msgIndex != null) ? `.mes[mesid="${msgIndex}"]` : '.mes:last-child';
    const $msg = jQuery(sel);
    if (!$msg.length) return;

    $msg.find('code.language-f1timing').each(function () {
        let data;
        try { data = JSON.parse(jQuery(this).text().trim()); }
        catch (e) { console.warn('[F1 Tower] Bad JSON:', e.message); return; }
        jQuery(this).closest('pre').css('display', 'none');
        applyUpdate(data);
    });
}

// ─── STATE UPDATE ────────────────────────────────────────────────────────────
function applyUpdate(data) {
    const newFlag = ((data.flag || 'green') + '').toLowerCase();
    const cfg = FLAG_CONFIG[newFlag] || FLAG_CONFIG.green;
    const changed = newFlag !== state.flag;

    state.flag    = newFlag;
    state.flagMsg = data.flag_message || '';
    state.frozen  = cfg.freeze;

    renderBanner(cfg, changed);
    document.getElementById('f1-tower')?.classList.toggle('f1-frozen', state.frozen);

    if (state.frozen) return;

    // snapshot previous positions for animation
    const prev = {};
    state.drivers.forEach(d => { prev[d.code] = d.pos; });
    state.prevPos = prev;

    if (Array.isArray(data.drivers) && data.drivers.length) {
        state.drivers = data.drivers;
        state.hasData = true;
    }
    if (data.lap        != null) state.lap       = data.lap;
    if (data.total_laps != null) state.totalLaps = data.total_laps;

    renderRows();
}

// ─── FLAG BANNER ─────────────────────────────────────────────────────────────
function renderBanner(cfg, restart) {
    const $b = jQuery('#f1-tower-flag-banner');
    const $i = jQuery('#f1-flag-inner');
    const $t = jQuery('#f1-flag-text');

    if (state.flag === 'green' && !state.flagMsg) { $b.fadeOut(300); return; }

    const lbl = state.flagMsg ? `${cfg.label}  —  ${state.flagMsg}` : cfg.label;
    $t.text(Array(4).fill(lbl).join('     ·     ')).css('color', cfg.color);
    $b.css({ background: cfg.bg, 'border-bottom': `2px solid ${cfg.border}` }).show();

    if (restart) { $i.css('animation','none'); void $i[0].offsetWidth; $i.css('animation',''); }
}

// ─── DRIVER ROWS ─────────────────────────────────────────────────────────────
function renderRows() {
    if (!state.hasData) return;

    if (state.lap > 0) {
        jQuery('#f1-tower-lap').show();
        jQuery('#f1-lap-value').html(state.totalLaps > 0
            ? `<span class="f1-lap-now">${state.lap}</span> / ${state.totalLaps}`
            : `<span class="f1-lap-now">${state.lap}</span>`);
        jQuery('#f1-tower-subtitle').text(state.totalLaps > 0
            ? `LAP ${state.lap} OF ${state.totalLaps}` : `LAP ${state.lap}`);
    }

    const sorted = [...state.drivers].sort((a, b) => a.pos - b.pos);
    const $rows  = jQuery('#f1-tower-rows');
    $rows.html(sorted.map(buildRow).join(''));

    sorted.forEach(d => {
        const prev = state.prevPos[d.code];
        if (prev == null || prev === d.pos) return;
        const cls = d.pos < prev ? 'f1-gained' : 'f1-lost';
        const $r  = $rows.find(`.f1-driver-row[data-code="${x(d.code)}"]`);
        $r.addClass(cls);
        setTimeout(() => $r.removeClass(cls), 1500);
    });
}

function buildRow(d) {
    const tc  = TEAM_COLORS[((d.team||'default')+'').toLowerCase().replace(/\s+/g,'')] || TEAM_COLORS.default;
    const cmp = ((d.tire||'M')+'').toUpperCase();
    const tco = TIRE_COLORS[cmp] || '#888';
    const tl  = d.tire_laps || 0;
    const tcl = tl > 20 ? 'f1-worn' : tl === 0 ? 'f1-fresh' : '';
    const gap = d.pos === 1 ? 'LEADER' : x(d.gap || '—');
    const gcl = d.pos === 1 ? 'f1-leader' : '';
    const fl  = d.fl ? '<span class="f1-fl">●</span>' : '';
    const sec = ['s1','s2','s3'].map(k => {
        const c = ((d[k]||'')+'').toLowerCase();
        return `<span class="f1-s f1-s-${c}" title="${k.toUpperCase()}"></span>`;
    }).join('');
    const pit = d.pit === true || d.pit === 'in'
        ? `<span class="f1-pit f1-pit-in">IN</span>`
        : d.pit === 'out' || d.pit === 'pit'
        ? `<span class="f1-pit">PIT</span>` : '';

    return `<div class="f1-row f1-driver-row" data-code="${x(d.code)}" data-pos="${d.pos}">
        <span class="f1-col f1-col-pos">${d.pos}</span>
        <span class="f1-col f1-col-bar"><span class="f1-bar" style="background:${tc}"></span></span>
        <span class="f1-col f1-col-driver">${x(d.code||d.name||'???')}${fl}</span>
        <span class="f1-col f1-col-gap ${gcl}">${gap}</span>
        <span class="f1-col f1-col-tire"><span class="f1-tire ${tcl}" style="background:${tco}" title="${cmp}·${tl}laps">${cmp}</span></span>
        <span class="f1-col f1-col-sectors">${sec}</span>
        <span class="f1-col f1-col-pit">${pit}</span>
    </div>`.trim();
}

function x(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── BOOT ────────────────────────────────────────────────────────────────────
injectTower();
bindEvents();
console.log('[F1 Timing Tower v3.0.0] ✅ Loaded — github.com/Th3ssa/f1-timing-tower');
