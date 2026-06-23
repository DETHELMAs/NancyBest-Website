// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background on scroll
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link based on scroll position
    updateActiveNavLink();
});

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Socials Dropdown (mobile) =====
const socialsBtn = document.querySelector('.socials-btn');
const socialsDropdown = document.querySelector('.socials-dropdown');

socialsBtn.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        socialsDropdown.classList.toggle('open');
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!socialsDropdown.contains(e.target)) {
        socialsDropdown.classList.remove('open');
    }
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Counter Animation =====
const statNumbers = document.querySelectorAll('.glass-stat-number');
let counterAnimated = false;

function animateCounters() {
    if (counterAnimated) return;

    const heroStats = document.querySelector('.hero-stats-glass');
    if (!heroStats) return;

    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        counterAnimated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ===== Scroll Reveal for Detail Blocks =====
const detailBlocks = document.querySelectorAll('.detail-block');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

detailBlocks.forEach(block => {
    revealObserver.observe(block);
});

// ===== Scroll Reveal for Quote Cards =====
const quoteCards = document.querySelectorAll('.quote-card');

quoteCards.forEach(card => {
    revealObserver.observe(card);
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Simulated form submission
    // const submitBtn = contactForm.querySelector('.btn-submit');
    // const originalText = submitBtn.textContent;
    // submitBtn.textContent = 'Sending...';
    // submitBtn.disabled = true;

    // setTimeout(() => {
    //     showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
    //     contactForm.reset();
    //     submitBtn.textContent = originalText;
    //     submitBtn.disabled = false;
    // }, 1500);

    // Actual form submission
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        // This sends the data input to Formspree action URL
        const response = await fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // SUCCESS: Trigger custom success message
            showFormMessage("Message sent successfully! I'll get back to you soon.", 'success');
            contactForm.reset();
        } else {
            // SERVER ERROR: Formspree returned an issue
            showFormMessage('Oops! Formspree encountered an error. Please try again.', 'error');
        }
    } catch (error) {
        // NETWORK ERROR: Lost internet connection during send
        showFormMessage('Network error. Please check your internet connection.', 'error');
    } finally {
        // This runs no matter what (success or fail) to restore button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function showFormMessage(msg, type) {
    // Remove existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-${type}`;
    messageEl.textContent = msg;
    messageEl.style.cssText = `
        padding: 14px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 0.95rem;
        font-weight: 500;
        text-align: center;
        ${type === 'success'
            ? 'background: rgba(39, 174, 96, 0.1); color: #27ae60; border: 1px solid rgba(39, 174, 96, 0.3);'
            : 'background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.3);'}
    `;

    contactForm.insertBefore(messageEl, contactForm.firstChild);

    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// ===== Smooth Scroll for TOC links =====
document.querySelectorAll('.toc-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetEl = document.querySelector(targetId);

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Brief highlight effect
            targetEl.style.background = 'rgba(230, 126, 34, 0.05)';
            setTimeout(() => {
                targetEl.style.background = '';
            }, 2000);
        }
    });
});
