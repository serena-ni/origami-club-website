document.addEventListener('DOMContentLoaded', function() {
    // -------------------- NAVIGATION SCROLL --------------------
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // -------------------- GALLERY SORT --------------------
    function sortProjects(projects, mode) {
        switch (mode) {
            case "recent":
                return [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));
            case "oldest":
                return [...projects].sort((a, b) => new Date(a.date) - new Date(b.date));
            case "easy":
                return [...projects].sort((a, b) => a.difficulty - b.difficulty);
            case "hard":
                return [...projects].sort((a, b) => b.difficulty - a.difficulty);
            default:
                return projects;
        }
    }

    // Get gallery items and convert to sortable objects
    function getProjectsFromDOM() {
        return [...document.querySelectorAll('.gallery-item')].map(item => ({
            element: item,
            date: item.dataset.date,
            difficulty: parseInt(item.dataset.difficulty, 10)
        }));
    }

    let projects = getProjectsFromDOM();

    // IntersectionObserver for fade-in
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    function applyObserver(items) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }

    applyObserver(projects.map(p => p.element));

    // Render sorted projects into the DOM
    function renderProjects(list) {
        const galleryContainer = document.querySelector('.gallery-grid'); 
        if (!galleryContainer) return;

        galleryContainer.innerHTML = "";
        list.forEach(p => galleryContainer.appendChild(p.element));

        // Reapply fade-in after sorting
        applyObserver(list.map(p => p.element));
    }

    // Dropdown listener
    const sortSelect = document.getElementById('sort');
    const sortLabel = document.querySelector('.sort-label'); // optional label span if you have one
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const mode = sortSelect.value;
            const sorted = sortProjects(projects, mode);
            renderProjects(sorted);

            // Update displayed selected value if you want a label
            if (sortLabel) sortLabel.textContent = sortSelect.options[sortSelect.selectedIndex].text;
        });
    }

    // -------------------- CONTACT FORM --------------------
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const form = e.target;
            const formMessage = form.querySelector('.form-message');

            try {
                const response = await fetch(form.action, {
                    method: form.method || 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (formMessage) formMessage.textContent = "🎉 thanks for joining! we'll be in touch soon.";
                    form.reset();
                } else {
                    const errText = await response.text().catch(() => 'Server error');
                    if (formMessage) formMessage.textContent = `❌ oops, something went wrong. ${errText}`;
                }
            } catch (err) {
                if (formMessage) formMessage.textContent = '❌ network error. please try again later.';
                console.error('Contact form submit error:', err);
            }
        });
    }
});
