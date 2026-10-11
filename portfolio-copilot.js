// Archivo creado por Copilot: portfolio-copilot.js
document.documentElement.classList.add('js');

const cabecera = document.getElementById('cabecera');
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');

window.addEventListener('scroll', () => {
  cabecera.classList.toggle('scroll', window.scrollY > 10);
}, { passive: true });

menuBtn.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  menuBtn.setAttribute('aria-expanded', abierto);
});
menu.addEventListener('click', e => {
  if (e.target.closest('a')) {
    menu.classList.remove('abierto');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// Aparición suave de los bloques
const revelar = document.querySelectorAll('.bloque, .cifras, .contacto, .proyecto');
revelar.forEach(el => el.classList.add('reveal'));
const obsReveal = new IntersectionObserver((entradas) => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      obsReveal.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
revelar.forEach(el => obsReveal.observe(el));

// Enlace activo según la sección visible
const enlaces = [...menu.querySelectorAll('a:not(.menu-cta)')];
const obsSec = new IntersectionObserver((entradas) => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      enlaces.forEach(a => a.classList.toggle('actual', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
enlaces.forEach(a => {
  const sec = document.querySelector(a.getAttribute('href'));
  if (sec) obsSec.observe(sec);
});

// Contadores de la franja de cifras
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const obsCifras = new IntersectionObserver((entradas) => {
  entradas.forEach(en => {
    if (!en.isIntersecting) return;
    obsCifras.unobserve(en.target);
    en.target.querySelectorAll('[data-cuenta]').forEach(n => {
      const meta = +n.dataset.cuenta;
      if (reducido) return;
      const inicio = performance.now();
      const paso = t => {
        const p = Math.min((t - inicio) / 900, 1);
        n.textContent = Math.round(meta * p);
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  });
}, { threshold: 0.5 });
obsCifras.observe(document.querySelector('.cifras'));

// Filtro de proyectos
const filtros = document.querySelectorAll('.filtro');
filtros.forEach(btn => btn.addEventListener('click', () => {
  filtros.forEach(b => b.classList.toggle('activo', b === btn));
  document.querySelectorAll('.proyecto').forEach(p => {
    p.hidden = btn.dataset.filtro !== 'todos' && p.dataset.tipo !== btn.dataset.filtro;
  });
}));

// Copiar correo
const copiar = document.getElementById('copiarMail');
const aviso = document.getElementById('aviso');
copiar.addEventListener('click', async () => {
  const mail = copiar.dataset.mail;
  try {
    await navigator.clipboard.writeText(mail);
    aviso.textContent = 'Correo copiado: ' + mail;
  } catch {
    aviso.textContent = 'Mi correo es ' + mail;
  }
});
