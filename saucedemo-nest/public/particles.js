// Fondo de partículas (plexus) puramente decorativo.
// No intercepta clics (pointer-events: none en CSS) ni toca ningún data-test,
// así que las pruebas automatizadas no se ven afectadas.
(() => {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINK_DIST = 120;
  let w, h, dots;

  const resize = () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  };

  const seed = () => {
    const n = Math.min(90, Math.floor((w * h) / 16000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.4,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < dots.length; i++) {
      const p = dots[i];
      if (!reducedMotion) {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
      }
      // conexiones finas entre puntos cercanos
      for (let j = i + 1; j < dots.length; j++) {
        const q = dots[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.strokeStyle = `rgba(90, 167, 255, ${0.07 * (1 - d / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(57, 240, 192, 0.38)';
      ctx.fill();
    }
    if (!reducedMotion) requestAnimationFrame(draw);
  };

  addEventListener('resize', () => { resize(); seed(); if (reducedMotion) draw(); });
  resize();
  seed();
  draw();
})();
