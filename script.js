/* ============================
   Like in House - Script
   ============================ */

// Force scroll to top on page load (prevents browser restoring scroll position)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // Ensure we're at top
    window.scrollTo(0, 0);

    // ---- Elements ----
    const header = document.querySelector('header');
    const topBar = document.querySelector('.top-bar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const modal = document.getElementById('cotizarModal');
    const closeModal = document.querySelector('.close');

    // ---- Header Scroll & Sticky Navbar ----
    const navbar = document.querySelector('.navbar');
    const brandArea = document.querySelector('.brand-area');
    let ticking = false; // Variable para throttle de scroll
    
    // Calculate the trigger point: when the brand area is scrolled past
    // We want the navbar to stick when it hits the top of the screen
    // The navbar is physically located BELOW the brand area in HTML flow (if position relative)
    // But header is absolute.
    // Actually, design is: TopBar (normal flow?) -> Header (Absolute).
    // Let's rely on scroll Y position. 
    
    // We want the sticky behavior to kick in after we scroll past the "Brand Header" height approx.
    const stickyTrigger = 150; // Approx height of brand logo area + top bar

    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                if (scrollY > stickyTrigger) {
                    navbar.classList.add('sticky');
                    // Optional: Fade out brand area faster?
                    if(brandArea) brandArea.style.opacity = '0';
                    if(brandArea) brandArea.style.pointerEvents = 'none';
                } else {
                    navbar.classList.remove('sticky');
                    if(brandArea) brandArea.style.opacity = '1';
                     if(brandArea) brandArea.style.pointerEvents = 'auto';
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial position

    // Recalculate on resize
    window.addEventListener('resize', () => {
        topBarHeight = topBar ? topBar.offsetHeight : 0;
        handleScroll();
    });

    // ---- Mobile Menu ----
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ---- Parallax Hero Effect (GSAP Optimized) ----
    const heroSection = document.querySelector('.hero-slider');
    
    if (heroSection && typeof gsap !== 'undefined') {
        heroSection.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                // Parallax text
                const content = activeSlide.querySelector('.slide-content');
                if (content) {
                    gsap.to(content, { 
                        x: mouseX * 20, 
                        y: mouseY * 20, 
                        duration: 1, 
                        ease: "power2.out" 
                    });
                }
                // Optional: Parallax background slightly opposite
                 const bg = activeSlide.querySelector('.slide-bg');
                 if (bg) {
                     gsap.to(bg, {
                         x: -mouseX * 15,
                         y: -mouseY * 15,
                         duration: 1.5,
                         ease: "power2.out",
                         overwrite: "auto" // Only overwrite translate, preserve scale
                     });
                 }
            }
        });
    }

    // ---- GSAP Hero Animation (Cinematic Intro) ----
    function initHeroAnimation() {
        if (typeof gsap === 'undefined') {
             console.warn('GSAP not loaded');
             return;
        }

        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) return;

        const bg = activeSlide.querySelector('.slide-bg');
        const title = activeSlide.querySelector('.slide-title');
        const subtitle = activeSlide.querySelector('.slide-subtitle');
        const btn = activeSlide.querySelector('.btn-hero');

        // Force visibility
        if (title) title.style.opacity = 0; // START HIDDEN
        if (subtitle) subtitle.style.opacity = 0; // START HIDDEN
        if (btn) btn.style.opacity = 0;       // START HIDDEN

        // Clear existing CSS animations to prevent conflicts
        if (title) title.style.animation = 'none';
        if (subtitle) subtitle.style.animation = 'none';
        if (btn) btn.style.animation = 'none';

        // Initial Set
        // Ensure bg starts zoomed in (must match CSS roughly to avoid jump)
        if (bg) gsap.set(bg, { scale: 1.15, force3D: true });
        
        // Ensure text is hidden and moved down
        if (title && subtitle && btn) {
            gsap.set([title, subtitle, btn], { opacity: 0, y: 40, force3D: true });
        }

        const tl = gsap.timeline({ defaults: { ease: "power2.out", force3D: true } });

        // Animation Sequence
        // 1. Zoom out background
        if (bg) {
             tl.to(bg, {
                scale: 1,
                duration: 3,
                ease: "power1.inOut"
            });
        }
        
        // 2. Bring in text slightly before zoom ends
        if (title && subtitle && btn) {
            // Wait 0.5s then start text
            tl.to([title, subtitle, btn], {
                opacity: 1,
                y: 0,
                duration: 1.5,
                stagger: 0.35, // Nice stagger between title -> sub -> btn
                ease: "power2.out"
            }, "-=2.2"); // Overlap significantly with the zoom
        }
    }

    // Run animation on load
    // Ensure styles are loaded
    // initHeroAnimation called immediately AND on load to catch both cases
    initHeroAnimation();
    window.onload = () => {
        window.scrollTo(0, 0); // Ensure top position on full load
        initHeroAnimation();
    };

    // ---- Hero Slider Logic with GSAP Integration ----
    let currentSlide = 0;
    let slideInterval;
    const slideCount = slides.length;

    // Helper to animate a specific slide (re-uses logic from initHeroAnimation but simplified for transitions)
    function animateSlideEnter(slideIndex) {
        if (typeof gsap === 'undefined') return;

        const slide = slides[slideIndex];
        const bg = slide.querySelector('.slide-bg');
        const title = slide.querySelector('.slide-title');
        const subtitle = slide.querySelector('.slide-subtitle');
        const btn = slide.querySelector('.btn-hero');

        // Reset state instantly for the new slide
        gsap.set(bg, { scale: 1.15, force3D: true });
        gsap.set([title, subtitle, btn], { opacity: 0, y: 40, force3D: true });

        // Create timeline with GPU acceleration
        const tl = gsap.timeline({ defaults: { ease: "power2.out", force3D: true } });

        tl.to(bg, {
            scale: 1,
            duration: 8, // Slower zoom for carousel transitions (more relaxed)
            ease: "power1.out"
        })
        .to([title, subtitle, btn], {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.25,
            ease: "power2.out"
        }, "-=7"); // Start almost immediately with the zoom
    }

    function goToSlide(index) {
        // Hide previous slide elements to prevent "ghosting" if rapid switching?
        // Actually CSS handles opacity of the .slide container, so we are fine.
        
        slides[currentSlide].classList.remove('active');
        if(dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        currentSlide = (index + slideCount) % slideCount;
        
        slides[currentSlide].classList.add('active');
        if(dots[currentSlide]) dots[currentSlide].classList.add('active');

        // Trigger animation for the NEW active slide
        animateSlideEnter(currentSlide);
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        // Clear any existing to avoid double timers
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 40000); // 40s per slide
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Controls
    if (nextBtn) {
        nextBtn.onclick = () => { stopAutoPlay(); nextSlide(); startAutoPlay(); };
    }
    if (prevBtn) {
        prevBtn.onclick = () => { stopAutoPlay(); prevSlide(); startAutoPlay(); };
    }

    dots.forEach((dot, i) => {
        dot.onclick = () => { stopAutoPlay(); goToSlide(i); startAutoPlay(); };
    });

    // Initialize
    startAutoPlay();

    // ---- ScrollTrigger Animations (Apple Style Reveal) ----
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animate Bento Grid Items on Scroll
        const bentoItems = document.querySelectorAll('.bento-item');
        bentoItems.forEach((item, index) => {
            gsap.fromTo(item, 
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1, // Stagger effect
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".bento-grid",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Experience Cards - Tilt Effect only (no scroll animation to ensure visibility)
        
        // Tilt Effect for cards (3D hover)
        const cards = document.querySelectorAll('.exp-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate center
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(card, {
                    transformPerspective: 1000,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.4, // Fast response
                    ease: "power1.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }

    // Run animation on load for the FIRST slide
    // (This is also called by window.onload but doing it here ensures logic connection)
    // Actually, let's just let initHeroAnimation handle the very first load to not conflict animations.
    // animateSlideEnter(0); 

    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderEl = document.querySelector('.hero-slider');

    if (sliderEl) {
        sliderEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        sliderEl.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                stopAutoPlay();
                diff > 0 ? nextSlide() : prevSlide();
                startAutoPlay();
            }
        });
    }

    startAutoPlay();

    // ---- FAQ Accordion Removed ----

    // ---- Modal ----
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Open modal from any element with data-modal="cotizar"
    document.querySelectorAll('[data-modal="cotizar"]').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    });

    // ---- Form Submit ----
    const cotizarForm = document.querySelector('.cotizar-form');
    if (cotizarForm) {
        cotizarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('¡Solicitud enviada! Nos pondremos en contacto contigo pronto.', 'success');
            modal.classList.remove('active');
            cotizarForm.reset();
        });
    }

    // ---- Notification System ----
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#4CAF50' : '#2196F3',
            color: '#fff',
            padding: '14px 24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '3000',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.9rem',
            transform: 'translateX(120%)',
            transition: 'transform 0.4s ease'
        });
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // ---- Scroll Reveal Animations ----
    function addScrollAnimations() {
        const animateElements = document.querySelectorAll(
            '.dest-card, .review-card, .faq-item, .section-header, .why-us-text, .banner-content'
        );

        animateElements.forEach(el => el.classList.add('scroll-animate'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    }

    addScrollAnimations();

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

});
