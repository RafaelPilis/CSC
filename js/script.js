// Cookie-Handling für sessionId
(function() {
    // Cookie-Funktionen
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // sessionId Cookie setzen, lesen oder löschen
    function initSessionId() {
        var sessionId = getCookie('sessionId');
        
        // Wenn keine sessionId existiert, erstelle eine neue
        if (!sessionId) {
            // Generiere eine eindeutige sessionId (z.B. Timestamp + Random)
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            // Setze Cookie für die Dauer der Browser-Session (ohne expires wird es beim Schließen gelöscht)
            setCookie('sessionId', sessionId);
        }
        
        return sessionId;
    }

    // Beim Laden der Seite sessionId initialisieren
    initSessionId();

    // Globale Funktionen für externe Nutzung verfügbar machen
    window.CookieHandler = {
        set: setCookie,
        get: getCookie,
        delete: deleteCookie,
        getSessionId: function() {
            return getCookie('sessionId');
        },
        deleteSessionId: function() {
            deleteCookie('sessionId');
        }
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle - entfernt
    
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
    const contactButtons = document.querySelectorAll('a[href="impressum.html"]');
    
    contactButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const currentPage = window.location.pathname.split('/').pop();
            
            // Nur auf die Impressum-Seite umleiten, wenn wir nicht bereits dort sind
            if (currentPage !== 'impressum.html') {
                window.location.href = 'impressum.html';
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