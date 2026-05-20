document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('online-booking-form');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.booking-steps .step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    
    // Booking State
    let currentStep = 1;
    const maxSteps = 4;
    
    // Elements for Time Selection
    const dateInput = document.getElementById('booking-date');
    const timeSlotsContainer = document.getElementById('time-slots');
    const selectedTimeInput = document.getElementById('selected-time');
    const timeNextBtn = document.getElementById('time-next-btn');
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    if(dateInput) dateInput.setAttribute('min', today);

    // Mock Time Slots Generator
    const generateTimeSlots = (date) => {
        timeSlotsContainer.innerHTML = '';
        const dayOfWeek = new Date(date).getDay();
        
        // Let's say Sunday (0) has different hours
        let startHour = (dayOfWeek === 0) ? 10 : 8;
        let endHour = (dayOfWeek === 0) ? 17 : 19; // Last booking 5PM sun, 7PM otherwise
        
        // Randomly "book" some slots to make it look realistic
        for (let i = startHour; i <= endHour; i++) {
            ['00', '30'].forEach(mins => {
                // Skip some random slots
                if (Math.random() > 0.7) return;
                
                const timeString = `${i > 12 ? i - 12 : i}:${mins} ${i >= 12 ? 'PM' : 'AM'}`;
                
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = timeString;
                slot.dataset.time = timeString;
                
                slot.addEventListener('click', () => {
                    // Remove selected from all
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    // Add to clicked
                    slot.classList.add('selected');
                    selectedTimeInput.value = timeString;
                    timeNextBtn.disabled = false;
                });
                
                timeSlotsContainer.appendChild(slot);
            });
        }
        
        if (timeSlotsContainer.innerHTML === '') {
            timeSlotsContainer.innerHTML = '<p class="text-muted">No available slots for this date. Please choose another.</p>';
            timeNextBtn.disabled = true;
        }
    };

    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            selectedTimeInput.value = '';
            timeNextBtn.disabled = true;
            generateTimeSlots(e.target.value);
        });
    }

    // Step Navigation Logic
    const updateSteps = () => {
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        // Update indicators up to current step
        for (let i = 0; i < currentStep; i++) {
            if(stepIndicators[i]) stepIndicators[i].classList.add('active');
        }
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validation per step
            if (currentStep === 1) {
                const service = document.querySelector('input[name="service"]:checked');
                if (!service) return alert('Please select a service.');
            } else if (currentStep === 2) {
                const barber = document.querySelector('input[name="barber"]:checked');
                if (!barber) return alert('Please select a barber.');
            } else if (currentStep === 3) {
                if (!dateInput.value || !selectedTimeInput.value) {
                    return alert('Please select a date and time.');
                }
            }

            if (currentStep < maxSteps) {
                currentStep++;
                updateSteps();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateSteps();
            }
        });
    });

    // Handle Form Submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather data
            const formData = new FormData(form);
            const name = formData.get('name');
            const service = formData.get('service');
            const rawDate = formData.get('date');
            
            // Convert raw date (YYYY-MM-DD) into a nice readable format (e.g., Thursday, May 21, 2026)
            // Adding T12:00:00 ensures we don't hit timezone off-by-one errors
            const dateObj = new Date(rawDate + 'T12:00:00');
            const date = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const time = formData.get('time');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const barber = formData.get('barber');
            
            // Change button text to show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Prepare the data exactly as EmailJS expects it based on our template variables
            const templateParams = {
                name: name,
                email: email,
                phone: phone,
                service: service,
                barber: barber,
                date: date,
                time: time
            };

            // Send via EmailJS
            emailjs.send('service_egyghyj', 'template_1j1l47m', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Reset button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;

                    // Populate success message
                    document.getElementById('confirm-name').textContent = name.split(' ')[0];
                    document.getElementById('confirm-service').textContent = service;
                    document.getElementById('confirm-date').textContent = date;
                    document.getElementById('confirm-time').textContent = time;
                    
                    // Hide all steps, show success
                    steps.forEach(step => step.classList.remove('active'));
                    document.getElementById('step-success').classList.add('active');
                }, function(error) {
                    console.log('FAILED...', error);
                    // Reset button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    alert('There was an error processing your booking. Please try again or call us directly.');
                });
        });
    }

    // Reset Form logic
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            currentStep = 1;
            selectedTimeInput.value = '';
            timeNextBtn.disabled = true;
            timeSlotsContainer.innerHTML = '<p class="text-muted">Please select a date to view available times.</p>';
            
            // Reset indicators
            stepIndicators.forEach(indicator => indicator.classList.remove('active'));
            stepIndicators[0].classList.add('active');
            
            steps.forEach(step => step.classList.remove('active'));
            document.getElementById('step-1').classList.add('active');
        });
    }
});
