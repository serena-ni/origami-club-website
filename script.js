document.addEventListener('DOMContentLoaded', function () {

    /* navigation smooth scroll */
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

    /* nav hide / show */
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    function isMobile() {
        return window.innerWidth <= 768;
    }

    window.addEventListener('scroll', () => {
        if (!header) return;

        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

        // mobile: hide faster, show sooner
        if (isMobile()) {
            if (scrollDelta > 6 && currentScrollY > 60) {
                header.style.transform = 'translateY(-100%)';
            } else if (scrollDelta < -4) {
                header.style.transform = 'translateY(0)';
            }
        }

        // desktop: smoother behavior
        else {
            if (scrollDelta > 12 && currentScrollY > 120) {
                header.style.transform = 'translateY(-100%)';
            } else if (scrollDelta < -8) {
                header.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
    });

    /* gallery sorting */
    const galleryGrid = document.querySelector('.gallery-grid');
    const sortSelect = document.getElementById('sort');

    if (galleryGrid && sortSelect) {
        const items = Array.from(galleryGrid.children);

        function sortGallery() {
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

            // fully reset DOM order to avoid glitches
            while (galleryGrid.firstChild) {
                galleryGrid.removeChild(galleryGrid.firstChild);
            }

            sortedItems.forEach(item => galleryGrid.appendChild(item));
        }

        sortSelect.addEventListener('change', sortGallery);
    }

    /* gallery fade-in on scroll */
    const observerOptions = {
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

    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition =
            `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(item);
    });

    /* scroll progress indicator */
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'var(--sage-green)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s linear';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    /* gallery keyboard navigation (desktop only) */
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    function highlightItem(index) {
        galleryItems.forEach((item, i) => {
            item.style.outline =
                i === index ? '3px solid var(--sage-green)' : 'none';
        });

        galleryItems[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    document.addEventListener('keydown', e => {
        if (isMobile() || galleryItems.length === 0) return;

        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            highlightItem(currentIndex);
        }

        if (e.key === 'ArrowLeft') {
            currentIndex =
                (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            highlightItem(currentIndex);
        }
    });

    /* contact form */
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
