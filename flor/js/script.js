const $ = (id) => document.getElementById(id);
const R = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HEART = document.body.dataset.mode === 'sobre';

const M = [
  'Sé que todavía faltan unos días para el 25 y el 26 pero la verdad no quería esperar a que fuera una fecha especial para tener este detallito contigo porque cualquier día es bueno para recordarte lo mucho que te amo',
  'Quién diría que desde aquel 25 que empezamos a hablar y ese 26 que te vi por primera vez te ibas a convertir en una personita tan especial para mí y cómo olvidar ese 03 en el que te convertiste en mi novia y me hiciste demasiado feliz',
  'No tienes idea de cuánto me encantas desde lo pequeñita que eres y lo tierna que te ves hasta esos ojitos tan lindos que tienes y que podría mirar durante horas sin cansarme',
  'Pero más allá de eso me encanta tu forma de ser la manera en la que me tratas y esa tranquilidad que me transmites cuando estoy contigo me encanta poder ser yo mismo contigo y sentir que me quieres tal y como soy',
  'Quería darte estas florecitas porque me nace hacerlo y porque quiero recordarte lo especial que eres para mí y lo feliz que me hace tenerte en mi vida',
  'Sé que llevamos poquito tiempo pero quiero vivir muchas cosas a tu lado crear demasiados recuerdos contigo cumplir nuestras metas y algún día construir ese futuro juntos'
];

const LOW = innerWidth < 700 || (navigator.hardwareConcurrency || 8) <= 4;
const c = $('stars');
const x = c.getContext('2d');
const dpr = Math.min(devicePixelRatio || 1, LOW ? 1.5 : 2);

let W, H;
let mx = 0;
let my = 0;
let shoot = [];
let parts = [];
let amb = [];

function rs() {
  W = innerWidth;
  H = innerHeight;
  c.width = W * dpr;
  c.height = H * dpr;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
}
rs();

let lw = innerWidth;
addEventListener('resize', () => {
  if (innerWidth === lw && Math.abs(innerHeight - H) < 150) return;
  lw = innerWidth;
  rs();
  if (R) draw(0);
});

addEventListener('pointermove', (e) => {
  mx = e.clientX / W - 0.5;
  my = e.clientY / H - 0.5;
});

const S = Array.from({ length: LOW ? 80 : 170 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.6 + 0.2,
  p: Math.random() * 6,
  z: Math.random()
}));

function mk(init) {
  return {
    x: Math.random() * W,
    y: init ? Math.random() * H : HEART ? H + 20 : -20,
    s: 7 + Math.random() * 9,
    vy: (HEART ? -1 : 1) * (0.3 + Math.random() * 0.6),
    ph: Math.random() * 6,
    rot: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.03,
    c: Math.random()
  };
}

if (!R) {
  for (let i = 0; i < (LOW ? 8 : 16); i++) {
    amb.push(mk(true));
  }
}

function shape(p, al) {
  x.save();
  x.translate(p.x, p.y);
  x.rotate(p.rot);
  x.globalAlpha = Math.max(al, 0);
  x.fillStyle = `hsl(${275 + p.c * 45} 80% ${68 + p.c * 14}%)`;
  if (HEART) {
    x.font = `${p.s * 1.7}px serif`;
    x.textAlign = 'center';
    x.fillText('♥', 0, 0);
  } else {
    x.beginPath();
    x.ellipse(0, 0, p.s * 0.5, p.s, 0, 0, 6.3);
    x.fill();
  }
  x.restore();
}

let lt = 0;
function draw(t) {
  if (!R && LOW && t - lt < 33) {
    requestAnimationFrame(draw);
    return;
  }
  lt = t;
  x.clearRect(0, 0, W, H);

  for (const s of S) {
    x.globalAlpha = 0.4 + 0.4 * Math.sin(R ? s.p : t / 1200 + s.p);
    x.fillStyle = '#e7caff';
    x.beginPath();
    x.arc(s.x * W + mx * s.z * 34, s.y * H + my * s.z * 34, s.r, 0, 6.3);
    x.fill();
  }

  if (R) return;

  if (Math.random() < 0.007) {
    shoot.push({ x: Math.random() * W * 0.8, y: Math.random() * H * 0.4, l: 0 });
  }
  shoot = shoot.filter((m) => m.l < 1);
  for (const m of shoot) {
    m.l += 0.025;
    m.x += 9;
    m.y += 4.5;
    const g = x.createLinearGradient(m.x, m.y, m.x - 80, m.y - 40);
    g.addColorStop(0, '#fff');
    g.addColorStop(1, '#fff0');
    x.globalAlpha = 1 - m.l;
    x.strokeStyle = g;
    x.lineWidth = 1.6;
    x.beginPath();
    x.moveTo(m.x, m.y);
    x.lineTo(m.x - 80, m.y - 40);
    x.stroke();
  }

  amb.forEach((p, i) => {
    p.y += p.vy;
    p.x += Math.sin(t / 900 + p.ph) * 0.5;
    p.rot += p.vr;
    shape(p, 0.55);
    if (p.y > H + 30 || p.y < -30) amb[i] = mk(false);
  });

  parts = parts.filter((p) => p.life > 0);
  for (const p of parts) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.vx *= 0.985;
    p.rot += p.vr;
    p.life -= 0.011;
    shape(p, p.life);
  }

  requestAnimationFrame(draw);
}
draw(0);

function burst(px, py, n) {
  if (R || parts.length > 160) return;
  n = LOW ? Math.ceil(n * 0.55) : n;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.3;
    const v = 2 + Math.random() * 5;
    parts.push({
      x: px,
      y: py,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 2.5,
      life: 1,
      rot: a,
      vr: (Math.random() - 0.5) * 0.2,
      s: 6 + Math.random() * 8,
      c: Math.random()
    });
  }
}

addEventListener('pointerdown', (e) => {
  if (!e.target.closest('#sound')) burst(e.clientX, e.clientY, 9);
});

let pend = [];
function show(v) {
  pend.forEach(clearTimeout);
  pend = [];
  $('cover').hidden = v;
  $('letter').hidden = !v;
  $('finale').hidden = true;
  scrollTo(0, 0);
  if (!v) return;

  const box = $('message');
  box.replaceChildren();
  let t = R ? 0 : 900;

  M.forEach((m, idx) => {
    const ws = m.split(' ');
    pend.push(
      setTimeout(() => {
        const p = document.createElement('p');
        ws.forEach((w, i) => {
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = w;
          s.style.animationDelay = (R ? 0 : i * 0.05) + 's';
          p.append(s, ' ');
        });
        box.append(p);
        if (idx > 0) {
          p.scrollIntoView({ behavior: R ? 'auto' : 'smooth', block: 'nearest' });
        }
      }, t)
    );
    t += R ? 0 : ws.length * 50 + 1200;
  });

  pend.push(
    setTimeout(() => {
      $('finale').hidden = false;
      $('finale').scrollIntoView({ behavior: R ? 'auto' : 'smooth', block: 'center' });
      burst(innerWidth / 2, innerHeight / 2, 60);
    }, t)
  );
}

$('heart').onclick = () => {
  const b = $('heart');
  if (b.disabled) return;
  b.disabled = true;
  b.classList.add('opening');
  const r = b.getBoundingClientRect();
  setTimeout(() => burst(r.left + r.width / 2, r.top + r.height * 0.3, 70), R ? 0 : 800);
  setTimeout(() => {
    show(true);
    b.classList.remove('opening');
    b.disabled = false;
  }, R ? 0 : 2000);
};

$('back').onclick = () => show(false);

const photoCard = $('photo-card');
if (photoCard) {
  photoCard.onclick = (e) => {
    const r = photoCard.getBoundingClientRect();
    burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2, 35);
  };
}

/* Música ambiental generada con Web Audio API */
let audio;
let timer;
let playing = false;
let out;
let step = 0;
const btn = $('sound');

const CH = [
  [48, 60, 64, 67, 72],
  [43, 59, 62, 67, 71],
  [45, 60, 64, 69, 72],
  [40, 59, 64, 67, 71],
  [41, 57, 60, 65, 69],
  [48, 60, 64, 67, 72],
  [41, 57, 60, 65, 69],
  [43, 59, 62, 67, 71]
];
const ML = [
  [76, 74],
  [71, 74],
  [72, 69],
  [71, 67],
  [69, 72],
  [76, 72],
  [77, 72],
  [74, 71]
];
const AP = [1, 2, 3, 4, 3, 2, 3, 2];

function setup() {
  audio = new (window.AudioContext || window.webkitAudioContext)();
  out = audio.createGain();
  const L = audio.sampleRate * 2;
  const b = audio.createBuffer(2, L, audio.sampleRate);
  for (let k = 0; k < 2; k++) {
    const d = b.getChannelData(k);
    for (let i = 0; i < L; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / L, 2.5);
    }
  }
  const cv = audio.createConvolver();
  const w = audio.createGain();
  cv.buffer = b;
  w.gain.value = 0.55;
  out.connect(audio.destination);
  out.connect(cv);
  cv.connect(w);
  w.connect(audio.destination);
}

function ping(m, v, d) {
  const t = audio.currentTime;
  const f = 440 * 2 ** ((m - 69) / 12);
  const o = audio.createOscillator();
  const o2 = audio.createOscillator();
  const g = audio.createGain();
  const g2 = audio.createGain();
  o.type = 'sine';
  o2.type = 'triangle';
  o.frequency.value = f;
  o2.frequency.value = f * 2;
  g2.gain.value = 0.25;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(v, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g);
  o2.connect(g2);
  g2.connect(g);
  g.connect(out);
  o.start(t);
  o2.start(t);
  o.stop(t + d + 0.1);
  o2.stop(t + d + 0.1);
}

function tick() {
  const cIdx = Math.floor(step / 8) % 8;
  const s = step % 8;
  const ch = CH[cIdx];
  if (s === 0) {
    ping(ch[0], 0.13, 3.6);
    ping(ch[0] - 12, 0.08, 3.6);
  }
  ping(ch[AP[s]], 0.055, 1.8);
  if (s % 4 === 0) {
    ping(ML[cIdx][s / 4], 0.1, 2.6);
  }
  step++;
}

btn.onclick = async () => {
  try {
    if (playing) {
      playing = false;
      clearInterval(timer);
      await audio.suspend();
      btn.textContent = '♫ Música';
      btn.setAttribute('aria-pressed', 'false');
      return;
    }
    if (!audio) setup();
    await audio.resume();
    playing = true;
    btn.textContent = 'Ⅱ Pausar';
    btn.setAttribute('aria-pressed', 'true');
    tick();
    timer = setInterval(tick, 480);
  } catch (e) {
    btn.textContent = 'Audio no disponible';
  }
};

/* Constelación en forma de corazón */
const svg = $('constellation');
const NS = 'http://www.w3.org/2000/svg';
const pts = [];

for (let i = 0; i < 86; i++) {
  const t = (i / 86) * Math.PI * 2;
  pts.push([
    140 + 7.1 * 16 * Math.sin(t) ** 3,
    105 - 7.1 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  ]);
}

const ln = document.createElementNS(NS, 'path');
ln.setAttribute('class', 'ln');
ln.setAttribute('pathLength', '1');
ln.setAttribute('d', 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z');
svg.append(ln);

pts.forEach((p, i) => {
  const d = document.createElementNS(NS, 'circle');
  d.setAttribute('cx', p[0]);
  d.setAttribute('cy', p[1]);
  d.setAttribute('r', i % 7 === 0 ? 2.8 : 1.5);
  d.style.setProperty('--dx', Math.cos(i * 2.4) * 110 + 'px');
  d.style.setProperty('--dy', Math.sin(i * 2.4) * 90 + 'px');
  d.style.setProperty('--delay', (i % 9) * 0.055 + 's');
  svg.append(d);
});
