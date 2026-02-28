/* ═══════════════════════════════════════════
   GINO OMEROVIC — PORTFOLIO SCRIPTS
═══════════════════════════════════════════ */

/* ──────────────────────────────
   1. NAVBAR SCROLL + HAMBURGER
────────────────────────────── */
const header    = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});


/* ──────────────────────────────
   2. ACTIVE NAV HIGHLIGHT
────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
  });
}
updateActiveNav();


/* ──────────────────────────────
   3. SCROLL REVEAL (IntersectionObserver)
────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


/* ──────────────────────────────
   4. PARALLAX HERO BLOBS (desktop only)
────────────────────────────── */
const isDesktop = window.matchMedia('(min-width: 1025px) and (pointer: fine)');
const blobs = document.querySelectorAll('.blob');

if (isDesktop.matches) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    blobs.forEach((blob, i) => {
      const speed = (i % 2 === 0 ? 1 : -1) * (0.06 + i * 0.03);
      blob.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
}


/* ──────────────────────────────
   5. CURSOR GLOW (desktop only — no touch)
────────────────────────────── */
if (isDesktop.matches && !('ontouchstart' in window)) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  cursor.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 340px; height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,0.10) 0%, transparent 70%);
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.4s ease;
    will-change: transform;
  `;
  document.body.appendChild(cursor);

  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  (function animateCursor() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    cursor.style.transform = `translate(${cx - 170}px, ${cy - 170}px)`;
    requestAnimationFrame(animateCursor);
  })();

  // Dim on dark sections
  const darkSections = document.querySelectorAll('.section-dark');
  const cursorDimObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) cursor.style.opacity = '0.4';
      else cursor.style.opacity = '1';
    });
  }, { threshold: 0.5 });
  darkSections.forEach(s => cursorDimObserver.observe(s));
}


/* ──────────────────────────────
   6. SMOOTH SECTION ENTRY — stagger children
────────────────────────────── */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('[data-reveal]');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('revealed'), i * 130);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.trophies, .skills-grid').forEach(container => {
  staggerObserver.observe(container);
});


/* ──────────────────────────────
   7. TIMELINE REVEAL
────────────────────────────── */
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.tl-item').forEach(item => tlObserver.observe(item));


/* ──────────────────────────────
   8. FOOTER YEAR AUTO-UPDATE
────────────────────────────── */
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
  yearEl.innerHTML = yearEl.innerHTML.replace(
    /© \d{4}/,
    `© ${new Date().getFullYear()}`
  );
}


/* ──────────────────────────────
   9. PROJETS DECK 2.5D
────────────────────────────── */
(function () {
  const ring   = document.getElementById('carouselRing');
  if (!ring) return;

  const cards  = Array.from(ring.querySelectorAll('.proj-card'));
  const dotsEl = document.getElementById('carouselDots');
  const count  = cards.length;
  let current  = 0;

  /* Build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'c-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Projet ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = ((index % count) + count) % count;

    cards.forEach((card, i) => {
      const pos = ((i - current) % count + count) % count;
      card.setAttribute('data-deck', pos < 4 ? pos : 4);
      // Only allow click-through links on the active card
      if (pos === 0 && card.tagName === 'A') {
        card.style.pointerEvents = 'auto';
      } else if (card.tagName === 'A') {
        card.style.pointerEvents = 'auto';
      }
    });

    dotsEl.querySelectorAll('.c-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  document.getElementById('carouselPrev')
    .addEventListener('click', () => goTo(current - 1));
  document.getElementById('carouselNext')
    .addEventListener('click', () => goTo(current + 1));

  /* Click on a non-active card brings it to front instead of following link */
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (i !== current) {
        e.preventDefault();
        goTo(i);
      }
    });
  });

  /* Swipe support for touch devices */
  let touchStartX = 0;
  let touchEndX = 0;

  ring.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  ring.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, { passive: true });

  goTo(0);
})();
