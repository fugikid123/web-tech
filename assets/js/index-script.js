/**
 * Index Page Specific Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');

        const validateField = (input) => {
            if (input.checkValidity() && input.value.trim() !== '') {
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else if (input.hasAttribute('required')) {
                input.classList.add('invalid');
                input.classList.remove('valid');
            }
        };

        inputs.forEach(input => {
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message ? contactForm.message.value : ''
            };

            try {
                const record = window.AppDB.save('contact_messages', formData);
                
                contactForm.parentElement.innerHTML = `
                    <div class="success-message" style="text-align: center; padding: 2rem;">
                        <h3 style="color: #10b981;">✓ Message Saved!</h3>
                        <p>Thank you, ${formData.name}. Your message has been recorded. Thank you very much!</p>
                        <div style="margin-top: 1.5rem;">
                            <button onclick="location.reload()" class="btn-secondary">Back</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                alert('Error saving message.');
            }
        });
    }

});
