document.addEventListener('DOMContentLoaded', () => {
    
    /* 2. ANIMACIÓN DE REVELADO DE TEXTO (PRINCIPIOS) */
    const revealTextElement = document.querySelector('.scroll-reveal-text');
    if (revealTextElement) {
        const textContent = revealTextElement.textContent.trim();
        const wordsArray = textContent.split(/\s+/);
        revealTextElement.innerHTML = '';
        
        wordsArray.forEach(word => {
            const span = document.createElement('span');
            span.classList.add('word');
            if (word.toLowerCase().includes('materiales')) {
                span.classList.add('highlight');
            }
            span.textContent = word + ' ';
            revealTextElement.appendChild(span);
        });
    }

    const words = document.querySelectorAll('.scroll-reveal-text .word');

    /* INTERSECTION OBSERVER (PASOS & FOOTER) */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('scroll-slide')) {
                    entry.target.classList.add('slide-in-visible');
                }
                if (entry.target.classList.contains('footer-container')) {
                    entry.target.classList.add('fade-in-visible');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-slide').forEach(el => scrollObserver.observe(el));
    const footerContainer = document.querySelector('.footer-container');
    if (footerContainer) scrollObserver.observe(footerContainer);

    /* REVELADO POR SCROLL EN PRINCIPIOS */
    window.addEventListener('scroll', () => {
        if (!revealTextElement) return;
        const rect = revealTextElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const totalHeight = windowHeight + rect.height;
            const scrollProgress = (windowHeight - rect.top) / (totalHeight * 0.7);
            const wordsToReveal = Math.floor(words.length * Math.min(Math.max(scrollProgress, 0), 1));
            
            words.forEach((word, index) => {
                if (index < wordsToReveal) {
                    word.classList.add('revealed');
                } else {
                    word.classList.remove('revealed');
                }
            });
        }
    });

    /* 3. PARALLAX EN EL TALLER */
    const parallaxImage = document.querySelector('.parallax-img');
    window.addEventListener('scroll', () => {
        if (!parallaxImage) return;
        const parentSection = document.querySelector('.workshop-section');
        const rect = parentSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const shift = (window.innerHeight - rect.top) * 0.06;
            parallaxImage.style.transform = `translateY(${shift}px) scale(1.05)`;
        }
    });

    /* 4. SELECCIÓN INTERACTIVA DE MATERIALES */
    const materialCards = document.querySelectorAll('.material-card');
    const descriptionText = document.getElementById('wood-description');

    materialCards.forEach(card => {
        card.addEventListener('click', () => {
            materialCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            updateDescription(card);
        });

        card.addEventListener('mouseenter', () => {
            updateDescription(card);
        });
    });

    function updateDescription(element) {
        const text = element.getAttribute('data-desc');
        if (descriptionText && descriptionText.textContent !== text) {
            descriptionText.style.opacity = 0;
            setTimeout(() => {
                descriptionText.textContent = text;
                descriptionText.style.opacity = 1;
            }, 200);
        }
    }
});