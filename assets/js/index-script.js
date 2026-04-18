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

    // Projects Interactivity Logic
    const projectCards = document.querySelectorAll('.project-card-interactive');
    const infoBox = document.getElementById('project-info-box');
    
    if (infoBox) {
        const infoPlaceholder = infoBox.querySelector('.info-placeholder');
        const infoContent = infoBox.querySelector('.info-content');
        
        const infoTitle = document.getElementById('info-title');
        const infoDescription = document.getElementById('info-description');
        const infoTime = document.getElementById('info-time');
        const infoInstitution = document.getElementById('info-institution');

        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Extract data from attributes
                const title = card.getAttribute('data-title');
                const description = card.getAttribute('data-description');
                const time = card.getAttribute('data-time');
                const institution = card.getAttribute('data-institution');

                // Update info box content
                infoTitle.textContent = title;
                infoDescription.textContent = description;
                infoTime.textContent = time;
                infoInstitution.textContent = institution;

                // Toggle visibility
                infoPlaceholder.classList.add('hidden');
                infoContent.classList.remove('hidden');

                // Active state styling
                projectCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }
});
