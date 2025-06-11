// Move background with cursor
document.addEventListener("mousemove", function(e) {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  const offsetX = Math.round((x - 0.5) * 200);
  const offsetY = Math.round((y - 0.5) * 200);
  document.body.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
});

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault(); // prevent actual submission
  // Redirect to dashboard or home page
  window.location.href = "dashboard.html"; // Replace with your desired page
});

// Social Media redirects
document.getElementById("instagram-link").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "https://www.instagram.com/";
});

document.getElementById("twitter-link").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "https://twitter.com/";
});

document.getElementById("linkedin-link").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "https://www.linkedin.com/";
});

document.getElementById("google-login").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "https://accounts.google.com/";
});

document.getElementById("apple-login").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "https://appleid.apple.com/";
});
