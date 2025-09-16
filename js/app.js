// Main application functionality
class RafaldiniApp {
    constructor() {
        this.currentPage = window.location.pathname;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupLazyLoading();
        this.initThemeToggle();
        
        // Page-specific initializations
        // Removida a inicialização da interface de API que não existe mais
        
        if (this.currentPage.includes('/perguntas')) {
            this.initQASection();
        }
        
        // Decode the pathname to handle all encoding variations
        const decodedPath = decodeURIComponent(this.currentPage);
        // Initialize Q&A section if the path contains '/perguntas' or '/perguntas&...' (any encoding)
        if (/\/perguntas($|&|\/|respostas)/.test(decodedPath)) {
            this.initQASection();
        }
    }

    setupEventListeners() {
        // Grid item click handling with improved UX
        document.addEventListener('click', (e) => {
            // Ignore events already handled by inline handlers
            if (e.__rafHandled) return;
            if (e.target.classList.contains('grid-item')) {
                this.handleGridClick(e);
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Add loading states to external links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.addEventListener('click', () => {
                this.showLoadingState(link);
            });
        });
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.blurb, .grid-item, .api-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupLazyLoading() {
        // Lazy load images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    handleGridClick(event) {
        const link = event.target.getAttribute('link');
        if (!link) return;

        // Add click animation
        event.target.classList.add('clicked');
        // Prevent other handlers from also processing this click
        if (event.stopPropagation) event.stopPropagation();
        event.__rafHandled = true;
        
        // Show loading state
        this.showNotification('Abrindo link...', 'info');
        
        // Open link after animation
        setTimeout(() => {
            window.open(link, '_blank');
            event.target.classList.remove('clicked');
        }, 300);
    }

    showLoadingState(element) {
        const originalText = element.textContent;
        element.textContent = 'Carregando...';
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.opacity = '1';
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    initQASection() {
        // Add body class for QA-specific styling
        document.body.classList.add('perguntas-respostas');
        
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        // Apply initial theme
        this.applyTheme(currentTheme);
        
        // Update icon
        this.updateThemeIcon(themeIcon, currentTheme);
        
        // Add click event
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(currentTheme);
            this.updateThemeIcon(themeIcon, currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    applyTheme(theme) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        }
    }

    updateThemeIcon(icon, theme) {
        if (theme === 'dark') {
            icon.textContent = '☀️';
            icon.setAttribute('aria-label', 'Mudar para modo claro');
        } else {
            icon.textContent = '🌙';
            icon.setAttribute('aria-label', 'Mudar para modo escuro');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create a single global app instance and reuse it from inline handlers
    window.rafaldiniApp = new RafaldiniApp();
});