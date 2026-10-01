/**
 * CV STUDIO PRO - JavaScript Engine
 * Dynamic live-sync, theme changer, photo upload, repeater items, and prefill
 */

let skillsList = ['Java', 'Spring Boot', 'Vue.js', 'TypeScript', 'PHP', 'MySQL', 'Docker', 'Linux / VPS', 'Git', 'Next.js'];

const johadData = {
    prenom: "Johad",
    nom: "Abidat",
    titre: "Développeur Full Stack",
    email: "abidatjohad@gmail.com",
    tel: "07 49 04 45 95",
    ville: "Marseille / Aix-en-Provence",
    github: "github.com/lucky-jhd13",
    bio: "Développeur Full-Stack rigoureux, concevant des architectures web fiables et maintenables. Autonome sur l'ensemble du cycle de développement : modélisation relationnelle de BDD, création d'API RESTful robustes (Java Spring Boot, PHP, Python) et intégration d'interfaces réactives modernes.",
    experiences: [
        {
            poste: "Fondateur & Développeur Full-Stack",
            entreprise: "DATA-11 (SaaS Sportif)",
            date: "2024 - Présent",
            desc: "Conception et déploiement d'une plateforme d'aide à la décision statistique. Déploiement VPS Linux (Ubuntu, Nginx, SSL), modèles prédictifs (Dixon-Coles) et flux API en temps réel."
        },
        {
            poste: "Développeur Full-Stack (Spring Boot & Vue)",
            entreprise: "ConnectIn (Réseau Social Pro)",
            date: "2024",
            desc: "Architecture découplée API REST sécurisée avec Spring Security et JWT, persistance JPA/MySQL, client SPA réactif en Vue 3 avec Vite, Pinia et Tailwind CSS."
        },
        {
            poste: "Développeur PHP / MySQL (MVC)",
            entreprise: "My_Cinema",
            date: "2023 - 2024",
            desc: "Gestion de complexe cinématographique. Modélisation relationnelle, requêtes SQL complexes optimisées, gestion des programmations et interface client dynamique."
        }
    ],
    formations: [
        {
            diplome: "Développeur Intégrateur Web (Full Stack)",
            ecole: "Web@cadémie by Epitech (Marseille)",
            date: "2023 - 2025"
        },
        {
            diplome: "Baccalauréat STMG - Management & Gestion",
            ecole: "Lycée Val-de-Durance",
            date: "2015 - 2018"
        }
    ],
    skills: ['Java', 'Spring Boot', 'Vue.js', 'TypeScript', 'PHP', 'MySQL', 'Docker', 'Linux / VPS', 'Git', 'Next.js']
};

document.addEventListener('DOMContentLoaded', () => {
    initLiveInputs();
    initPhotoUpload();
    initColorPicker();
    initPrefillButton();
    initResetButton();

    // Load initial Johad profile by default
    loadProfileData(johadData);
});

// 1. Live Input Synchronization
function initLiveInputs() {
    const mappings = [
        { inputId: 'input-prenom', previewId: 'preview-prenom', fallback: 'Prénom' },
        { inputId: 'input-nom', previewId: 'preview-nom', fallback: 'Nom' },
        { inputId: 'input-titre', previewId: 'preview-titre', fallback: 'Titre Professionnel' },
        { inputId: 'input-email', previewId: 'preview-email', fallback: 'contact@exemple.com' },
        { inputId: 'input-tel', previewId: 'preview-tel', fallback: '06 00 00 00 00' },
        { inputId: 'input-ville', previewId: 'preview-ville', fallback: 'Ville / Mobilité' },
        { inputId: 'input-github', previewId: 'preview-github', fallback: 'github.com/profil' },
        { inputId: 'input-bio', previewId: 'preview-bio', fallback: 'Présentation professionnelle...' }
    ];

    mappings.forEach(m => {
        const input = document.getElementById(m.inputId);
        const preview = document.getElementById(m.previewId);
        if (input && preview) {
            input.addEventListener('input', () => {
                preview.textContent = input.value.trim() || m.fallback;
            });
        }
    });

    // Enter key for skills
    const skillInput = document.getElementById('input-new-skill');
    if (skillInput) {
        skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkillFromInput();
            }
        });
    }
}

// 2. Photo Upload Handling (Client-side FileReader)
function initPhotoUpload() {
    const fileInput = document.getElementById('input-photo-file');
    const thumbImg = document.getElementById('editor-photo-thumb');
    const previewAvatar = document.getElementById('preview-avatar');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target.result;
                    if (thumbImg) thumbImg.src = result;
                    if (previewAvatar) previewAvatar.src = result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 3. Theme Color Switcher
function initColorPicker() {
    const dots = document.querySelectorAll('.color-dot');
    const colorLightMap = {
        '#2563eb': '#eff6ff',
        '#0f172a': '#f1f5f9',
        '#059669': '#ecfdf5',
        '#7c3aed': '#f5f3ff',
        '#e11d48': '#fff1f2'
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            const color = dot.getAttribute('data-color');
            const lightColor = colorLightMap[color] || '#eff6ff';

            document.documentElement.style.setProperty('--theme-color', color);
            document.documentElement.style.setProperty('--theme-color-light', lightColor);
            document.documentElement.style.setProperty('--theme-color-dark', color);

            const badge = document.getElementById('brand-badge-icon');
            if (badge) badge.style.background = color;
        });
    });
}

// 4. Dynamic Experiences
function addExperience(data = null) {
    const id = Date.now() + Math.floor(Math.random() * 100);
    const editorList = document.getElementById('editor-experiences-list');
    const previewList = document.getElementById('preview-experiences-list');
    if (!editorList || !previewList) return;

    const poste = data ? data.poste : '';
    const entreprise = data ? data.entreprise : '';
    const date = data ? data.date : '';
    const desc = data ? data.desc : '';

    const itemHtml = `
        <div class="dynamic-item-card" id="exp-editor-${id}">
            <button type="button" class="btn-remove-item" onclick="removeExperience(${id})" title="Supprimer">✕</button>
            <div class="form-grid-2">
                <div class="form-group">
                    <label class="form-label">Poste</label>
                    <input type="text" class="input-field" id="exp-poste-${id}" value="${poste}" placeholder="Ex: Développeur Web" oninput="syncExperience(${id})">
                </div>
                <div class="form-group">
                    <label class="form-label">Entreprise / Projet</label>
                    <input type="text" class="input-field" id="exp-ent-${id}" value="${entreprise}" placeholder="Ex: Entreprise SAS" oninput="syncExperience(${id})">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Période (ex: 2022 - 2024)</label>
                <input type="text" class="input-field" id="exp-date-${id}" value="${date}" placeholder="Ex: Jan 2023 - Présent" oninput="syncExperience(${id})">
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Description des réalisations</label>
                <textarea class="input-field" id="exp-desc-${id}" rows="2" placeholder="Détaillez vos missions..." oninput="syncExperience(${id})">${desc}</textarea>
            </div>
        </div>
    `;
    editorList.insertAdjacentHTML('beforeend', itemHtml);

    const previewHtml = `
        <div class="cv-timeline-item" id="exp-preview-${id}">
            <div class="cv-item-title" id="p-exp-poste-${id}">${poste || 'Intitulé du poste'}</div>
            <div class="cv-item-subtitle">
                <span id="p-exp-ent-${id}">${entreprise || 'Entreprise'}</span>
                <span class="cv-item-date" id="p-exp-date-${id}">${date || 'Période'}</span>
            </div>
            <p class="cv-item-desc" id="p-exp-desc-${id}">${desc || 'Description des réalisations...'}</p>
        </div>
    `;
    previewList.insertAdjacentHTML('beforeend', previewHtml);
}

function syncExperience(id) {
    const poste = document.getElementById(`exp-poste-${id}`)?.value || 'Intitulé du poste';
    const entreprise = document.getElementById(`exp-ent-${id}`)?.value || 'Entreprise';
    const date = document.getElementById(`exp-date-${id}`)?.value || 'Période';
    const desc = document.getElementById(`exp-desc-${id}`)?.value || 'Description...';

    const pPoste = document.getElementById(`p-exp-poste-${id}`);
    const pEnt = document.getElementById(`p-exp-ent-${id}`);
    const pDate = document.getElementById(`p-exp-date-${id}`);
    const pDesc = document.getElementById(`p-exp-desc-${id}`);

    if (pPoste) pPoste.textContent = poste;
    if (pEnt) pEnt.textContent = entreprise;
    if (pDate) pDate.textContent = date;
    if (pDesc) pDesc.textContent = desc;
}

function removeExperience(id) {
    document.getElementById(`exp-editor-${id}`)?.remove();
    document.getElementById(`exp-preview-${id}`)?.remove();
}

// 5. Dynamic Formations
function addFormation(data = null) {
    const id = Date.now() + Math.floor(Math.random() * 100);
    const editorList = document.getElementById('editor-formations-list');
    const previewList = document.getElementById('preview-formations-list');
    if (!editorList || !previewList) return;

    const diplome = data ? data.diplome : '';
    const ecole = data ? data.ecole : '';
    const date = data ? data.date : '';

    const itemHtml = `
        <div class="dynamic-item-card" id="form-editor-${id}">
            <button type="button" class="btn-remove-item" onclick="removeFormation(${id})" title="Supprimer">✕</button>
            <div class="form-grid-2">
                <div class="form-group">
                    <label class="form-label">Diplôme / Formation</label>
                    <input type="text" class="input-field" id="form-dip-${id}" value="${diplome}" placeholder="Ex: Licence Informatique" oninput="syncFormation(${id})">
                </div>
                <div class="form-group">
                    <label class="form-label">Établissement / École</label>
                    <input type="text" class="input-field" id="form-ecole-${id}" value="${ecole}" placeholder="Ex: Epitech" oninput="syncFormation(${id})">
                </div>
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Année ou Période</label>
                <input type="text" class="input-field" id="form-date-${id}" value="${date}" placeholder="Ex: 2021 - 2023" oninput="syncFormation(${id})">
            </div>
        </div>
    `;
    editorList.insertAdjacentHTML('beforeend', itemHtml);

    const previewHtml = `
        <div class="cv-timeline-item" id="form-preview-${id}">
            <div class="cv-item-title" id="p-form-dip-${id}">${diplome || 'Diplôme'}</div>
            <div class="cv-item-subtitle">
                <span id="p-form-ecole-${id}">${ecole || 'Établissement'}</span>
                <span class="cv-item-date" id="p-form-date-${id}">${date || 'Période'}</span>
            </div>
        </div>
    `;
    previewList.insertAdjacentHTML('beforeend', previewHtml);
}

function syncFormation(id) {
    const diplome = document.getElementById(`form-dip-${id}`)?.value || 'Diplôme';
    const ecole = document.getElementById(`form-ecole-${id}`)?.value || 'Établissement';
    const date = document.getElementById(`form-date-${id}`)?.value || 'Période';

    const pDip = document.getElementById(`p-form-dip-${id}`);
    const pEcole = document.getElementById(`p-form-ecole-${id}`);
    const pDate = document.getElementById(`p-form-date-${id}`);

    if (pDip) pDip.textContent = diplome;
    if (pEcole) pEcole.textContent = ecole;
    if (pDate) pDate.textContent = date;
}

function removeFormation(id) {
    document.getElementById(`form-editor-${id}`)?.remove();
    document.getElementById(`form-preview-${id}`)?.remove();
}

// 6. Dynamic Skills
function addSkillFromInput() {
    const input = document.getElementById('input-new-skill');
    if (!input) return;
    const name = input.value.trim();
    if (!name) return;

    if (!skillsList.includes(name)) {
        skillsList.push(name);
        renderSkills();
    }
    input.value = '';
}

function removeSkill(name) {
    skillsList = skillsList.filter(s => s !== name);
    renderSkills();
}

function renderSkills() {
    const editorCloud = document.getElementById('editor-skills-cloud');
    const previewContainer = document.getElementById('preview-skills-container');
    if (!editorCloud || !previewContainer) return;

    editorCloud.innerHTML = '';
    previewContainer.innerHTML = '';

    skillsList.forEach(skill => {
        // Tag in editor with delete cross
        const tag = document.createElement('span');
        tag.className = 'skill-tag-pill';
        tag.innerHTML = `<span>${skill}</span> <span class="remove-tag" onclick="removeSkill('${skill.replace(/'/g, "\\'")}')">✕</span>`;
        editorCloud.appendChild(tag);

        // Chip in A4 preview
        const chip = document.createElement('span');
        chip.className = 'preview-chip';
        chip.textContent = skill;
        previewContainer.appendChild(chip);
    });
}

// 7. Profile Pre-fill
function initPrefillButton() {
    const btn = document.getElementById('btn-prefill-johad');
    if (btn) {
        btn.addEventListener('click', () => {
            loadProfileData(johadData);
        });
    }
}

function initResetButton() {
    const btn = document.getElementById('btn-reset-form');
    if (btn) {
        btn.addEventListener('click', () => {
            const emptyData = {
                prenom: "",
                nom: "",
                titre: "",
                email: "",
                tel: "",
                ville: "",
                github: "",
                bio: "",
                experiences: [],
                formations: [],
                skills: []
            };
            loadProfileData(emptyData);
        });
    }
}

function loadProfileData(data) {
    // Fill text inputs
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = val;
            el.dispatchEvent(new Event('input'));
        }
    };

    setVal('input-prenom', data.prenom);
    setVal('input-nom', data.nom);
    setVal('input-titre', data.titre);
    setVal('input-email', data.email);
    setVal('input-tel', data.tel);
    setVal('input-ville', data.ville);
    setVal('input-github', data.github);
    setVal('input-bio', data.bio);

    // Reset and fill experiences
    const editorExp = document.getElementById('editor-experiences-list');
    const previewExp = document.getElementById('preview-experiences-list');
    if (editorExp) editorExp.innerHTML = '';
    if (previewExp) previewExp.innerHTML = '';
    if (data.experiences && data.experiences.length > 0) {
        data.experiences.forEach(exp => addExperience(exp));
    }

    // Reset and fill formations
    const editorForm = document.getElementById('editor-formations-list');
    const previewForm = document.getElementById('preview-formations-list');
    if (editorForm) editorForm.innerHTML = '';
    if (previewForm) previewForm.innerHTML = '';
    if (data.formations && data.formations.length > 0) {
        data.formations.forEach(form => addFormation(form));
    }

    // Reset and fill skills
    skillsList = [...(data.skills || [])];
    renderSkills();
}