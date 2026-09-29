document.addEventListener('DOMContentLoaded', () => {
    const themeDots = document.querySelectorAll('.theme-dot');
    const root = document.documentElement;

    const colors = ['orange', 'iris', 'yellow', 'pink'];

    function applyTheme(colorName) {
        root.style.setProperty('--active-color', `var(--theme-${colorName})`);
        themeDots.forEach(d => {
            if (d.getAttribute('data-color') === colorName) {
                d.classList.add('active');
            } else {
                d.classList.remove('active');
            }
        });
        sessionStorage.setItem('portfolio-theme-color', colorName);
    }




    // --- Block Fade Animation for Text ---
    const fadeTexts = document.querySelectorAll('.fade-reveal-text');
    fadeTexts.forEach(el => {
        el.style.opacity = '0.4';
        
        function onScrollFade() {
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Fade starts when element enters viewport and finishes halfway
            const startPoint = viewportHeight * 0.9;
            const endPoint = viewportHeight * 0.5;
            
            let progress = (startPoint - rect.top) / (startPoint - endPoint);
            progress = Math.max(0, Math.min(1, progress));
            
            // Update opacity of the entire block
            el.style.opacity = (0.4 + (progress * 0.6)).toFixed(3);
        }
        
        window.addEventListener('scroll', onScrollFade, { passive: true });
        window.addEventListener('resize', onScrollFade);
        onScrollFade();
    });

    // --- Block Fade OUT Animation for Text ---
    const fadeOutTexts = document.querySelectorAll('.fade-out-text');
    fadeOutTexts.forEach(el => {
        el.style.opacity = '1';
        
        function onScrollFadeOut() {
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Fade OUT starts when element scrolls up past a certain point
            // For example, starts fading out when top hits 60% of viewport, 
            // finishes fading out when top hits 20% of viewport
            const startPoint = viewportHeight * 0.6;
            const endPoint = viewportHeight * 0.2;
            
            let progress = (startPoint - rect.top) / (startPoint - endPoint);
            progress = Math.max(0, Math.min(1, progress));
            
            // Update opacity of the entire block (from 1 down to 0.4)
            el.style.opacity = (1 - (progress * 0.6)).toFixed(3);
        }
        
        window.addEventListener('scroll', onScrollFadeOut, { passive: true });
        window.addEventListener('resize', onScrollFadeOut);
        onScrollFadeOut();
    });



    // --- On Load: Randomize only on Refresh/First Visit ---
    const savedColor = sessionStorage.getItem('portfolio-theme-color');
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    if (savedColor && !isReload) {
        // Use existing color if navigating normally (Back, Links)
        applyTheme(savedColor);
    } else {
        // Randomize on refresh or first open
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        applyTheme(randomColor);
    }

    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            applyTheme(dot.getAttribute('data-color'));
        });
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar .desktop-link');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('nav-open');
            document.body.style.overflow = navbar.classList.contains('nav-open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });
    }


    // --- Project Hover Preview Logic ---
    const preview = document.getElementById('project-preview');
    const projectItems = document.querySelectorAll('.project-item');

    if (preview && projectItems.length > 0) {
        projectItems.forEach(item => {
            const imgPath = item.getAttribute('data-img');
            
            item.addEventListener('mouseenter', () => {
                if (imgPath) {
                    preview.innerHTML = `<img src="${imgPath}" alt="Preview">`;
                    preview.style.display = 'block';
                    // Trigger reflow for transition
                    setTimeout(() => {
                        preview.style.opacity = '1';
                    }, 10);
                }
            });

            item.addEventListener('mousemove', (e) => {
                // Offset the preview slightly from the cursor
                const offsetX = 20;
                const offsetY = 20;
                
                // Keep the preview within the viewport bounds
                let left = e.clientX + offsetX;
                let top = e.clientY + offsetY;

                if (left + preview.offsetWidth > window.innerWidth) {
                    left = e.clientX - preview.offsetWidth - offsetX;
                }
                if (top + preview.offsetHeight > window.innerHeight) {
                    top = e.clientY - preview.offsetHeight - offsetY;
                }

                preview.style.transform = `translate(${left}px, ${top}px)`;
            });

            item.addEventListener('mouseleave', () => {
                preview.style.opacity = '0';
                setTimeout(() => {
                    preview.style.display = 'none';
                    preview.innerHTML = '';
                }, 300);
            });
        });
    }

    // Contact loop image animation
    const contactLoopImg = document.getElementById('contactLoopImg');
    if (contactLoopImg) {
        let loopIndex = 1;
        const totalLoopImages = 4;
        
        setInterval(() => {
            loopIndex = (loopIndex % totalLoopImages) + 1;
            contactLoopImg.src = `loop_${loopIndex}.jpg`;
        }, 800); // Change image every 800ms
    }

    
    // Unhide contact/footer if user clicks contact link directly
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('work-page') && !document.body.classList.contains('topic-selected')) {
                document.body.classList.add('topic-selected');
                const pView = document.getElementById('projects-view');
                if (pView) pView.classList.remove('hidden');
                
                // Select the first category visually
                const firstTopic = document.querySelector('.topic:not(.page-title)');
                if (firstTopic) firstTopic.click();
            }
        });
    });

    // --- Custom Cursor ---
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    
    // Event delegation for custom cursor to avoid element timing issues
    document.addEventListener("mouseover", (e) => {
        const target = e.target.closest("a:not(.project-card):not(.contact-loop-link):not(.navbar a):not(.footer-col a):not(.resume-button):not(.topic):not(.available-link):not(.gray-text):not(.project-index a), button, .theme-dot");
        if (target) {
            cursor.classList.add("hovering-small");
        }
    });
    document.addEventListener("mouseout", (e) => {
        const target = e.target.closest("a:not(.project-card):not(.contact-loop-link):not(.navbar a):not(.footer-col a):not(.resume-button):not(.topic):not(.available-link):not(.gray-text):not(.project-index a), button, .theme-dot");
        if (target) {
            cursor.classList.remove("hovering-small");
        }
    });


    document.body.appendChild(cursor);

    // Add hover effect for large interactive elements (images, project cards)
    const largeInteractiveElements = document.querySelectorAll('.project-card, .contact-loop-link');
    largeInteractiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // --- 3D Blob Effect ---
    const blobContainer = document.getElementById('blob-canvas-container');
    if (blobContainer && typeof THREE !== 'undefined') {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, blobContainer.clientWidth / blobContainer.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(blobContainer.clientWidth, blobContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        blobContainer.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);
        
        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        dirLight2.position.set(-5, -5, -5);
        scene.add(dirLight2);

        // Blob Geometry & Material
        const geometry = new THREE.IcosahedronGeometry(2, 32); // High detail for smooth deformation
        
        // Save original vertices for animation
        const positionAttribute = geometry.attributes.position;
        const vertexData = [];
        for (let i = 0; i < positionAttribute.count; i++) {
            vertexData.push({
                x: positionAttribute.getX(i),
                y: positionAttribute.getY(i),
                z: positionAttribute.getZ(i),
            });
        }

        const material = new THREE.MeshStandardMaterial({
            color: 0xFF6433,
            roughness: 0.1,
            metalness: 0.1,
            wireframe: false
        });

                const blobMesh = new THREE.Mesh(geometry, material);
        scene.add(blobMesh);

        function updateBlobScale() {
            if (window.innerWidth < 768) {
                blobMesh.scale.set(0.65, 0.65, 0.65);
            } else {
                blobMesh.scale.set(1, 1, 1);
            }
        }
        updateBlobScale();

        // Resize handler
        window.addEventListener('resize', () => {
            if (!blobContainer) return;
            camera.aspect = blobContainer.clientWidth / blobContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(blobContainer.clientWidth, blobContainer.clientHeight);
            updateBlobScale();
        });

        // Interaction state
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let targetRotation = { x: 0, y: 0 };
        let currentRotation = { x: 0, y: 0 };
        
        // Mouse Events
        renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            renderer.domElement.style.cursor = 'grabbing';
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };

                targetRotation.y += deltaMove.x * 0.01;
                targetRotation.x += deltaMove.y * 0.01;

                previousMousePosition = { x: e.offsetX, y: e.offsetY };
            }
        });

                window.addEventListener('mouseup', () => {
            isDragging = false;
            renderer.domElement.style.cursor = 'grab';
        });

        // Touch Events
        renderer.domElement.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length > 0) {
                const deltaMove = {
                    x: e.touches[0].clientX - previousMousePosition.x,
                    y: e.touches[0].clientY - previousMousePosition.y
                };

                targetRotation.y += deltaMove.x * 0.015;
                targetRotation.x += deltaMove.y * 0.015;

                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Scroll Event for passive rotation
        window.addEventListener('scroll', () => {
            if (!isDragging) {
                targetRotation.y = window.scrollY * 0.002;
            }
        });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Lerp rotation for smooth interaction
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
            
            blobMesh.rotation.x = currentRotation.x;
            blobMesh.rotation.y = currentRotation.y;
            
            // Add slight auto-rotation if not dragged
            if (!isDragging && window.scrollY < 10) {
                targetRotation.y += 0.001;
                targetRotation.x += 0.0005;
            }

            // Deform vertices
            const k = 1.5; // Deformation speed
            for (let i = 0; i < positionAttribute.count; i++) {
                const p = vertexData[i];
                // Math.sin combinations for irregular organic pulsing
                const noise = 0.15 * Math.sin(p.x * 2 + time * k) + 
                              0.1 * Math.sin(p.y * 3 + time * k * 0.8) + 
                              0.1 * Math.sin(p.z * 1.5 + time * k * 1.2);
                
                const ratio = 1 + noise;
                positionAttribute.setXYZ(i, p.x * ratio, p.y * ratio, p.z * ratio);
            }
            positionAttribute.needsUpdate = true;
            geometry.computeVertexNormals(); // Update lighting based on new shape

            renderer.render(scene, camera);
        }

        animate();
    }
        

    // --- Work Page Project Filtering Logic ---
    const isWorkPage = document.querySelector('.work-page');
    if (isWorkPage) {
        const projectsData = [
            { title: 'FocusUp', tags: ['ux/ui', 'product'], img: 'focusup_cover.jpg', url: 'focusup.html' },
            { title: 'Aurion', tags: ['ux/ui', 'phygital'], img: 'aurion_cover.jpg', url: 'aurion.html' },
            { title: 'Chorale', tags: ['product', 'speculative'], img: 'chorale_cover.jpg', url: 'chorale.html' },
            { title: 'Taboo', tags: ['product', 'phygital'], img: 'taboo_cover.png', url: 'taboo.html' }
        ];

        const topics = document.querySelectorAll('.topic:not(.page-title)');
        const projectsView = document.getElementById('projects-view');
        const projectsGrid = document.getElementById('projects-grid');
        const body = document.body;

        topics.forEach(topicLink => {
            topicLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                let topicName = '';
                const clone = topicLink.cloneNode(true);
                const countSpan = clone.querySelector('.count');
                if (countSpan) countSpan.remove();
                topicName = clone.textContent.trim().toLowerCase();

                body.classList.add('topic-selected');
                projectsView.classList.remove('hidden');
                
                topics.forEach(t => t.style.color = '');
                topicLink.style.color = '#FF6433';

                const filteredProjects = topicName === 'all' ? projectsData : projectsData.filter(p => p.tags.includes(topicName));
                
                if (topicName === 'ux/ui') {
                    projectsGrid.classList.add('reverse-stagger');
                } else {
                    projectsGrid.classList.remove('reverse-stagger');
                }
                
                projectsGrid.innerHTML = '';
                if (filteredProjects.length === 0) {
                    projectsGrid.innerHTML = '<p>No projects found for this category yet.</p>';
                } else {
                    filteredProjects.forEach(proj => {
                        const card = document.createElement('a');
                        card.href = proj.url;
                        card.className = 'project-card'; 
                        
                        card.innerHTML = `
                            <div class="project-image">
                                <img src="${proj.img}" alt="${proj.title}">
                            </div>
                            <div class="project-info">
                                <div>
                                    <h3 class="project-title">${proj.title}</h3>
                                    <p class="project-tags">${proj.tags.join(' / ')}</p>
                                </div>
                            </div>
                        `;
                        
                        card.addEventListener('mouseenter', () => {
                            const img = card.querySelector('img');
                            if(img) img.style.transform = 'scale(1.05)';
                            document.getElementById('custom-cursor').classList.add('hovering');
                        });
                        card.addEventListener('mouseleave', () => {
                            const img = card.querySelector('img');
                            if(img) img.style.transform = 'scale(1)';
                            document.getElementById('custom-cursor').classList.remove('hovering');
                        });
                        
                        projectsGrid.appendChild(card);
                    });
                }
                
                // Removed automatic scrolling per user request
            });
        });
    }
    // --- Page Transitions (Exit) ---
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]:not([target="_blank"])');
        
        if (link && link.getAttribute('href') !== '#' && !link.getAttribute('href').startsWith('#') && link.hostname === window.location.hostname) {
            e.preventDefault();
            const target = link.href;
            
            // Animate out
            document.querySelectorAll('main, footer, .navbar > a, .navbar > button').forEach(el => {
                el.style.animation = 'page-exit-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards';
            });
            document.querySelectorAll('.top-header').forEach(el => {
                el.style.animation = 'hero-fade-out 0.7s ease forwards';
            });

            // Wait for animation to almost finish before changing page
            setTimeout(() => {
                window.location.href = target;
            }, 600);
        }
    });
});









/* Project Index Scroll Spy */
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.project-content section[id]');
    const navLinks = document.querySelectorAll('.project-index a');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px' // Trigger when section is in the top/middle of viewport
        });
        
        sections.forEach(sec => observer.observe(sec));
    }
});













