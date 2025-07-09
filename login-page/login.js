document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  const emailError = document.getElementById('email-error');
  const pwdError = document.getElementById('password-error');
  const togglePwdIcon = document.getElementById('toggle-password');
 // === Login Rate Limiting ===
  let loginAttempts = 0;
  const maxAttempts = 5;
  const lockoutTime = 30000; // 30 seconds

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Prevent further login if limit reached
    if (loginAttempts >= maxAttempts) {
      pwdError.textContent = `🚫 Too many failed attempts. Try again in 30 seconds.`;
      return;
    }
  
  let valid = true;
  emailError.textContent = '';
  pwdError.textContent = '';

  const email = emailInput.value.trim();
  const pwd = pwdInput.value.trim();

  if (!/\S+@\S+\.\S+/.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    valid = false;
  }

  if (!pwd) {
    pwdError.textContent = "Password cannot be empty.";
    valid = false;
  }

  if (!valid) {
    console.warn("Form validation failed.");
    return;
  }

  console.log("Sending login request...");

  fetch("https://api.fein-ai.com/v1/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", 
    body: JSON.stringify({
      email: email,
      password: pwd
    })
  })
  .then(async response => {
    const contentType = response.headers.get("content-type");
    let data;

    try {
      data = contentType && contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };
    } catch (e) {
      console.error("Failed to parse response:", e);
      pwdError.textContent = "Invalid server response.";
      return;
    }

    console.log("Login response status:", response.status);
    console.log("Login response data:", data);

    if (data.status === "ok") {
     loginAttempts = 0; // Reset on success
      alert("Welcome back!");
      window.location.href = "../question/index.html"; // 
    } else {
        loginAttempts++;
      pwdError.textContent = data.message || "Invalid login credentials.";
      // Lockout if max attempts reached
        if (loginAttempts >= maxAttempts) {
          loginBtn.disabled = true;
          pwdError.textContent = "🚫 Too many failed attempts. Try again in 30 seconds.";

          setTimeout(() => {
            loginAttempts = 0;
            loginBtn.disabled = false;
            pwdError.textContent = "";
          }, lockoutTime);
    }
    }
  })
  .catch(err => {
    console.error("Network or server error during login:", err);
    pwdError.textContent = "Server error. Please try again later.";
  });
});

  // Toggle password visibility
  togglePwdIcon?.addEventListener('click', () => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      togglePwdIcon.innerHTML = '<i class="ph ph-eye-slash"></i>';
    } else {
      pwdInput.type = 'password';
      togglePwdIcon.innerHTML = '<i class="ph ph-eye"></i>';
    }
  });

  // Social buttons
  document.getElementById('instagram-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "https://instagram.com/";
  });

  document.getElementById('twitter-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "https://twitter.com/";
  });

  document.getElementById('linkedin-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "https://linkedin.com/";
  });

  document.getElementById('forgot-password')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "forgot-password.html";
  });

  document.getElementById('google-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "https://accounts.google.com/signin";
  });

  document.getElementById('apple-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "https://appleid.apple.com/";
  });

  document.getElementById('signup-now')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "signup.html";
  });

  // ======== CONSTELLATION BACKGROUND =========
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
