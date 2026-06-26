/**
 * Mars Group of Companies | Corporate Digital Showcase
 * Client-side script handling particle networks, typing effects, filters,
 * slider, scroll reveals, custom mouse spotlight, and client inquiry inbox dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSpotlightCards();
    initParticleNetwork();
    initTypewriter();
    initPortfolioFilters();
    initTestimonialsSlider();
    initScrollReveal();
    initInquirySystem();
    initMobileMenu();
});

/* ==========================================================================
   1. Card Spotlight Hover Effect (Glass Glow)
   ========================================================================== */
function initSpotlightCards() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   3. Interactive Particle Network Canvas
   ========================================================================== */
function initParticleNetwork() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = width < 768 ? 40 : 100;
    const connectionDistance = 120;
    
    let mouse = { x: null, y: null, radius: 150 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            // Palette matches HSL variables
            this.color = Math.random() > 0.5 ? 'rgba(140, 80, 255, 0.4)' : 'rgba(0, 240, 255, 0.3)';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary checks
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse repeller or attractor
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Pull particles slightly toward mouse
                    this.x += (dx / dist) * force * 0.5;
                    this.y += (dy / dist) * force * 0.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Connect particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.12;
                    ctx.strokeStyle = `rgba(140, 80, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   4. Hero Section Typewriter Loop
   ========================================================================== */
function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    
    const words = JSON.parse(el.getAttribute('data-words') || '[]');
    let currentWordIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let speed = 100;
    
    function tick() {
        const fullWord = words[currentWordIndex];
        
        if (isDeleting) {
            currentText = fullWord.substring(0, currentText.length - 1);
            speed = 50;
        } else {
            currentText = fullWord.substring(0, currentText.length + 1);
            speed = 120;
        }
        
        el.textContent = currentText;
        
        if (!isDeleting && currentText === fullWord) {
            isDeleting = true;
            speed = 2000; // Pause at end of word
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % words.length;
            speed = 300; // Pause before typing new word
        }
        
        setTimeout(tick, speed);
    }
    
    setTimeout(tick, 1000);
}

/* ==========================================================================
   5. Portfolio Filtering
   ========================================================================== */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            
            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });
}

/* ==========================================================================
   6. Testimonials Slider
   ========================================================================== */
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots-container');
    
    let currentSlide = 0;
    
    // Generate dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function updateSliderState() {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlide);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSliderState();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSliderState();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSliderState();
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto rotation every 8 seconds
    let slideTimer = setInterval(nextSlide, 8000);
    
    // Pause auto rotation on user interaction
    const resetTimer = () => {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 8000);
    };
    
    nextBtn.addEventListener('click', resetTimer);
    prevBtn.addEventListener('click', resetTimer);
    dots.forEach(d => d.addEventListener('click', resetTimer));
}

/* ==========================================================================
   7. Scroll Reveal & Skill Bar Animation
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
    
    // Track sticky navbar and active section
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.offsetHeight;
            if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Dynamic padding for shrink navbar effect
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.querySelector('.nav-container').style.padding = '10px 24px';
        } else {
            navbar.style.padding = '0';
            navbar.querySelector('.nav-container').style.padding = '20px 24px';
        }
    });
}

/* ==========================================================================
   8. LocalStorage Inquiry System & Confetti Canvas Overlay
   ========================================================================== */
function initInquirySystem() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const inboxToggle = document.getElementById('inbox-toggle');
    const inboxModal = document.getElementById('inbox-modal');
    const modalClose = document.getElementById('modal-close');
    const inboxList = document.getElementById('inbox-list');
    const inboxCount = document.getElementById('inbox-count');
    const clearAllBtn = document.getElementById('clear-all-btn');
    
    const STORAGE_KEY = 'mars_client_inquiries';
    
    // Load existing items
    let inquiries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    updateInboxUI();

    // Contact Form Submission Handler
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Retrieve field values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            const timestamp = new Date().toLocaleString();
            
            // Build Inquiry entry
            const newInquiry = { id: Date.now(), name, email, subject, message, timestamp };
            
            // Save to localStorage
            inquiries.unshift(newInquiry);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
            
            // Reset form
            form.reset();
            
            // Trigger Confetti Celebrations
            triggerConfetti();
            
            // Trigger Toast popup
            showToast();
            
            // Update Inbox UI list
            updateInboxUI();
        });
    }

    // Toast Toggle
    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Confetti Animation Canvas
    function triggerConfetti() {
        const confettiCanvas = document.getElementById('confetti-canvas');
        if (!confettiCanvas) return;
        const ctx = confettiCanvas.getContext('2d');
        
        let width = confettiCanvas.width = window.innerWidth;
        let height = confettiCanvas.height = window.innerHeight;
        
        const confettiCount = 150;
        const confettiParticles = [];
        
        const colors = [
            '#8c50ff', // primary
            '#ea54ff', // secondary
            '#00f0ff', // accent
            '#ffffff',
            '#27c93f'  // green success
        ];

        class ConfettiParticle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height; // Start above screen
                this.size = Math.random() * 8 + 6;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedY = Math.random() * 5 + 4;
                this.speedX = (Math.random() - 0.5) * 3;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 10;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        for (let i = 0; i < confettiCount; i++) {
            confettiParticles.push(new ConfettiParticle());
        }

        let animationFrameId;
        let framesCount = 0;
        
        function drawConfetti() {
            ctx.clearRect(0, 0, width, height);
            
            let particlesActive = false;
            confettiParticles.forEach(p => {
                if (p.y < height) {
                    p.update();
                    p.draw();
                    particlesActive = true;
                }
            });
            
            framesCount++;
            
            if (particlesActive && framesCount < 300) {
                animationFrameId = requestAnimationFrame(drawConfetti);
            } else {
                ctx.clearRect(0, 0, width, height);
                cancelAnimationFrame(animationFrameId);
            }
        }
        
        drawConfetti();
    }

    // Modal Portal Access Actions
    if (inboxToggle && inboxModal && modalClose) {
        inboxToggle.addEventListener('click', () => {
            inboxModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });
        
        modalClose.addEventListener('click', () => {
            inboxModal.classList.remove('show');
            document.body.style.overflow = ''; // Unlock scrolling
        });
        
        inboxModal.addEventListener('click', (e) => {
            if (e.target === inboxModal) {
                inboxModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Clear All submissions
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (inquiries.length === 0) return;
            if (confirm('Are you sure you want to delete all incoming inquiries? This cannot be undone.')) {
                inquiries = [];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
                updateInboxUI();
            }
        });
    }

    // Render Inbox rows
    function updateInboxUI() {
        if (!inboxList || !inboxCount) return;
        
        inboxCount.textContent = `${inquiries.length} message${inquiries.length === 1 ? '' : 's'}`;
        
        if (inquiries.length === 0) {
            inboxList.innerHTML = `
                <div class="empty-inbox">
                    <i class="fa-solid fa-face-smile-wink"></i>
                    <p>No inquiries yet. Submissions from the contact form will show up here in real-time!</p>
                </div>
            `;
            return;
        }
        
        inboxList.innerHTML = '';
        inquiries.forEach(item => {
            const card = document.createElement('div');
            card.className = 'inquiry-card';
            card.innerHTML = `
                <div class="inquiry-header">
                    <div>
                        <span class="inquiry-client">${escapeHtml(item.name)}</span>
                        <span class="inquiry-category">${escapeHtml(item.subject)}</span>
                        <div class="inquiry-email">${escapeHtml(item.email)}</div>
                    </div>
                    <span class="inquiry-date">${item.timestamp}</span>
                </div>
                <div class="inquiry-body">${escapeHtml(item.message)}</div>
                <div class="inquiry-actions">
                    <button class="btn-delete-item" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            `;
            
            // Delete individual inquiry
            card.querySelector('.btn-delete-item').addEventListener('click', () => {
                inquiries = inquiries.filter(i => i.id !== item.id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
                updateInboxUI();
            });
            
            inboxList.appendChild(card);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/* ==========================================================================
   9. Mobile Responsive Menu
   ========================================================================== */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');
    const navBtn = document.getElementById('cta-nav');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    // Close menu when clicking link items
    links.forEach(l => {
        l.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });
    
    if (navBtn) {
        navBtn.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    }
}
