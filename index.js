// ═══════════════════════════════════════════════════════════════════
//  F1 LIVE TIMING TOWER — SillyTavern Extension v4.0.0
//  Author  : Th3ssa
//  Repo    : https://github.com/Th3ssa/F1-TIMING-TOWER-WIDGET
//  Target  : SillyTavern 1.12.x – 1.16.x
// ═══════════════════════════════════════════════════════════════════

import { eventSource, event_types } from '../../../../script.js';

// ── CONSTANTS ────────────────────────────────────────────────────

const TEAM_COLORS = {
    redbull:'#3671C6', rbr:'#3671C6', oracle:'#3671C6',
    ferrari:'#DC0000', scuderia:'#DC0000',
    mclaren:'#FF8000', papaya:'#FF8000',
    mercedes:'#00D2BE', amg:'#00D2BE',
    audi:'#C0C0C0',
    cadillac:'#003DA5',
    aston:'#006F62', astonmartin:'#006F62',
    alpine:'#FF87BC',
    williams:'#005AFF',
    haas:'#B6BABD', tgrhaas:'#B6BABD',
    vcarb:'#6692FF', rb:'#6692FF', racingbulls:'#6692FF',
    'racing bulls':'#6692FF', visacashapprb:'#6692FF',
    default:'#888888',
};

const TIRE_COLORS = {
    S:'#E8002D', M:'#FFF200', H:'#EBEBEB', I:'#39B54A', W:'#0067FF',
};

const FLAGS = {
    green:    { bg:'#061a06', border:'#39FF14', color:'#39FF14', label:'GREEN FLAG',                   freeze:false },
    yellow:   { bg:'#1a1500', border:'#FFE400', color:'#FFE400', label:'⚠ YELLOW FLAG',                freeze:false },
    blue:     { bg:'#00001a', border:'#4488FF', color:'#88BBFF', label:'🔵 BLUE FLAG',                 freeze:false },
    red:      { bg:'#1a0000', border:'#FF2800', color:'#FF5555', label:'🔴 RED FLAG — RACE SUSPENDED', freeze:true  },
    sc:       { bg:'#1a0e00', border:'#FFA500', color:'#FFB347', label:'🚗 SAFETY CAR DEPLOYED',       freeze:true  },
    vsc:      { bg:'#1a1200', border:'#FFD700', color:'#FFD700', label:'🚗 VIRTUAL SAFETY CAR',        freeze:true  },
    chequered:{ bg:'#111111', border:'#FFFFFF', color:'#FFFFFF', label:'🏁 CHEQUERED FLAG',            freeze:false },
};

// ── STATE ────────────────────────────────────────────────────────

const state = {
    flag:'green', flagMsg:'', frozen:false,
    lap:0, totalLaps:0,
    drivers:[], prevPos:{}, hasData:false,
};

// ── TOWER HTML ───────────────────────────────────────────────────

function injectTower() {
    if (document.getElementById('f1-tower')) return;

    document.body.insertAdjacentHTML('beforeend', `
        <div id="f1-tower">
            <div id="f1-header">
                <div id="f1-logo">
                    <span id="f1-icon">🏎</span>
                    <div>
                        <div id="f1-title">F1 LIVE TIMING</div>
                        <div id="f1-subtitle">Awaiting race data…</div>
                    </div>
                </div>
                <div id="f1-controls">
                    <button id="f1-collapse-btn">▼</button>
                    <button id="f1-close-btn">✕</button>
                </div>
            </div>
            <div id="f1-banner" style="display:none">
                <div id="f1-banner-inner">
                    <span id="f1-banner-text"></span>
                </div>
            </div>
            <div id="f1-body">
                <div id="f1-lap-bar" style="display:none">
                    <span id="f1-lap-label">LAP</span>
                    <span id="f1-lap-num">—</span>
                </div>
                <div id="f1-grid">
                    <div class="f1-row f1-thead">
                        <span class="f1-c f1-pos">P</span>
                        <span class="f1-c f1-bar-col"></span>
                        <span class="f1-c f1-drv">Driver</span>
                        <span class="f1-c f1-gap">Gap</span>
                        <span class="f1-c f1-tyre">Tyre</span>
                        <span class="f1-c f1-sec">S1 S2 S3</span>
                        <span class="f1-c f1-pit">Pit</span>
                    </div>
                    <div id="f1-rows">
                        <div id="f1-waiting">
                            <p>Awaiting timing data</p>
                            <div class="f1-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="f1-frozen-msg">⏸ Updates paused — neutralisation period</div>
            </div>
        </div>
        <button id="f1-reopen-btn">🏎 TIMING</button>
    `);

    setupControls();
    setupDrag();
}

function setupControls() {
    document.getElementById('f1-collapse-btn').addEventListener('click', () => {
        const tower = document.getElementById('f1-tower');
        const btn   = document.getElementById('f1-collapse-btn');
        tower.classList.toggle('f1-collapsed');
        btn.textContent = tower.classList.contains('f1-collapsed') ? '▲' : '▼';
    });

    document.getElementById('f1-close-btn').addEventListener('click', () => {
        document.getElementById('f1-tower').style.display = 'none';
        document.getElementById('f1-reopen-btn').style.display = 'flex';
    });

    document.getElementById('f1-reopen-btn').addEventListener('click', () => {
        document.getElementById('f1-tower').style.display = '';
        document.getElementById('f1-reopen-btn').style.display = 'none';
    });
}

function setupDrag() {
    const tower  = document.getElementById('f1-tower');
    const handle = document.getElementById('f1-header');
    let active = false, ox, oy, ol, ot;

    const start = (cx, cy) => {
        active = true;
        ox = cx; oy = cy;
        const r = tower.getBoundingClientRect();
        ol = r.left; ot = r.top;
        tower.style.right = 'auto';
        tower.style.bottom = 'auto';
    };
    const move = (cx, cy) => {
        if (!active) return;
        tower.style.left = (ol + cx - ox) + 'px';
        tower.style.top  = (ot + cy - oy) + 'px';
    };
    const end = () => { active = false; };

    handle.addEventListener('mousedown', e => {
        if (e.target.tagName === 'BUTTON') return;
        start(e.clientX, e.clientY);
        e.preventDefault();
    });
    handle.addEventListener('touchstart', e => {
        if (e.target.tagName === 'BUTTON') return;
        const t = e.touches[0];
        start(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener('mousemove', e => move(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        move(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener('mouseup',  end);
    document.addEventListener('touchend', end);
}

// ── EVENT LISTENERS ──────────────────────────────────────────────

function bindEvents() {
    eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, parseMessage);
    eventSource.on(event_types.MESSAGE_SWIPED,             parseMessage);
}

function parseMessage(msgIndex) {
    const sel  = msgIndex != null ? `.mes[mesid="${msgIndex}"]` : '.mes:last-child';
    const $msg = jQuery(sel);
    if (!$msg.length) return;

    // Hide ALL f1timing blocks regardless of parse success
    $msg.find('code.language-f1timing').each(function () {
        jQuery(this).closest('pre').hide();

        let data;
        try {
            data = JSON.parse(jQuery(this).text().trim());
        } catch (e) {
            console.warn('[F1 Tower] JSON parse failed:', e.message);
            return;
        }
        applyData(data);
    });
}

// ── DATA PROCESSING ──────────────────────────────────────────────

function applyData(data) {
    const newFlag = String(data.flag || 'green').toLowerCase();
    const cfg     = FLAGS[newFlag] || FLAGS.green;
    const changed = newFlag !== state.flag;

    state.flag    = newFlag;
    state.flagMsg = data.flag_message || '';
    state.frozen  = cfg.freeze;

    updateBanner(cfg, changed);
    document.getElementById('f1-tower')?.classList.toggle('f1-frozen', state.frozen);

    // Still hide the block but don't update tower data when frozen
    if (state.frozen) return;

    // Snapshot positions for animation
    const snap = {};
    state.drivers.forEach(d => { snap[d.code] = d.pos; });
    state.prevPos = snap;

    if (Array.isArray(data.drivers) && data.drivers.length) {
        state.drivers  = data.drivers;
        state.hasData  = true;
    }
    if (data.lap        != null) state.lap       = data.lap;
    if (data.total_laps != null) state.totalLaps = data.total_laps;

    renderGrid();
}

// ── BANNER ───────────────────────────────────────────────────────

function updateBanner(cfg, restart) {
    const $banner = jQuery('#f1-banner');
    const $inner  = jQuery('#f1-banner-inner');
    const $text   = jQuery('#f1-banner-text');

    if (state.flag === 'green' && !state.flagMsg) {
        $banner.fadeOut(400);
        return;
    }

    const msg    = state.flagMsg ? `${cfg.label}  —  ${state.flagMsg}` : cfg.label;
    const repeat = Array(5).fill(msg).join('     ·     ');

    $text.text(repeat).css('color', cfg.color);
    $banner.css({
        background: cfg.bg,
        'border-bottom': `2px solid ${cfg.border}`,
    }).show();

    if (restart) {
        $inner.css('animation', 'none');
        void $inner[0].offsetWidth; // reflow
        $inner.css('animation', '');
    }
}

// ── GRID RENDER ──────────────────────────────────────────────────

function renderGrid() {
    if (!state.hasData) return;

    // Lap counter
    if (state.lap > 0) {
        jQuery('#f1-lap-bar').show();
        jQuery('#f1-lap-num').html(
            state.totalLaps > 0
                ? `<em>${state.lap}</em> / ${state.totalLaps}`
                : `<em>${state.lap}</em>`
        );
        jQuery('#f1-subtitle').text(
            state.totalLaps > 0
                ? `LAP ${state.lap} OF ${state.totalLaps}`
                : `LAP ${state.lap}`
        );
    }

    const sorted = [...state.drivers].sort((a, b) => a.pos - b.pos);
    const $rows  = jQuery('#f1-rows');
    $rows.html(sorted.map(buildRow).join(''));

    // Position change flash animations
    sorted.forEach(d => {
        const prev = state.prevPos[d.code];
        if (prev == null || prev === d.pos) return;
        const cls = d.pos < prev ? 'f1-gained' : 'f1-lost';
        const $r  = $rows.find(`.f1-driver-row[data-code="${esc(d.code)}"]`);
        $r.addClass(cls);
        setTimeout(() => $r.removeClass(cls), 1500);
    });
}

function buildRow(d) {
    const teamKey  = String(d.team || 'default').toLowerCase().replace(/\s+/g, '');
    const teamClr  = TEAM_COLORS[teamKey] || TEAM_COLORS.default;
    const compound = String(d.tire || 'M').toUpperCase();
    const tyreClr  = TIRE_COLORS[compound] || '#888';
    const tyreLaps = d.tire_laps || 0;
    const tyreAge  = tyreLaps > 20 ? 'f1-worn' : tyreLaps === 0 ? 'f1-fresh' : '';
    const isLeader = d.pos === 1;
    const gapText  = isLeader ? 'LEADER' : esc(d.gap || '—');
    const flDot    = d.fl ? '<span class="f1-fl-dot">●</span>' : '';

    const sectors = ['s1', 's2', 's3'].map(k => {
        const c = String(d[k] || '').toLowerCase();
        return `<span class="f1-sector f1-s-${c}"></span>`;
    }).join('');

    const pitBadge = (d.pit === true || d.pit === 'in')
        ? '<span class="f1-pit-badge f1-pit-in">IN</span>'
        : (d.pit === 'out' || d.pit === 'pit')
        ? '<span class="f1-pit-badge">PIT</span>'
        : '';

    return `
        <div class="f1-row f1-driver-row" data-code="${esc(d.code)}" data-pos="${d.pos}">
            <span class="f1-c f1-pos${isLeader ? ' f1-p1' : ''}">${d.pos}</span>
            <span class="f1-c f1-bar-col">
                <span class="f1-team-bar" style="background:${teamClr}"></span>
            </span>
            <span class="f1-c f1-drv">${esc(d.code || d.name || '???')}${flDot}</span>
            <span class="f1-c f1-gap${isLeader ? ' f1-leader-gap' : ''}">${gapText}</span>
            <span class="f1-c f1-tyre">
                <span class="f1-tyre-badge ${tyreAge}" style="background:${tyreClr}" title="${compound} · ${tyreLaps} laps">${compound}</span>
            </span>
            <span class="f1-c f1-sec">${sectors}</span>
            <span class="f1-c f1-pit">${pitBadge}</span>
        </div>
    `.trim();
}

// ── UTIL ─────────────────────────────────────────────────────────

function esc(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── BOOT ─────────────────────────────────────────────────────────

injectTower();
bindEvents();
console.log('[F1 Timing Tower v4.0.0] ✅ github.com/Th3ssa/F1-TIMING-TOWER-WIDGET');
