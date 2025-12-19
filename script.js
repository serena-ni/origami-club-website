document.addEventListener('DOMContentLoaded', function () {

    // navigation scroll
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition =
                    elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // gallery sorting
    const galleryGrid = document.querySelector('.gallery-grid');
    const sortSelect = document.getElementById('sort');

    if (galleryGrid && sortSelect) {
        const items = Array.from(galleryGrid.children);

        sortSelect.addEventListener('change', () => {
            const mode = sortSelect.value;

            const sortedItems = [...items].sort((a, b) => {
                const dateA = new Date(a.dataset.date);
                const dateB = new Date(b.dataset.date);
                const diffA = Number(a.dataset.difficulty);
                const diffB = Number(b.dataset.difficulty);

                switch (mode) {
                    case 'recent':
                        return dateB - dateA;
                    case 'oldest':
                        return dateA - dateB;
                    case 'easy':
                        return diffA - diffB;
                    case 'hard':
                        return diffB - diffA;
                    default:
                        return 0;
                }
            });

            sortedItems.forEach(item => galleryGrid.appendChild(item));
        });
    }

    // gallery fade-in
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // contact form
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formMessage = contactForm.querySelector('.form-message');

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method || 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });

                if (response.ok) {
                    formMessage.textContent =
                        "🌿 thanks for joining! we'll be in touch soon.";
                    contactForm.reset();
                } else {
                    formMessage.textContent =
                        "❌ something went wrong. please try again later.";
                }
            } catch (err) {
                formMessage.textContent =
                    "❌ network error. please try again later.";
                console.error(err);
            }
        });
    }
});
