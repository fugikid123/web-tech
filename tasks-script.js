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
    const inputs = form.querySelectorAll('input');

    const validateInput = (input) => {
        let isValid = true;
        const value = input.value.trim();
        const type = input.id;

        // Validation Rules
        if (value === "") {
            isValid = false;
        } else {
            switch(type) {
                case 'username':
                    isValid = value.length >= 8;
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(value);
                    break;
                case 'password':
                    // Min 8 chars, 1 number, 1 special char
                    const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
                    isValid = passRegex.test(value);
                    break;
            }
        }

        // Apply Styles
        if (isValid) {
            input.classList.add('valid');
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
        }

        return isValid;
    };

    // Live Validation on input/blur
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // Form Submit Handling
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            alert('Registration Successful!');
            form.reset();
            inputs.forEach(i => i.classList.remove('valid', 'invalid'));
        } else {
            alert('Please fix the errors in the form.');
        }
    });

});
