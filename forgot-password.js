document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('forgot-form');
  const emailInput = document.getElementById('forgot-email');
  const emailError = document.getElementById('email-error');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    emailError.textContent = '';

    const email = emailInput.value.trim();
    const emailValid = /\S+@\S+\.\S+/.test(email);

    if (!emailValid) {
      emailError.textContent = "Please enter a valid email address.";
    } else {
      // Simulate form submission
      window.location.href = "reset-link-sent.html";
    }
  });

  // ===== CONSTELLATION BACKGROUND =====
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let W, H;
  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.002,
    vy: (Math.random() - 0.5) * 0.002,
    r: Math.random() * 1.2 + 0.3
  }));

  let mouse = { x: 0.5, y: 0.5 };

  canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX / W;
    mouse.y = e.clientY / H;
  });

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.x += (mouse.x - s.x) * 0.001;
      s.y += (mouse.y - s.y) * 0.001;
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0 || s.x > 1) s.vx *= -1;
      if (s.y < 0 || s.y > 1) s.vy *= -1;

      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 180, 1)';
      ctx.fill();
    });

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = (stars[i].x - stars[j].x) * W;
        const dy = (stars[i].y - stars[j].y) * H;
        if (dx * dx + dy * dy < 10000) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x * W, stars[i].y * H);
          ctx.lineTo(stars[j].x * W, stars[j].y * H);
          ctx.strokeStyle = 'rgba(221,241,165,0.1)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
});
