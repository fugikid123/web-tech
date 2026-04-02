/**
 * Hypertrophy Page Specific Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Posture Interactive Display ---
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
                displayTitle.textContent = data.title;
                displayDesc.textContent = data.desc;
                displayImg.src = data.img;
                displaySource.textContent = data.source;
                postureItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const displayContent = document.querySelector('.posture-detail-content');
                if (displayContent) {
                    displayContent.style.animation = 'none';
                    void displayContent.offsetWidth;
                    displayContent.style.animation = 'fadeIn 0.4s ease-out';
                }
            }
        };
        item.addEventListener('mouseenter', updateDisplay);
        item.addEventListener('click', updateDisplay);
    });

    // --- 2. Mobility Interactive Display ---
    const mobilityItems = document.querySelectorAll('.mobility-nav-item');
    const mobDisplayTitle = document.getElementById('mob-display-title');
    const mobDisplayDesc = document.getElementById('mob-display-description');
    const mobDisplayImg = document.getElementById('mob-display-image');
    const mobDisplaySource = document.getElementById('mob-display-source');

    const mobilityData = {
        ankle: {
            title: 'Ankle Dorsiflexion',
            desc: 'Limited ankle range often leads to poor squat depth, knee compensation, and increased risk of lower body injuries.',
            img: 'https://i0.wp.com/e3rehab.com/wp-content/uploads/2023/11/C0004.00_01_44_04.Still010-scaled.jpg?fit=2560%2C1440&ssl=1',
            source: 'Source: e3rehab.com'
        },
        shoulder: {
            title: 'Shoulder Mobility',
            desc: 'Restricted overhead range impacts press movements and posture.',
            img: 'https://tommorrison.uk/storage/vVOL7Oz82er7CLDCXPYmoItVbJHwBrLdSv3cY8iD.jpeg',
            source: 'Source: tommorrison.uk'
        },
        scapular: {
            title: 'Scapular Mobility',
            desc: 'Proper shoulder blade movement is key to avoiding shoulder impingement.',
            img: 'https://s3.amazonaws.com/production.scholastica/public/attachments/33e4e791-a9c4-479a-8dfc-cfd98fa2e5dd/large/figure_5._scapular_retraction_test._the_examiner_first_performs_a_traditional_flexion_manual_strengt.png',
            source: 'Source: scholastica / research'
        },
        hip: {
            title: 'Hip Mobility',
            desc: 'Crucial for effective leg training and protecting the lower back.',
            img: 'https://noregretspt.com.au/wp-content/uploads/2025/02/Anterior-Hip-Stretching-good-vs-bad.png',
            source: 'Source: noregretspt.com.au'
        }
    };

    mobilityItems.forEach(item => {
        const updateMobDisplay = () => {
            const type = item.getAttribute('data-mobility');
            const data = mobilityData[type];
            if (data && mobDisplayTitle) {
                mobDisplayTitle.textContent = data.title;
                mobDisplayDesc.textContent = data.desc;
                mobDisplayImg.src = data.img;
                mobDisplaySource.textContent = data.source;
                mobilityItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const displayContent = document.querySelector('.mobility-detail-content');
                if (displayContent) {
                    displayContent.style.animation = 'none';
                    void displayContent.offsetWidth;
                    displayContent.style.animation = 'fadeIn 0.4s ease-out';
                }
            }
        };
        item.addEventListener('mouseenter', updateMobDisplay);
        item.addEventListener('click', updateMobDisplay);
    });

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

    // --- 4. Form Validation ---
    const signupForm = document.querySelector('form');
    if (signupForm) {
        const inputs = signupForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) input.classList.add('valid');
                else input.classList.remove('valid');
            });
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: signupForm.name.value,
                email: signupForm.email.value,
                age: signupForm.age.value,
                level: signupForm.level.value,
                days: Array.from(signupForm.querySelectorAll('input[name="days"]:checked')).map(el => el.value)
            };

            try {
                const record = window.AppDB.save('hypertrophy_signups', formData);
                signupForm.parentElement.innerHTML = `
                    <div class="success-message" style="text-align: center; padding: 2rem;">
                        <h3 style="color: #10b981;">✓ Signup Recorded!</h3>
                        <p>Thank you, ${formData.name} for signing up. I will contact you soon.</p>
                        <div style="margin-top: 1.5rem;">
                            <button onclick="location.reload()" class="btn-secondary">Back</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                alert('Error saving details.');
            }
        });
    }
});
