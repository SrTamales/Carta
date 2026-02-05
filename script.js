// =======================
// SVG + ANIMACIÓN
// =======================
fetch('./img/lirios.svg')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar el SVG');
    return res.text();
  })
  .then(svgText => {

    const container = document.getElementById('tree-container');
    if (!container) return;

    container.innerHTML = svgText;

    const svg = container.querySelector('svg');
    if (!svg) return;

    const allPaths = Array.from(svg.querySelectorAll('path'));

    // ===== DEFS =====
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="lirio-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#444"/>
        <stop offset="100%" stop-color="#111"/>
      </linearGradient>

      <radialGradient id="lirio-fill">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="60%" stop-color="#f6f6f6"/>
        <stop offset="100%" stop-color="#e9e9e9"/>
      </radialGradient>

      <filter id="lirio-glow">
        <feGaussianBlur stdDeviation="0.8" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
    svg.insertBefore(defs, svg.firstChild);

    // ===== PREPARAR PATHS =====
    allPaths.forEach(path => {
      const length = path.getTotalLength();
      path.style.stroke = 'url(#lirio-stroke)';
      path.style.strokeWidth = '1.6';
      path.style.fill = 'url(#lirio-fill)';
      path.style.fillOpacity = '0';
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.vectorEffect = 'non-scaling-stroke';
    });

    // ===== DIBUJO =====
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition =
          `stroke-dashoffset 1.3s cubic-bezier(.65,0,.2,1) ${i * 0.08}s,
           fill-opacity 0.6s ${1 + i * 0.08}s`;

        path.style.strokeDashoffset = 0;

        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.filter = 'url(#lirio-glow)';
        }, 1300 + i * 80);
      });
    }, 80);

    // ===== EVENTOS POST-ANIMACIÓN =====
    const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
    setTimeout(() => {
      svg.classList.add('move-and-scale');
      setTimeout(() => {
        showDedicationText();
        startFloatingObjects();
        showCountdown();
        playBackgroundMusic();
      }, 1200);
    }, totalDuration);
  })
  .catch(err => console.error(err));


// =======================
// TEXTO
// =======================
function getURLParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function showDedicationText() {
  const container = document.getElementById('dedication-text');
  if (!container) return;

  const mensaje =
    getURLParam('mensaje')
      ? decodeURIComponent(getURLParam('mensaje')).replace(/\\n/g, '\n')
      : `Para mi niña hermosa:\n\nDesde que llegaste, mi mundo es más bonito contigo.`;

  container.textContent = mensaje;
  showSignature();
}


// =======================
// FIRMA
// =======================
function showSignature() {
  const dedication = document.getElementById('dedication-text');
  if (!dedication) return;

  let signature = dedication.querySelector('.signature');

  if (!signature) {
    signature = document.createElement('div');
    signature.className = 'signature';
    dedication.appendChild(signature);
  }

  const firma = getURLParam('firma');
  signature.textContent = firma
    ? decodeURIComponent(firma)
    : '¿Quieres ser mi novia?';

  signature.classList.add('visible');
}


// =======================
// PÉTALOS
// =======================
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  if (!container) return;

  let count = 0;

  function spawn() {
    const el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = '110%';
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 80;

    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1s`;
      el.style.transform = `translate(${drift}px, -120vh)`;
      el.style.opacity = 0;
    }, 30);

    setTimeout(() => el.remove(), duration + 500);
    setTimeout(spawn, count++ < 30 ? 400 : 1200);
  }

  spawn();
}


// =======================
// CONTADOR
// =======================
function showCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  const startDate = new Date('2025-09-05T18:36:00');
  const eventDate = new Date('2026-09-05T18:36:00');

  function update() {
    const now = new Date();
    const days = Math.floor((now - startDate) / 86400000);
    const diff = eventDate - now;

    const d = Math.max(0, Math.floor(diff / 86400000));
    const h = Math.max(0, Math.floor(diff / 3600000) % 24);
    const m = Math.max(0, Math.floor(diff / 60000) % 60);
    const s = Math.max(0, Math.floor(diff / 1000) % 60);

    container.innerHTML =
      `Llevamos juntos: <b>${days}</b> días<br>` +
      `Nuestro aniversario: <b>${d}d ${h}h ${m}m ${s}s</b>`;

    container.classList.add('visible');
  }

  update();
  setInterval(update, 1000);
}


// =======================
// MÚSICA
// =======================
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  audio.volume = 0.7;
  audio.loop = true;

  audio.play().catch(() => {
    document.addEventListener('click', () => audio.play(), { once: true });
  });
}
