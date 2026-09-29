// ============================================================
// particles.js — Cinematic Particle Network
// Interactive particles with connecting lines, mouse reactivity,
// depth layers, and theme-aware colors
// ============================================================
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DARK_COLORS  = ['#ff6b35', '#ff375f', '#bf5af2', '#f7c948', '#ffd700', '#ff8c61', '#38bdf8'];
  const LIGHT_COLORS = ['#e85d04', '#c1121f', '#7b2d8b', '#d4a017', '#b8860b', '#ff8c61', '#0077b6'];
  const COUNT = 80;
  const LINE_DIST = 140;
  let W, H, particles = [];
  let mouseX = -1000, mouseY = -1000;

  function isDark() {
    return document.body.classList.contains('dark-mode');
  }
  function getColors() {
    return isDark() ? DARK_COLORS : LIGHT_COLORS;
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function createParticle(scattered) {
    const colors = getColors();
    return {
      x:     rand(0, W),
      y:     scattered ? rand(0, H) : H + rand(5, 50),
      r:     rand(0.6, 2.5),
      vx:    rand(-0.3, 0.3),
      vy:    rand(-0.5, -0.08),
      life:  rand(0.4, 1),
      decay: rand(0.0006, 0.0018),
      alpha: rand(0.2, 0.65),
      col:   colors[Math.floor(Math.random() * colors.length)],
      depth: rand(0.3, 1), // depth layer for parallax
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, () => createParticle(true));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const opacity = (1 - dist / LINE_DIST) * 0.12 * particles[i].alpha * particles[j].alpha;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = isDark() ? 'rgba(255,107,53,0.5)' : 'rgba(232,93,4,0.4)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Update and draw particles
    particles.forEach((p, i) => {
      // Mouse repulsion
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 120) {
        const force = (120 - mdist) / 120;
        p.x += (mdx / mdist) * force * 1.5;
        p.y += (mdy / mdist) * force * 1.5;
      }

      p.x += p.vx * p.depth;
      p.y += p.vy * p.depth;
      p.life -= p.decay;

      if (p.y < -10 || p.life <= 0 || p.x < -20 || p.x > W + 20) {
        particles[i] = createParticle(false);
        return;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha * Math.max(p.life, 0);
      ctx.fillStyle = p.col;
      ctx.shadowBlur = 12 * p.depth;
      ctx.shadowColor = p.col;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.depth, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(loop);
  }

  // Mouse tracking
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  resize();
  init();
  loop();
})();
