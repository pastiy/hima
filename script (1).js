'use strict';

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('gone'), 1900);
});

/* ── DARK MODE ── */
const darkBtn = document.getElementById('darkBtn');
const darkIco = document.getElementById('darkIco');
const body    = document.body;
if (localStorage.getItem('hm-theme') === 'dark') setDark();
darkBtn?.addEventListener('click', () => {
  body.classList.contains('dark') ? setLight() : setDark();
});
function setDark()  { body.classList.add('dark');    darkIco.className = 'fas fa-sun';  localStorage.setItem('hm-theme','dark'); }
function setLight() { body.classList.remove('dark'); darkIco.className = 'fas fa-moon'; localStorage.setItem('hm-theme','light'); }

/* ── NAVBAR ── */
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const links   = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  highlightNav();
}, { passive: true });

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
links.forEach(l => l.addEventListener('click', () => {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}));

function highlightNav() {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 90) cur = s.id;
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
  });
}
highlightNav();

/* ── PARTICLE CANVAS ── */
(function () {
  const c = document.getElementById('canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = c.width  = c.offsetWidth;
    H = c.height = c.offsetHeight;
    pts = Array.from({ length: Math.floor(W * H / 13000) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.6 + .4, a: Math.random() * .45 + .1
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77,166,255,${p.a})`;
      ctx.fill();
      pts.forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(10,102,255,${.14 * (1 - d / 100)})`;
          ctx.lineWidth = .5;
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  })();
})();

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target); } });
}, { threshold: .1, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── SCROLL TO TOP ── */
const stb = document.getElementById('scrollTop');
window.addEventListener('scroll', () => stb?.classList.toggle('show', window.scrollY > 350), { passive: true });
stb?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── SMOOTH ANCHOR ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' });
  });
});
