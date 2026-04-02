/**
 * Shared Interactivity for all pages
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Smooth Scrolling for Navigation ---
    const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle) navToggle.checked = false;
            }
        });
    });

    // --- 2. Scroll Reveal Animation ---
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
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0.9';
        section.style.transition = 'all 0.6s ease-out';
    });
    window.addEventListener('scroll', revealOnScroll);

    // --- 3. Quotes API ---
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');

    const fetchQuote = async () => {
        if (!quoteText) return;
        try {
            quoteText.textContent = 'Updating inspiration...';
            const response = await fetch('https://api.quotable.io/random?tags=technology|famous-quotes');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            quoteText.textContent = `"${data.content}"`;
            quoteAuthor.textContent = data.author;
        } catch (error) {
            quoteText.textContent = '"Code is like humor. When you have to explain it, it’s bad."';
            quoteAuthor.textContent = 'Cory House';
        }
    };

    if (quoteText) fetchQuote();
    if (newQuoteBtn) newQuoteBtn.addEventListener('click', fetchQuote);

    // --- 4. JSON Database Helper ---
    window.AppDB = {
        save: (collection, data) => {
            const db = JSON.parse(localStorage.getItem('portfolio_db')) || { hypertrophy_signups: [], contact_messages: [] };
            const record = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                ...data
            };
            db[collection].push(record);
            localStorage.setItem('portfolio_db', JSON.stringify(db));
            console.log(`Database Updated: Saved to ${collection}`, record);
            return record;
        },
        getAll: () => {
            return JSON.parse(localStorage.getItem('portfolio_db')) || { hypertrophy_signups: [], contact_messages: [] };
        },
        exportJSON: () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.AppDB.getAll(), null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "database_export.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    };

    // --- 5. Hidden Admin Shortcut (Ctrl + Shift + S) ---
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            console.log('Admin Action: Exporting Database...');
            window.AppDB.exportJSON();
        }
    });
});
