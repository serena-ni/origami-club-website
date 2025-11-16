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
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // -------------------- GALLERY --------------------
    const galleryGrid = document.querySelector('.gallery-grid');
    const sortSelect = document.getElementById('sort');

    function getProjects() {
        return [...document.querySelectorAll('.gallery-item')].map(item => ({
            el: item,
            date: item.dataset.date,
            difficulty: parseInt(item.dataset.difficulty, 10)
        }));
    }

    function renderProjects(projects) {
        galleryGrid.innerHTML = '';
        projects.forEach(p => galleryGrid.appendChild(p.el));
    }

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
    let projects = getProjects();

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sorted = sortProjects(projects, sortSelect.value);
            renderProjects(sorted);
        });
    }

    // -------------------- GALLERY FADE-IN --------------------
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    [...document.querySelectorAll('.gallery-item')].forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // -------------------- CONTACT FORM --------------------
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formMessage = contactForm.querySelector('.form-message');
            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method || 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    if (formMessage) formMessage.textContent = "🎉 thanks for joining! we'll be in touch soon.";
                    contactForm.reset();
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
