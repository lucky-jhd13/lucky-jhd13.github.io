/**
 * Portfolio JavaScript - Johad Abidat
 * Animations, Preloader, Magnetic Cursor, Modals, Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });
        window.lenis = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. Preloader Animation
    const preloader = document.getElementById('preloader');
    const loaderCounter = document.getElementById('loader-counter');
    const loaderProgress = document.getElementById('loader-progress');
    const loaderWords = document.querySelectorAll('.loader-word');

    const alreadyVisited = sessionStorage.getItem('ja_portfolio_visited');

    function finishPreloader() {
        if (preloader) {
            preloader.classList.add('loaded');
        }
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.img-cv-container', 
                { scale: 0.95, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out', clearProps: 'opacity,scale' }
            );
            gsap.fromTo('.cta-circle', 
                { scale: 0.5, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'opacity,scale', delay: 0.2 }
            );
        }
        sessionStorage.setItem('ja_portfolio_visited', 'true');
    }

    if (alreadyVisited) {
        if (loaderCounter) loaderCounter.innerText = '100';
        if (loaderProgress) loaderProgress.style.width = '100%';
        finishPreloader();
    } else {
        // Reveal words
        loaderWords.forEach((word, idx) => {
            setTimeout(() => {
                word.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                word.style.transform = 'translateY(0%)';
            }, 80 + idx * 100);
        });

        let count = 0;
        const countInterval = setInterval(() => {
            count += Math.floor(Math.random() * 12) + 6;
            if (count >= 100) {
                count = 100;
                clearInterval(countInterval);
                if (loaderCounter) loaderCounter.innerText = '100';
                if (loaderProgress) loaderProgress.style.width = '100%';

                setTimeout(finishPreloader, 200);
            } else {
                if (loaderCounter) loaderCounter.innerText = count;
                if (loaderProgress) loaderProgress.style.width = `${count}%`;
            }
        }, 30);
    }

    // 3. Custom Magnetic Cursor
    const cursor = document.getElementById('custom-cursor');
    const cursorText = cursor ? cursor.querySelector('.cursor-text') : null;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover interactions for cursor
    const interactiveElements = document.querySelectorAll('.interactive, a, button, input, textarea');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            const cursorAttr = el.getAttribute('data-cursor');
            if (cursor) {
                if (cursorAttr) {
                    cursor.classList.add('cursor-active');
                    if (cursorText) cursorText.innerText = cursorAttr;
                } else {
                    cursor.classList.add('cursor-link');
                }
            }
        });

        el.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.classList.remove('cursor-active', 'cursor-link');
                if (cursorText) cursorText.innerText = '';
            }
        });
    });

    // 4. Discord copy trigger
    const discordBtn = document.getElementById('discord-copy-trigger');
    if (discordBtn) {
        discordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const discordTag = "lucky_jhd";
            navigator.clipboard.writeText(discordTag).then(() => {
                if (cursorText) {
                    cursorText.innerText = "Copié !";
                    setTimeout(() => {
                        cursorText.innerText = "Discord";
                    }, 1800);
                }
                const toast = document.createElement('div');
                toast.innerText = "Pseudo Discord copié : " + discordTag;
                toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:10px 20px;border-radius:9999px;font-size:13px;font-weight:600;z-index:999999;box-shadow:0 10px 30px rgba(0,0,0,0.3);font-family:var(--font-mono);";
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
            });
        });
    }

    // 5. Lightbox Modal
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, alt) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Aperçu du projet';
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    document.querySelectorAll('.project-preview-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const src = trigger.getAttribute('data-img-src');
            const alt = trigger.getAttribute('data-img-alt');
            openLightbox(src, alt);
        });
    });

    // 6. Project Readme / Details Modal
    const readmeModal = document.getElementById('readme-modal');
    const readmeTitle = document.getElementById('readme-title');
    const readmeBody = document.getElementById('readme-body');
    const readmeClose = document.getElementById('readme-close');

    const projectDetails = {
        'data-11': {
            title: 'DATA-11 — Plateforme SaaS d\'Aide à la Décision',
            content: `
                <div class="space-y-4 text-sm leading-relaxed text-gray-300">
                    <p class="text-base text-white font-medium">Plateforme SaaS d'analyse statistique sportive et de détection automatisée d'anomalies de cotes (Value Bets +EV%) sur plus de 100 compétitions mondiales.</p>
                    
                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🎯 Objectifs du projet :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Construire un outil professionnel d'analyse prédictive et quantitative sans parti pris émotionnel.</li>
                        <li>Ingérer et modéliser des flux de données en temps réel sur les ligues majeures et secondaires (Champions League, Premier League, Ligue 1, etc.).</li>
                        <li>Automatiser la détection des cotes décalées par rapport aux probabilités mathématiques réelles.</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">⚡ Défis techniques & Architecture :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Infrastructure de Production :</strong> Déploiement autonome sur serveur dédié VPS Linux Ubuntu, configuration complète du reverse proxy Nginx avec certificat SSL et gestion de processus.</li>
                        <li><strong>Flux & Cache :</strong> Synchronisation d'API REST sportives massives avec système de cache mémoire pour respecter les quotas stricts et garantir des temps de réponse sous les 150ms.</li>
                        <li><strong>Algorithmes Prédictifs :</strong> Implémentation du modèle Dixon-Coles V3, métriques d'Expected Goals (xG), scanner multi-prismes (H2H, domicile, extérieur).</li>
                        <li><strong>Full-Stack Moderne :</strong> Interface réactive avec Next.js, TypeScript, Tailwind CSS, espace membre et intégration de paiements sécurisés pour les abonnements Premium.</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🛠️ Stack Technique :</h4>
                    <p class="font-mono text-xs text-sky-400">Next.js • React • TypeScript • Python • Tailwind CSS • API REST • VPS Linux (Ubuntu) • Nginx • Git</p>
                </div>
            `
        },
        'my-cinema': {
            title: 'My_Cinema — Gestion de Complexe Cinématographique',
            content: `
                <div class="space-y-4 text-sm leading-relaxed text-gray-300">
                    <p class="text-base text-white font-medium">Application web complète de gestion et de catalogue pour complexes cinématographiques avec architecture MVC rigoureuse.</p>
                    
                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🎯 Objectifs & Fonctionnalités :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Catalogue dynamique de films, séances, salles, abonnements et clients.</li>
                        <li>Moteur de recherche multicritères avec filtres avancés (genres, distributeurs, dates).</li>
                        <li>Gestion administrative des plannings de projection et fidélisation client.</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">⚡ Défis Techniques :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Modélisation complexe de base de données relationnelle MySQL (plusieurs dizaines de tables liées).</li>
                        <li>Optimisation de requêtes SQL volumineuses avec jointures multiples et indexation.</li>
                        <li>Implémentation du pattern Repository et séparation stricte des couches métiers.</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🛠️ Stack Technique :</h4>
                    <p class="font-mono text-xs text-sky-400">PHP 8.x • MySQL • HTML5 • CSS3 • JavaScript • Git</p>
                </div>
            `
        },
        'connectin': {
            title: 'ConnectIn — Réseau Social Professionnel (Spring Boot & Vue.js)',
            content: `
                <div class="space-y-4 text-sm leading-relaxed text-gray-300">
                    <p class="text-base text-white font-medium">Application complète de réseau social d'entreprise (type LinkedIn / Intranet) avec architecture découplée API Backend & Client SPA réactif.</p>
                    
                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🎯 Fonctionnalités Clés :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Fil d'actualité interactif avec création de publications, likes et commentaires.</li>
                        <li>Gestion de profils utilisateurs détaillés, relations de réseau et recherche d'employés.</li>
                        <li>Authentification sécurisée par tokens JWT (JSON Web Tokens) et gestion des rôles.</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">⚡ Architecture & Technologies :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Backend API :</strong> Java 21, Spring Boot 3.4.1, Spring Security, Spring Data JPA, Hibernate, base de données MySQL.</li>
                        <li><strong>Frontend Client :</strong> Vue.js 3.5, Vite 7, TypeScript, Pinia (State Management), Vue Router, Tailwind CSS v4, Axios.</li>
                        <li><strong>Sécurité :</strong> Filtres d'authentification personnalisés, chiffrement Bcrypt, validation stricte des payloads DTO.</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🛠️ Dépôt GitHub Vérifié :</h4>
                    <p class="font-mono text-xs text-sky-400">github.com/lucky-jhd13/ConnectinV2</p>
                </div>
            `
        },
        'klivio': {
            title: 'Klivio — Plateforme de Formations en Ligne (E-learning)',
            content: `
                <div class="space-y-4 text-sm leading-relaxed text-gray-300">
                    <p class="text-base text-white font-medium">Intégration d'un site vitrine moderne et catalogue de cours en ligne à partir d'une maquette Figma avec un souci extrême du détail.</p>
                    
                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🎯 Réalisations :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Intégration "pixel perfect" respectant la hiérarchie visuelle, les espacements et la typographie Montserrat.</li>
                        <li>Mise en page 100% responsive fluide (mobile-first) optimisée pour smartphones, tablettes et écrans larges.</li>
                        <li>Structure HTML5 sémantique garantissant une accessibilité et un bon référencement naturel (SEO).</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🛠️ Stack & Dépôt :</h4>
                    <p class="font-mono text-xs text-sky-400">HTML5 Sémantique • CSS3 Grid & Flexbox • FontAwesome • Figma • github.com/lucky-jhd13/Klivio</p>
                </div>
            `
        },
        'cv-generator': {
            title: 'Générateur de CV Dynamique & Export PDF',
            content: `
                <div class="space-y-4 text-sm leading-relaxed text-gray-300">
                    <p class="text-base text-white font-medium">Application web interactive permettant la création, l'édition en direct et l'exportation de curriculum vitae professionnels.</p>
                    
                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🎯 Fonctionnalités & Logique :</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Formulaire interactif avec ajout dynamique illimité d'expériences, formations et compétences.</li>
                        <li>Prévisualisation en temps réel sans aucun rechargement grâce à la synchronisation d'événements DOM.</li>
                        <li>Téléversement et traitement local de la photo de profil via l'API FileReader (sans upload serveur).</li>
                        <li>Module d'export PDF intégré respectant les règles d'impression A4 standard.</li>
                    </ul>

                    <h4 class="text-white font-bold uppercase tracking-wider text-xs pt-2">🛠️ Stack & Dépôt :</h4>
                    <p class="font-mono text-xs text-sky-400">JavaScript ES6 • DOM API • FileReader API • Bootstrap 5 / CSS3 • github.com/lucky-jhd13/g-n-rateur_cv</p>
                </div>
            `
        }
    };

    function openReadme(projectId) {
        const project = projectDetails[projectId];
        if (!project || !readmeModal) return;
        if (readmeTitle) readmeTitle.innerText = project.title;
        if (readmeBody) readmeBody.innerHTML = project.content;
        readmeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
    }

    function closeReadme() {
        if (!readmeModal) return;
        readmeModal.classList.remove('active');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
    }

    if (readmeClose) readmeClose.addEventListener('click', closeReadme);
    if (readmeModal) {
        readmeModal.addEventListener('click', (e) => {
            if (e.target === readmeModal) closeReadme();
        });
    }

    document.querySelectorAll('.btn-info-project').forEach((btn) => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project-id');
            openReadme(projectId);
        });
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeReadme();
        }
    });

    // 7. Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 8. Contact Form Handling (Web3Forms)
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (formError) formError.classList.add('hidden');

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Envoi en cours...";
            }

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    contactForm.reset();
                    if (formSuccess) formSuccess.classList.remove('hidden');
                } else {
                    if (formError) {
                        formError.innerText = result.message || "Une erreur est survenue lors de l'envoi.";
                        formError.classList.remove('hidden');
                    } else {
                        alert(result.message || "Une erreur est survenue.");
                    }
                }
            } catch (err) {
                if (formError) {
                    formError.innerText = "Impossible d'envoyer le message. Vérifiez votre connexion.";
                    formError.classList.remove('hidden');
                } else {
                    alert("Erreur réseau lors de l'envoi.");
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Envoyer le message";
                }
            }
        });
    }
});
