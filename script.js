document.addEventListener("DOMContentLoaded", () => {

  const textEl = document.getElementById("dedication-text");
  const countdownEl = document.getElementById("countdown");
  const floating = document.getElementById("floating-objects");

});

fetch('Img/lirios.svg')
  .then(res => res.text())
  .then(svgText => {

    const container = document.getElementById('tree-container');
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
      path.style.strokeLinecap = 'round';
      path.style.strokeLinejoin = 'round';
      path.style.vectorEffect = 'non-scaling-stroke';

      path.style.fill = 'url(#lirio-fill)';
      path.style.fillOpacity = '0';

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
      
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;

setTimeout(() => {
  svg.classList.add('move-and-scale');

  setTimeout(() => {
    showDedicationText();      // ✉️ carta
    startFloatingObjects();    // 🌸 pétalos
    showCountdown();           // ⏳ contador
    playBackgroundMusic();     // 🎵 música
  }, 1200);

}, totalDuration);

    });
    // ===== ANIMACIÓN =====
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
}, 60);

function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { 
  const container = document.getElementById('dedication-text');
  if (!container) return;

  let text = getURLParam('text');
  if (!text) {
    text = `Para mi niña hermosa:\n\n A veces pienso que conocerte no solo fue casualidad, fue causalidad. Es como si el universo se hubiera empeñado en que nuestros hilos nunca se soltaran del todo, y por eso seguimos aquí, cuidándonos y compartiendo la vida como si el tiempo no hubiera pasado.La realidad es que, aunque nunca nos fuimos, mi corazón te sigue eligiendo en cada silencio y en cada risa. No me conformo con solo tenerte cerca; te quiero conmigo, de verdad y para siempre. Quiero que volvamos a ser ese 'nosotros' que nos hacía brillar, porque mi vida es mucho más bonita si puedo llamarte mi novia. Por eso, con todo lo que siento, te hago esta pregunta.`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }

  container.textContent = '';
  let i = 0;

  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i++);
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

function showSignature() {
  const dedication = document.getElementById('dedication-text');

  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }

  let firma = getURLParam('firma');
  signature.textContent = firma
    ? decodeURIComponent(firma)
    : "¿Quieres ser mi novia?";

  signature.classList.add('visible');
}

function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;

  function spawn() {
    const el = document.createElement('div');
    el.className = 'floating-petal';

    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `110%`;

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
function showCountdown() {
  const container = document.getElementById('countdown');

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

    // ===== ANIMACIÓN =====
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
    }, 60);

  });

    
// 🔓 Desbloquear música en la primera interacción del usuario
let musicUnlocked = false;

function unlockMusicOnFirstInteraction() {
  if (musicUnlocked) return;
  musicUnlocked = true;

  const audio = document.getElementById('bg-music');
  if (!audio) return;

  audio.play().then(() => {
    const btn = document.getElementById('music-btn');
    if (btn) btn.textContent = '🔊 Música';
  }).catch(() => {});

  document.removeEventListener('click', unlockMusicOnFirstInteraction);
  document.removeEventListener('touchstart', unlockMusicOnFirstInteraction);
}

// Escucha cualquier interacción real
document.addEventListener('click', unlockMusicOnFirstInteraction);
document.addEventListener('touchstart', unlockMusicOnFirstInteraction);


    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });


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
    }, 50);


    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  ;


function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { 
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida: Eres la persona más especial que jamas conocere princesa, te amo con todo lo que puedo `;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
 
      setTimeout(showSignature, 600);
    }
  }
  type();
}


function showSignature() {

  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor, Felipe";
  signature.classList.add('visible');
}



function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';



    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);


    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);


setTimeout(() => {
  el.remove();
}, duration + 500);

 
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-09-05T18:36:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2026-09-05T18:36:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Llevamos juntos: <b>${days}</b> días<br>` +
      `Nuestro aniversario: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    // Decodifica y previene rutas maliciosas
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  // Intentar reproducir inmediatamente
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    // Si falla el autoplay, esperar click en el botón
    btn.textContent = '▶️ Música';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
  document.addEventListener('DOMContentLoaded', () => {
  showDedicationText();
  showCountdown();
});

});
