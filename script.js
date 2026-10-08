/* =========================================================
   WasteWise — plain JavaScript (no frameworks)
   Data lives in data.js (loaded before this file).
   ========================================================= */
'use strict';

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BIN_KEYS = ['wet', 'dry', 'ewaste', 'hazardous'];

/* Scroll reveal */
const revealIO = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

function observeReveal(root = document) {
  $$('.reveal:not(.in)', root).forEach((el) => (revealIO ? revealIO.observe(el) : el.classList.add('in')));
}

/* Animated number counter (cancels itself if restarted, respects reduced motion) */
function countUp(el, target, { duration = 1200, format = (n) => String(n) } = {}) {
  if (!el) return;
  if (el._raf) cancelAnimationFrame(el._raf);
  if (reduceMotion) { el.textContent = format(target); return; }
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = format(Math.round(target * eased));
    if (p < 1) el._raf = requestAnimationFrame(tick);
  };
  el._raf = requestAnimationFrame(tick);
}

/* ---------- SVG illustrations ---------- */
const BROWN = '#3b2a1e';
let svgUid = 0;

const recycleArrows = (color, width) =>
  [0, 120, 240].map((d) =>
    `<g transform="rotate(${d} 50 50)">
       <path d="M60.35 11.36 A40 40 0 0 1 86.25 66.9" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>
       <polygon points="82.9,74.2 91.7,69.4 80.8,64.4" fill="${color}" stroke="${color}" stroke-width="1" stroke-linejoin="round"/>
     </g>`).join('');

const recycleSymbol = (size, color, spin) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" focusable="false" ${spin ? 'style="animation:spin 14s linear infinite"' : ''}>${recycleArrows(color, 7)}</svg>`;

const starSvg = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="12,1.5 14.9,8.6 22.5,9.2 16.7,14.1 18.5,21.6 12,17.6 5.5,21.6 7.3,14.1 1.5,9.2 9.1,8.6" fill="#e0a82e" stroke="${BROWN}" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

function earthGroup() {
  const id = 'earthclip' + (++svgUid);
  let dots = '';
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
    dots += `<circle cx="${20 + c * 14 + (r % 2) * 7}" cy="${30 + r * 14}" r="2.4"/>`;
  }
  const land = (d, fill) => `<path d="${d}" fill="${fill}" stroke="${BROWN}" stroke-width="4" stroke-linejoin="round"/>`;
  return `<g>
    <defs><clipPath id="${id}"><circle r="110"/></clipPath></defs>
    <circle r="116" fill="#e0a82e" opacity="0.55"/>
    <circle r="110" fill="#2f6b67" stroke="${BROWN}" stroke-width="6"/>
    <g clip-path="url(#${id})">
      ${land('M-85 -40 C-60 -90 -10 -80 0 -55 C10 -30 -25 -20 -35 5 C-45 25 -80 15 -95 -10 Z', '#5f8a45')}
      ${land('M22 8 C55 -14 92 8 84 44 C76 80 44 96 26 66 C10 44 10 26 22 8 Z', '#7a7a2e')}
      ${land('M-50 48 C-32 36 -8 58 -20 80 C-38 92 -62 70 -50 48 Z', '#5f8a45')}
      ${land('M28 -78 C48 -90 72 -76 66 -58 C54 -50 34 -56 28 -78 Z', '#5f8a45')}
      <g fill="${BROWN}" opacity="0.22">${dots}</g>
      <path d="M-95 -20 A100 100 0 0 1 -30 -92" fill="none" stroke="#f3e9d2" stroke-width="7" stroke-linecap="round" opacity="0.8"/>
    </g>
  </g>`;
}

const earthSvg = (size) =>
  `<svg width="${size}" height="${size}" viewBox="-125 -125 250 250" role="img" aria-label="Retro illustration of planet Earth">${earthGroup()}</svg>`;

const ICON_STROKE = `stroke="${BROWN}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const ICONS = {
  bottle: `<g ${ICON_STROKE}><rect x="-6" y="-30" width="12" height="7" rx="2" fill="#b34a26"/><path d="M-7 -23 H7 L9 -14 C16 -8 16 -4 16 2 V24 C16 29 12 31 8 31 H-8 C-12 31 -16 29 -16 24 V2 C-16 -4 -16 -8 -9 -14 Z" fill="#8fb7ae"/><rect x="-16" y="4" width="32" height="14" fill="#f3e9d2"/></g>`,
  glass: `<g ${ICON_STROKE}><path d="M-5 -32 H5 V-16 C5 -10 14 -8 14 2 V26 C14 30 11 32 8 32 H-8 C-11 32 -14 30 -14 26 V2 C-14 -8 -5 -10 -5 -16 Z" fill="#5f8a45"/><rect x="-14" y="6" width="28" height="12" fill="#e0a82e"/></g>`,
  can: `<g ${ICON_STROKE}><rect x="-16" y="-24" width="32" height="50" rx="4" fill="#e0a82e"/><ellipse cx="0" cy="-24" rx="16" ry="5" fill="#f3e9d2"/><rect x="-16" y="-8" width="32" height="18" fill="#b34a26"/></g>`,
  food: `<g ${ICON_STROKE}><path d="M0 -18 C-16 -28 -28 -10 -24 6 C-20 24 -8 30 0 26 C8 30 20 24 24 6 C28 -10 16 -28 0 -18 Z" fill="#b34a26"/><path d="M0 -18 C0 -26 4 -30 10 -32" fill="none"/><path d="M6 -30 C14 -34 20 -30 20 -30 C16 -24 10 -24 6 -30 Z" fill="#5f8a45"/><circle cx="14" cy="-2" r="3" fill="#f3e9d2" stroke="none"/></g>`,
  phone: `<g ${ICON_STROKE}><rect x="-17" y="-30" width="34" height="60" rx="6" fill="#3b2a1e"/><rect x="-12" y="-23" width="24" height="40" rx="2" fill="#8fb7ae"/><circle cx="0" cy="24" r="2.5" fill="#f3e9d2" stroke="none"/><path d="M-7 -12 L0 -4 L7 -14" fill="none" stroke="#2f5d3a"/></g>`,
  paper: `<g ${ICON_STROKE}><path d="M-20 -28 H10 L22 -16 V28 H-20 Z" fill="#f3e9d2"/><path d="M10 -28 V-16 H22" fill="#e8dbbb"/><path d="M-12 -4 H14 M-12 6 H14 M-12 16 H6" fill="none"/></g>`,
};

function heroArtSvg() {
  const items = [
    ['bottle', -90], ['glass', -30], ['can', 30], ['food', 90], ['phone', 150], ['paper', 210],
  ];
  const R = 178;
  const badges = items.map(([name, angle], i) => {
    const x = (250 + R * Math.cos((angle * Math.PI) / 180)).toFixed(1);
    const y = (250 + R * Math.sin((angle * Math.PI) / 180)).toFixed(1);
    return `<g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:${i * -0.8}s">
      <circle r="46" fill="#f3e9d2" stroke="${BROWN}" stroke-width="4"/>
      <circle r="38" fill="none" stroke="${BROWN}" stroke-width="1.5" stroke-dasharray="3 5"/>
      <g transform="scale(0.85)">${ICONS[name]}</g></g></g>`;
  }).join('');
  return `<svg viewBox="0 0 500 500" role="img" aria-label="Retro illustration of planet Earth surrounded by a plastic bottle, glass bottle, metal can, food waste, an electronic device and paper, linked by recycling arrows">
    <g class="spin-slow"><g transform="translate(250 250) scale(4.45) translate(-50 -50)">${recycleArrows('#2f5d3a', 3.2)}</g></g>
    <g transform="translate(250 250) scale(0.95)">${earthGroup()}</g>
    ${badges}
  </svg>`;
}

/* ---------- Static decorations ---------- */
function initDecor() {
  $('#hero-art').innerHTML = heroArtSvg();
  $$('[data-star]').forEach((el) => { el.innerHTML = starSvg(Number(el.dataset.star)); });
  $('#imp-star1').innerHTML = starSvg(30);
  $('#imp-star2').innerHTML = starSvg(30);
  $('#impact-earth').innerHTML = earthSvg(220);
  $('#footer-symbol').innerHTML = recycleSymbol(34, '#e0a82e', true);
  $('#loop-spin').innerHTML = recycleSymbol(30, '#e0a82e', false);
  const words = ['KNOW YOUR WASTE', 'SORT IT RIGHT', 'PROTECT THE FUTURE', 'REDUCE', 'REUSE', 'RECYCLE'];
  const strip = [...words, ...words, ...words, ...words];
  $('#strip').innerHTML = strip.map((w) => `<span>★ ${w}</span>`).join('');
  $('#year').textContent = new Date().getFullYear();
  $('#disclaimer-text').textContent = disclaimer;
  $('#local-rules-note').textContent = '⚠ ' + disclaimer;
}

/* ---------- Navbar ---------- */
function initNav() {
  const btn = $('#menu-toggle');
  const menu = $('#nav-menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.firstElementChild.textContent = open ? '✕' : '☰';
  };
  btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Highlight the section in view
  const ids = ['home', 'guide', 'sort', 'learn', 'impact', 'identify', 'ewaste', 'quiz'];
  const map = { identify: 'guide', ewaste: 'learn', quiz: 'impact' };
  const links = $$('.nav-links a[data-section]');
  const onScroll = () => {
    const y = window.scrollY + 140;
    let current = 'home';
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) current = map[id] || id;
    });
    links.forEach((a) => {
      const on = a.dataset.section === current;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Quick waste identifier ---------- */
function initIdentifier() {
  const picker = $('#item-picker');
  picker.innerHTML = identifierItems.map((it) =>
    `<button type="button" class="item-btn" data-id="${it.id}" aria-pressed="false">
       <span class="emoji" aria-hidden="true">${it.emoji}</span><span>${it.name}</span></button>`).join('');
  picker.addEventListener('click', (e) => {
    const b = e.target.closest('.item-btn');
    if (b) showItem(b.dataset.id);
  });
  showItem(identifierItems[0].id);
}

function showItem(id) {
  const item = identifierItems.find((i) => i.id === id);
  const bin = BINS[item.bin];
  $$('.item-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
  $('#result').innerHTML = `
    <article class="result-panel" aria-label="Result for ${item.name}">
      <div class="result-panel__top">
        <span class="result-panel__emoji" aria-hidden="true">${item.emoji}</span>
        <div>
          <p class="result-panel__item" style="margin:0">You selected: ${item.name}</p>
          <h3 class="result-panel__cat bin--${bin.key}" style="margin:0.4rem 0 0">${item.category}</h3>
        </div>
      </div>
      <div class="facts">
        <div class="fact"><h4>HOW TO DISPOSE</h4><p>${item.disposal}</p></div>
        <div class="fact"><h4>REUSE IDEA</h4><p>${item.reuse}</p></div>
        <div class="fact"><h4>RECYCLING INFO</h4><p>${item.recycling}</p></div>
        <div class="fact"><h4>ECO TIP</h4><p>${item.tip}</p></div>
      </div>
      <div class="why-box"><h4>Why it matters</h4><p>${item.why}</p></div>
      <p style="margin:1rem 0 0;font-size:0.88rem;font-family:var(--font-type)">${disclaimer}</p>
    </article>`;
}

/* ---------- Waste guide ---------- */
function initGuide() {
  let filter = 'all';
  let openId = null;
  const chips = $('#filters');
  const grid = $('#guide-grid');
  const label = (c) => (c.title.startsWith('HAZ') ? 'Hazardous' : c.title.charAt(0) + c.title.slice(1).toLowerCase());

  chips.innerHTML =
    `<button type="button" class="chip" data-filter="all" aria-pressed="true">All 7</button>` +
    wasteCategories.map((c) => `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="false">${label(c)}</button>`).join('');

  const renderGrid = () => {
    const visible = filter === 'all' ? wasteCategories : wasteCategories.filter((c) => c.id === filter);
    grid.innerHTML = visible.map((c, i) => `
      <article class="cat-card reveal" data-id="${c.id}" style="transition-delay:${i * 60}ms" aria-labelledby="cat-${c.id}">
        <div class="cat-card__head head--${c.color}">
          <span class="cat-card__num">${c.num} —</span>
          <span class="cat-card__icon" aria-hidden="true">${c.icon}</span>
          <h3 id="cat-${c.id}">${c.title}</h3>
        </div>
        <div class="cat-card__body">
          <p>${c.desc}</p>
          <ul class="tags" aria-label="Examples of ${c.title.toLowerCase()}">${c.examples.map((e) => `<li>${e}</li>`).join('')}</ul>
          <button type="button" class="btn btn--sm btn--green" data-more="${c.id}" aria-expanded="false" aria-controls="more-${c.id}">Learn more +</button>
          <div class="more" id="more-${c.id}" hidden>
            <h4>HOW TO HANDLE IT</h4><p>${c.more.how}</p>
            <h4>WHAT TO AVOID</h4><p>${c.more.avoid}</p>
            <h4>DID YOU KNOW?</h4><p>${c.more.fact}</p>
          </div>
        </div>
      </article>`).join('');
    observeReveal(grid);
  };

  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    filter = b.dataset.filter;
    openId = null;
    $$('.chip', chips).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderGrid();
  });

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-more]');
    if (!b) return;
    openId = openId === b.dataset.more ? null : b.dataset.more;
    $$('.cat-card', grid).forEach((card) => {
      const open = card.dataset.id === openId;
      $('.more', card).hidden = !open;
      const btn = $('[data-more]', card);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Show less −' : 'Learn more +';
    });
  });

  renderGrid();
}

/* ---------- Games: shared pieces ---------- */
const game = { mode: 'classic' };
let timerId = null;
const hudPrev = {};
const stopTimer = () => { if (timerId) { clearInterval(timerId); timerId = null; } };
const resetHud = () => Object.keys(hudPrev).forEach((k) => delete hudPrev[k]);

const binsHtml = () => `<div class="bins" role="group" aria-label="Choose a bin">${BIN_KEYS.map((k) => {
  const b = BINS[k];
  return `<button type="button" class="bin-btn bin--${k}" data-bin="${k}" aria-label="${b.label} bin"><span class="bin-emoji" aria-hidden="true">${b.emoji}</span><span>${b.label}</span></button>`;
}).join('')}</div>`;

const legendHtml = () => `<ul class="legend" aria-label="Bin guide">
  <li>🟢 <strong>Wet</strong>: food &amp; garden scraps</li>
  <li>🟡 <strong>Dry</strong>: paper, plastic, glass, metal, textiles</li>
  <li>🔵 <strong>E-waste</strong>: electronics</li>
  <li>🟠 <strong>Hazardous</strong>: batteries, paint, chemicals, bulbs</li>
</ul>`;

const progressHtml = (id, label, cls = '') =>
  `<div class="progress ${cls}" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress__bar" id="${id}" style="width:0%"></div></div>`;

function setProgress(id, pct) {
  const bar = $('#' + id);
  bar.style.width = pct + '%';
  bar.parentElement.setAttribute('aria-valuenow', String(Math.round(pct)));
}

function setHud(id, items) {
  $('#' + id).innerHTML = items.map((it) => {
    const key = id + it.label;
    const bump = hudPrev[key] !== undefined && hudPrev[key] !== String(it.value);
    hudPrev[key] = String(it.value);
    return `<div class="hud__box"><span class="hud__label">${it.label}</span><span class="hud__value${bump ? ' hud__value--bump' : ''}">${it.value}</span></div>`;
  }).join('');
}

const itemCardHtml = (item) => `<div class="item-card"><div class="item-card__emoji" aria-hidden="true">${item.emoji}</div><div class="item-card__name">${item.name}</div></div>`;

function showStart() {
  stopTimer();
  const root = $('#game-root');
  if (game.mode === 'classic') {
    root.innerHTML = `<div class="game-board"><div class="start-screen">
      <span class="big-emoji" aria-hidden="true">🗑️</span>
      <h3 class="game-title">Sort it out!</h3>
      <p class="game-sub">Can you put everyday waste in the right place?</p>
      <p>${ROUND_LENGTH} items. Pick the right bin. Score up to 100.</p>
      <button type="button" class="btn btn--green" data-act="start-classic">Start game</button>
      ${legendHtml()}</div></div>`;
  } else {
    root.innerHTML = `<div class="game-board"><div class="start-screen">
      <span class="big-emoji" aria-hidden="true">⏱️</span>
      <h3 class="game-title">30-second sorting challenge</h3>
      <p class="game-sub">Sort as many items as you can before time runs out.</p>
      <p>+10 for a correct sort, −5 for a mistake. Tip: press keys 1–4 to pick a bin.</p>
      <button type="button" class="btn btn--terra" data-act="start-challenge">Start challenge</button>
      ${legendHtml()}</div></div>`;
  }
}

/* ---------- Game 1: Sort it out ---------- */
const POINTS = 100 / ROUND_LENGTH;
let S = null;

function sortingVerdict(score) {
  if (score >= 90) return { title: 'SORTING CHAMPION!', medal: '🏆', msg: 'Outstanding! You know your bins like a true eco-hero.' };
  if (score >= 70) return { title: 'ECO HERO!', medal: '🌟', msg: 'Great sorting! A few more rounds and you will be a champion.' };
  if (score >= 50) return { title: 'GETTING THERE!', medal: '🌱', msg: 'Good effort. Check the Waste Guide and try again.' };
  return { title: 'KEEP LEARNING!', medal: '📚', msg: 'Every sorter starts somewhere. Explore the guide and play again!' };
}

function startSorting() {
  stopTimer();
  resetHud();
  S = { queue: shuffle(gameItems).slice(0, ROUND_LENGTH), index: 0, score: 0, correct: 0, incorrect: 0, wrong: [], solved: false, missed: false };
  $('#game-root').innerHTML = `<div class="game-board">
    <h3 class="game-title">Sort it out!</h3>
    <p class="game-sub">Can you put everyday waste in the right place?</p>
    <div class="hud" id="s-hud"></div>
    ${progressHtml('s-bar', 'Game progress')}
    <div id="s-card"></div>
    ${binsHtml()}
    <div id="s-feedback" aria-live="polite"></div>
  </div>`;
  updateSorting(true);
}

function updateSorting(newItem) {
  const item = S.queue[S.index];
  setHud('s-hud', [
    { label: 'Score', value: `${S.score} / 100` },
    { label: 'Question', value: `${S.index + 1} / ${ROUND_LENGTH}` },
    { label: 'Correct', value: S.correct },
    { label: 'Incorrect', value: S.incorrect },
  ]);
  setProgress('s-bar', ((S.index + (S.solved ? 1 : 0)) / ROUND_LENGTH) * 100);
  if (newItem) $('#s-card').innerHTML = itemCardHtml(item);

  $$('.bin-btn', $('#game-root')).forEach((b) => {
    const k = b.dataset.bin;
    const wrong = S.wrong.includes(k);
    b.disabled = S.solved || wrong;
    b.classList.toggle('is-wrong', wrong);
    b.classList.toggle('is-correct', S.solved && k === item.bin);
    b.setAttribute('aria-label', `${BINS[k].label} bin${wrong ? ' (already tried)' : ''}`);
  });

  const fb = $('#s-feedback');
  if (S.solved) {
    fb.innerHTML = `<div class="feedback feedback--good"><h3>NICE SORT! ♻️</h3>
      <p>That's the right category: <strong>${BINS[item.bin].full}</strong>. ${item.why}</p>
      <button type="button" class="btn btn--green" id="s-next" data-act="sort-next">${S.index + 1 >= ROUND_LENGTH ? 'See results' : 'Next item →'}</button></div>`;
  } else if (S.wrong.length) {
    fb.innerHTML = `<div class="feedback feedback--bad"><h3>NOT QUITE!</h3><p>Try again. Learn why this item belongs elsewhere: ${item.why}</p></div>`;
  } else {
    fb.innerHTML = '';
  }
}

function sortPick(k) {
  if (!S || S.solved) return;
  const item = S.queue[S.index];
  if (k === item.bin) {
    S.solved = true;
    if (!S.missed) { S.correct++; S.score += POINTS; }
  } else {
    if (!S.missed) { S.incorrect++; S.missed = true; }
    S.wrong.push(k);
  }
  updateSorting(false);
  if (S.solved) { const n = $('#s-next'); if (n) n.focus(); }
}

function sortNext() {
  if (S.index + 1 >= ROUND_LENGTH) return finishSorting();
  S.index++; S.wrong = []; S.solved = false; S.missed = false;
  updateSorting(true);
}

function finishSorting() {
  const v = sortingVerdict(S.score);
  $('#game-root').innerHTML = `<div class="game-board"><div class="result-screen" aria-live="polite">
    <span class="medal" aria-hidden="true">${v.medal}</span>
    <h3>${v.title}</h3>
    <p class="big-score" id="final-score">SCORE: 0 / 100</p>
    <p>${v.msg}</p>
    <p><strong>${S.correct}</strong> correct first time · <strong>${S.incorrect}</strong> items needed a second try</p>
    <button type="button" class="btn btn--terra" data-act="start-classic">Play again</button>
  </div></div>`;
  countUp($('#final-score'), S.score, { format: (n) => `SCORE: ${n} / 100` });
}

/* ---------- Game 2: 30-second challenge ---------- */
let C = null;

function challengeMessage(score) {
  if (score >= 120) return { title: 'ECO LEGEND!', msg: 'Lightning-fast and accurate. The planet thanks you!', icon: '🏆' };
  if (score >= 70) return { title: 'GREEN MACHINE!', msg: 'Speedy sorting with great accuracy.', icon: '🌟' };
  if (score >= 30) return { title: 'GOOD START!', msg: 'Nice pace. Review the guide to sharpen your accuracy.', icon: '🌱' };
  return { title: 'WARM-UP DONE!', msg: 'Practice in Sort It Out, then try the challenge again.', icon: '📚' };
}

function buildQueue() {
  const a = shuffle(gameItems);
  const b = shuffle(gameItems);
  if (b[0].id === a[a.length - 1].id) b.push(b.shift());
  return [...a, ...b];
}

const challengeScore = () => Math.max(0, C.correct * 10 - C.wrong * 5);

function startChallenge() {
  stopTimer();          // never leave an old timer running
  resetHud();
  C = { queue: buildQueue(), index: 0, correct: 0, wrong: 0, time: CHALLENGE_SECONDS, last: null, playing: true };
  $('#game-root').innerHTML = `<div class="game-board">
    <h3 class="game-title">30-second sorting challenge</h3>
    <div class="hud" id="c-hud"></div>
    ${progressHtml('c-bar', 'Time remaining', 'timer-bar')}
    <div id="c-card"></div>
    ${binsHtml()}
    <p id="c-feedback" aria-live="polite" style="min-height:2.2em;margin:1rem 0 0;font-family:var(--font-type)"></p>
    <button type="button" class="btn btn--sm btn--cream" data-act="start-challenge">Restart</button>
  </div>`;
  updateChallenge(true);
  timerId = setInterval(() => {
    C.time--;
    updateChallenge(false);
    if (C.time <= 0) finishChallenge();
  }, 1000);
}

function updateChallenge(newItem) {
  setHud('c-hud', [
    { label: 'Time', value: Math.max(C.time, 0) },
    { label: 'Score', value: challengeScore() },
    { label: 'Items sorted', value: C.correct },
    { label: 'Mistakes', value: C.wrong },
  ]);
  setProgress('c-bar', (Math.max(C.time, 0) / CHALLENGE_SECONDS) * 100);
  if (newItem) $('#c-card').innerHTML = itemCardHtml(C.queue[C.index]);
  const fb = $('#c-feedback');
  if (fb && C.last) fb.textContent = C.last.ok ? `✔ ${C.last.name}: nice sort!` : `✘ ${C.last.name} belongs in ${C.last.bin}.`;
}

function challengePick(k) {
  if (!C || !C.playing) return;
  const item = C.queue[C.index];
  const ok = item.bin === k;
  if (ok) C.correct++; else C.wrong++;
  C.last = { ok, name: item.name, bin: BINS[item.bin].label };
  if (C.index + 1 >= C.queue.length - 1) C.queue.push(...buildQueue());
  C.index++;
  updateChallenge(true);
}

function finishChallenge() {
  stopTimer();
  C.playing = false;
  const score = challengeScore();
  const m = challengeMessage(score);
  $('#game-root').innerHTML = `<div class="game-board"><div class="result-screen" aria-live="polite">
    <span class="medal" aria-hidden="true">${m.icon}</span>
    <h3>${m.title}</h3>
    <p class="game-sub">YOUR ECO SCORE</p>
    <p class="big-score" id="final-score">0</p>
    <p>${m.msg}</p>
    <p><strong>${C.correct}</strong> items sorted correctly · <strong>${C.wrong}</strong> mistakes</p>
    <button type="button" class="btn btn--terra" data-act="start-challenge">Play again</button>
  </div></div>`;
  countUp($('#final-score'), score);
}

function initGames() {
  const root = $('#game-root');
  showStart();

  $$('.game-tabs [data-mode]').forEach((btn) => btn.addEventListener('click', () => {
    stopTimer();
    if (C) C.playing = false;
    game.mode = btn.dataset.mode;
    $$('.game-tabs [data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    showStart();
  }));

  root.addEventListener('click', (e) => {
    const bin = e.target.closest('[data-bin]');
    if (bin) { game.mode === 'classic' ? sortPick(bin.dataset.bin) : challengePick(bin.dataset.bin); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    switch (act.dataset.act) {
      case 'start-classic': startSorting(); break;
      case 'start-challenge': startChallenge(); break;
      case 'sort-next': sortNext(); break;
      default: break;
    }
  });

  // Keys 1-4 pick a bin during the challenge
  document.addEventListener('keydown', (e) => {
    if (game.mode !== 'challenge' || !C || !C.playing || e.repeat) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 4) challengePick(BIN_KEYS[n - 1]);
  });

  // Always clear the timer if the page is closed or hidden for good
  window.addEventListener('pagehide', stopTimer);
}

/* ---------- Learn: eco loop + mistakes ---------- */
function initLearn() {
  const loop = $('#loop');
  const caption = $('#loop-caption');
  let step = null;
  loop.innerHTML = loopSteps.map((s, i) =>
    `<span style="display:contents"><button type="button" class="loop__node" data-step="${s.id}" aria-pressed="false">
       <span class="ic" aria-hidden="true">${s.icon}</span>${s.title}</button>${i < loopSteps.length - 1 ? '<span class="loop__arrow" aria-hidden="true">→</span>' : ''}</span>`).join('');
  loop.addEventListener('click', (e) => {
    const b = e.target.closest('.loop__node');
    if (!b) return;
    step = step === b.dataset.step ? null : b.dataset.step;
    $$('.loop__node', loop).forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.step === step)));
    const cur = loopSteps.find((s) => s.id === step);
    caption.textContent = cur ? `${cur.title}: ${cur.text}` : 'Tap a step to explore it.';
  });

  $('#mistake-grid').innerHTML = mistakes.map((m, i) => `
    <article class="mistake reveal" style="transition-delay:${i * 60}ms">
      <div class="mistake__myth"><span class="stamp">❌ MYTH</span><p>${m.myth}</p></div>
      <div class="mistake__reality"><span class="stamp">✔ REALITY</span><p>${m.reality}</p></div>
    </article>`).join('');
}

/* ---------- E-waste ---------- */
function initEwaste() {
  $('#device-row').innerHTML = ewasteItems.map((d) =>
    `<div class="device"><span class="emoji" aria-hidden="true">${d.emoji}</span><span class="n">${d.name}</span></div>`).join('');

  const list = $('#checklist');
  const status = $('#check-status');
  const reset = $('#check-reset');
  list.innerHTML = ewasteChecklist.map((t, i) =>
    `<li><label class="check-row"><input type="checkbox" data-i="${i}"><span class="check-box" aria-hidden="true"></span><span class="check-text">${t}</span></label></li>`).join('');

  const refresh = () => {
    const n = $$('input:checked', list).length;
    status.textContent = n === ewasteChecklist.length
      ? '🎉 All done! Your device is ready to go to an authorized collection point.'
      : `${n} of ${ewasteChecklist.length} steps done`;
    reset.disabled = n === 0;
  };
  list.addEventListener('change', refresh);
  reset.addEventListener('click', () => { $$('input', list).forEach((i) => { i.checked = false; }); refresh(); });
  refresh();
}

/* ---------- Impact counters + daily challenge ---------- */
function initImpact() {
  const wrap = $('#counters');
  wrap.innerHTML = demoStats.map((s) =>
    `<div class="counter"><div class="counter__num" aria-label="${s.value.toLocaleString()}${s.suffix}"><span aria-hidden="true" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</span></div><div class="counter__label">${s.label}</div></div>`).join('');

  const run = (counter) => {
    const el = $('[data-target]', counter);
    const suffix = el.dataset.suffix;
    countUp(el, Number(el.dataset.target), { duration: 1600, format: (n) => n.toLocaleString() + suffix });
  };
  const counters = $$('.counter', wrap);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach(run);
  }
}

function initDaily() {
  const root = $('#daily');
  const done = new Set();
  const dayIndex = () => {
    const now = new Date();
    return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000) % ecoChallenges.length;
  };
  let currentId = ecoChallenges[dayIndex()].id;
  const dateText = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  const render = (focusId) => {
    const cur = ecoChallenges.find((c) => c.id === currentId);
    const isDone = done.has(cur.id);
    root.innerHTML = `
      <div class="daily__card">
        <p class="daily__date">${dateText}</p>
        <h3>Today's eco challenge</h3>
        <p class="daily__title">${cur.title}</p>
        <p>${cur.tip}</p>
        ${isDone
          ? `<p class="daily__done" role="status">✓ Challenge complete! Thank you.</p><div><button type="button" class="btn btn--sm btn--cream" id="dc-toggle" data-toggle>Undo</button></div>`
          : `<button type="button" class="btn btn--green" id="dc-toggle" data-toggle>I did it ✓</button>`}
      </div>
      <div class="daily__list">
        <h4>Your challenges · ${done.size} of ${ecoChallenges.length} done</h4>
        <div class="progress" role="progressbar" aria-label="Eco challenges completed" aria-valuemin="0" aria-valuemax="${ecoChallenges.length}" aria-valuenow="${done.size}" style="margin-bottom:0.8rem"><div class="progress__bar" style="width:${(done.size / ecoChallenges.length) * 100}%"></div></div>
        <ul>${ecoChallenges.map((c) => `
          <li data-current="${c.id === currentId}"><span aria-hidden="true">${done.has(c.id) ? '✅' : '⬜'}</span>
            <button type="button" data-pick="${c.id}" id="dc-${c.id}" ${c.id === currentId ? 'aria-current="true"' : ''}>${c.title}${done.has(c.id) ? '<span class="sr-only"> (completed)</span>' : ''}</button></li>`).join('')}
        </ul>
        <p style="font-size:0.85rem;margin:0.8rem 0 0;font-family:var(--font-type)">Progress lives in this page only and resets when you refresh.</p>
      </div>`;
    if (focusId) { const el = document.getElementById(focusId); if (el) el.focus(); }
  };

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-toggle]')) {
      if (done.has(currentId)) done.delete(currentId); else done.add(currentId);
      render('dc-toggle');
      return;
    }
    const pick = e.target.closest('[data-pick]');
    if (pick) { currentId = pick.dataset.pick; render('dc-' + currentId); }
  });
  render();
}

/* ---------- Eco quiz ---------- */
function initQuiz() {
  const root = $('#quiz-root');
  const total = quizQuestions.length;
  const LETTERS = ['A', 'B', 'C', 'D'];
  const Q = { i: 0, picked: null, score: 0, finished: false };
  $('#quiz-intro').textContent = `${total} quick questions. Answer, then read the explanation.`;

  const grade = (pct) => {
    if (pct === 100) return { title: 'ECO EXPERT!', icon: '🏆', msg: 'Perfect score! Share what you know with friends and family.' };
    if (pct >= 70) return { title: 'WELL DONE!', icon: '🌟', msg: 'Strong knowledge. Review the explanations to close the gaps.' };
    if (pct >= 40) return { title: 'GOOD EFFORT!', icon: '🌱', msg: 'You are on the way. Explore the Waste Guide and try again.' };
    return { title: 'KEEP EXPLORING!', icon: '📚', msg: 'Read the guide and take the quiz again. Every step counts.' };
  };

  const render = () => {
    if (Q.finished) {
      const g = grade((Q.score / total) * 100);
      root.innerHTML = `<div class="result-screen" aria-live="polite">
        <span class="medal" aria-hidden="true">${g.icon}</span><h3>${g.title}</h3>
        <p class="big-score" id="q-final">0 / ${total}</p><p>${g.msg}</p>
        <button type="button" class="btn btn--terra" data-act="restart">Retake quiz</button></div>`;
      countUp($('#q-final'), Q.score, { duration: 900, format: (n) => `${n} / ${total}` });
      return;
    }
    const q = quizQuestions[Q.i];
    const answered = Q.picked !== null;
    const pct = ((Q.i + (answered ? 1 : 0)) / total) * 100;
    root.innerHTML = `
      <p class="game-sub" style="margin:0">Question ${Q.i + 1} of ${total} · Score ${Q.score}</p>
      <div class="progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><div class="progress__bar" style="width:${pct}%"></div></div>
      <h3 class="quiz-q" id="quiz-q">${q.q}</h3>
      <div class="options" role="group" aria-labelledby="quiz-q">
        ${q.options.map((opt, i) => {
          let cls = '';
          let sr = '';
          if (answered) {
            if (i === q.answer) { cls = 'is-correct'; sr = ' (correct answer)'; }
            else if (i === Q.picked) { cls = 'is-wrong'; sr = ' (your answer, incorrect)'; }
            else cls = 'is-dim';
          }
          return `<button type="button" class="option ${cls}" data-opt="${i}" ${answered ? 'disabled' : ''}><span class="letter" aria-hidden="true">${LETTERS[i]}</span><span>${opt}</span>${sr ? `<span class="sr-only">${sr}</span>` : ''}</button>`;
        }).join('')}
      </div>
      <div aria-live="polite">${answered ? `
        <div class="feedback ${Q.picked === q.answer ? 'feedback--good' : 'feedback--bad'}">
          <h3>${Q.picked === q.answer ? 'CORRECT! ♻️' : 'NOT QUITE!'}</h3>
          <p><strong>Answer: ${LETTERS[q.answer]}. ${q.options[q.answer]}.</strong> ${q.explain}</p>
          <button type="button" class="btn btn--green" id="q-next" data-act="next">${Q.i + 1 >= total ? 'See my score' : 'Next question →'}</button>
        </div>` : ''}</div>`;
    if (answered) $('#q-next').focus();
  };

  root.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-opt]');
    if (opt && Q.picked === null) {
      Q.picked = Number(opt.dataset.opt);
      if (Q.picked === quizQuestions[Q.i].answer) Q.score++;
      render();
      return;
    }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'next') {
      if (Q.i + 1 >= total) Q.finished = true; else { Q.i++; Q.picked = null; }
      render();
    } else if (act.dataset.act === 'restart') {
      Q.i = 0; Q.picked = null; Q.score = 0; Q.finished = false;
      render();
    }
  });
  render();
}

/* ---------- Footer ---------- */
function initFooter() {
  const btn = $('#about-toggle');
  const about = $('#about');
  btn.addEventListener('click', () => {
    about.hidden = !about.hidden;
    btn.setAttribute('aria-expanded', String(!about.hidden));
  });
}

/* ---------- Start ---------- */
initDecor();
initNav();
initIdentifier();
initGuide();
initGames();
initLearn();
initEwaste();
initImpact();
initDaily();
initQuiz();
initFooter();
observeReveal();
