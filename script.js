/* ===========================
   RN CONSÓRCIOS — SCRIPT.JS
   =========================== */

'use strict';

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// ===== SMOOTH ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveNav);

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== REVEAL ON SCROLL (IntersectionObserver) =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger reveal
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0) * 1000);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach((el, i) => {
  // Add stagger delay based on position within parent
  const siblings = el.parentElement.querySelectorAll('.reveal');
  const idx = Array.from(siblings).indexOf(el);
  el.dataset.delay = idx * 0.1;
  revealObserver.observe(el);
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // Close all
    faqItems.forEach(fi => {
      fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      fi.querySelector('.faq-answer').classList.remove('open');
    });
    // Open clicked (if was closed)
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ===== WHATSAPP NUMBER MASK =====
const wppInput = document.getElementById('whatsapp');
if (wppInput) {
  wppInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    e.target.value = v;
  });
}

// ===== FORM VALIDATION & SUBMIT =====
const leadForm = document.getElementById('leadForm');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

function validateField(field) {
  const val = field.value.trim();
  if (field.required && !val) {
    field.classList.add('error');
    return false;
  }
  if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    field.classList.add('error');
    return false;
  }
  field.classList.remove('error');
  return true;
}

if (leadForm) {
  // Real-time validation
  leadForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = leadForm.querySelectorAll('input[required], select[required]');
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });

    if (!valid) {
      // Scroll to first error
      const firstError = leadForm.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Build WhatsApp message
    const nome = document.getElementById('nome').value.trim();
    const wpp = document.getElementById('whatsapp').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipo = document.getElementById('tipo').value;
    const valor = document.getElementById('valor').value;
    const msg = document.getElementById('mensagem').value.trim();

    const tipoMap = {
      imovel: 'Imóvel', veiculo: 'Veículo', moto: 'Moto',
      pesado: 'Pesados', servico: 'Serviços'
    };
    const valorMap = {
      'ate50k': 'até R$ 50.000', '50k-100k': 'R$ 50.000 a R$ 100.000',
      '100k-200k': 'R$ 100.000 a R$ 200.000', '200k-500k': 'R$ 200.000 a R$ 500.000',
      'acima500k': 'Acima de R$ 500.000'
    };

    const waMensagem = encodeURIComponent(
      `Olá! Vim pelo site da RN Consórcios e gostaria de solicitar uma simulação.\n\n` +
      `*Nome:* ${nome}\n` +
      `*WhatsApp:* ${wpp}\n` +
      `*E-mail:* ${email}\n` +
      `*Tipo de consórcio:* ${tipoMap[tipo] || tipo}\n` +
      `*Valor desejado:* ${valorMap[valor] || valor}\n` +
      (msg ? `*Mensagem:* ${msg}` : '')
    );

    // Show success modal
    successModal.classList.add('active');
    leadForm.reset();

    // Open WhatsApp after short delay
    setTimeout(() => {
      window.open(`https://wa.me/5500000000000?text=${waMensagem}`, '_blank');
    }, 800);
  });
}

// Close modal
if (closeModal) {
  closeModal.addEventListener('click', () => successModal.classList.remove('active'));
}
if (successModal) {
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) successModal.classList.remove('active');
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = '+' + current.toLocaleString('pt-BR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(el => {
        const text = el.textContent;
        if (text.includes('5.000')) animateCounter(el, 5000, '');
      });
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ===== TIPO CARDS EQUALIZER =====
// On load & resize, equalize tipo card heights in same row
function equalizeTipoCards() {
  const grid = document.querySelector('.tipos-grid');
  if (!grid || window.innerWidth < 900) return;
  const cards = grid.querySelectorAll('.tipo-card');
  cards.forEach(c => { c.style.height = 'auto'; });
  // Group by row
  const rows = {};
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (!rows[top]) rows[top] = [];
    rows[top].push(card);
  });
  Object.values(rows).forEach(row => {
    const max = Math.max(...row.map(c => c.offsetHeight));
    row.forEach(c => { c.style.height = max + 'px'; });
  });
}
window.addEventListener('load', equalizeTipoCards);
window.addEventListener('resize', equalizeTipoCards);

// ===== INIT LOG =====
console.log('%c🏆 RN Consórcios', 'color: #c9a84c; font-size: 20px; font-weight: bold;');
console.log('%cRealizando Sonhos Juntos — Site v1.0', 'color: #0d1b3e; font-size: 12px;');
