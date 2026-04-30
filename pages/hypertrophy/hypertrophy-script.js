/**
 * Hypertrophy Page Logic (Cleaned for Principles Only)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in and redirect to dashboard
    if (localStorage.getItem('logged_in_user')) {
        window.location.href = '../dashboard/dashboard.html';
    }

    // --- 3. Exercise Search (API-Ninjas) ---
    const exerciseBtn = document.getElementById('search-exercise-btn');
    const muscleSelect = document.getElementById('muscle-select');
    const exerciseResults = document.getElementById('exercise-results');
    const NINJA_API_KEY = '3WIbUGGs3LDDu6Ctfgx2w5ytyf2mMLCXObUScC55';

    const fetchExercises = async () => {
        const muscle = muscleSelect.value;
        if (!muscle) return alert('Please select a muscle group.');
        exerciseResults.innerHTML = '<div class="spinner" style="grid-column: 1/-1;"></div>';
        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
                headers: { 'X-Api-Key': NINJA_API_KEY }
            });
            const exercises = await response.json();
            renderExercises(exercises);
        } catch (error) {
            exerciseResults.innerHTML = '<p style="color:var(--accent-red); grid-column:1/-1;">Error loading exercises.</p>';
        }
    };

    const renderExercises = (exercises) => {
        if (!exercises || exercises.length === 0) {
            exerciseResults.innerHTML = '<p style="grid-column:1/-1;">No exercises found.</p>';
            return;
        }
        exerciseResults.innerHTML = exercises.map((ex, index) => `
            <div class="card">
                <h3>${ex.name}</h3>
                <img src="https://loremflickr.com/400/250/workout,gym?lock=${index + 20}" alt="Workout" style="width:100%; height:160px; object-fit:cover; border-radius:8px;">
                <p style="font-size:0.85rem; color:var(--text-dim);">${ex.instructions.substring(0, 200)}...</p>
            </div>
        `).join('');
    };

    if (exerciseBtn) exerciseBtn.addEventListener('click', fetchExercises);

    // --- 4. Auto-Album Cycle Logic ---
    const albums = {
        fitness: {
            imgId: 'fitness-img',
            captionId: 'fitness-album',
            images: [
                { url: '../../assets/images/Fitness transform/Female bef-aft.png', name: 'Sarah J.', period: '6 Months' },
                { url: '../../assets/images/Fitness transform/Male bef-aft.png', name: 'Michael T.', period: '9 Months' },
                { url: '../../assets/images/Fitness transform/Senior bef-aft.png', name: 'Arthur P.', period: '8 Months' }
            ],
            index: 0
        },
        posture: {
            imgId: 'posture-img',
            captionId: 'posture-album',
            images: [
                { url: '../../assets/images/Posture transform/Firefly_Gemini Flash_Before and after posture correction of a teenage boy, side by side comparison, same p 925209.png', name: 'Leo K.', period: '4 Months' },
                { url: '../../assets/images/Posture transform/Firefly_Gemini Flash_Before and after posture correction of a teenage girl, side view comparison, same per 99139.png', name: 'Sophie V.', period: '5 Months' },
                { url: '../../assets/images/Posture transform/Firefly_Gemini Flash_the before posture, make 2 knees bend in 99139.png', name: 'David L.', period: '7 Months' }
            ],
            index: 0
        }
    };

    function initAlbum(albumKey) {
        const album = albums[albumKey];
        const imgElement = document.getElementById(album.imgId);
        const container = imgElement.parentElement;
        const caption = document.querySelector(`#${album.captionId} .album-caption`);

        const updateView = (index) => {
            const imageData = album.images[index];
            imgElement.src = imageData.url;
            if (caption) {
                caption.innerHTML = `<strong>${imageData.name}</strong> — ${imageData.period} of training`;
            }
        };

        // Auto-cycle logic
        setInterval(() => {
            album.index = (album.index + 1) % album.images.length;
            container.style.opacity = '0';
            setTimeout(() => {
                updateView(album.index);
                container.style.opacity = '1';
            }, 400);
        }, 5000);

        updateView(0);
    }

    if (document.getElementById('fitness-img')) initAlbum('fitness');
    if (document.getElementById('posture-img')) initAlbum('posture');

    // --- 4b. Album Active State Toggle ---
    const comparisonCards = document.querySelectorAll('.comparison-card');
    comparisonCards.forEach(card => {
        card.addEventListener('click', () => {
            comparisonCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
    // Default first one to active
    if (comparisonCards.length > 0) comparisonCards[0].classList.add('active');

    // --- 5. Login Redirect Logic ---
    const loginModal = document.getElementById('login-modal');
    const loginNavBtn = document.getElementById('login-nav-btn');
    const closeLoginBtn = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => loginModal.classList.add('hidden'));
    }

    window.onclick = (event) => {
        if (event.target == loginModal) loginModal.classList.add('hidden');
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            if (user === 'user1' && pass === '12345') {
                localStorage.setItem('logged_in_user', 'user1');
                window.location.href = '../dashboard/dashboard.html';
            } else if (user === 'ad' && pass === '123') {
                localStorage.setItem('logged_in_user', 'admin');
                window.location.href = '../dashboard/dashboard.html';
            } else {
                loginError.style.opacity = '1';
                setTimeout(() => { loginError.style.opacity = '0'; }, 3000);
            }
        });
    }

    // --- 5. Form Validation (Matched with Index Page Style) ---
    const signupForm = document.querySelector('section#join form');
    if (signupForm) {
        const inputs = signupForm.querySelectorAll('input, select');

        const validateField = (input) => {
            let isValid = input.checkValidity();
            const value = input.value.trim();

            // Extra JS validation for Fullname (no digits)
            if (input.id === 'name' && /\d/.test(value)) {
                isValid = false;
                input.setCustomValidity("Name should not contain digits.");
            } else if (input.id === 'name') {
                input.setCustomValidity(""); // Clear custom error
            }

            // Extra JS validation for Email (.com requirement)
            if (input.type === 'email' && !value.endsWith('.com')) {
                isValid = false;
                input.setCustomValidity("Please input a valid email address");
            } else if (input.type === 'email') {
                input.setCustomValidity(""); // Clear custom error
            }

            if (isValid && value !== '') {
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

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!signupForm.checkValidity()) {
                return;
            }

            // Collect form data
            const formData = {
                name: signupForm.name.value,
                age: signupForm.age.value ? parseInt(signupForm.age.value) : null,
                email: signupForm.email.value,
                level: signupForm.level.value,
                days: Array.from(signupForm.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value)
            };

            try {
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const result = await response.json();
                    const userName = result.data.name;
                        
                    signupForm.parentElement.innerHTML = `
                        <div class="success-message" style="text-align: center; padding: 2rem;">
                            <h3 style="color: #10b981;">✓ Signup Recorded in MongoDB!</h3>
                            <p>Thank you, ${userName} for signing up. Your request has been saved to our real database.</p>
                            <div style="margin-top: 1.5rem;">
                                <button onclick="location.reload()" class="btn-primary">Back</button>
                            </div>
                        </div>
                    `;
                } else {
                    const errData = await response.json();
                    alert("Error saving signup: " + (errData.error || "Unknown error"));
                }
            } catch (error) {
                console.error("Error connecting to backend:", error);
                alert("Could not connect to the backend server. Make sure it's running (node server.js)");
            }
        });
    }
});

