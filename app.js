'use strict';

/* ==========================================================================
   Daily Tracker — pure HTML/CSS/JS, data in localStorage.
   ========================================================================== */

const APP_VERSION = '1.0.0';
const STORAGE_KEY = 'dailytracker.v1';
const UI_KEY = 'dailytracker.ui';
const LOCALE = 'en-GB';

/* --------------------------------------------------------------------------
   Tracker definitions. Every tracker is a list of items with a daily target.
   New trackers (e.g. vitamins) can be added here later using the same shape.
   All amounts are grams (exercise is the only exception: minutes).
   -------------------------------------------------------------------------- */

const DAILY_DOZEN = {
  id: 'dd',
  name: 'Daily Dozen',
  items: [
    {
      id: 'beans', name: 'Beans', emoji: '🫘', target: 3, color: '#b8643e',
      servings: [
        ['Cooked beans, lentils or split peas', '90 g'],
        ['Hummus or bean dip', '60 g'],
        ['Tofu', '125 g'],
        ['Tempeh', '85 g'],
        ['Fresh green peas', '145 g'],
        ['Sprouted lentils', '75 g'],
      ],
      examples: 'Black beans, black-eyed peas, butter beans, cannellini, chickpeas, edamame, kidney beans, lentils, miso, navy beans, pinto beans, split peas, tempeh, tofu.',
    },
    {
      id: 'berries', name: 'Berries', emoji: '🫐', target: 1, color: '#7b5bd6',
      servings: [
        ['Fresh or frozen berries', '75 g'],
        ['Dried berries', '40 g'],
      ],
      examples: 'Açaí, barberries, blackberries, blueberries, cherries, concord grapes, cranberries, goji berries, kumquats, mulberries, raspberries, strawberries.',
    },
    {
      id: 'fruits', name: 'Other Fruits', emoji: '🍎', target: 3, color: '#f0703a',
      servings: [
        ['Medium-sized fruit', '1 piece ≈ 150 g'],
        ['Cut-up fruit', '150 g'],
        ['Dried fruit', '40 g'],
      ],
      examples: 'Apples, apricots, avocados, bananas, cantaloupe, clementines, dates, figs, grapefruit, kiwi, lemons, mangos, oranges, papaya, peaches, pears, pineapple, plums, pomegranates, prunes, watermelon.',
    },
    {
      id: 'cruciferous', name: 'Cruciferous Vegetables', emoji: '🥦', target: 1, color: '#1f9e7a',
      servings: [
        ['Chopped, raw', '45 g'],
        ['Chopped, cooked', '80 g'],
        ['Broccoli or Brussels sprouts sprouts', '10 g'],
        ['Horseradish', '15 g'],
      ],
      examples: 'Arugula, bok choy, broccoli, Brussels sprouts, cabbage, cauliflower, collard greens, horseradish, kale, mustard greens, radishes, turnip greens, watercress.',
    },
    {
      id: 'greens', name: 'Greens', emoji: '🥬', target: 2, color: '#4aa53d',
      servings: [
        ['Raw leafy greens', '30 g'],
        ['Cooked greens', '90 g'],
      ],
      examples: 'Arugula, beet greens, collard greens, kale, mesclun mix, mustard greens, sorrel, spinach, Swiss chard, turnip greens.',
    },
    {
      id: 'vegetables', name: 'Other Vegetables', emoji: '🥕', target: 2, color: '#d9488a',
      servings: [
        ['Raw leafy vegetables', '30 g'],
        ['Non-leafy vegetables, raw or cooked', '75 g'],
        ['Vegetable juice', '120 g'],
        ['Dried mushrooms', '7 g'],
      ],
      examples: 'Artichokes, asparagus, beets, bell peppers, carrots, corn, garlic, mushrooms, okra, onions, pumpkin, snap peas, squash, sweet potatoes, tomatoes, zucchini.',
    },
    {
      id: 'flax', name: 'Flaxseeds', emoji: '🌱', target: 1, color: '#a3804f',
      servings: [
        ['Ground flaxseed', '7 g'],
      ],
      examples: 'Brown or golden flaxseed, ground (whole seeds pass through undigested).',
    },
    {
      id: 'nuts', name: 'Nuts & Seeds', emoji: '🥜', target: 1, color: '#8a6248',
      servings: [
        ['Nuts or seeds', '30 g'],
        ['Nut or seed butter', '32 g'],
      ],
      examples: 'Almonds, Brazil nuts, cashews, chia seeds, hazelnuts, hemp seeds, macadamia nuts, pecans, pistachios, pumpkin seeds, sesame seeds, sunflower seeds, walnuts.',
    },
    {
      id: 'spices', name: 'Herbs & Spices', emoji: '🌿', target: 1, color: '#d8a010',
      servings: [
        ['Turmeric', '1 g'],
        ['Plus any other salt-free herbs and spices', 'to taste'],
      ],
      examples: 'Allspice, barberries, basil, cardamom, chili powder, cilantro, cinnamon, cloves, cumin, curry powder, dill, fenugreek, garlic, ginger, mint, oregano, paprika, parsley, pepper, rosemary, sage, thyme, turmeric, vanilla.',
    },
    {
      id: 'grains', name: 'Whole Grains', emoji: '🌾', target: 3, color: '#c08a36',
      servings: [
        ['Cooked grains, pasta or hot cereal (weighed cooked)', '90 g'],
        ['Cold whole-grain cereal', '30 g'],
        ['Bread or tortilla', '1 slice ≈ 35 g'],
        ['Bagel or English muffin', '½ ≈ 45 g'],
        ['Popcorn, popped', '25 g'],
      ],
      examples: 'Barley, brown rice, buckwheat, millet, oats, popcorn, quinoa, rye, teff, whole-wheat pasta, wild rice.',
    },
    {
      id: 'beverages', name: 'Beverages', emoji: '💧', target: 5, color: '#2f8de4',
      servings: [
        ['One glass of water, tea or coffee', '350 g'],
      ],
      examples: 'Water, black tea, chai, coffee, green tea, hibiscus tea, hot chocolate, jasmine tea, lemon balm tea, matcha, white tea. (Water: 350 g = 350 ml.)',
    },
    {
      id: 'exercise', name: 'Exercise', emoji: '🏃‍♀️', target: 1, color: '#e2456b',
      servings: [
        ['Moderate activity (brisk walking, cycling, dancing)', '90 min'],
        ['Vigorous activity (running, swimming laps, tennis)', '40 min'],
      ],
      examples: 'Can be split up throughout the day.',
    },
  ],
};

const TRACKER = DAILY_DOZEN;
const TOTAL = TRACKER.items.reduce((s, it) => s + it.target, 0);

/* --------------------------------------------------------------------------
   Small helpers
   -------------------------------------------------------------------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const pad = (n) => String(n).padStart(2, '0');

function dateKey(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseKey(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(k, n) { const d = parseKey(k); d.setDate(d.getDate() + n); return dateKey(d); }
function todayKey() { return dateKey(new Date()); }
function daysBetween(a, b) { return Math.round((parseKey(b) - parseKey(a)) / 86400000); }
function fmt(k, opts) { return parseKey(k).toLocaleDateString(LOCALE, opts); }

const ICONS = {
  left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9M7.5 13.5L12 9l4.5 4.5M5 4h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>',
};

/* --------------------------------------------------------------------------
   Storage (localStorage)
   Shape: { version: 1, days: { 'YYYY-MM-DD': { dd: { beans: 2, ... } } } }
   -------------------------------------------------------------------------- */

const Store = {
  data: { version: 1, days: {} },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = sanitize(JSON.parse(raw));
        if (parsed) this.data = parsed;
      }
    } catch (e) { /* corrupted or blocked: start fresh in memory */ }
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      return true;
    } catch (e) {
      toast('Could not save — storage is full or blocked');
      return false;
    }
  },

  get(date, item) {
    return this.data.days[date]?.[TRACKER.id]?.[item] ?? 0;
  },

  set(date, item, n) {
    const days = this.data.days;
    if (n > 0) {
      days[date] ??= {};
      days[date][TRACKER.id] ??= {};
      days[date][TRACKER.id][item] = n;
    } else if (days[date]?.[TRACKER.id]) {
      delete days[date][TRACKER.id][item];
      if (!Object.keys(days[date][TRACKER.id]).length) delete days[date][TRACKER.id];
      if (!Object.keys(days[date]).length) delete days[date];
    }
    this.save();
  },

  replace(data) { this.data = data; this.save(); },
};

/** Validate and clean imported/stored data. Returns null if unusable. */
function sanitize(obj) {
  if (!obj || typeof obj !== 'object' || !obj.days || typeof obj.days !== 'object' || Array.isArray(obj.days)) return null;
  const days = {};
  for (const [date, trackers] of Object.entries(obj.days)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !trackers || typeof trackers !== 'object') continue;
    for (const [tid, items] of Object.entries(trackers)) {
      if (!items || typeof items !== 'object') continue;
      for (const [iid, val] of Object.entries(items)) {
        const n = Math.floor(Number(val));
        if (!Number.isFinite(n) || n <= 0) continue;
        days[date] ??= {};
        days[date][tid] ??= {};
        days[date][tid][iid] = Math.min(n, 99);
      }
    }
  }
  return { version: 1, days };
}

const UI = {
  get() { try { return JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch (e) { return {}; } },
  set(patch) { try { localStorage.setItem(UI_KEY, JSON.stringify({ ...this.get(), ...patch })); } catch (e) { /* ignore */ } },
};

/* --------------------------------------------------------------------------
   Stats
   -------------------------------------------------------------------------- */

function dayDone(k) {
  let done = 0;
  for (const it of TRACKER.items) done += Math.min(Store.get(k, it.id), it.target);
  return done;
}

function firstLoggedDay() {
  const keys = Object.keys(Store.data.days).filter((k) => Store.data.days[k][TRACKER.id]).sort();
  return keys[0] || null;
}

/** Window of the last n days ending today, but never before the first logged day. */
function windowDays(n) {
  const today = todayKey();
  const first = firstLoggedDay();
  if (!first) return [];
  const len = Math.min(n, daysBetween(first, today) + 1);
  return Array.from({ length: Math.max(len, 1) }, (_, i) => addDays(today, -i));
}

function currentStreak() {
  let k = todayKey();
  if (dayDone(k) < TOTAL) k = addDays(k, -1);
  let n = 0;
  while (dayDone(k) === TOTAL) { n++; k = addDays(k, -1); }
  return n;
}

function bestStreak() {
  const full = Object.keys(Store.data.days).filter((k) => dayDone(k) === TOTAL).sort();
  let best = 0, run = 0, prev = null;
  for (const k of full) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

/* --------------------------------------------------------------------------
   App state
   -------------------------------------------------------------------------- */

const state = {
  view: 'today',
  date: todayKey(),
  lastToday: todayKey(),
  expanded: new Set(),
  calMonth: null, // 'YYYY-MM'
};

/* --------------------------------------------------------------------------
   Feedback: toast + haptics
   -------------------------------------------------------------------------- */

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

// iOS Safari (17.4+) gives a haptic tick when a native switch toggles; we click a hidden one.
const haptic = (() => {
  let label = null;
  return () => {
    try {
      if (navigator.vibrate) { navigator.vibrate(8); return; }
      if (!label) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.setAttribute('switch', '');
        input.id = 'haptic-switch';
        label = document.createElement('label');
        label.htmlFor = 'haptic-switch';
        const box = document.createElement('div');
        box.className = 'haptic';
        box.setAttribute('aria-hidden', 'true');
        box.append(input, label);
        document.body.append(box);
      }
      label.click();
    } catch (e) { /* no haptics, no problem */ }
  };
})();

/* --------------------------------------------------------------------------
   Views
   -------------------------------------------------------------------------- */

function render() {
  const view = $('#view');
  if (state.view === 'history') view.innerHTML = renderHistory();
  else if (state.view === 'settings') view.innerHTML = renderSettings();
  else view.innerHTML = renderToday();
  view.dataset.view = state.view;
  for (const t of $$('.tab')) {
    if (t.dataset.view === state.view) t.setAttribute('aria-current', 'page');
    else t.removeAttribute('aria-current');
  }
}

/* ---- Today ---- */

const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

function dayTitle(k) {
  const diff = daysBetween(k, todayKey());
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return fmt(k, { weekday: 'long' });
}

function summaryMessage(done) {
  if (done >= TOTAL) return 'All done — amazing! 🎉';
  const left = TOTAL - done;
  const togo = `${left} serving${left === 1 ? '' : 's'} to go`;
  if (done === 0) return `A fresh start · ${togo}`;
  if (done < TOTAL / 3) return `Good start · ${togo}`;
  if (done < (TOTAL * 2) / 3) return `Keep it up · ${togo}`;
  return `Almost there · ${togo}`;
}

function shouldShowInstallTip() {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return ios && navigator.standalone === false && !UI.get().hideInstall;
}

function renderToday() {
  const today = todayKey();
  const isToday = state.date === today;
  const done = dayDone(state.date);
  const pct = Math.round((done / TOTAL) * 100);

  const tip = shouldShowInstallTip() ? `
    <aside class="tip card">
      <div>
        <b>Add to Home Screen</b>
        <p>Tap ${ICONS.share} Share, then “Add to Home Screen”. It opens full-screen and keeps your data safe.</p>
      </div>
      <button class="icon-btn small" data-action="hide-tip" aria-label="Dismiss">${ICONS.close}</button>
    </aside>` : '';

  return `
    <header class="day-header">
      <button class="icon-btn" data-action="prev-day" aria-label="Previous day">${ICONS.left}</button>
      <div class="date-wrap">
        <div class="date-title">${dayTitle(state.date)}</div>
        <div class="date-sub">${fmt(state.date, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <input type="date" class="date-input" id="date-input" value="${state.date}" max="${today}" aria-label="Choose a date">
      </div>
      <button class="icon-btn" data-action="next-day" aria-label="Next day" ${isToday ? 'disabled' : ''}>${ICONS.right}</button>
    </header>

    ${tip}

    <section class="summary card${done >= TOTAL ? ' complete' : ''}" id="summary">
      <div class="ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="ring-track" cx="60" cy="60" r="${RING_R}"/>
          <circle class="ring-bar" cx="60" cy="60" r="${RING_R}"
            stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="${(RING_C * (1 - done / TOTAL)).toFixed(2)}"/>
        </svg>
        <div class="ring-label"><span id="ring-pct">${pct}</span><small>%</small></div>
      </div>
      <div class="summary-text">
        <h1 class="summary-title">${TRACKER.name}</h1>
        <div class="summary-count"><b id="sum-done">${done}</b> of ${TOTAL} servings</div>
        <div class="summary-msg" id="sum-msg">${summaryMessage(done)}</div>
        ${isToday ? '' : '<button class="pill" data-action="go-today">Back to today</button>'}
      </div>
    </section>

    <ul class="items" id="items">
      ${TRACKER.items.map((it) => itemHTML(it, Store.get(state.date, it.id), state.expanded.has(it.id))).join('')}
    </ul>

    <p class="footnote">Gram weights are practical conversions of Dr. Greger’s serving sizes. Weigh beans, grains and pasta after cooking. Swipe left or right to change the day.</p>
  `;
}

function itemHTML(it, n, open) {
  const boxes = Array.from({ length: it.target }, (_, i) => `
    <button class="box${i < n ? ' on' : ''}" data-action="box" data-i="${i}"
      aria-pressed="${i < n}" aria-label="${it.name}: serving ${i + 1} of ${it.target}">${ICONS.check}</button>`).join('');
  const servings = it.servings.map(([label, amount]) => `<li><span>${label}</span><b>${amount}</b></li>`).join('');
  return `
    <li class="item${n >= it.target ? ' done' : ''}${open ? ' open' : ''}" data-id="${it.id}" style="--c:${it.color}">
      <button class="item-head" data-action="info" aria-expanded="${open}" aria-controls="info-${it.id}">
        <span class="emoji" aria-hidden="true">${it.emoji}</span>
        <span class="name">${it.name}</span>
        <span class="count">${n}/${it.target}</span>
        <span class="chev">${ICONS.down}</span>
      </button>
      <div class="boxes" role="group" aria-label="${it.name} servings">${boxes}</div>
      <div class="info" id="info-${it.id}"${open ? '' : ' hidden'}>
        <div class="info-title">One serving</div>
        <ul class="servings">${servings}</ul>
        <p class="examples">${it.examples}</p>
      </div>
    </li>`;
}

function updateItem(li, it) {
  const n = Store.get(state.date, it.id);
  li.classList.toggle('done', n >= it.target);
  $$('.box', li).forEach((b, i) => {
    b.classList.toggle('on', i < n);
    b.setAttribute('aria-pressed', String(i < n));
  });
  $('.count', li).textContent = `${n}/${it.target}`;
}

function updateSummary() {
  const done = dayDone(state.date);
  $('#summary').classList.toggle('complete', done >= TOTAL);
  $('.ring-bar').setAttribute('stroke-dashoffset', (RING_C * (1 - done / TOTAL)).toFixed(2));
  $('#ring-pct').textContent = Math.round((done / TOTAL) * 100);
  $('#sum-done').textContent = done;
  $('#sum-msg').textContent = summaryMessage(done);
}

function setDate(k, direction = 0) {
  const today = todayKey();
  if (!k || k > today) k = today;
  if (k === state.date) return;
  state.date = k;
  render();
  if (direction) {
    const list = $('#items');
    list.classList.add(direction > 0 ? 'slide-next' : 'slide-prev');
  }
}

/* ---- History ---- */

function renderHistory() {
  const today = todayKey();
  const month = state.calMonth || today.slice(0, 7);
  const [y, m] = month.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(y, m, 0).getDate();
  const isCurrentMonth = month === today.slice(0, 7);

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(LOCALE, { weekday: 'narrow' }));

  let cells = '<span class="cal-blank"></span>'.repeat(offset);
  for (let d = 1; d <= daysInMonth; d++) {
    const k = `${month}-${pad(d)}`;
    const future = k > today;
    const done = future ? 0 : dayDone(k);
    const p = Math.round((done / TOTAL) * 100);
    const cls = ['cal-day', k === today && 'is-today', done >= TOTAL && 'full', p >= 55 && 'strong', future && 'future']
      .filter(Boolean).join(' ');
    cells += `<button class="${cls}" style="--p:${p}%" data-action="open-day" data-date="${k}" ${future ? 'disabled' : ''}
      aria-label="${fmt(k, { day: 'numeric', month: 'long' })}: ${done} of ${TOTAL}">${d}</button>`;
  }

  const week = windowDays(7);
  const month30 = windowDays(30);
  const avg = (ks) => ks.length ? (ks.reduce((s, k) => s + dayDone(k), 0) / ks.length).toFixed(1) : '–';
  const streak = currentStreak();
  const best = bestStreak();

  const bars = TRACKER.items.map((it) => {
    const p = week.length
      ? Math.round((week.reduce((s, k) => s + Math.min(Store.get(k, it.id), it.target), 0) / (it.target * week.length)) * 100)
      : 0;
    return `
      <li style="--c:${it.color}">
        <span class="bar-emoji" aria-hidden="true">${it.emoji}</span>
        <span class="bar-name">${it.name}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${p}%"></span></span>
        <span class="bar-pct">${p}%</span>
      </li>`;
  }).join('');

  return `
    <header class="page-header"><h1>History</h1></header>

    <section class="stats">
      <div class="stat card"><b>${streak}</b><span>day streak</span></div>
      <div class="stat card"><b>${best}</b><span>best streak</span></div>
      <div class="stat card"><b>${avg(week)}</b><span>avg / ${TOTAL} · 7 days</span></div>
      <div class="stat card"><b>${avg(month30)}</b><span>avg / ${TOTAL} · 30 days</span></div>
    </section>

    <section class="card calendar">
      <div class="cal-head">
        <button class="icon-btn" data-action="cal-prev" aria-label="Previous month">${ICONS.left}</button>
        <h2>${first.toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' })}</h2>
        <button class="icon-btn" data-action="cal-next" aria-label="Next month" ${isCurrentMonth ? 'disabled' : ''}>${ICONS.right}</button>
      </div>
      <div class="cal-grid cal-weekdays" aria-hidden="true">${weekdays.map((w) => `<span>${w}</span>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
      <div class="cal-legend" aria-hidden="true">
        <span>0%</span><i style="--p:0%"></i><i style="--p:25%"></i><i style="--p:50%"></i><i style="--p:75%"></i><i style="--p:100%"></i><span>100%</span>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">Last 7 days by category</h2>
      ${week.length ? `<ul class="bars">${bars}</ul>` : '<p class="muted">Nothing logged yet. Your progress will show up here.</p>'}
    </section>
  `;
}

/* ---- Settings ---- */

function renderSettings() {
  const daysLogged = Object.keys(Store.data.days).length;
  const first = firstLoggedDay();
  return `
    <header class="page-header"><h1>Settings</h1></header>

    <section class="card group">
      <h2 class="card-title">Backup</h2>
      <p class="muted">Your data is stored only on this phone${first ? ` — ${daysLogged} day${daysLogged === 1 ? '' : 's'} logged since ${fmt(first, { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}. Export a backup now and then (save it to Files or iCloud Drive).</p>
      <button class="row-btn" data-action="export">${ICONS.share}<span>Export backup</span></button>
      <label class="row-btn" for="import-input">${ICONS.upload}<span>Import backup</span></label>
      <input type="file" id="import-input" class="visually-hidden" accept="application/json,.json">
    </section>

    <section class="card group">
      <h2 class="card-title">Danger zone</h2>
      <button class="row-btn danger" data-action="erase">${ICONS.trash}<span>Erase all data</span></button>
    </section>

    <section class="card about">
      <h2 class="card-title">About</h2>
      <p>The Daily Dozen is Dr. Michael Greger’s checklist of the foods to eat every day, from <i>How Not to Die</i>. Serving sizes here are converted to grams.</p>
      <p class="muted">Daily Tracker ${APP_VERSION}</p>
    </section>
  `;
}

/* ---- Backup ---- */

async function exportBackup() {
  const json = JSON.stringify({ app: 'dailytracker', exportedAt: new Date().toISOString(), ...Store.data }, null, 2);
  const name = `daily-tracker-${todayKey()}.json`;
  const blob = new Blob([json], { type: 'application/json' });
  try {
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Daily Tracker backup' });
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importBackup(file) {
  try {
    const data = sanitize(JSON.parse(await file.text()));
    if (!data) throw new Error('invalid');
    const n = Object.keys(data.days).length;
    if (!confirm(`Replace all current data with this backup (${n} day${n === 1 ? '' : 's'})?`)) return;
    Store.replace(data);
    toast('Backup restored');
    render();
  } catch (e) {
    toast('That file is not a valid backup');
  }
}

/* --------------------------------------------------------------------------
   Events
   -------------------------------------------------------------------------- */

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;

  switch (el.dataset.action) {
    case 'tab': {
      const v = el.dataset.view;
      if (v === state.view) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      state.view = v;
      render();
      window.scrollTo(0, 0);
      break;
    }
    case 'box': {
      const li = el.closest('.item');
      const it = TRACKER.items.find((x) => x.id === li.dataset.id);
      const i = Number(el.dataset.i);
      const cur = Store.get(state.date, it.id);
      const before = dayDone(state.date);
      Store.set(state.date, it.id, i < cur ? i : i + 1);
      updateItem(li, it);
      updateSummary();
      haptic();
      if (i >= cur) {
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
      }
      if (before < TOTAL && dayDone(state.date) === TOTAL) {
        toast(`All ${TOTAL} servings — well done! 🎉`);
        $('#summary').classList.add('celebrate');
      }
      break;
    }
    case 'info': {
      const li = el.closest('.item');
      const id = li.dataset.id;
      const open = !state.expanded.has(id);
      open ? state.expanded.add(id) : state.expanded.delete(id);
      li.classList.toggle('open', open);
      el.setAttribute('aria-expanded', String(open));
      $('.info', li).hidden = !open;
      break;
    }
    case 'prev-day': setDate(addDays(state.date, -1), -1); break;
    case 'next-day': setDate(addDays(state.date, 1), 1); break;
    case 'go-today': setDate(todayKey(), 1); break;
    case 'hide-tip': UI.set({ hideInstall: true }); el.closest('.tip').remove(); break;
    case 'cal-prev':
    case 'cal-next': {
      const base = state.calMonth || todayKey().slice(0, 7);
      const [y, m] = base.split('-').map(Number);
      const d = new Date(y, m - 1 + (el.dataset.action === 'cal-next' ? 1 : -1), 1);
      state.calMonth = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
      render();
      break;
    }
    case 'open-day':
      state.date = el.dataset.date;
      state.view = 'today';
      render();
      window.scrollTo(0, 0);
      break;
    case 'export': exportBackup(); break;
    case 'erase':
      if (confirm('Erase ALL tracked data on this phone? This cannot be undone.')) {
        Store.replace({ version: 1, days: {} });
        toast('All data erased');
        render();
      }
      break;
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'date-input') {
    if (e.target.value) setDate(e.target.value, e.target.value < state.date ? -1 : 1);
  } else if (e.target.id === 'import-input') {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (file) importBackup(file);
  }
});

// Swipe left/right on the Today view to change day.
(() => {
  let x0 = 0, y0 = 0, t0 = 0, tracking = false;
  const view = $('#view');
  view.addEventListener('touchstart', (e) => {
    tracking = state.view === 'today' && e.touches.length === 1;
    if (!tracking) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
  }, { passive: true });
  view.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - x0, dy = t.clientY - y0;
    if (Date.now() - t0 < 600 && Math.abs(dx) > 70 && Math.abs(dy) < Math.abs(dx) * 0.5) {
      if (dx < 0 && state.date < todayKey()) setDate(addDays(state.date, 1), 1);
      else if (dx > 0) setDate(addDays(state.date, -1), -1);
    }
  }, { passive: true });
})();

// Roll over to the new day if the app was left open (or resumed) past midnight.
function checkNewDay() {
  const today = todayKey();
  if (today === state.lastToday) return;
  const wasOnToday = state.date === state.lastToday;
  state.lastToday = today;
  if (wasOnToday) state.date = today;
  if (state.view !== 'settings') render();
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkNewDay(); });
setInterval(checkNewDay, 60000);

// Data changed in another tab.
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) { Store.load(); render(); }
});

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

Store.load();
render();

if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
