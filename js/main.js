/* ════════════════════════════════════════════════
   TRASTES — js/main.js
   ────────────────────────────────────────────────
   1 · Hero fade-up al cargar
   2 · Reveal palabra-por-palabra en principios
   3 · IntersectionObserver para scroll reveals
   4 · Parallax suave en imagen del taller
   5 · Hover interactivo en maderas
════════════════════════════════════════════════ */

'use strict';

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ════════════════════════════════════════════════
   1 · HERO FADE-UP
   Se dispara al DOMContentLoaded para que el
   CSS de opacidad: 0 ya esté pintado.
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      qsa('.anim-fade-up').forEach(el => el.classList.add('is-visible'));
    });
  });
});


/* ════════════════════════════════════════════════
   2 · WORD REVEAL — principios
   Recorre los nodos del párrafo y envuelve cada
   palabra en <span class="word">, preservando
   etiquetas como <strong>.
════════════════════════════════════════════════ */
function wrapWords(el) {
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (/\S/.test(part)) {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = part;
          frag.appendChild(span);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      return frag;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      [...node.childNodes].forEach(child => clone.appendChild(processNode(child)));
      return clone;
    }
    return node.cloneNode(true);
  };

  const frag = document.createDocumentFragment();
  [...el.childNodes].forEach(child => frag.appendChild(processNode(child)));
  el.innerHTML = '';
  el.appendChild(frag);
}

const quoteEl = qs('.js-word-reveal');
if (quoteEl) wrapWords(quoteEl);


/* ════════════════════════════════════════════════
   3 · INTERSECTION OBSERVER — scroll reveals
════════════════════════════════════════════════ */
const ioOpts = { threshold: 0.18, rootMargin: '0px 0px -30px 0px' };

/* ── Reveals genéricos (slide-left, slide-right, fade-reveal) ── */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealIO.unobserve(entry.target);
  });
}, ioOpts);

/* Stagger para los pasos del proceso */
qsa('.proceso__row').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.16}s`;
  revealIO.observe(el);
});

qsa('.anim-fade-reveal').forEach(el => revealIO.observe(el));

/* ── Word reveal de principios ── */
const wordIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    qsa('.word', entry.target).forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), i * 42);
    });
    wordIO.unobserve(entry.target);
  });
}, { threshold: 0.3 });

if (quoteEl) wordIO.observe(quoteEl);


/* ════════════════════════════════════════════════
   4 · PARALLAX — imagen del taller
   Hace un leve zoom-in + desplazamiento vertical
   a medida que el usuario hace scroll.
════════════════════════════════════════════════ */
const parallaxImg = qs('.js-parallax');

if (parallaxImg) {
  const section = parallaxImg.closest('.taller');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const { top, height } = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (top < vh && top + height > 0) {
        const progress = (vh - top) / (vh + height); // 0 → 1
        const yShift   = (progress - 0.5) * 44;      // ±22 px
        const scale    = 1.06 + progress * 0.04;
        parallaxImg.style.transform = `scale(${scale}) translateY(${yShift}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}


/* ════════════════════════════════════════════════
   5 · MADERAS — hover interactivo
   Al pasar el cursor sobre una card:
   · La card activa escala levemente
   · Las demás se atenúan
   · El panel de texto muestra la descripción
════════════════════════════════════════════════ */
const woodData = [
  {
    name: 'Cedro',
    desc: 'Cálido y resonante. El cedro aporta claridad en los agudos con un cuerpo medio pronunciado. Es la elección clásica para instrumentos que buscan calidez sin sacrificar proyección.'
  },
  {
    name: 'Picea',
    desc: 'La madera de las tapas acústicas por excelencia. Su ligereza extrema combinada con rigidez excepcional produce un sonido brillante y articulado que mejora con los años.'
  },
  {
    name: 'Caoba',
    desc: 'Rica, oscura y con cuerpo. La caoba enfatiza los medios-bajos y genera un sustain largo y cálido: el material que da carácter a los sonidos más icónicos del rock y el blues.'
  },
  {
    name: 'Palisandro',
    desc: 'Densa y compleja. Ofrece agudos cristalinos, bajos profundos y una respuesta dinámica amplia. Su veta oscura la convierte en protagonista visual del instrumento.'
  }
];

const cards   = qsa('.wood-card');
const descEl  = qs('#maderaDesc');
const DEFAULT_DESC = 'Seleccioná una madera para descubrir qué sonido evoca.';

function setDesc(text) {
  if (!descEl) return;
  descEl.style.opacity = '0';
  setTimeout(() => {
    descEl.textContent = text;
    descEl.style.opacity = '1';
  }, 190);
}

cards.forEach(card => {
  const idx = parseInt(card.dataset.index, 10);

  card.addEventListener('mouseenter', () => {
    cards.forEach(c =>
      c === card
        ? (c.classList.add('is-active'), c.classList.remove('is-dimmed'))
        : (c.classList.add('is-dimmed'), c.classList.remove('is-active'))
    );
    setDesc(woodData[idx].desc);
  });

  card.addEventListener('mouseleave', () => {
    cards.forEach(c => c.classList.remove('is-active', 'is-dimmed'));
    setDesc(DEFAULT_DESC);
  });
});
