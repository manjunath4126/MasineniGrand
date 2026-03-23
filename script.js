/* =============================================
   HOTEL MASINENI GRAND — Shared JavaScript
   Works across all pages
   ============================================= */

'use strict';

// ── CURSOR GLOW (desktop only) ─────────────────
if (window.innerWidth > 1024) {
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const animCursor = () => {
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    cursorGlow.style.left = gx + 'px';
    cursorGlow.style.top = gy + 'px';
    requestAnimationFrame(animCursor);
  };
  animCursor();
}

// ── NAVBAR SCROLL ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE NAV ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const [s1, , s3] = hamburger.querySelectorAll('span');
    hamburger.querySelectorAll('span')[1].style.opacity = open ? '0' : '';
    s1.style.transform = open ? 'rotate(45deg) translateY(7px)' : '';
    s3.style.transform = open ? 'rotate(-45deg) translateY(-7px)' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── ACTIVE NAV LINK based on current page ─────
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || (page === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });
})();

// ── SCROLL REVEAL ──────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

// ── HERO PARALLAX ──────────────────────────────
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }, { passive: true });
}

// ── DEFAULT BOOKING DATES ──────────────────────
(function setDates() {
  const ci = document.getElementById('checkIn');
  const co = document.getElementById('checkOut');
  if (!ci || !co) return;
  const pad = n => String(n).padStart(2, '0');
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const t = new Date(), t1 = new Date(t), t2 = new Date(t);
  t1.setDate(t.getDate() + 1);
  t2.setDate(t.getDate() + 2);
  ci.min = fmt(t1); ci.value = fmt(t1);
  co.min = fmt(t2); co.value = fmt(t2);
  ci.addEventListener('change', () => {
    const sel = new Date(ci.value);
    const next = new Date(sel); next.setDate(sel.getDate() + 1);
    co.min = fmt(next);
    if (new Date(co.value) <= sel) co.value = fmt(next);
  });
})();

// ── BOOKING FORM ───────────────────────────────
function handleBooking(e) {
  e.preventDefault();
  const ci = document.getElementById('checkIn')?.value;
  const co = document.getElementById('checkOut')?.value;
  const rt = document.getElementById('roomType');
  const room = rt ? rt.options[rt.selectedIndex].text : 'Selected Room';
  const g = document.getElementById('guests')?.value || '2';
  const prices = { 'Executive Single': 3300, 'Premium Single': 3600, 'Suite': 8500 };
  const nights = ci && co ? Math.max(1, Math.round((new Date(co) - new Date(ci)) / 86400000)) : 1;
  const total = (prices[room] || 3300) * nights;
  showModal('🎉 Booking Request Received!',
    `<strong>${room}</strong> — ${nights} night${nights > 1 ? 's' : ''} for ${g} guest${g > 1 ? 's' : ''}<br>
     Estimated: <strong>₹${total.toLocaleString('en-IN')} + Tax</strong><br><br>
     Our team will call <strong>+91 77997 18535</strong> to confirm within 2 hours.`);
}

// ── CONTACT FORM ───────────────────────────────
function handleContact(e) {
  e.preventDefault();
  const name = document.getElementById('cfName')?.value || 'Guest';
  showModal('✅ Message Sent!',
    `Thank you, <strong>${name}</strong>! We've received your enquiry and will respond within 24 hours.<br><br>
     For urgent queries: <strong>+91 77997 18535</strong>`);
  e.target.reset();
}

// ── MODAL ──────────────────────────────────────
function showModal(title, msg) {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMsg').innerHTML = msg;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── TILT on Cards ──────────────────────────────
document.querySelectorAll('.room-card, .event-card, .package-card, .facility-item, .value-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

// ── PARTICLE BURST on CTA ─────────────────────
function burst(x, y) {
  const colors = ['#c9a96e','#e8c98a','#9a7240','#f0d9a0','#d4a54e'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    const size = 4 + Math.random() * 5;
    p.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:50%;pointer-events:none;z-index:9999;
    `;
    document.body.appendChild(p);
    const a = (Math.PI * 2 * i) / 14;
    const d = 70 + Math.random() * 70;
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(0)`, opacity: 0 }
    ], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(0,0.9,0.57,1)' })
    .onfinish = () => p.remove();
  }
}
document.querySelectorAll('.btn-primary, .btn-book-nav').forEach(btn => {
  btn.addEventListener('click', e => burst(e.clientX, e.clientY));
});

// ── TYPING EFFECT for hero eyebrow ─────────────
(function typeEyebrow() {
  const el = document.querySelector('#hero .hero-eyebrow');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(iv);
    }, 55);
  }, 500);
})();

// ── SMOOTH SECTION SCROLL ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── PAGE FADE IN ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));
});

// ── NAV HIGHLIGHT on scroll (home page) ────────
if (document.getElementById('hero')) {
  const sectionEls = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 130;
    sectionEls.forEach(s => {
      const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (link) {
        const inView = scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight;
        link.style.color = inView ? 'var(--gold)' : '';
      }
    });
  }, { passive: true });
}
