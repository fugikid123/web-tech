/**
 * General Interactivity Script
 * Using ES6+, DOM API, and Events
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // --- 1. API Integrations & Form Submission ---
    const signupForm = document.querySelector('form');
    
    // Function to handle fetching and displaying data
    const initAPIs = async () => {
        // No longer overwriting principles images to ensure they display correctly from HTML
    };

    initAPIs();

    // --- Exercise Search (API-Ninjas) ---
    const exerciseBtn = document.getElementById('search-exercise-btn');
    const muscleSelect = document.getElementById('muscle-select');
    const exerciseResults = document.getElementById('exercise-results');
    const NINJA_API_KEY = '3WIbUGGs3LDDu6Ctfgx2w5ytyf2mMLCXObUScC55';

    const fetchExercises = async () => {
        const muscle = muscleSelect.value;
        if (!muscle) {
            alert('Please select a muscle group.');
            return;
        }

        exerciseResults.innerHTML = '<div class="spinner" style="grid-column: 1/-1;"></div>';
        exerciseBtn.disabled = true;
        exerciseBtn.textContent = 'Searching...';

        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
                headers: { 'X-Api-Key': NINJA_API_KEY }
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API Error (${response.status}): ${errorBody || response.statusText}`);
            }
            
            const exercises = await response.json();
            renderExercises(exercises);
        } catch (error) {
            console.error('Error:', error);
            exerciseResults.innerHTML = `<p style="color:var(--accent-red); grid-column:1/-1; text-align:center;">
                Error loading exercises.<br>
                <small style="opacity:0.8;">${error.message}</small>
            </p>`;
        } finally {
            exerciseBtn.disabled = false;
            exerciseBtn.textContent = 'Find Exercises';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return '#10b981'; // Green
            case 'intermediate': return '#f59e0b'; // Yellow/Amber
            case 'expert': return '#ef4444'; // Red
            default: return 'var(--text-dim)';
        }
    };

    const renderExercises = (exercises) => {
        if (!exercises || exercises.length === 0) {
            exerciseResults.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No exercises found for this muscle group.</p>';
            return;
        }

        exerciseResults.innerHTML = exercises.map((ex, index) => `
            <div class="card" style="margin:0; display:flex; flex-direction:column; gap:0.5rem;">
                <h3 style="color:var(--accent-white); border:none; padding:0; font-size:1.1rem; text-transform:capitalize;">${ex.name}</h3>
                <img src="https://loremflickr.com/400/250/workout,gym?lock=${index + 20}" alt="Workout" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin:0.5rem 0; background:#222;">
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <span style="font-size:0.7rem; padding:0.2rem 0.5rem; background:#333; border-radius:4px; color:${getDifficultyColor(ex.difficulty)}; font-weight:bold; text-transform:capitalize;">${ex.difficulty}</span>
                </div>
                <p style="font-size:0.85rem; color:var(--text-dim); line-height:1.4; margin-top:0.5rem;">
                    ${ex.instructions.length > 300 ? ex.instructions.substring(0, 300) + '...' : ex.instructions}
                </p>
            </div>
        `).join('');
    };

    if (exerciseBtn) {
        exerciseBtn.addEventListener('click', fetchExercises);
    }

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
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Stop page reload
            
            let allValid = true;
            inputs.forEach(input => {
                validateField(input, true);
                if (!input.checkValidity()) allValid = false;
            });

            if (allValid) {
                // Prepare form data
                const formData = {
                    name: signupForm.name.value,
                    email: signupForm.email.value,
                    age: signupForm.age.value,
                    level: signupForm.level.value,
                    days: Array.from(signupForm.querySelectorAll('input[name="days"]:checked')).map(el => el.value)
                };

                // 👤 Customer details (POST /users)
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    const result = await response.json();
                    console.log('Success:', result);

                    // DOM Manipulation: Replace form with success message
                    const container = signupForm.parentElement;
                    container.innerHTML = `
                        <div class="success-message" style="text-align: center; padding: 2rem; animation: fadeIn 0.5s ease-in;">
                            <h3 style="color: #10b981; margin-bottom: 1rem;">✓ Lead Captured Successfully! (ID: ${result.id})</h3>
                            <p>Thank you for your interest, ${result.name}. We've received your request for the <strong>${result.level}</strong> training guide.</p>
                            <p style="font-size:0.8rem; color:var(--text-dim); margin-top:1rem;">API Response: Simulated success with JSONPlaceholder.</p>
                            <button onclick="location.reload()" class="btn-secondary" style="margin-top: 1rem;">Back to form</button>
                        </div>
                    `;
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('An error occurred. Please try again later.');
                }
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

    // --- 6. Interactive Posture Display ---
    const postureItems = document.querySelectorAll('.posture-nav-item');
    const displayTitle = document.getElementById('display-title');
    const displayDesc = document.getElementById('display-description');
    const displayImg = document.getElementById('display-image');
    const displaySource = document.getElementById('display-source');

    const postureData = {
        apt: {
            title: 'Anterior Pelvic Tilt (APT)',
            desc: 'Excessive forward tilt of the pelvis, often caused by tight hip flexors and weak glutes/abs. It places high stress on the lower back during heavy lifts.',
            img: 'https://backintelligence.com/wp-content/uploads/2018/01/anterior-pelvic-tilt-image.png',
            source: 'Source: backintelligence.com'
        },
        head: {
            title: 'Forward Head Posture',
            desc: 'Commonly known as "tech neck," this shifts the center of gravity forward, straining the neck muscles and affecting breathing mechanics during exercise.',
            img: 'https://noregretspt.com.au/wp-content/uploads/2025/02/Forward-Head-Posture-infographic.jpg',
            source: 'Source: noregretspt.com.au'
        },
        shoulders: {
            title: 'Rounded Shoulders',
            desc: 'Resulting from tight pectoral muscles and weak upper back, this limitation restricts your range of motion in pressing and pulling movements.',
            img: 'https://jackhanrahanfitness.com/wp-content/uploads/2017/08/r-shoulders-e1504721366824-1024x951.jpg',
            source: 'Source: jackhanrahanfitness.com'
        },
        valgus: {
            title: 'Knee Valgus',
            desc: 'Knees collapsing inward during squats or lunges. This is often a sign of weak gluteus medius and can lead to significant knee joint issues.',
            img: 'https://selectflex.com/cdn/shop/articles/effective-solutions-for-valgus-knees-840802.jpg?v=1700424812',
            source: 'Source: selectflex.com'
        },
        feet: {
            title: 'Flat Feet',
            desc: 'Collapse of the medial arch affects the entire kinetic chain, potentially causing ankle, knee, and hip pain when performing standing exercises.',
            img: 'https://storage.googleapis.com/treatspace-prod-media/pracimg/u-2202/shutterstock_2125649891.jpeg',
            source: 'Source: shutterstock / treatspace'
        }
    };

    postureItems.forEach(item => {
        const updateDisplay = () => {
            const type = item.getAttribute('data-posture');
            const data = postureData[type];

            if (data && displayTitle) {
                // Update content
                displayTitle.textContent = data.title;
                displayDesc.textContent = data.desc;
                displayImg.src = data.img;
                displaySource.textContent = data.source;

                // Update active state in sidebar
                postureItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Trigger animation reset
                const displayContent = document.querySelector('.posture-detail-content');
                if (displayContent) {
                    displayContent.style.animation = 'none';
                    void displayContent.offsetWidth; // Trigger reflow
                    displayContent.style.animation = 'fadeIn 0.4s ease-out';
                }
            }
        };

        item.addEventListener('mouseenter', updateDisplay);
        item.addEventListener('click', updateDisplay); // For mobile/touch
    });

    // --- 7. Interactive Mobility Display ---
    const mobilityItems = document.querySelectorAll('.mobility-nav-item');
    const mobDisplayTitle = document.getElementById('mob-display-title');
    const mobDisplayDesc = document.getElementById('mob-display-description');
    const mobDisplayImg = document.getElementById('mob-display-image');
    const mobDisplaySource = document.getElementById('mob-display-source');

    const mobilityData = {
        ankle: {
            title: 'Ankle Dorsiflexion',
            desc: 'Limited ankle range often leads to poor squat depth, knee compensation, and increased risk of lower body injuries. Proper ankle mobility is foundational for all leg exercises.',
            img: 'https://i0.wp.com/e3rehab.com/wp-content/uploads/2023/11/C0004.00_01_44_04.Still010-scaled.jpg?fit=2560%2C1440&ssl=1',
            source: 'Source: e3rehab.com'
        },
        shoulder: {
            title: 'Shoulder Mobility',
            desc: 'Restricted overhead range impacts press movements and posture. It can lead to compensations in the lower back and neck when trying to lift overhead.',
            img: 'https://tommorrison.uk/storage/vVOL7Oz82er7CLDCXPYmoItVbJHwBrLdSv3cY8iD.jpeg  ',
            source: 'Source: tommorrison.uk'
        },
        scapular: {
            title: 'Scapular Mobility',
            desc: 'Proper shoulder blade movement is key to avoiding shoulder impingement and ensuring strong pulling mechanics. It allows for a stable base during heavy lifts.',
            img: 'https://s3.amazonaws.com/production.scholastica/public/attachments/33e4e791-a9c4-479a-8dfc-cfd98fa2e5dd/large/figure_5._scapular_retraction_test._the_examiner_first_performs_a_traditional_flexion_manual_strengt.png',
            source: 'Source: scholastica / research'
        },
        hip: {
            title: 'Hip Mobility',
            desc: 'Crucial for effective leg training and protecting the lower back. Tight hips can cause the pelvis to tilt, leading to lower back pain and poor movement quality.',
            img: 'https://noregretspt.com.au/wp-content/uploads/2025/02/Anterior-Hip-Stretching-good-vs-bad.png',
            source: 'Source: noregretspt.com.au'
        }
    };

    mobilityItems.forEach(item => {
        const updateMobDisplay = () => {
            const type = item.getAttribute('data-mobility');
            const data = mobilityData[type];

            if (data && mobDisplayTitle) {
                // Update content
                mobDisplayTitle.textContent = data.title;
                mobDisplayDesc.textContent = data.desc;
                mobDisplayImg.src = data.img;
                mobDisplaySource.textContent = data.source;

                // Update active state in sidebar
                mobilityItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Trigger animation reset
                const displayContent = document.querySelector('.mobility-detail-content');
                if (displayContent) {
                    displayContent.style.animation = 'none';
                    void displayContent.offsetWidth; // Trigger reflow
                    displayContent.style.animation = 'fadeIn 0.4s ease-out';
                }
            }
        };

        item.addEventListener('mouseenter', updateMobDisplay);
        item.addEventListener('click', updateMobDisplay); // For mobile/touch
    });

    // --- 8. Programming Quotes API Integration ---
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');

    /**
     * Fetches a random programming quote from an API
     */
    const fetchQuote = async () => {
        if (!quoteText) return;

        try {
            quoteText.textContent = 'Updating inspiration...';
            quoteAuthor.textContent = '';
            
            // Note: Using a reliable public API for programming/tech quotes
            const response = await fetch('https://api.quotable.io/random?tags=technology|famous-quotes');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // Update UI with quote
            quoteText.textContent = `"${data.content}"`;
            quoteAuthor.textContent = data.author;
            
            // Add a small animation effect
            quoteText.style.animation = 'none';
            void quoteText.offsetWidth; // trigger reflow
            quoteText.style.animation = 'fadeIn 0.8s ease-in-out';
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            quoteText.textContent = '"Code is like humor. When you have to explain it, it’s bad."';
            quoteAuthor.textContent = 'Cory House';
        }
    };

    // Initial fetch on load
    if (quoteText) {
        fetchQuote();
    }

    // Event listener for button click
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', fetchQuote);
    }
});
