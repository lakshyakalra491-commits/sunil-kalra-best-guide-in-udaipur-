// script.js - Sunil Kalra Luxury Heritage Tours

const SunilKalra = {
    init() {
        this.navbar.init();
        this.smoothScroll.init();
        this.hero.init();
        this.particles.init();
        this.scrollReveal.init();
        this.parallax.init();
        this.counter.init();
        this.timeline.init();
        this.magnetic.init();
        this.scrollProgress.init();
        this.mobileMenu.init();
        this.bookingForm.init();
    },


    navbar: {
        init() {
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 80) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }, { passive: true });
        }
    },

    smoothScroll: {
        init() {
            const navbarHeight = 80; // approximate sticky navbar height
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#' || targetId.length <= 1) return;
                    const target = document.querySelector(targetId);
                    if (!target) return;
                    e.preventDefault();
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                });
            });
        }
    },

    hero: {
        init() {
            // Initial load animations using native CSS/JS if GSAP is not loaded yet
            setTimeout(() => {
                document.querySelectorAll('.hero-section [data-reveal]').forEach(el => {
                    setTimeout(() => {
                        el.classList.add('is-revealed');
                    }, parseFloat(el.getAttribute('data-delay') || 0) * 1000);
                });
            }, 100);
        }
    },

    particles: {
        init() {
            const canvas = document.getElementById('particle-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            let width, height, particles;
            
            const initCanvas = () => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                particles = [];
                for(let i=0; i<60; i++) {
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        radius: Math.random() * 2 + 1,
                        vx: Math.random() * 0.5 - 0.25,
                        vy: Math.random() * -0.5 - 0.2, // Move up
                        alpha: Math.random() * 0.3 + 0.1
                    });
                }
            };
            
            const draw = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#D4AF37'; // Gold
                
                particles.forEach(p => {
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    // Wrap around
                    if (p.y < -10) p.y = height + 10;
                    if (p.x < -10) p.x = width + 10;
                    if (p.x > width + 10) p.x = -10;
                });
                
                requestAnimationFrame(draw);
            };
            
            initCanvas();
            draw();
            window.addEventListener('resize', initCanvas);
        }
    },

    scrollReveal: {
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(() => {
                            entry.target.classList.add('is-revealed');
                        }, delay * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            });

            document.querySelectorAll('section:not(.hero-section) [data-reveal]').forEach(el => {
                observer.observe(el);
            });
        }
    },

    parallax: {
        init() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            const layers = document.querySelectorAll('.parallax-layer');
            const heroBg = document.querySelector('.parallax-bg');
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                if (scrolled > window.innerHeight) return; // Only run when in hero
                
                requestAnimationFrame(() => {
                    if(heroBg) heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
                    
                    layers.forEach(layer => {
                        const speed = layer.getAttribute('data-speed');
                        layer.style.transform = `translateY(${scrolled * speed}px)`;
                    });
                });
            }, { passive: true });
        }
    },

    counter: {
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.counter-val');
                        counters.forEach(counter => {
                            const target = parseFloat(counter.getAttribute('data-target'));
                            const isDecimal = counter.getAttribute('data-decimal') === 'true';
                            const duration = 2000;
                            const start = performance.now();
                            
                            const updateCounter = (currentTime) => {
                                const elapsed = currentTime - start;
                                const progress = Math.min(elapsed / duration, 1);
                                
                                // easeOutQuart
                                const ease = 1 - Math.pow(1 - progress, 4);
                                const currentVal = target * ease;
                                
                                if (isDecimal) {
                                    counter.innerText = currentVal.toFixed(1);
                                } else {
                                    counter.innerText = Math.floor(currentVal);
                                }
                                
                                if (progress < 1) {
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    counter.innerText = isDecimal ? target.toFixed(1) : target;
                                }
                            };
                            
                            requestAnimationFrame(updateCounter);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            const counterSection = document.querySelector('.achievement-counters');
            if (counterSection) observer.observe(counterSection);
        }
    },

    timeline: {
        init() {
            const timelineNodes = document.querySelectorAll('.timeline-node');
            const progressLine = document.getElementById('timeline-progress');
            if (!timelineNodes.length || !progressLine) return;
            
            const container = document.querySelector('.timeline-container');
            
            window.addEventListener('scroll', () => {
                const containerRect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Calculate progress based on container visibility
                if (containerRect.top < windowHeight / 2 && containerRect.bottom > windowHeight / 2) {
                    const scrollDist = (windowHeight / 2) - containerRect.top;
                    const maxDist = containerRect.height;
                    const percentage = Math.max(0, Math.min(100, (scrollDist / maxDist) * 100));
                    progressLine.style.height = `${percentage}%`;
                }

                // Active nodes
                timelineNodes.forEach(node => {
                    const rect = node.getBoundingClientRect();
                    if (rect.top < windowHeight * 0.7) {
                        node.classList.add('active');
                    }
                });
            }, { passive: true });
        }
    },

    magnetic: {
        init() {
            if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch
            
            const magnetics = document.querySelectorAll('.magnetic-btn');
            
            magnetics.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    // Max offset 12px X, 8px Y
                    const xOffset = (x / (rect.width / 2)) * 12;
                    const yOffset = (y / (rect.height / 2)) * 8;
                    
                    btn.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0px, 0px)';
                });
            });
        }
    },

    scrollProgress: {
        init() {
            const progressBar = document.querySelector('.scroll-progress');
            window.addEventListener('scroll', () => {
                const totalScroll = document.documentElement.scrollTop;
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scroll = `${totalScroll / windowHeight * 100}%`;
                if(progressBar) progressBar.style.width = scroll;
            }, { passive: true });
        }
    },

    mobileMenu: {
        init() {
            const toggle = document.getElementById('mobile-toggle');
            const menu = document.getElementById('mobile-menu');
            const links = document.querySelectorAll('.mobile-link');
            
            if (!toggle || !menu) return;
            
            toggle.addEventListener('click', () => {
                const isOpen = toggle.classList.toggle('active');
                menu.classList.toggle('active');
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
            
            links.forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    },

    bookingForm: {
        init() {
            const form = document.getElementById('booking-form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = document.getElementById('name')?.value.trim() || '';
                const email = document.getElementById('email')?.value.trim() || '';
                const phone = document.getElementById('phone')?.value.trim() || '';
                const date = document.getElementById('date')?.value || '';
                const travelers = document.getElementById('travelers')?.value || '';
                const requirements = document.getElementById('requirements')?.value.trim() || '';

                // Build WhatsApp message
                let message = `Hello Sunil Kalra! I'd like to book a private tour in Udaipur.\n\n`;
                message += `*Name:* ${name}\n`;
                if (email) message += `*Email:* ${email}\n`;
                if (phone) message += `*Phone:* ${phone}\n`;
                if (date) message += `*Tour Date:* ${date}\n`;
                if (travelers) message += `*Travelers:* ${travelers}\n`;
                if (requirements) message += `*Requirements:* ${requirements}\n`;
                message += `\nPlease share tour details and pricing. Thank you!`;

                const encoded = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/919928665779?text=${encoded}`;

                window.open(whatsappURL, '_blank');

                // Show confirmation
                const btn = form.querySelector('.btn-submit');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Sent to WhatsApp!';
                btn.style.background = '#25D366';
                btn.style.color = '#fff';
                btn.style.borderColor = '#25D366';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 3000);
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => SunilKalra.init());
