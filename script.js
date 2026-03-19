/* ═══════════════════════════════════════════
   STAKEHOLDERS — script.js
   Matrix Rain · Scroll Reveal · Interactions
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. MATRIX RAIN CANVAS ── */
  const canvas  = document.getElementById('matrixCanvas');
  const ctx     = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const CHARS   = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01アBCDEF$#@!><{}[]|/\\';
  const FONT_SZ = 14;
  let cols      = Math.floor(canvas.width / FONT_SZ);
  let drops     = Array(cols).fill(1);

  const drawMatrix = () => {
    ctx.fillStyle = 'rgba(5,5,8,0.055)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = FONT_SZ + 'px Share Tech Mono';
    cols = Math.floor(canvas.width / FONT_SZ);
    if (drops.length < cols) drops = [...drops, ...Array(cols - drops.length).fill(1)];

    for (let i = 0; i < cols; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      // Head char — bright pink
      const alpha = Math.random() > 0.98 ? 1 : 0.6;
      ctx.fillStyle = `rgba(255, 45, 120, ${alpha})`;
      ctx.fillText(char, i * FONT_SZ, drops[i] * FONT_SZ);
      if (drops[i] * FONT_SZ > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  };

  let matrixInterval = setInterval(drawMatrix, 50);


  /* ── 2. THEME TOGGLE ── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const toggleIcon  = document.getElementById('toggleIcon');
  const DARK = 'dark', LIGHT = 'light';

  const applyTheme = (t) => {
    html.setAttribute('data-theme', t);
    toggleIcon.textContent = t === DARK ? '☀' : '🌙';
    localStorage.setItem('sh-theme', t);
  };

  const savedTheme = localStorage.getItem('sh-theme') || DARK;
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === DARK ? LIGHT : DARK);
  });


  /* ── 3. MOBILE BURGER MENU ── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobLinks.forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });


  /* ── 4. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 5. SKILL BARS (animate on scroll) ── */
  const skillGrid = document.querySelector('.skills-grid');
  if (skillGrid) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 200);
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    barObserver.observe(skillGrid);
  }


  /* ── 6. COUNTER ANIMATION (hero stats) ── */
  const statNums = document.querySelectorAll('.stat-num');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current  = 0;
        const step   = Math.max(1, Math.floor(target / 20));
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current;
        }, 60);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => countObserver.observe(el));


  /* ── 7. NAVBAR SCROLL STYLE ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 40
      ? '0 4px 30px rgba(255,45,120,0.08)'
      : 'none';
  });


  /* ── 8. ACTIVE NAV LINK (scroll spy) ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--pink)';
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spyObserver.observe(s));


  /* ── 9. CONTACT FORM SEND BUTTON ── */
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.cf-field input, .cf-field textarea');
      let valid = true;
      inputs.forEach(i => { if (!i.value.trim()) { i.style.borderColor = 'var(--pink)'; valid = false; } else { i.style.borderColor = ''; } });
      if (!valid) return;

      sendBtn.textContent = 'SENDING...';
      sendBtn.disabled = true;
      setTimeout(() => {
        sendBtn.textContent = '✓ MESSAGE SENT';
        sendBtn.style.background = '#22e88a';
        sendBtn.style.boxShadow = '0 0 20px rgba(34,232,138,0.4)';
        inputs.forEach(i => i.value = '');
        setTimeout(() => {
          sendBtn.textContent = 'SEND MESSAGE';
          sendBtn.style.background = '';
          sendBtn.style.boxShadow = '';
          sendBtn.disabled = false;
        }, 3000);
      }, 1400);
    });
  }


  /* ── 10. PROJECT CARD GLITCH HOVER ── */
  const projCards = document.querySelectorAll('.proj-card');
  projCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const num = card.querySelector('.proj-num');
      if (!num) return;
      let flickers = 0;
      const flicker = setInterval(() => {
        num.style.opacity = num.style.opacity === '0.2' ? '1' : '0.2';
        if (++flickers > 5) { clearInterval(flicker); num.style.opacity = '0.6'; }
      }, 70);
    });
  });


  /* ── 11. MEMBER AVATAR GLITCH ── */
  const avatars = document.querySelectorAll('.member-avatar');
  avatars.forEach(av => {
    av.parentElement.parentElement.addEventListener('mouseenter', () => {
      av.style.boxShadow = '0 0 35px rgba(255,45,120,0.55), -3px 0 0 rgba(255,45,120,0.3), 3px 0 0 rgba(0,200,255,0.2)';
      setTimeout(() => { av.style.boxShadow = ''; }, 300);
    });
  });


  /* ── 12. SMOOTH ANCHOR SCROLLING (offset for fixed nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── RESIZE: update matrix cols ── */
  window.addEventListener('resize', () => {
    cols = Math.floor(canvas.width / FONT_SZ);
    drops = Array(cols).fill(1);
  });

});