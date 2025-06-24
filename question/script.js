document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const form = document.getElementById('multiStepForm');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const progressBar = document.getElementById('progressBar');
  const stepIndicator = document.getElementById('stepIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const backBtn = document.getElementById('backBtn');
  
  let currentStep = 0;
  const TOTAL_STEPS = steps.length;

  // Initialize the form
  function initForm() {
    steps.forEach((step, index) => {
      if (index !== 0) {
        step.classList.add('hidden');
        step.style.opacity = '0';
      } else {
        step.style.opacity = '1';
      }
    });
    updateUI();
    
    // Add event listeners
    prevBtn.addEventListener('click', prevStep);
    nextBtn.addEventListener('click', nextStep);
    backBtn.addEventListener('click', goBack);
    form.addEventListener('submit', handleSubmit);
    form.addEventListener('keydown', handleKeyDown);
    
    // Initialize toggle switches
    initToggleSwitches();
    
    // Add validation for age input
    document.getElementById('age').addEventListener('input', validateAge);
  }

  // Show a specific step with animation
  function showStep(index) {
    if (index < 0 || index >= TOTAL_STEPS) return;
    
    const currentStepElement = steps[currentStep];
    const isForward = index > currentStep;
    
    // Animate out current step
    currentStepElement.style.opacity = '0';
    currentStepElement.style.transform = isForward ? 'translateX(-20px)' : 'translateX(20px)';
    
    setTimeout(() => {
      currentStepElement.classList.add('hidden');
      
      // Prepare and show new step
      const newStepElement = steps[index];
      newStepElement.classList.remove('hidden');
      newStepElement.style.transform = isForward ? 'translateX(20px)' : 'translateX(-20px)';
      
      requestAnimationFrame(() => {
        newStepElement.style.opacity = '1';
        newStepElement.style.transform = 'translateX(0)';
      });
      
      currentStep = index;
      updateUI();
    }, 400);
  }

  // Update UI elements (progress bar, buttons)
  function updateUI() {
    const stepNumber = currentStep + 1;
    stepIndicator.textContent = `Step ${stepNumber} of ${TOTAL_STEPS}`;
    
    const progressPercentage = (stepNumber / TOTAL_STEPS) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Update button visibility
    prevBtn.classList.toggle('hidden', currentStep === 0);
    nextBtn.classList.toggle('hidden', currentStep === TOTAL_STEPS - 1);
    submitBtn.classList.toggle('hidden', currentStep !== TOTAL_STEPS - 1);
    
    // Change progress bar color on last step
    if (currentStep === TOTAL_STEPS - 1) {
      progressBar.style.backgroundColor = '#86efac';
    } else {
      progressBar.style.backgroundColor = '#b5ff60';
    }
  }

  // Validate all required inputs in current step
  function validateStep(stepIndex) {
    const currentStepElement = steps[stepIndex];
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      input.classList.remove('invalid');
      
      if (!input.checkValidity()) {
        input.classList.add('invalid');
        
        // Create error message if it doesn't exist
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.textContent = input.validationMessage || 'Please fill out this field';
          input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }
        
        input.nextElementSibling.style.display = 'block';
        isValid = false;
      } else if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
        input.nextElementSibling.style.display = 'none';
      }
    });
    
    return isValid;
  }

  // Go to next step
  function nextStep() {
    if (!validateStep(currentStep)) {
      // Scroll to first invalid input
      const firstInvalid = steps[currentStep].querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (currentStep < TOTAL_STEPS - 1) {
      showStep(currentStep + 1);
    }
  }

  // Go to previous step
  function prevStep() {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      const firstInvalid = steps[currentStep].querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Convert checkbox values to boolean
      data.followBudget = formData.get('followBudget') === 'on';
      data.retirementPlan = formData.get('retirementPlan') === 'on';
      data.autoInvest = formData.get('autoInvest') === 'on';
      data.loanDefault = formData.get('loanDefault') === 'on';
      data.consultAdvisor = formData.get('consultAdvisor') === 'on';
      data.reviewGoals = formData.get('reviewGoals') === 'on';
      
      // In a real application, you would send this data to your server
      console.log('Form data:', data);
      
      // Simulate API call with credentials
      const response = await fetch('https://api.fein-ai.com/v1/save-preferences', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Include authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Show success message
      showConfirmation();
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  }

  // Show confirmation message
  function showConfirmation() {
    const container = document.querySelector('.container');
    container.innerHTML = `
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
    
    // Countdown before redirect
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
  }

  // Handle back button click
  function goBack() {
    if (currentStep > 0) {
      prevStep();
    } else {
      window.history.back();
    }
  }

  // Handle Enter key press
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (currentStep === TOTAL_STEPS - 1) {
        submitBtn.click();
      } else {
        nextBtn.click();
      }
    }
  }

  // Initialize toggle switches
  function initToggleSwitches() {
    document.querySelectorAll('.toggle-container').forEach(container => {
      const checkbox = container.querySelector('input[type="checkbox"]');
      
      container.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          // Trigger change event for the checkbox
          checkbox.dispatchEvent(new Event('change'));
        }
      });
      
      container.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });
    });
  }

  // Validate age input
  function validateAge(e) {
    const input = e.target;
    if (input.validity.rangeUnderflow) {
      input.setCustomValidity('Minimum age required is 18.');
    } else {
      input.setCustomValidity('');
    }
  }

  // Initialize the form
  initForm();
});
