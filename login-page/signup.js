document.addEventListener("DOMContentLoaded", () => {
  const formSteps = document.querySelectorAll('.form-step');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');
  const showPwdCheckbox = document.getElementById('show-password');
  const phoneInput = document.getElementById('phone');

  let currentStep = 0;
  updateFormSteps();

  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
  
      if (currentStep >= formSteps.length) {
        const signupData = {
          name: document.getElementById('name')?.value.trim(),
          dob: document.getElementById('dob')?.value.trim(),
          email: document.getElementById('email')?.value.trim(),
          password: document.getElementById('password')?.value.trim(),
          username: document.getElementById('name')?.value.trim().toLowerCase().replace(/\s+/g, ''),
          referral: document.getElementById('referral')?.value.trim(),
          phone: document.getElementById('phone')?.value.trim()
        };

        fetch("https://api.fein-ai.com/v1/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(signupData)
        })
        .then(response => response.json())
        .then(data => {
          if (data && data.success !== false) {
            alert("Signup successful! Redirecting to login page...");
            window.location.href = "login.html";
          } else {
            alert("Signup failed: " + (data.message || "Please try again."));
          }
        })
        .catch(error => {
          console.error("Signup error:", error);
          alert("Something went wrong. Please try again later.");
        });

        return;
      }

      updateFormSteps();
    }
  });

  backBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateFormSteps();
    }
  });

  function updateFormSteps() {
    formSteps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });

    backBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = currentStep === formSteps.length - 1 ? 'Submit' : 'Next';
  }

  showPwdCheckbox?.addEventListener('change', () => {
    const pwd = document.getElementById('password');
    const confirm = document.getElementById('confirm-password');
    const type = showPwdCheckbox.checked ? "text" : "password";
    if (pwd) pwd.type = type;
    if (confirm) confirm.type = type;
  });

  phoneInput?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });

  function validateStep(step) {
    const fields = ['name', 'dob', 'email', 'password', 'referral', 'phone'];
    const id = fields[step] || 'confirm-password';
    const input = document.getElementById(id);
    const error = document.getElementById(`error-${id}`);
    if (!input || !error) return true;

    const value = input.value.trim();
    error.textContent = "";

    if (id === 'email') {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value)) {
        error.textContent = "Please enter a valid email.";
        return false;
      }
    }

    if (id === 'password') {
  const confirmValue = document.getElementById('confirm-password').value.trim();
  const confirmError = document.getElementById('error-confirm-password');

  // ✅ Strong password regex
  const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/;

  if (!strongPassword.test(value)) {
    error.textContent = "Password must contain at least 12 characters, 1 uppercase, 1 lowercase, 1 numeric and 1 special character.";
    return false;
  }

  if (confirmValue === "") {
    confirmError.textContent = "Please confirm your password.";
    return false;
  }

  if (value !== confirmValue) {
    confirmError.textContent = "Passwords do not match.";
    return false;
  }
}


    if (id === 'phone') {
      const phoneValue = value.replace(/\D/g, '');
      if (!/^\d{10}$/.test(phoneValue)) {
        error.textContent = "Enter a valid 10-digit phone number.";
        return false;
      }
    }

    return true;
  }

  // Animated Stars Background
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
// Disable paste in Confirm Password field
const confirmPwd = document.getElementById('confirm-password');
if (confirmPwd) {
  confirmPwd.addEventListener('paste', function (e) {
    e.preventDefault();
    alert("Pasting is disabled. Please re-type your password.");
  });
}
  draw();
});
