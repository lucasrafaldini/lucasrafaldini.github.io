// Main application functionality
class RafaldiniApp {
    constructor() {
        this.currentPage = window.location.pathname;
        this.currentLanguage = 'en';
        this.messages = {
            en: {
                openingLink: 'Opening link...',
                loading: 'Loading...',
                switchToLightMode: 'Switch to light mode',
                switchToDarkMode: 'Switch to dark mode'
            },
            pt: {
                openingLink: 'Abrindo link...',
                loading: 'Carregando...',
                switchToLightMode: 'Mudar para modo claro',
                switchToDarkMode: 'Mudar para modo escuro'
            }
        };
        this.init();
    }

    init() {
        this.initLanguage();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupLazyLoading();
        this.initThemeToggle();
        this.initBlueprintInteractions();
        this.initSystemsGraph();
        this.init3DBust();
        
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

    initLanguage() {
        const savedLanguage = localStorage.getItem('siteLanguage');
        const initialLanguage = savedLanguage === 'pt' ? 'pt' : 'en';
        this.applyLanguage(initialLanguage, false);
    }

    t(key) {
        const dictionary = this.messages[this.currentLanguage] || this.messages.en;
        return dictionary[key] || key;
    }

    applyLanguage(language, persist = true) {
        this.currentLanguage = language === 'pt' ? 'pt' : 'en';

        document.body.setAttribute('data-lang', this.currentLanguage);
        document.documentElement.setAttribute('data-lang', this.currentLanguage);
        document.documentElement.setAttribute('lang', this.currentLanguage === 'pt' ? 'pt-BR' : 'en');

        this.updateLanguageButtons();
        this.updateTranslatedAttributes();

        if (persist) {
            localStorage.setItem('siteLanguage', this.currentLanguage);
        }

        document.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language: this.currentLanguage }
        }));
    }

    updateLanguageButtons() {
        document.querySelectorAll('[data-set-lang]').forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-set-lang') === this.currentLanguage);
        });
    }

    updateTranslatedAttributes() {
        const language = this.currentLanguage;

        document.querySelectorAll('[data-i18n-aria-en]').forEach((element) => {
            const text = element.getAttribute(`data-i18n-aria-${language}`);
            if (text) {
                element.setAttribute('aria-label', text);
            }
        });

        document.querySelectorAll('[data-i18n-title-en]').forEach((element) => {
            const text = element.getAttribute(`data-i18n-title-${language}`);
            if (text) {
                element.setAttribute('title', text);
            }
        });

        const themeIcon = document.querySelector('#themeToggle .theme-icon');
        if (themeIcon) {
            this.updateThemeIcon(themeIcon, document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        }
    }

    setupEventListeners() {
        document.querySelectorAll('[data-set-lang]').forEach((button) => {
            button.addEventListener('click', () => {
                const selectedLanguage = button.getAttribute('data-set-lang');
                this.applyLanguage(selectedLanguage);
            });
        });

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
        this.showNotification(this.t('openingLink'), 'info');
        
        // Open link after animation
        setTimeout(() => {
            window.open(link, '_blank');
            event.target.classList.remove('clicked');
        }, 300);
    }

    showLoadingState(element) {
        const originalText = element.textContent;
        element.textContent = this.t('loading');
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
        if (!themeToggle) return;

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
            icon.setAttribute('aria-label', this.t('switchToLightMode'));
        } else {
            icon.textContent = '🌙';
            icon.setAttribute('aria-label', this.t('switchToDarkMode'));
        }
    }

    initBlueprintInteractions() {
        const frame = document.getElementById('manifestoFrame');
        if (!frame) return;

        const wrap = frame.querySelector('.perspective-grid-wrap');
        const centerNode = frame.querySelector('.wire-node.center');
        if (!wrap) return;

        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const pctX = Math.round((x / rect.width) * 100);
            const pctY = Math.round((y / rect.height) * 100);

            wrap.style.setProperty('--mouse-x', `${pctX}%`);
            wrap.style.setProperty('--mouse-y', `${pctY}%`);

            if (centerNode) {
                const shiftX = (pctX - 50) * 0.3;
                const shiftY = (pctY - 50) * 0.3;
                centerNode.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
            }
        });

        wrap.addEventListener('mouseleave', () => {
            wrap.style.setProperty('--mouse-x', '50%');
            wrap.style.setProperty('--mouse-y', '50%');
            if (centerNode) {
                centerNode.style.transform = 'translate(0px, 0px)';
            }
        });

        // Interactive calibration tracks hover
        document.querySelectorAll('.cal-row').forEach(row => {
            const node = row.querySelector('.cal-node');
            if (!node) return;
            const originalLeft = node.style.left;

            row.addEventListener('mouseenter', () => {
                node.style.transform = 'translate(-50%, 0) scale(1.35)';
            });

            row.addEventListener('mouseleave', () => {
                node.style.transform = 'translate(-50%, 0) scale(1)';
            });
        });
    }

    initSystemsGraph() {
        const canvas = document.getElementById('systemsGraphCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Graph Nodes in 3D relative space
        const nodeCount = Math.min(Math.max(Math.floor((width * height) / 22000), 28), 50);
        const nodes = [];
        const labels = ['CORE-01', 'ACK', 'SYN', 'SYS-A', 'ROUTER', 'OBS-7', 'INGRESS', 'EDGE-9', 'GATEWAY', 'SRV-X', 'TRACE', 'LOG-0'];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: (Math.random() - 0.5) * (width * 1.3),
                y: (Math.random() - 0.5) * (height * 1.6),
                z: (Math.random() - 0.5) * 500,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                vz: (Math.random() - 0.5) * 0.35,
                radius: Math.random() > 0.85 ? 4.5 : (Math.random() > 0.5 ? 3 : 2),
                isHub: Math.random() > 0.8,
                label: Math.random() > 0.72 ? labels[Math.floor(Math.random() * labels.length)] : null,
                screenX: 0,
                screenY: 0,
                screenRadius: 0
            });
        }

        // Data Packets moving along links
        const packets = [];
        for (let p = 0; p < 8; p++) {
            packets.push({
                from: Math.floor(Math.random() * nodeCount),
                to: Math.floor(Math.random() * nodeCount),
                progress: Math.random(),
                speed: 0.007 + Math.random() * 0.012
            });
        }

        let mouse = { x: -1000, y: -1000, active: false };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        // Click shockwaves
        const shockwaves = [];
        window.addEventListener('click', (e) => {
            shockwaves.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                maxRadius: 280,
                alpha: 1
            });
        }, { passive: true });

        // Scroll tracking with velocity & inertia
        let scrollY = window.scrollY || 0;
        let lastScrollY = scrollY;
        let scrollVelocity = 0;
        let rotationY = 0;
        let targetRotationY = 0;
        let rotationX = 0;
        let targetRotationX = 0;

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY || 0;
            const delta = scrollY - lastScrollY;
            scrollVelocity = delta;
            lastScrollY = scrollY;
            targetRotationY = scrollY * 0.0016;
            targetRotationX = Math.sin(scrollY * 0.0012) * 0.22;
        }, { passive: true });

        // Animation Loop
        const fov = 500;

        const render = () => {
            // Smooth scroll inertia
            rotationY += (targetRotationY - rotationY) * 0.07;
            rotationX += (targetRotationX - rotationX) * 0.07;
            scrollVelocity *= 0.92;

            const isDark = document.body.classList.contains('dark-mode');

            // High contrast colors
            const nodeFill = isDark ? '#38bdf8' : '#0f172a';
            const hubFill = isDark ? '#34d399' : '#0284c7';
            const edgeStroke = isDark ? 'rgba(56, 189, 248, ' : 'rgba(15, 23, 42, ';
            const packetColor = isDark ? '#facc15' : '#0284c7';
            const labelColor = isDark ? '#93c5fd' : '#0f172a';
            const shockwaveColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(2, 132, 199, ';

            ctx.clearRect(0, 0, width, height);

            const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
            const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);

            // Update & project nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                n.x += n.vx;
                n.y += n.vy;
                n.z += n.vz;

                // Move with scroll velocity
                n.y -= scrollVelocity * 0.25;

                // Bounds wrap in 3D box
                const spanX = width * 0.7;
                const spanY = height * 0.8;
                if (n.x < -spanX) n.x = spanX;
                if (n.x > spanX) n.x = -spanX;
                if (n.y < -spanY) n.y = spanY;
                if (n.y > spanY) n.y = -spanY;
                if (n.z < -300) n.z = 300;
                if (n.z > 300) n.z = -300;

                // 3D rotation
                let x1 = n.x * cosY - n.z * sinY;
                let z1 = n.z * cosY + n.x * sinY;

                let y1 = n.y * cosX - z1 * sinX;
                let z2 = z1 * cosX + n.y * sinX;

                // Perspective projection
                const scale = fov / (fov + z2 + 350);
                n.screenX = width / 2 + x1 * scale;
                n.screenY = height / 2 + y1 * scale;
                n.screenRadius = Math.max(1.2, n.radius * scale * 1.3);

                // Mouse interaction (gentle attraction / probe)
                if (mouse.active) {
                    const dx = mouse.x - n.screenX;
                    const dy = mouse.y - n.screenY;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 180 && dist > 1) {
                        const force = (180 - dist) / 180;
                        n.screenX += (dx / dist) * force * 15;
                        n.screenY += (dy / dist) * force * 15;
                    }
                }
            }

            // Draw Shockwaves
            for (let s = shockwaves.length - 1; s >= 0; s--) {
                const sw = shockwaves[s];
                sw.radius += 7;
                sw.alpha *= 0.94;
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.strokeStyle = shockwaveColor + (sw.alpha * 0.6) + ')';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                if (sw.alpha < 0.05 || sw.radius > sw.maxRadius) {
                    shockwaves.splice(s, 1);
                }
            }

            // Draw Edges (High contrast connections)
            const maxDist = Math.min(width, height) * 0.22;
            for (let i = 0; i < nodes.length; i++) {
                const nA = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const nB = nodes[j];
                    const dx = nA.screenX - nB.screenX;
                    const dy = nA.screenY - nB.screenY;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.45;
                        ctx.beginPath();
                        ctx.moveTo(nA.screenX, nA.screenY);
                        ctx.lineTo(nB.screenX, nB.screenY);
                        ctx.strokeStyle = edgeStroke + alpha + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Mouse probe beam to closest nodes
            if (mouse.active) {
                let closest = [];
                for (let i = 0; i < nodes.length; i++) {
                    const d = Math.hypot(mouse.x - nodes[i].screenX, mouse.y - nodes[i].screenY);
                    if (d < 220) {
                        closest.push({ node: nodes[i], dist: d });
                    }
                }
                closest.sort((a, b) => a.dist - b.dist);
                for (let k = 0; k < Math.min(3, closest.length); k++) {
                    const c = closest[k];
                    const alpha = (1 - c.dist / 220) * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(c.node.screenX, c.node.screenY);
                    ctx.strokeStyle = isDark ? `rgba(52, 211, 153, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
                    ctx.lineWidth = 1.25;
                    ctx.setLineDash([3, 3]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }

            // Draw Packets moving across edges
            for (let p = 0; p < packets.length; p++) {
                const pkt = packets[p];
                const fromNode = nodes[pkt.from];
                const toNode = nodes[pkt.to];
                if (fromNode && toNode) {
                    pkt.progress += pkt.speed;
                    if (pkt.progress >= 1) {
                        pkt.progress = 0;
                        pkt.from = pkt.to;
                        pkt.to = Math.floor(Math.random() * nodes.length);
                    }
                    const px = fromNode.screenX + (toNode.screenX - fromNode.screenX) * pkt.progress;
                    const py = fromNode.screenY + (toNode.screenY - fromNode.screenY) * pkt.progress;

                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = packetColor;
                    ctx.fill();
                }
            }

            // Draw Nodes & Technical Labels
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                ctx.beginPath();
                ctx.arc(n.screenX, n.screenY, n.screenRadius, 0, Math.PI * 2);
                ctx.fillStyle = n.isHub ? hubFill : nodeFill;
                ctx.fill();

                if (n.isHub) {
                    ctx.beginPath();
                    ctx.arc(n.screenX, n.screenY, n.screenRadius + 4, 0, Math.PI * 2);
                    ctx.strokeStyle = n.isHub ? hubFill : nodeFill;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                if (n.label && n.screenRadius > 2.5) {
                    ctx.font = '9px "JetBrains Mono", monospace';
                    ctx.fillStyle = labelColor;
                    ctx.fillText(n.label, n.screenX + 8, n.screenY + 3);
                }
            }

            requestAnimationFrame(render);
        };

        render();
    }

    init3DBust() {
        const canvas = document.getElementById('bustCanvas');
        if (!canvas) return;

        if (typeof THREE === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => this.setup3DBustScene(canvas);
            document.head.appendChild(script);
            return;
        }

        this.setup3DBustScene(canvas);
    }

    setup3DBustScene(canvas) {
        const container = canvas.parentElement;
        const width = container.clientWidth || 440;
        const height = container.clientHeight || 440;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
        camera.position.set(0, 0, 12.0);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        // Textures with Base64 data URIs for 100% zero-CORS compatibility on file:// and web
        const textureLoader = new THREE.TextureLoader();
        const basePath = window.SITE_BASEURL || '';
        const b64 = window.BUST_TEXTURES || {};

        const depthTexture = textureLoader.load(b64.depth_map || `${basePath}/assets/images/busts/classic_depth.png`, () => {
            if (material) material.needsUpdate = true;
        });

        const variantUrls = {
            classic: b64.classic || `${basePath}/assets/images/busts/classic_cutout.png`,
            wayfarer: b64.wayfarer || `${basePath}/assets/images/busts/wayfarer_cutout.png`,
            buzzcut: b64.buzzcut || `${basePath}/assets/images/busts/buzzcut_cutout.png`,
            helmet: b64.helmet || `${basePath}/assets/images/busts/helmet_cutout.png`,
            sculpt: b64.sculpt || `${basePath}/assets/images/busts/sculpt_cutout.png`
        };

        const textures = {};
        for (const key in variantUrls) {
            textures[key] = textureLoader.load(variantUrls[key], () => {
                if (material) material.needsUpdate = true;
            });
        }

        // Lighting for realistic 3D depth, architectural highlights and shadows
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
        dirLight.position.set(3, 4, 6);
        scene.add(dirLight);

        const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
        rimLight.position.set(-4, -2, 5);
        scene.add(rimLight);

        // Geometry (128x128 subdivisions for high-fidelity 3D depth displacement)
        const geometry = new THREE.PlaneGeometry(7.2, 7.2, 128, 128);

        // True 3D Cutout Bust Material (zero background, volumetric anatomical relief)
        const material = new THREE.MeshStandardMaterial({
            map: textures.classic,
            displacementMap: depthTexture,
            displacementScale: 1.4,
            displacementBias: 0.0,
            roughness: 0.45,
            metalness: 0.08,
            transparent: true,
            alphaTest: 0.05,
            side: THREE.DoubleSide
        });

        const bustMesh = new THREE.Mesh(geometry, material);
        scene.add(bustMesh);

        // Rotation & Interactivity
        let targetRotX = 0;
        let targetRotY = 0;
        let mouseX = 0;
        let mouseY = 0;
        let isDragging = false;
        let prevMouseX = 0;
        let prevMouseY = 0;

        // Window mousemove tracks head orientation
        window.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = canvas.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            mouseX = (e.clientX - cx) / (window.innerWidth / 2);
            mouseY = (e.clientY - cy) / (window.innerHeight / 2);

            targetRotY = Math.max(-0.6, Math.min(0.6, mouseX * 0.7));
            targetRotX = Math.max(-0.4, Math.min(0.4, -mouseY * 0.5));
        }, { passive: true });

        // Direct Drag on Canvas
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - prevMouseX;
            const dy = e.clientY - prevMouseY;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;

            targetRotY += dx * 0.01;
            targetRotX += dy * 0.01;
        });

        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                prevMouseX = e.touches[0].clientX;
                prevMouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - prevMouseX;
            const dy = e.touches[0].clientY - prevMouseY;
            prevMouseX = e.touches[0].clientX;
            prevMouseY = e.touches[0].clientY;

            targetRotY += dx * 0.012;
            targetRotX += dy * 0.012;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Scroll interaction
        let scrollY = window.scrollY || 0;
        let lastScrollY = scrollY;
        let scrollTilt = 0;

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY || 0;
            const delta = scrollY - lastScrollY;
            lastScrollY = scrollY;
            scrollTilt = delta * 0.003;
        }, { passive: true });

        // Specimen Selector buttons
        const chips = document.querySelectorAll('.spec-chip[data-bust]');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const bustKey = chip.getAttribute('data-bust');
                if (textures[bustKey]) {
                    // Brief pulse relief
                    material.displacementScale = 1.8;
                    material.map = textures[bustKey];
                    material.needsUpdate = true;
                    setTimeout(() => {
                        material.displacementScale = 1.3;
                    }, 140);
                }
            });
        });

        // Telemetry element
        const telemetryEl = document.getElementById('bustCoords');

        // Resize handler
        window.addEventListener('resize', () => {
            const newW = container.clientWidth || 440;
            const newH = container.clientHeight || 440;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        }, { passive: true });

        // Render Loop
        const animate = () => {
            // Smooth rotation with spring dampening
            bustMesh.rotation.y += (targetRotY - bustMesh.rotation.y) * 0.08;
            bustMesh.rotation.x += (targetRotX + scrollTilt - bustMesh.rotation.x) * 0.08;

            scrollTilt *= 0.92;

            // Camera subtle distance breathing
            camera.position.z = 12.0 + Math.sin(Date.now() * 0.001) * 0.12;

            // Update telemetry coords text
            if (telemetryEl) {
                const pitch = (bustMesh.rotation.x * 57.2958).toFixed(1);
                const yaw = (bustMesh.rotation.y * 57.2958).toFixed(1);
                telemetryEl.textContent = `PITCH: ${pitch}° · YAW: ${yaw}° · RELIEF: 1.00`;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.rafaldiniApp = new RafaldiniApp();
    });
} else {
    window.rafaldiniApp = new RafaldiniApp();
}