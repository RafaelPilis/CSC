document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.createElement('div');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(mobileToggle);
    
    mobileToggle.addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });
    
    // Bei kleinen Bildschirmen (mobil) die Dropdown-Navigation anpassen
    if (window.innerWidth <= 768) {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(function(dropdown) {
            const link = dropdown.querySelector('a');
            const content = dropdown.querySelector('.dropdown-content');
            
            // Klick-Event für Mobile hinzufügen
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    // Alle anderen schließen
                    document.querySelectorAll('.dropdown-content').forEach(function(el) {
                        el.style.display = 'none';
                    });
                    content.style.display = 'block';
                }
            });
        });
    }
    
    // FAQ Accordion Funktionalität
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
    
    // Smooth Scroll für Anker-Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky Header Funktionalität
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > headerHeight) {
            header.classList.add('sticky');
            document.body.style.paddingTop = headerHeight + 'px';
        } else {
            header.classList.remove('sticky');
            document.body.style.paddingTop = '0';
        }
        
        // Verstecken beim Runterscrollen, Zeigen beim Hochscrollen
        if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Popup für Kontaktanfragen
    const contactButtons = document.querySelectorAll('a[href="kontakt.html"]');
    
    contactButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const currentPage = window.location.pathname.split('/').pop();
            
            // Nur auf die Kontaktseite umleiten, wenn wir nicht bereits dort sind
            if (currentPage !== 'kontakt.html') {
                window.location.href = 'kontakt.html';
            }
        });
    });
    
    // Testimonial Slider (wenn mehrere vorhanden sind)
    const testimonialContainers = document.querySelectorAll('.testimonial-grid');
    
    testimonialContainers.forEach(function(container) {
        if (container.querySelectorAll('.testimonial').length > 3) {
            // Hier könnte eine Slider-Funktionalität implementiert werden
            // Für eine einfache Implementierung:
            let currentSlide = 0;
            const slides = container.querySelectorAll('.testimonial');
            const totalSlides = slides.length;
            
            // Slider-Steuerelemente erstellen
            const sliderControls = document.createElement('div');
            sliderControls.className = 'slider-controls';
            
            const prevButton = document.createElement('button');
            prevButton.className = 'slider-prev';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextButton = document.createElement('button');
            nextButton.className = 'slider-next';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            sliderControls.appendChild(prevButton);
            sliderControls.appendChild(nextButton);
            
            container.parentNode.appendChild(sliderControls);
            
            // Slider-Funktionalität
            function showSlide(index) {
                slides.forEach(slide => slide.style.display = 'none');
                slides[index].style.display = 'block';
            }
            
            // Initial ersten Slide zeigen
            showSlide(currentSlide);
            
            // Event-Listener für Buttons
            prevButton.addEventListener('click', function() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                showSlide(currentSlide);
            });
            
            nextButton.addEventListener('click', function() {
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            });
        }
    });
    
    // Formularvalidierung für das Kontaktformular
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // E-Mail-Validierung
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // In einer echten Anwendung würde hier AJAX verwendet werden
                alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
                contactForm.reset();
            } else {
                alert('Bitte füllen Sie alle erforderlichen Felder korrekt aus.');
            }
        });
    }
}); 