/**
 * JS Tasks Logic: Task Manager & Dynamic Form
 * Implementing ES6+, DOM APIs, and Events
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // TASK 1: MINI TASK MANAGER
    // ==========================================
    const taskInput = document.querySelector('#task-input');
    const addTaskBtn = document.querySelector('#add-task-btn');
    const taskList = document.querySelector('#task-list');

    const addTask = () => {
        const text = taskInput.value.trim();
        
        // Prevent empty tasks
        if (text === "") {
            alert("Please enter a task!");
            return;
        }

        // Create Task Item (li)
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // Create inner structure with Template Literals
        li.innerHTML = `
            <span class="task-text">${text}</span>
            <button class="delete-btn">Delete</button>
        `;

        // Toggle Completed Status
        const taskSpan = li.querySelector('.task-text');
        taskSpan.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        // Delete Task functionality
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        // Append to List
        taskList.appendChild(li);

        // Clear input
        taskInput.value = "";
        taskInput.focus();
    };

    // Event Listeners for Task Manager
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });


    // ==========================================
    // TASK 2: DYNAMIC UI
    // ==========================================
    
    // Part 1: Background Color Switcher
    const bgBox = document.querySelector('#dynamic-bg-box');
    const bgBtn = document.querySelector('#bg-change-btn');
    const colors = ['#1a1a1a', '#2d0a0a', '#0a2d0a', '#0a0a2d', '#2d2d0a'];
    let colorIndex = 0;

    bgBtn.addEventListener('click', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        bgBox.style.backgroundColor = colors[colorIndex];
    });

    // Part 2: Live Character Counter
    const charInput = document.querySelector('#char-input');
    const charCountDisplay = document.querySelector('#char-count');

    charInput.addEventListener('input', () => {
        const length = charInput.value.length;
        charCountDisplay.textContent = length;
        
        // Visual feedback if length gets high
        charCountDisplay.style.color = length > 50 ? '#e11d48' : '#10b981';
    });


    // ==========================================
    // TASK 2: FORM VALIDATION
    // ==========================================
    const form = document.querySelector('#registration-form');

    if (form) {
        const inputs = [...form.querySelectorAll('input')];
        let isSubmitted = false;

        const validators = {
            firstName: value => value.length > 0,
            lastName: value => value.length > 0,
            username: value => value.length >= 8,
            email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            // Min 8 chars, at least 1 number and 1 special character
            password: value => /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value)
        };

        const validateInput = (input, forceShow = false) => {
            const value = input.value.trim();
            const validator = validators[input.id];
            const isValid = validator ? validator(value) : value.length > 0;

            if (isValid) {
                input.classList.remove('invalid');
                input.classList.add('valid');
            } else if (forceShow) {
                input.classList.remove('valid');
                input.classList.add('invalid');
            } else {
                // Keep field neutral until first blur/submit
                input.classList.remove('valid', 'invalid');
            }

            return isValid;
        };

        // Live validation: if a field was invalid, typing fixes it immediately
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const shouldShow = isSubmitted || input.classList.contains('invalid');
                validateInput(input, shouldShow);
            });

            input.addEventListener('blur', () => {
                validateInput(input, true);
            });
        });

        // Form submit handling
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            isSubmitted = true;

            const isFormValid = inputs.every(input => validateInput(input, true));

            if (isFormValid) {
                alert('Registration Successful!');
                form.reset();
                isSubmitted = false;
                inputs.forEach(input => input.classList.remove('valid', 'invalid'));
            } else {
                alert('Please fix the errors in the form.');
            }
        });
    }

});
