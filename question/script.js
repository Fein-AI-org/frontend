function skipSurvey() {
  alert("Survey skipped. Redirecting...");
  window.location.href = "../chatpage/index.html";
}

function updateProgressBar() {
  const inputs = document.querySelectorAll('#financeForm input, #financeForm select');
  let filled = 0;

  inputs.forEach(input => {
    if ((input.type === 'range') || input.value.trim() !== '') {
      filled++;
    }
  });

  const percent = Math.round((filled / inputs.length) * 100);
  document.getElementById('progressBar').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `${percent}% complete`;
}

document.querySelectorAll('#financeForm input, #financeForm select').forEach(input => {
  input.addEventListener('input', updateProgressBar);
});

document.getElementById("financeForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const inputs = document.querySelectorAll('#financeForm input, #financeForm select');
  const data = {};
  let valid = true;

  inputs.forEach(input => {
    const value = parseFloat(input.value);
    const name = input.name;

    if ((input.type === "number" || input.tagName === "INPUT") && input.value) {
      if (input.hasAttribute("min") && value < parseFloat(input.min)) {
        alert(`Invalid value for ${name}. Minimum allowed is ${input.min}.`);
        valid = false;
      }
      if (input.hasAttribute("max") && value > parseFloat(input.max)) {
        alert(`Invalid value for ${name}. Maximum allowed is ${input.max}.`);
        valid = false;
      }
    }

    data[name] = input.value;
  });

  if (!valid) return;

  console.log("Submitted Data:", data);
  alert("Your financial profile has been recorded. Thank you!");
  window.location.href = "../chatpage/index.html";
});

