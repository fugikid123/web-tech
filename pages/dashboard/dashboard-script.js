/**
 * Dashboard Specific Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const pageHero = document.getElementById('page-hero');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if user is logged in
    const authUser = localStorage.getItem('logged_in_user');
    if (!authUser) {
        window.location.href = '../hypertrophy/hypertrophy.html';
        return;
    }

    const isAdmin = (authUser === 'admin');
    
    const DEFAULT_DANIEL_DATA = {
        name: "Daniel Tran",
        age: 27,
        occupation: "Software Developer",
        height: 172,
        weight: 78,
        dailyCalorieGoal: 2300,
        currentCalories: 1800,
        dailyStepGoal: 8000,
        currentSteps: 5200,
        workoutStreak: 3,
        photo: "../../assets/images/user1-avatar.jpg",
        nutrition: { protein: 190, carb: 200, fat: 80 },
        postureRoutine: [
            { name: "Chin tucks", sets: 2 },
            { name: "Wall angels", sets: 2 },
            { name: "Hip flexor stretch", sets: 2 }
        ],
        workoutPlan: [
            { name: "Bench Press", sets: "3x8-10" },
            { name: "Pull Ups", sets: "3xMAX" },
            { name: "Shoulder Press", sets: "3x12" }
        ],
        timeline: [
            { date: "15/4/2026", weight: 78.5, calories: 2300, steps: 7200, protein: 185, carb: 210, fat: 75, photo: "../../assets/images/DT.jpg", aim: "Fatloss" },
            { date: "15/7/2026", weight: 70.0, calories: 2100, steps: 10000, protein: 180, carb: 220, fat: 65, photo: "../../assets/images/DT2.jpg", aim: "Muscle build" }
        ],
        weightTrend: [78.5, 78.2, 78.4, 78.1, 78.0, 77.9, 78.0],
        stepsTrend: [7200, 8100, 6500, 9200, 4100, 5200, 7800]
    };

    let danielData = JSON.parse(localStorage.getItem('daniel_data')) || DEFAULT_DANIEL_DATA;

    // Safety & Update: ensure new required entries and fields are present
    const requiredDate = "15/7/2026";
    const hasJulyEntry = danielData.timeline.some(e => e.date === requiredDate);
    if (!hasJulyEntry) {
        danielData.timeline.push({ 
            date: "15/7/2026", weight: 70.0, calories: 2100, steps: 10000, 
            protein: 180, carb: 220, fat: 65, photo: "../../assets/images/DT2.jpg", aim: "muscle build" 
        });
    }

    danielData.timeline.forEach((entry, idx) => {
        if (!entry.aim) entry.aim = entry.date === "15/4/2026" ? "Fatloss" : "muscle build";
        if (entry.date === "15/4/2026") entry.photo = "../../assets/images/DT.jpg";
        if (entry.date === "15/7/2026") entry.photo = "../../assets/images/DT2.jpg";
    });

    if (danielData.photo === "user1-avatar.jpg") danielData.photo = "../../assets/images/user1-avatar.jpg";

    danielData.timeline.sort((a, b) => {
        const parseDate = (d) => {
            const [day, month, year] = d.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        return parseDate(a.date) - parseDate(b.date);
    });

    const saveDanielData = () => {
        localStorage.setItem('daniel_data', JSON.stringify(danielData));
    };

    const fetchRandomQuote = async () => {
        try {
            const response = await fetch('../../assets/data/fitness quotes.txt');
            const text = await response.text();
            const quotes = text.split('\n').filter(q => q.trim() !== "");
            return quotes[Math.floor(Math.random() * quotes.length)] || "“Discipline beats motivation every single time.”";
        } catch (error) {
            return "“Discipline beats motivation every single time.”";
        }
    };

    const renderTimelineDetail = (entry, idx) => {
        if (!entry) return '<div class="info-placeholder">Select an entry to view details.</div>';
        
        return `
            <div class="timeline-detail-display">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
                    <div>
                        <h3 style="color: var(--accent-red); margin: 0; font-size: 2rem;">Phase ${idx + 1}</h3>
                        <p style="color: var(--text-dim); margin-top: 0.5rem; font-size: 1.1rem;">${entry.date} — Result</p>
                    </div>
                    ${isAdmin ? `<button class="btn-primary delete-entry" data-index="${idx}">Delete Entry</button>` : ''}
                </div>
                
                <div class="timeline-detail-grid">
                    <div class="info-visual">
                        <img src="${entry.photo}" style="width: 100%; height: auto; max-height: 500px; object-fit: contain; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid var(--border-color);">
                    </div>
                    <div class="info-details">
                        <div class="card" style="margin-top: 0; background: rgba(255,255,255,0.02); padding: 1.5rem;">
                            <h4 style="margin-top: 0; color: var(--accent-red); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">Nutrient Breakdown</h4>
                            <div style="display: flex; gap: 2rem; margin-top: 1.25rem; flex-wrap: wrap;">
                                <div><div style="font-size: 1.5rem; font-weight: bold; color: var(--text-main);">${entry.protein}g</div><div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase;">Protein</div></div>
                                <div><div style="font-size: 1.5rem; font-weight: bold; color: var(--text-main);">${entry.carb}g</div><div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase;">Carbs</div></div>
                                <div><div style="font-size: 1.5rem; font-weight: bold; color: var(--text-main);">${entry.fat}g</div><div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase;">Fats</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    const renderDashboard = async () => {
        const data = danielData;
        const quote = await fetchRandomQuote();
        
        // Calculate Average Steps for Hero
        const avgSteps = Math.round(data.stepsTrend.reduce((a, b) => a + b, 0) / data.stepsTrend.length);

        pageHero.innerHTML = `
            <div style="display: flex; gap: 3rem; align-items: center; justify-content: center; flex-wrap: wrap; text-align: left; max-width: 1800px; margin: 0 auto;">
                <div style="position: relative; display: inline-block;">
                    <img src="${data.photo}" class="user-profile-img" style="width:180px; height:180px; border-width:4px;">
                    ${isAdmin ? '<button id="edit-avatar" style="position: absolute; bottom: 10px; right: 0; padding: 4px 8px; font-size: 10px;" class="btn-primary">Edit</button>' : ''}
                </div>
                <div style="flex: 1; min-width: 300px;">
                    <h1 style="margin: 0; font-size: 2.5rem;">Welcome back, ${data.name.split(' ')[0]} 👋</h1>
                    <div style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid var(--border-color);">
                        <h3 style="margin-top: 0; color: var(--accent-red); font-size: 0.9rem; text-transform: uppercase;">Overview</h3>
                        <ul class="custom-list" style="margin: 1rem 0 0 0; font-size: 1.1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <li><strong>Name:</strong> ${data.name}</li>
                            <li><strong>Age:</strong> ${data.age}</li>
                            <li><strong>Weight:</strong> ${data.weight} kg</li>
                            <li><strong>Average Steps:</strong> ${avgSteps}</li>
                            <li><strong>Current Aim:</strong> <span style="color: var(--accent-red);">Fatloss</span></li>
                        </ul>
                    </div>
                    <p id="daily-quote" style="text-transform: none; font-style: italic; margin-top: 1.5rem; color: var(--accent-red); font-size: 1rem;">
                        ${quote}
                    </p>
                    ${isAdmin ? '<div style="margin-top: 10px;"><span style="background: var(--accent-red); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">ADMIN MODE</span></div>' : ''}
                </div>
            </div>
        `;

        mainContent.innerHTML = `
            <section id="timeline-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2>Progress Timeline</h2>
                    ${isAdmin ? '<button id="add-timeline-point" class="btn-primary">+ Add Entry</button>' : ''}
                </div>
                
                <div class="timeline-split-container">
                    <div class="timeline-visual-nav">
                        <div class="timeline-vertical-line"></div>
                        <div class="timeline-vertical-points" id="timeline-points">
                            ${data.timeline.map((entry, idx) => `
                                <div class="timeline-point ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                                    <div class="timeline-circle"></div>
                                    <div class="timeline-date">Phase ${idx + 1}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="info-box" style="margin: 0; padding: 2.5rem;">
                        ${renderTimelineDetail(data.timeline[0], 0)}
                    </div>
                </div>
            </section>

            <section id="workout-section">
                <h2 style="margin-bottom: 2rem;">Workout plan</h2>
                <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                    <div class="card" style="flex: 1; min-width: 300px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3>Functional workout</h3>
                            ${isAdmin ? '<button id="edit-posture" class="btn-primary">Edit</button>' : ''}
                        </div>
                        <div id="functional-items-container" style="margin-top: 1rem;">
                            ${data.postureRoutine.map((r, idx) => `
                                <div class="plan-item">
                                    <input type="checkbox" class="workout-check">
                                    <span><strong>${r.name}</strong> – ${r.sets} sets</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="card" style="flex: 1; min-width: 300px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3>Physical workout</h3>
                            ${isAdmin ? '<button id="edit-workout" class="btn-primary">Edit</button>' : ''}
                        </div>
                        <div id="physical-items-container" style="margin-top: 1rem;">
                            ${data.workoutPlan.map((w, idx) => `
                                <div class="plan-item">
                                    <input type="checkbox" class="workout-check">
                                    <span><strong>${w.name}</strong>: ${w.sets}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>

            <section id="trends">
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                    <h2>Progress tracker</h2>
                    <div><button id="update-trends" class="btn-primary">Add new record</button></div>
                </div>
                <div class="card" style="background: white; border: 1px solid #ddd;">
                    <h3 style="color: #333; margin-top: 0;">7-Day Progress Overview</h3>
                    <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: #555; padding-left: 10px;">
                        <span style="display: flex; align-items: center; gap: 8px;"><span style="width: 16px; height: 16px; background: var(--accent-red); border-radius: 3px; display: inline-block;"></span> <strong>Weight (kg)</strong></span>
                        <span style="display: flex; align-items: center; gap: 8px;"><span style="width: 16px; height: 16px; background: #3b82f6; border-radius: 3px; display: inline-block;"></span> <strong>Steps</strong></span>
                    </div>
                    <div class="chart-container" id="merged-chart" style="background: white; border-radius: 8px; padding: 10px;">
                        <svg viewBox="0 0 700 250" class="line-chart" style="overflow: visible;">
                            ${data.weightTrend.map((w, i) => {
                                const s = data.stepsTrend[i];
                                const wHeight = Math.max(20, (w - 60) * 6); 
                                const sHeight = (s / 12000) * 180;
                                return `
                                    <rect x="${i * 100 + 20}" y="${200 - wHeight}" width="28" height="${wHeight}" fill="var(--accent-red)" rx="4"></rect>
                                    <text x="${i * 100 + 34}" y="${200 - wHeight - 10}" fill="#333" font-size="13" font-weight="bold" text-anchor="middle">${w}</text>
                                    <rect x="${i * 100 + 52}" y="${200 - sHeight}" width="28" height="${sHeight}" fill="#3b82f6" rx="4"></rect>
                                    <text x="${i * 100 + 66}" y="${200 - sHeight - 10}" fill="#333" font-size="11" font-weight="bold" text-anchor="middle">${s}</text>
                                    <text x="${i * 100 + 50}" y="230" fill="#888" font-size="12" font-weight="600" text-anchor="middle">Day ${i + 1}</text>
                                `;
                            }).join('')}
                            <line x1="0" y1="200" x2="700" y2="200" stroke="#eee" stroke-width="2" />
                        </svg>
                    </div>
                </div>
            </section>
        `;

        const timelinePoints = document.querySelectorAll('.timeline-point');
        const detailContent = document.getElementById('info-box');
        
        timelinePoints.forEach(point => {
            point.addEventListener('click', () => {
                const idx = parseInt(point.getAttribute('data-index'));
                timelinePoints.forEach(p => p.classList.remove('active'));
                point.classList.add('active');
                detailContent.innerHTML = renderTimelineDetail(data.timeline[idx], idx);
                attachDetailBtnListeners(detailContent);
            });
        });

        const attachDetailBtnListeners = (container) => {
            const delBtn = container.querySelector('.delete-entry');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    const deleteIdx = parseInt(e.target.getAttribute('data-index'));
                    data.timeline.splice(deleteIdx, 1);
                    saveDanielData();
                    renderDashboard();
                });
            }
        };
        attachDetailBtnListeners(detailContent);

        // Interactivity for all workout checkboxes
        document.querySelectorAll('.workout-check').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const span = e.target.nextElementSibling;
                span.style.color = e.target.checked ? '#555' : 'var(--text-main)';
                span.style.textDecoration = e.target.checked ? 'line-through' : 'none';
            });
        });

        // Helper to create and show admin modals
        const showAdminModal = (title, formHTML, onSubmit) => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content card" style="max-width: 500px;">
                    <span class="close-admin-modal close-modal">&times;</span>
                    <h2 style="border-left: none; padding-left: 0; text-align: center;">${title}</h2>
                    <form id="admin-modal-form">
                        ${formHTML}
                        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">Save Changes</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.close-admin-modal').onclick = () => modal.remove();
            modal.querySelector('#admin-modal-form').onsubmit = (e) => {
                e.preventDefault();
                onSubmit(new FormData(e.target));
                modal.remove();
            };
        };

        if (isAdmin) {
            document.getElementById('add-timeline-point').addEventListener('click', () => {
                showAdminModal("Add Timeline Entry", `
                    <div class="input-group">
                        <label>Date (DD/MM/YYYY)</label>
                        <input type="text" name="date" required value="${new Date().toLocaleDateString('en-GB')}">
                    </div>
                    <div class="input-group">
                        <label>Weight (kg)</label>
                        <input type="number" name="weight" step="0.1" required value="${data.weight}">
                    </div>
                    <div class="input-group">
                        <label>Aim</label>
                        <input type="text" name="aim" required value="muscle build">
                    </div>
                `, (formData) => {
                    data.timeline.push({ 
                        date: formData.get('date'), 
                        weight: parseFloat(formData.get('weight')), 
                        aim: formData.get('aim'), 
                        calories: data.dailyCalorieGoal, steps: data.currentSteps, 
                        protein: data.nutrition.protein, carb: data.nutrition.carb, fat: data.nutrition.fat, 
                        photo: "../../assets/images/DT2.jpg" 
                    });
                    saveDanielData();
                    renderDashboard();
                });
            });

            document.getElementById('edit-posture').addEventListener('click', () => {
                const currentStr = data.postureRoutine.map(r => `${r.name}-${r.sets}`).join(', ');
                showAdminModal("Edit Functional Workout", `
                    <div class="input-group">
                        <label>Routine (Format: Name-Sets, Name-Sets...)</label>
                        <textarea name="routine" rows="4" required>${currentStr}</textarea>
                    </div>
                `, (formData) => {
                    const newRoutine = formData.get('routine');
                    data.postureRoutine = newRoutine.split(',').map(s => {
                        const [name, sets] = s.split('-').map(p => p.trim());
                        return { name, sets: parseInt(sets) || 0 };
                    });
                    saveDanielData();
                    renderDashboard();
                });
            });

            document.getElementById('edit-workout').addEventListener('click', () => {
                const currentStr = data.workoutPlan.map(w => `${w.name}-${w.sets}`).join(', ');
                showAdminModal("Edit Physical Workout", `
                    <div class="input-group">
                        <label>Plan (Format: Name-Sets, Name-Sets...)</label>
                        <textarea name="plan" rows="4" required>${currentStr}</textarea>
                    </div>
                `, (formData) => {
                    const newPlan = formData.get('plan');
                    data.workoutPlan = newPlan.split(',').map(s => {
                        const [name, sets] = s.split('-').map(p => p.trim());
                        return { name, sets };
                    });
                    saveDanielData();
                    renderDashboard();
                });
            });
        }

        document.getElementById('update-trends').addEventListener('click', () => {
            showAdminModal("Add New Progress Record", `
                <div class="input-group">
                    <label>Today's Weight (kg)</label>
                    <input type="number" name="weight" step="0.1" required value="${data.weight}">
                </div>
                <div class="input-group">
                    <label>Today's Steps</label>
                    <input type="number" name="steps" required value="${data.currentSteps}">
                </div>
            `, (formData) => {
                const newWeight = parseFloat(formData.get('weight'));
                const newSteps = parseInt(formData.get('steps'));
                if (!isNaN(newWeight)) { data.weightTrend.shift(); data.weightTrend.push(newWeight); data.weight = newWeight; }
                if (!isNaN(newSteps)) { data.stepsTrend.shift(); data.stepsTrend.push(newSteps); data.currentSteps = newSteps; }
                saveDanielData();
                renderDashboard();
            });
        });
    };

    logoutBtn.onclick = () => {
        localStorage.removeItem('logged_in_user');
        window.location.href = '../hypertrophy/hypertrophy.html';
    };

    renderDashboard();
});