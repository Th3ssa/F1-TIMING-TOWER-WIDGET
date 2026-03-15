// ═══════════════════════════════════════════════════════════════════
//  F1 LIVE TIMING TOWER — SillyTavern Extension v4.2.0
//  Author  : Th3ssa
//  Repo    : https://github.com/Th3ssa/F1-TIMING-TOWER-WIDGET
//  Changes : IMF logo, circuit name, countdown timer,
//            position arrows, persistent state restore
// ═══════════════════════════════════════════════════════════════════

import { eventSource, event_types } from '../../../../script.js';

// ── IMF LOGO (base64) ────────────────────────────────────────────
const IMF_LOGO = 'data:image/png;base64,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';

// ── CONSTANTS ────────────────────────────────────────────────────
const TEAM_COLORS = {
    redbull:'#3671C6',rbr:'#3671C6',oracle:'#3671C6',
    ferrari:'#DC0000',scuderia:'#DC0000',
    mclaren:'#FF8000',papaya:'#FF8000',
    mercedes:'#00D2BE',amg:'#00D2BE',
    audi:'#C0C0C0',cadillac:'#003DA5',
    aston:'#006F62',astonmartin:'#006F62',
    alpine:'#FF87BC',williams:'#005AFF',
    haas:'#B6BABD',tgrhaas:'#B6BABD',
    vcarb:'#6692FF',rb:'#6692FF',racingbulls:'#6692FF',
    'racing bulls':'#6692FF',visacashapprb:'#6692FF',
    default:'#888888',
};

const TIRE_COLORS = {S:'#E8002D',M:'#FFF200',H:'#EBEBEB',I:'#39B54A',W:'#0067FF'};

const FLAGS = {
    green:    {bg:'#061a06',border:'#39FF14',color:'#39FF14',label:'GREEN FLAG',freeze:false},
    yellow:   {bg:'#1a1500',border:'#FFE400',color:'#FFE400',label:'⚠ YELLOW FLAG',freeze:false},
    blue:     {bg:'#00001a',border:'#4488FF',color:'#88BBFF',label:'🔵 BLUE FLAG',freeze:false},
    red:      {bg:'#1a0000',border:'#FF2800',color:'#FF5555',label:'🔴 RED FLAG — RACE SUSPENDED',freeze:true},
    sc:       {bg:'#1a0e00',border:'#FFA500',color:'#FFB347',label:'🚗 SAFETY CAR DEPLOYED',freeze:true},
    vsc:      {bg:'#1a1200',border:'#FFD700',color:'#FFD700',label:'🚗 VIRTUAL SAFETY CAR',freeze:true},
    chequered:{bg:'#111111',border:'#FFFFFF',color:'#FFFFFF',label:'🏁 CHEQUERED FLAG',freeze:false},
};

const STORAGE_KEY = 'f1_tower_last_state';

// ── STATE ────────────────────────────────────────────────────────
const state = {
    flag:'green',flagMsg:'',frozen:false,
    lap:0,totalLaps:0,
    circuit:'',raceDurationMinutes:0,
    drivers:[],prevPos:{},hasData:false,
    timerStart:null,timerInterval:null,
};

// ── PERSIST ──────────────────────────────────────────────────────
function saveState() {
    try {
        const saved = {
            flag:state.flag,flagMsg:state.flagMsg,
            lap:state.lap,totalLaps:state.totalLaps,
            circuit:state.circuit,raceDurationMinutes:state.raceDurationMinutes,
            drivers:state.drivers,hasData:state.hasData,
            savedAt:Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch(e) { console.warn('[F1 Tower] Save failed:', e.message); }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        if (!saved.hasData || !Array.isArray(saved.drivers) || !saved.drivers.length) return false;
        Object.assign(state, {
            flag: saved.flag || 'green',
            flagMsg: saved.flagMsg || '',
            lap: saved.lap || 0,
            totalLaps: saved.totalLaps || 0,
            circuit: saved.circuit || '',
            raceDurationMinutes: saved.raceDurationMinutes || 0,
            drivers: saved.drivers,
            hasData: true,
        });
        return true;
    } catch(e) { return false; }
}

// ── COUNTDOWN TIMER ──────────────────────────────────────────────
function startTimer(durationMinutes) {
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (!durationMinutes || durationMinutes <= 0) return;
    state.raceDurationMinutes = durationMinutes;
    if (!state.timerStart) state.timerStart = Date.now();
    state.timerInterval = setInterval(updateTimerDisplay, 1000);
    updateTimerDisplay();
}

function updateTimerDisplay() {
    if (!state.timerStart || !state.raceDurationMinutes) return;
    const elapsed = Math.floor((Date.now() - state.timerStart) / 1000);
    const total   = state.raceDurationMinutes * 60;
    const remaining = Math.max(0, total - elapsed);
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    const display = h > 0
        ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
        : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    jQuery('#f1-timer-val').text(display);
    if (remaining === 0) {
        clearInterval(state.timerInterval);
        jQuery('#f1-timer-val').text('00:00').addClass('f1-timer-done');
    }
}

// ── TOWER HTML ───────────────────────────────────────────────────
function injectTower() {
    if (document.getElementById('f1-tower')) return;
    document.body.insertAdjacentHTML('beforeend', `
        <div id="f1-tower">
            <div id="f1-header">
                <div id="f1-logo-wrap">
                    <img id="f1-imf-logo" src="${IMF_LOGO}" alt="IMF" title="International Motorsport Federation" />
                </div>
                <div id="f1-header-center">
                    <div id="f1-title">F1 LIVE TIMING</div>
                    <div id="f1-circuit-name">Awaiting race data…</div>
                </div>
                <div id="f1-controls">
                    <button id="f1-collapse-btn">▼</button>
                    <button id="f1-close-btn">✕</button>
                </div>
            </div>
            <div id="f1-banner" style="display:none">
                <div id="f1-banner-inner"><span id="f1-banner-text"></span></div>
            </div>
            <div id="f1-body">
                <div id="f1-info-bar">
                    <div id="f1-lap-wrap" style="display:none">
                        <span class="f1-info-label">LAP</span>
                        <span id="f1-lap-num">—</span>
                    </div>
                    <div id="f1-timer-wrap" style="display:none">
                        <span class="f1-info-label">TIME</span>
                        <span id="f1-timer-val">—</span>
                    </div>
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
                            <div class="f1-dots"><span></span><span></span><span></span></div>
                        </div>
                    </div>
                </div>
                <div id="f1-frozen-msg">⏸ Updates paused — neutralisation period</div>
            </div>
        </div>
        <div id="f1-restore-banner" style="display:none">
            <span id="f1-restore-text">⟳ Last race state restored</span>
            <button id="f1-restore-dismiss">✕</button>
        </div>
        <button id="f1-reopen-btn">🏎 TIMING</button>
    `);

    setupControls();
    setupDrag();
}

function setupControls() {
    document.getElementById('f1-collapse-btn').addEventListener('click', () => {
        const t = document.getElementById('f1-tower');
        t.classList.toggle('f1-collapsed');
        document.getElementById('f1-collapse-btn').textContent =
            t.classList.contains('f1-collapsed') ? '▲' : '▼';
    });
    document.getElementById('f1-close-btn').addEventListener('click', () => {
        document.getElementById('f1-tower').style.display = 'none';
        document.getElementById('f1-reopen-btn').style.display = 'flex';
    });
    document.getElementById('f1-reopen-btn').addEventListener('click', () => {
        document.getElementById('f1-tower').style.display = '';
        document.getElementById('f1-reopen-btn').style.display = 'none';
    });
    document.getElementById('f1-restore-dismiss').addEventListener('click', () => {
        document.getElementById('f1-restore-banner').style.display = 'none';
    });
}

function setupDrag() {
    const tower = document.getElementById('f1-tower');
    const handle = document.getElementById('f1-header');
    let active=false,ox,oy,ol,ot;
    const start=(cx,cy)=>{active=true;ox=cx;oy=cy;const r=tower.getBoundingClientRect();ol=r.left;ot=r.top;tower.style.right='auto';tower.style.bottom='auto';};
    const move=(cx,cy)=>{if(!active)return;tower.style.left=(ol+cx-ox)+'px';tower.style.top=(ot+cy-oy)+'px';};
    const end=()=>{active=false;};
    handle.addEventListener('mousedown',e=>{if(e.target.tagName!=='BUTTON'&&e.target.tagName!=='IMG'){start(e.clientX,e.clientY);e.preventDefault();}});
    handle.addEventListener('touchstart',e=>{if(e.target.tagName!=='BUTTON'&&e.target.tagName!=='IMG'){const t=e.touches[0];start(t.clientX,t.clientY);}},{passive:true});
    document.addEventListener('mousemove',e=>move(e.clientX,e.clientY));
    document.addEventListener('touchmove',e=>{const t=e.touches[0];move(t.clientX,t.clientY);},{passive:true});
    document.addEventListener('mouseup',end);
    document.addEventListener('touchend',end);
}

// ── PARSE MESSAGE ────────────────────────────────────────────────
function parseMessage(msgIndex) {
    const sel  = msgIndex != null ? `.mes[mesid="${msgIndex}"]` : '.mes:last-child';
    const $msg = jQuery(sel);
    if (!$msg.length) return;

    let found = false;

    // Strategy 1: standard class
    $msg.find('code.language-f1timing').each(function() {
        jQuery(this).closest('pre').css({display:'none',visibility:'hidden'});
        tryParse(jQuery(this).text().trim());
        found = true;
    });
    if (found) return;

    // Strategy 2: class contains f1timing
    $msg.find('code[class*="f1timing"]').each(function() {
        jQuery(this).closest('pre').css({display:'none',visibility:'hidden'});
        tryParse(jQuery(this).text().trim());
        found = true;
    });
    if (found) return;

    // Strategy 3: any pre containing drivers key
    $msg.find('pre').each(function() {
        const $pre = jQuery(this);
        const raw = $pre.find('code').text().trim() || $pre.text().trim();
        if (raw.includes('"drivers"') && raw.includes('"flag"') && raw.trim().startsWith('{')) {
            $pre.css({display:'none',visibility:'hidden'});
            tryParse(raw);
            found = true;
            return false;
        }
    });
    if (found) return;

    // Strategy 4: regex scrape HTML
    const html = $msg.find('.mes_text').html() || '';
    const match = html.match(/```f1timing\s*([\s\S]*?)```/);
    if (match) {
        $msg.find('pre').each(function() {
            if (jQuery(this).text().includes('"drivers"'))
                jQuery(this).css({display:'none',visibility:'hidden'});
        });
        tryParse(match[1].trim());
    }
}

function tryParse(raw) {
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.drivers)) {
            applyData(data);
        }
    } catch(e) {
        console.warn('[F1 Tower] JSON parse failed:', e.message);
    }
}

// ── APPLY DATA ───────────────────────────────────────────────────
function applyData(data) {
    const newFlag = String(data.flag || 'green').toLowerCase();
    const cfg     = FLAGS[newFlag] || FLAGS.green;
    const changed = newFlag !== state.flag;

    state.flag    = newFlag;
    state.flagMsg = data.flag_message || '';
    state.frozen  = cfg.freeze;

    // Circuit name
    if (data.circuit) {
        state.circuit = data.circuit;
        jQuery('#f1-circuit-name').text(data.circuit.toUpperCase());
    } else if (state.circuit) {
        jQuery('#f1-circuit-name').text(state.circuit.toUpperCase());
    }

    // Timer — start if duration provided and not already running
    if (data.race_duration_minutes && !state.timerStart) {
        state.timerStart = Date.now();
        jQuery('#f1-timer-wrap').show();
        startTimer(data.race_duration_minutes);
    } else if (!data.race_duration_minutes && data.total_laps && !state.timerStart) {
        // Fallback: estimate 1h45m for <60 laps, 2h for longer races
        const estimated = data.total_laps <= 58 ? 105 : 120;
        state.timerStart = Date.now();
        jQuery('#f1-timer-wrap').show();
        startTimer(estimated);
    }

    updateBanner(cfg, changed);
    document.getElementById('f1-tower')?.classList.toggle('f1-frozen', state.frozen);

    if (state.frozen) { saveState(); return; }

    // Snapshot for arrow animations
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
    saveState();
}

// ── BANNER ───────────────────────────────────────────────────────
function updateBanner(cfg, restart) {
    const $b = jQuery('#f1-banner');
    const $i = jQuery('#f1-banner-inner');
    const $t = jQuery('#f1-banner-text');
    if (state.flag === 'green' && !state.flagMsg) { $b.fadeOut(400); return; }
    const msg = state.flagMsg ? `${cfg.label}  —  ${state.flagMsg}` : cfg.label;
    $t.text(Array(5).fill(msg).join('     ·     ')).css('color', cfg.color);
    $b.css({background:cfg.bg,'border-bottom':`2px solid ${cfg.border}`}).show();
    if (restart) { $i.css('animation','none'); void $i[0].offsetWidth; $i.css('animation',''); }
}

// ── GRID ─────────────────────────────────────────────────────────
function renderGrid() {
    if (!state.hasData) return;

    if (state.lap > 0) {
        jQuery('#f1-lap-wrap').show();
        jQuery('#f1-lap-num').html(state.totalLaps > 0
            ? `<em>${state.lap}</em> / ${state.totalLaps}`
            : `<em>${state.lap}</em>`);
    }

    const sorted  = [...state.drivers].sort((a,b) => a.pos - b.pos);
    const $rows   = jQuery('#f1-rows');
    const rowsEl  = $rows[0];

    // ── FLIP ANIMATION ─────────────────────────────────────────
    // Step 1: snapshot existing row positions (FIRST)
    const firstPos = {};
    $rows.find('.f1-driver-row').each(function() {
        const code = jQuery(this).data('code');
        firstPos[code] = this.getBoundingClientRect().top;
    });

    // Step 2: determine position changes before re-render
    const changes = {};
    sorted.forEach(d => {
        const prev = state.prevPos[d.code];
        if (prev != null && prev !== d.pos) {
            changes[d.code] = d.pos < prev ? 'up' : 'down';
        }
    });

    // Step 3: re-render HTML (LAST)
    $rows.html(sorted.map(d => buildRow(d, changes[d.code])).join(''));

    // Step 4: INVERT + PLAY — animate from old position to new
    $rows.find('.f1-driver-row').each(function() {
        const code  = jQuery(this).data('code');
        const first = firstPos[code];
        if (first == null) return;
        const last  = this.getBoundingClientRect().top;
        const delta = first - last;
        if (Math.abs(delta) < 2) return;

        // Snap to old position instantly, then animate to new
        this.style.transform = `translateY(${delta}px)`;
        this.style.transition = 'none';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.style.transform  = 'translateY(0)';
            });
        });

        // Clean up after animation
        setTimeout(() => {
            this.style.transform  = '';
            this.style.transition = '';
        }, 500);
    });
}

function buildRow(d, direction) {
    const teamKey  = String(d.team||'default').toLowerCase().replace(/\s+/g,'');
    const teamClr  = TEAM_COLORS[teamKey] || TEAM_COLORS.default;
    const compound = String(d.tire||'M').toUpperCase();
    const tyreClr  = TIRE_COLORS[compound] || '#888';
    const tyreLaps = d.tire_laps || 0;
    const tyreAge  = tyreLaps > 20 ? 'f1-worn' : tyreLaps === 0 ? 'f1-fresh' : '';
    const isLeader = d.pos === 1;
    const gapText  = isLeader ? 'LEADER' : esc(d.gap||'—');
    const flDot    = d.fl ? '<span class="f1-fl-dot">●</span>' : '';
    const arrow    = direction === 'up'
        ? '<span class="f1-move-arrow f1-move-up">▲</span>'
        : direction === 'down'
        ? '<span class="f1-move-arrow f1-move-down">▼</span>'
        : '';
    const sectors  = ['s1','s2','s3'].map(k => {
        const c = String(d[k]||'').toLowerCase();
        return `<span class="f1-sector f1-s-${c}"></span>`;
    }).join('');
    const pitBadge = (d.pit===true||d.pit==='in')
        ? '<span class="f1-pit-badge f1-pit-in">IN</span>'
        : (d.pit==='out'||d.pit==='pit')
        ? '<span class="f1-pit-badge">PIT</span>' : '';

    return `<div class="f1-row f1-driver-row" data-code="${esc(d.code)}" data-pos="${d.pos}">
        <span class="f1-c f1-pos">${d.pos}</span>
        <span class="f1-c f1-bar-col"><span class="f1-team-bar" style="background:${teamClr}"></span></span>
        <span class="f1-c f1-drv">${arrow}${esc(d.code||d.name||'???')}${flDot}</span>
        <span class="f1-c f1-gap${isLeader?' f1-leader-gap':''}">${gapText}</span>
        <span class="f1-c f1-tyre"><span class="f1-tyre-badge ${tyreAge}" style="background:${tyreClr}" title="${compound}·${tyreLaps}laps">${compound}</span></span>
        <span class="f1-c f1-sec">${sectors}</span>
        <span class="f1-c f1-pit">${pitBadge}</span>
    </div>`.trim();
}

function esc(s) {
    if (s==null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── BOOT ─────────────────────────────────────────────────────────
injectTower();

// Restore last state
if (loadState()) {
    const cfg = FLAGS[state.flag] || FLAGS.green;
    updateBanner(cfg, false);
    document.getElementById('f1-tower')?.classList.toggle('f1-frozen', state.frozen);
    if (state.circuit) jQuery('#f1-circuit-name').text(state.circuit.toUpperCase());
    renderGrid();

    // Show restore banner briefly
    const $rb = jQuery('#f1-restore-banner');
    const circuit = state.circuit ? ` — ${state.circuit}` : '';
    jQuery('#f1-restore-text').text(`⟳ Last race state restored${circuit}`);
    $rb.fadeIn(300);
    setTimeout(() => $rb.fadeOut(600), 4000);

    console.log('[F1 Tower] ✅ State restored from localStorage');
}

eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, parseMessage);
eventSource.on(event_types.MESSAGE_SWIPED, parseMessage);
console.log('[F1 Timing Tower v4.2.0] ✅ Loaded — github.com/Th3ssa/F1-TIMING-TOWER-WIDGET');
