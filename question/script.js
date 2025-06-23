const form = document.getElementById('multiStepForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const progressBar = document.getElementById('progressBar');
const stepIndicator = document.getElementById('stepIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
let currentStep = 0;
const TOTAL_STEPS = steps.length;

function showStep(index) {
    
    const currentStepElement = steps[currentStep];
    currentStepElement.style.opacity = 0;
    const isForward = index > currentStep;
    currentStepElement.style.transform = isForward ? 'translateX(-20px)' : 'translateX(20px)';

    setTimeout(() => {
        currentStepElement.classList.add('hidden');
        
        
        const newStepElement = steps[index];
        newStepElement.classList.remove('hidden');
        newStepElement.style.transform = isForward ? 'translateX(20px)' : 'translateX(-20px)';
        
        
        requestAnimationFrame(() => {
            newStepElement.style.opacity = 1;
            newStepElement.style.transform = 'translateX(0)';
        });

        currentStep = index;
        updateUI();
    }, 400); 
}

function updateUI() {
    const stepNumber = currentStep + 1;
    stepIndicator.textContent = `Step ${stepNumber} of ${TOTAL_STEPS}`;
    
    const progressPercentage = (stepNumber / TOTAL_STEPS) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    if (currentStep === TOTAL_STEPS - 1) {
        progressBar.style.backgroundColor = '#86efac';
        progressBar.style.backgroundColor = '#b5ff60';
    }

    prevBtn.classList.toggle('hidden', currentStep === 0);
    prevBtn.disabled = currentStep === 0;
    nextBtn.classList.toggle('hidden', currentStep === TOTAL_STEPS - 1);
    submitBtn.classList.toggle('hidden', currentStep !== TOTAL_STEPS - 1);
}

function validateStep(stepIndex) {
    const currentStepElement = steps[stepIndex];
    const inputs = currentStepElement.querySelectorAll('input[required]');

    for (const input of inputs) {
        input.classList.remove('invalid');
        if (!input.checkValidity()) {
            input.classList.add('invalid');
            input.reportValidity(); 
            return false; 
        }
    }
    
    return true;
}

function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep < TOTAL_STEPS - 1) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    
    console.log('Form submitted with data:', new FormData(form));
    
    document.querySelector('.container').innerHTML = `
        <div class="form-box" style="text-align:center; opacity: 0; transform: translateY(20px); animation: fadeIn 0.5s forwards;">
            <h2 style="color: #d8ff94;">Thank You!</h2>
            <p>Your financial health assessment has been submitted.</p>
            <p style="color: #bfffb0; font-size: 0.9em;">A report will be generated shortly.</p>
            <p id="redirect-message" style="color: #bfffb0; font-size: 0.8em; margin-top: 25px;"></p>
        </div>
        <style>
          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>
    `;

    
    let seconds = 5;
    const redirectMessage = document.getElementById('redirect-message');
    
    const countdown = () => {
        if (seconds > 0) {
            redirectMessage.textContent = `You will be redirected in ${seconds} second${seconds > 1 ? 's' : ''}...`;
            seconds--;
        } else {
            redirectMessage.textContent = 'Redirecting...';
            clearInterval(intervalId);
            window.location.href = 'report.html'; 
        }
    };

    countdown();
    const intervalId = setInterval(countdown, 1000);
});

function goBack() {
    if (currentStep > 0) {
        prevStep();
    } else {
         window.history.back();
    }
}


document.querySelectorAll('.toggle-container').forEach(container => {
  const checkbox = container.querySelector('input[type="checkbox"]');
  container.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  });
  container.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
    }
  });
});


document.getElementById('age').addEventListener('input', e => {
  if (e.target.validity.rangeUnderflow) {
    e.target.setCustomValidity('Minimum age required is 18.');
  } else {
    e.target.setCustomValidity('');
  }
});


form.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    
    const focusedElement = document.activeElement;
    
    if(focusedElement.tagName === 'BUTTON' && focusedElement.id !== 'nextBtn') {
        return;
    }

    e.preventDefault();
    
    
    if (currentStep === TOTAL_STEPS - 1) {
      submitBtn.click();
    } else {
      
      nextBtn.click();
    }
  }
});


(function() {
    steps.forEach((step, i) => {
      if (i !== 0) {
        step.classList.add('hidden');
        step.style.opacity = 0;
      } else {
        step.style.opacity = 1;
        step.style.transform = 'translateX(0)';
      }
    });
    updateUI();
})();
