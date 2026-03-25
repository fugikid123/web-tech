/**
 * Professional Portfolio Interactivity Script
 * Using ES6+, DOM API, and Events
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // --- 1. Form Validation & Interaction ---
    const signupForm = document.querySelector('form');
    
    if (signupForm) {
        // Selecting all relevant input elements
        const inputs = signupForm.querySelectorAll('input, textarea');

        /**
         * Validates an individual input field and applies visual feedback
         * @param {HTMLElement} input 
         * @param {boolean} force - If true, show error even if empty
         */
        const validateField = (input, force = false) => {
            const isRequired = input.hasAttribute('required');
            const isEmpty = input.value.trim() === '';
            const isValid = input.checkValidity();

            if (!isEmpty && isValid) {
                // Input has valid data
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else if (!isEmpty && !isValid) {
                // Input has data, but it's formatted incorrectly
                input.classList.add('invalid');
                input.classList.remove('valid');
            } else if (isEmpty && isRequired && force) {
                // Input is empty, mandatory, and user moved away or submitted
                input.classList.add('invalid');
                input.classList.remove('valid');
            } else {
                // Input is empty and either optional or not interacted with yet
                input.classList.remove('valid', 'invalid');
            }
        };

        // Add event listeners for real-time feedback
        inputs.forEach(input => {
            // Event: 'input' triggers whenever the value changes
            input.addEventListener('input', () => validateField(input));
            
            // Event: 'blur' triggers when user leaves the field
            input.addEventListener('blur', () => validateField(input, true));
        });

        // Event: 'submit' handle form submission
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Stop page reload
            
            let allValid = true;
            inputs.forEach(input => {
                validateField(input, true);
                if (!input.checkValidity()) allValid = false;
            });

            if (allValid) {
                // DOM Manipulation: Replace form with success message
                const container = signupForm.parentElement;
                container.innerHTML = `
                    <div class="success-message" style="text-align: center; padding: 2rem; animation: fadeIn 0.5s ease-in;">
                        <h3 style="color: #10b981; margin-bottom: 1rem;">✓ Application Received!</h3>
                        <p>Thank you for your interest, ${signupForm.name.value}. We will contact you soon at ${signupForm.email.value}.</p>
                        <button onclick="location.reload()" class="btn-secondary" style="margin-top: 1rem;">Back to form</button>
                    </div>
                `;
            } else {
                // Simple alert if validation fails on submit
                alert('Please fill in the form correctly.');
            }
        });
    }

    // --- 2. Smooth Scrolling for Navigation ---
    // Using ES6 Spread operator to convert NodeList to Array
    const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for sticky nav
                    behavior: 'smooth'
                });

                // If mobile menu is open, close it (for mobile view)
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle) navToggle.checked = false;
            }
        });
    });

    // --- 3. Dynamic Skill Card Hover Effects ---
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Event: mouseenter
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 10px 30px rgba(225, 29, 72, 0.15)';
        });

        // Event: mouseleave
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = 'none';
        });
    });

    // --- 4. Scroll Reveal (Optional but cool) ---
    const revealOnScroll = () => {
        const sections = document.querySelectorAll('section');
        const triggerBottom = window.innerHeight * 0.8;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styling for scroll reveal
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0.9'; // Subtle start
        section.style.transition = 'all 0.6s ease-out';
    });

    window.addEventListener('scroll', revealOnScroll);
});
