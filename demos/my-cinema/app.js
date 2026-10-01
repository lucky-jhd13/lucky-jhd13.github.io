/* ==========================================================================
   CINEVERSE PRO — JavaScript Application Logic
   Dynamic Catalog, Live Filters, Interactive Seat Map & LocalStorage Persistence
   ========================================================================== */

// Initial Seed Data
const DEFAULT_MOVIES = [
    { 
        id: 1, 
        title: "Inception", 
        duration: 148, 
        release_year: 2010, 
        genre: "Sci-Fi / Thriller", 
        director: "Christopher Nolan", 
        poster: "posters/inception.jpg",
        synopsis: "Dom Cobb est un voleur expérimenté dans l'art périlleux de l'extraction, volant les secrets les plus précieux enfouis au plus profond du subconscient pendant que la cible rêve.",
        rating: 4.8
    },
    { 
        id: 2, 
        title: "Interstellar", 
        duration: 169, 
        release_year: 2014, 
        genre: "Sci-Fi / Aventure", 
        director: "Christopher Nolan", 
        poster: "posters/interstellar.jpg",
        synopsis: "Alors que la Terre se meurt, un groupe d'explorateurs franchit un trou de ver récemment découvert afin de trouver une nouvelle planète habitable pour l'humanité.",
        rating: 4.9
    },
    { 
        id: 3, 
        title: "Dune: Deuxième Partie", 
        duration: 166, 
        release_year: 2024, 
        genre: "Sci-Fi / Action", 
        director: "Denis Villeneuve", 
        poster: "posters/dune2.jpg",
        synopsis: "Paul Atréides s'unit à Chani et aux Fremen tout en préparant sa revanche contre les conspirateurs qui ont détruit sa famille. Face à des choix cruciaux, il tente d'empêcher un futur tragique.",
        rating: 4.9
    },
    { 
        id: 4, 
        title: "Oppenheimer", 
        duration: 180, 
        release_year: 2023, 
        genre: "Drame / Historique", 
        director: "Christopher Nolan", 
        poster: "posters/oppenheimer.jpg",
        synopsis: "Pendant la Seconde Guerre mondiale, le physicien J. Robert Oppenheimer dirige le projet Manhattan, qui aboutit à la création de la première bombe atomique de l'histoire.",
        rating: 4.7
    },
    { 
        id: 5, 
        title: "Pulp Fiction", 
        duration: 154, 
        release_year: 1994, 
        genre: "Crime / Drame", 
        director: "Quentin Tarantino", 
        poster: "posters/pulpfiction.jpg",
        synopsis: "Les vies de deux hommes de main, d'un boxeur, de la femme d'un gangster et d'un couple de braqueurs s'entrecroisent dans une série d'incidents drôles et violents à Los Angeles.",
        rating: 4.8
    },
    { 
        id: 6, 
        title: "The Dark Knight", 
        duration: 152, 
        release_year: 2008, 
        genre: "Action / Crime", 
        director: "Christopher Nolan", 
        poster: "posters/darkknight.jpg",
        synopsis: "Batman entreprend de démanteler les organisations criminelles de Gotham avec le lieutenant Gordon et le procureur Harvey Dent. Mais le terrifiant Joker plonge la ville dans l'anarchie.",
        rating: 4.9
    }
];

const DEFAULT_ROOMS = [
    { id: 1, name: "Salle IMAX 1", capacity: 320, type: "IMAX", occupancy: 85, screen: "Laser 4K Dual", sound: "Dolby Atmos 64 canaux" },
    { id: 2, name: "Salle Dolby 2", capacity: 210, type: "3D", occupancy: 68, screen: "3D HFR Reald", sound: "Immersif 360°" },
    { id: 3, name: "Salle Premium 3", capacity: 150, type: "Standard", occupancy: 52, screen: "Laser 4K Barco", sound: "Surround 7.1 Pro" }
];

const DEFAULT_SCREENINGS = [
    { id: 1, movie_id: 1, movie_title: "Inception", room_name: "Salle IMAX 1", date: "2026-10-02 20:30", poster: "posters/inception.jpg" },
    { id: 2, movie_id: 3, movie_title: "Dune: Deuxième Partie", room_name: "Salle Dolby 2", date: "2026-10-02 21:15", poster: "posters/dune2.jpg" },
    { id: 3, movie_id: 2, movie_title: "Interstellar", room_name: "Salle Premium 3", date: "2026-10-03 18:00", poster: "posters/interstellar.jpg" },
    { id: 4, movie_id: 4, movie_title: "Oppenheimer", room_name: "Salle IMAX 1", date: "2026-10-03 21:00", poster: "posters/oppenheimer.jpg" },
    { id: 5, movie_id: 6, movie_title: "The Dark Knight", room_name: "Salle Dolby 2", date: "2026-10-04 19:45", poster: "posters/darkknight.jpg" }
];

// State with LocalStorage fallbacks
let movies = JSON.parse(localStorage.getItem('cineverse_movies')) || [...DEFAULT_MOVIES];
let rooms = JSON.parse(localStorage.getItem('cineverse_rooms')) || [...DEFAULT_ROOMS];
let screenings = JSON.parse(localStorage.getItem('cineverse_screenings')) || [...DEFAULT_SCREENINGS];

let currentGenre = 'all';
let currentSearch = '';
let currentSort = 'recent';

// Selected seats state in modal
let selectedSeats = [];
const TICKET_PRICE = 12.50;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderMovies();
    renderRooms();
    renderScreenings();
    updateStats();
    populateSelects();
    setupEventListeners();
}

function saveToLocalStorage() {
    localStorage.setItem('cineverse_movies', JSON.stringify(movies));
    localStorage.setItem('cineverse_rooms', JSON.stringify(rooms));
    localStorage.setItem('cineverse_screenings', JSON.stringify(screenings));
}

// -----------------------------------------------------------------------------
// RENDER FUNCTIONS
// -----------------------------------------------------------------------------

function renderMovies() {
    const container = document.getElementById('movies-container');
    if (!container) return;

    let filtered = movies.filter(m => {
        const matchesGenre = currentGenre === 'all' || m.genre.toLowerCase().includes(currentGenre.toLowerCase());
        const matchesSearch = !currentSearch || 
            m.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
            m.director.toLowerCase().includes(currentSearch.toLowerCase()) ||
            m.genre.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    // Sorting
    filtered.sort((a, b) => {
        if (currentSort === 'recent') return b.release_year - a.release_year;
        if (currentSort === 'duration-desc') return b.duration - a.duration;
        if (currentSort === 'duration-asc') return a.duration - b.duration;
        if (currentSort === 'title-asc') return a.title.localeCompare(b.title);
        return 0;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <i class="fa-solid fa-film" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-subtle);"></i>
                <p style="font-weight: 700; font-size: 1.1rem; color: var(--text-white);">Aucun film ne correspond à vos critères</p>
                <p style="font-size: 0.85rem; margin-top: 4px;">Modifiez le mot-clé de recherche ou réinitialisez le filtre de genre.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(m => `
        <article class="movie-card" onclick="openDetailsModal(${m.id})">
            <img src="${m.poster}" alt="${m.title}" class="movie-poster-img" loading="lazy">
            <div class="movie-top-badges">
                <span class="badge-year">${m.release_year}</span>
                <span class="badge-format">${m.rating ? '★ ' + m.rating : '4K'}</span>
            </div>
            <div class="movie-overlay">
                <h3 class="movie-card-title">${m.title}</h3>
                <p class="movie-card-genre">${m.genre}</p>
                <div class="movie-card-footer">
                    <span class="movie-card-duration"><i class="fa-regular fa-clock"></i> ${m.duration} min</span>
                    <span class="movie-card-director" title="${m.director}">De : ${m.director}</span>
                </div>
                <div class="movie-hover-cta">
                    <i class="fa-solid fa-circle-play"></i> Fiche & Séances
                </div>
            </div>
        </article>
    `).join('');
}

function renderRooms() {
    const container = document.getElementById('rooms-container');
    if (!container) return;

    if (rooms.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">Aucune salle enregistrée.</p>';
        return;
    }

    container.innerHTML = rooms.map(r => {
        let typeBadgeClass = 'badge-standard';
        let progressFillClass = 'emerald';
        if (r.type === 'IMAX') {
            typeBadgeClass = 'badge-imax';
            progressFillClass = 'cyan';
        } else if (r.type === '3D') {
            typeBadgeClass = 'badge-3d';
            progressFillClass = 'purple';
        }

        const occ = r.occupancy || Math.floor(Math.random() * 35) + 50;

        return `
            <div class="room-card">
                <div class="room-top">
                    <div class="room-title-box">
                        <h3>${r.name}</h3>
                        <span class="room-badge-type ${typeBadgeClass}">${r.type}</span>
                    </div>
                    <button class="room-delete-btn" onclick="deleteRoom(${r.id})" title="Supprimer la salle">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>

                <div class="room-capacity-bar">
                    <div class="capacity-labels">
                        <span>Capacité : <strong>${r.capacity} places</strong></span>
                        <span>Occupation : <strong>${occ}%</strong></span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill ${progressFillClass}" style="width: ${occ}%"></div>
                    </div>
                </div>

                <div class="room-tech-tags">
                    <span class="tech-tag"><i class="fa-solid fa-tv"></i> ${r.screen || 'Laser 4K'}</span>
                    <span class="tech-tag"><i class="fa-solid fa-volume-high"></i> ${r.sound || 'Dolby Atmos'}</span>
                    <span class="tech-tag"><i class="fa-solid fa-couch"></i> Fauteuils Cuir</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderScreenings() {
    const container = document.getElementById('screenings-container');
    if (!container) return;

    if (screenings.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <i class="fa-solid fa-calendar-xmark" style="font-size: 2.2rem; margin-bottom: 10px; color: var(--text-subtle);"></i>
                <p style="font-weight: 700; font-size: 1.05rem; color: var(--text-white);">Aucune séance programmée</p>
                <p style="font-size: 0.85rem; margin-top: 4px;">Utilisez le formulaire ci-dessous pour ajouter une séance.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = screenings.map(s => {
        // Resolve poster
        const matchedMovie = movies.find(m => m.id === s.movie_id || m.title === s.movie_title);
        const posterSrc = s.poster || (matchedMovie ? matchedMovie.poster : 'posters/dune2.jpg');
        const genre = matchedMovie ? matchedMovie.genre : 'Action / Aventure';
        const formattedDate = formatDateTime(s.date);

        return `
            <div class="screening-ticket">
                <div class="screening-movie-col">
                    <img src="${posterSrc}" alt="${s.movie_title}" class="screening-poster-mini">
                    <div>
                        <h4 class="screening-movie-title">${s.movie_title}</h4>
                        <span class="screening-movie-sub">${genre}</span>
                    </div>
                </div>

                <div class="screening-room-col">
                    <span class="tech-tag" style="background: rgba(255,255,255,0.06); font-weight: 700; color: white; padding: 6px 12px; font-size: 0.82rem;">
                        <i class="fa-solid fa-couch"></i> ${s.room_name}
                    </span>
                </div>

                <div class="screening-time-col">
                    <span class="screening-time-badge">
                        <i class="fa-regular fa-clock" style="color: var(--cinema-red);"></i> ${formattedDate.time}
                    </span>
                    <span class="screening-date-sub">${formattedDate.date}</span>
                </div>

                <div class="screening-status-col">
                    <span class="status-pill open">
                        <i class="fa-solid fa-circle" style="font-size: 6px;"></i> Ouvert
                    </span>
                    <button class="btn-book-ticket" onclick="openBookingModal('${s.movie_title.replace(/'/g, "\\'")}', '${s.room_name.replace(/'/g, "\\'")}', '${s.date}')">
                        <i class="fa-solid fa-ticket"></i> Réserver
                    </button>
                    <button class="btn-screening-del" onclick="deleteScreening(${s.id})" title="Supprimer la séance">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const elMovies = document.getElementById('stat-movies-count');
    const elRooms = document.getElementById('stat-rooms-count');
    const elSeats = document.getElementById('stat-seats-count');
    const elScreenings = document.getElementById('stat-screenings-count');

    if (elMovies) elMovies.innerText = movies.length;
    if (elRooms) elRooms.innerText = rooms.length;
    if (elSeats) {
        const totalSeats = rooms.reduce((acc, r) => acc + (parseInt(r.capacity) || 0), 0);
        elSeats.innerText = totalSeats > 0 ? totalSeats : 680;
    }
    if (elScreenings) elScreenings.innerText = screenings.length;
}

function populateSelects() {
    const movieSelect = document.getElementById('screening-movie-select');
    if (movieSelect) {
        movieSelect.innerHTML = '<option value="">Sélectionner un film...</option>';
        movies.forEach(m => {
            movieSelect.innerHTML += `<option value="${m.id}">${m.title} (${m.duration} min)</option>`;
        });
    }

    const roomSelect = document.getElementById('screening-room-select');
    if (roomSelect) {
        roomSelect.innerHTML = '<option value="">Sélectionner une salle...</option>';
        rooms.forEach(r => {
            roomSelect.innerHTML += `<option value="${r.name}">${r.name} (${r.type} - ${r.capacity} places)</option>`;
        });
    }
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS & INTERACTIONS
// -----------------------------------------------------------------------------

function setupEventListeners() {
    // Genre Filter Pills
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentGenre = pill.getAttribute('data-genre');
            renderMovies();
        });
    });

    // Global Search Input
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            renderMovies();
        });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderMovies();
        });
    }

    // Ergonomic Quick Tab Pills synchronization on scroll & click
    const quickTabs = document.querySelectorAll('.tab-pill-btn');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav(activeId) {
        quickTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('href') === `#${activeId}`);
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });
    }

    quickTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('href').replace('#', '');
            updateActiveNav(targetId);
        });
    });

    window.addEventListener('scroll', () => {
        const sections = ['movies-section', 'screenings-section', 'rooms-section', 'admin-section'];
        const scrollPosition = window.scrollY + 140;
        for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && scrollPosition >= el.offsetTop) {
                updateActiveNav(sections[i]);
                break;
            }
        }
    }, { passive: true });

    // Form 1: Add Movie
    const movieForm = document.getElementById('add-movie-form');
    if (movieForm) {
        movieForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value.trim();
            const director = document.getElementById('director').value.trim();
            const duration = parseInt(document.getElementById('duration').value);
            const release_year = parseInt(document.getElementById('release_year').value);
            const genre = document.getElementById('genre').value;
            const poster = document.getElementById('poster-select').value;

            const newMovie = {
                id: Date.now(),
                title,
                director,
                duration,
                release_year,
                genre,
                poster,
                synopsis: `Chef-d'œuvre cinématographique réalisé par ${director}. Une expérience immersive à découvrir dans nos salles.`,
                rating: 4.8
            };

            movies.unshift(newMovie);
            saveToLocalStorage();
            renderMovies();
            populateSelects();
            updateStats();
            movieForm.reset();
            showToast(`Film "${title}" ajouté avec succès au catalogue !`, 'success');
            
            // Smooth scroll to movies
            document.getElementById('movies-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Form 2: Add Room
    const roomForm = document.getElementById('add-room-form');
    if (roomForm) {
        roomForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('room-name').value.trim();
            const capacity = parseInt(document.getElementById('room-capacity').value);
            const type = document.getElementById('room-type').value;

            const newRoom = {
                id: Date.now(),
                name,
                capacity,
                type,
                occupancy: 45,
                screen: type === 'IMAX' ? 'Dual Laser 4K' : (type === '3D' ? '3D HFR Reald' : 'Numérique 4K'),
                sound: type === 'IMAX' ? 'Dolby Atmos 64 canaux' : 'Surround 7.1'
            };

            rooms.push(newRoom);
            saveToLocalStorage();
            renderRooms();
            populateSelects();
            updateStats();
            roomForm.reset();
            showToast(`Salle "${name}" créée avec succès !`, 'success');
        });
    }

    // Form 3: Add Screening
    const screeningForm = document.getElementById('add-screening-form');
    if (screeningForm) {
        screeningForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const movieSelect = document.getElementById('screening-movie-select');
            const roomName = document.getElementById('screening-room-select').value;
            const dateVal = document.getElementById('screening-date').value;

            const movieId = parseInt(movieSelect.value);
            const matchedMovie = movies.find(m => m.id === movieId);
            const movieTitle = matchedMovie ? matchedMovie.title : movieSelect.options[movieSelect.selectedIndex].text;
            const poster = matchedMovie ? matchedMovie.poster : 'posters/dune2.jpg';

            const newScreening = {
                id: Date.now(),
                movie_id: movieId,
                movie_title: movieTitle,
                room_name: roomName,
                date: dateVal.replace('T', ' '),
                poster
            };

            screenings.unshift(newScreening);
            saveToLocalStorage();
            renderScreenings();
            updateStats();
            screeningForm.reset();
            showToast(`Séance pour "${movieTitle}" programmée avec succès !`, 'success');

            document.getElementById('screenings-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Delete Handlers
function deleteRoom(id) {
    if (!confirm('Voulez-vous supprimer cette salle ?')) return;
    rooms = rooms.filter(r => r.id !== id);
    saveToLocalStorage();
    renderRooms();
    populateSelects();
    updateStats();
    showToast('Salle supprimée.', 'info');
}

function deleteScreening(id) {
    screenings = screenings.filter(s => s.id !== id);
    saveToLocalStorage();
    renderScreenings();
    updateStats();
    showToast('Séance supprimée.', 'info');
}

// Admin Tab Switcher
function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-form-pane').forEach(p => p.classList.remove('active'));

    const btn = document.getElementById(`btn-${tabId}`);
    const pane = document.getElementById(tabId);

    if (btn) btn.classList.add('active');
    if (pane) pane.classList.add('active');
}

// -----------------------------------------------------------------------------
// MODALS (Details & Interactive Seat Reservation)
// -----------------------------------------------------------------------------

function openDetailsModal(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;

    const modalBackdrop = document.getElementById('cinema-modal-backdrop');
    const modalBody = document.getElementById('modal-body-content');
    const bannerImg = document.getElementById('modal-banner-img');

    if (bannerImg) bannerImg.src = movie.poster;

    // Find screenings for this movie
    const movieScreenings = screenings.filter(s => s.movie_id === movie.id || s.movie_title === movie.title);

    let screeningsHtml = '';
    if (movieScreenings.length > 0) {
        screeningsHtml = `
            <div style="margin-top: 24px;">
                <h4 style="font-size: 1rem; color: var(--text-white); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-calendar-days" style="color: var(--cinema-red);"></i> Prochaines séances disponibles :
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${movieScreenings.map(s => `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 10px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                            <div>
                                <strong style="color: white;">${formatDateTime(s.date).date}</strong> à 
                                <span style="color: var(--cinema-accent); font-weight: 800;">${formatDateTime(s.date).time}</span>
                                <span style="margin-left: 8px; font-size: 0.75rem; color: var(--text-muted);">${s.room_name}</span>
                            </div>
                            <button class="btn-book-ticket" style="padding: 6px 14px; font-size: 0.78rem;" onclick="closeCinemaModal(); openBookingModal('${movie.title.replace(/'/g, "\\'")}', '${s.room_name.replace(/'/g, "\\'")}', '${s.date}');">
                                Réserver
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        screeningsHtml = `
            <div style="margin-top: 20px; padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 0.85rem;">
                <i class="fa-solid fa-circle-info" style="color: var(--cinema-cyan); margin-right: 6px;"></i> Aucune séance programmée pour l'instant. Utilisez l'administration pour en planifier une.
            </div>
        `;
    }

    modalBody.innerHTML = `
        <div class="modal-movie-top">
            <img src="${movie.poster}" alt="${movie.title}" class="modal-poster">
            <div class="modal-title-wrap">
                <span class="badge-year" style="display: inline-block; margin-bottom: 8px;">${movie.release_year}</span>
                <h2>${movie.title}</h2>
                <p style="color: var(--cinema-accent); font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">${movie.genre}</p>
                <p style="color: var(--text-muted); font-size: 0.82rem;">De <strong>${movie.director}</strong> • Durée <strong>${movie.duration} minutes</strong></p>
            </div>
        </div>

        <div style="margin-top: 10px;">
            <h4 style="font-size: 0.95rem; color: var(--text-white); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Synopsis</h4>
            <p style="color: #CBD5E1; font-size: 0.92rem; line-height: 1.6;">${movie.synopsis || "Un film incontournable à vivre sur écran géant avec sonorisation de haute précision."}</p>
        </div>

        ${screeningsHtml}
    `;

    modalBackdrop.classList.add('open');
}

function openBookingModal(movieTitle, roomName, date) {
    selectedSeats = [];
    const modalBackdrop = document.getElementById('cinema-modal-backdrop');
    const modalBody = document.getElementById('modal-body-content');
    const bannerImg = document.getElementById('modal-banner-img');

    const matchedMovie = movies.find(m => m.title === movieTitle);
    if (bannerImg) bannerImg.src = matchedMovie ? matchedMovie.poster : 'posters/dune2.jpg';

    const formatted = formatDateTime(date);

    // Generate Seat Rows (Rows A to E, 8 seats each)
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsHtml = rows.map((r, rIdx) => `
        <div class="seat-row">
            <span style="font-size: 0.7rem; color: var(--text-muted); width: 14px; text-align: right; margin-right: 6px; line-height: 24px;">${r}</span>
            ${[1, 2, 3, 4, 5, 6, 7, 8].map(num => {
                const seatId = `${r}${num}`;
                // Randomly mark a few seats occupied
                const isOccupied = (rIdx === 1 && num === 4) || (rIdx === 2 && (num === 3 || num === 4 || num === 5)) || (rIdx === 3 && num === 6);
                if (isOccupied) {
                    return `<div class="seat occupied" title="Siège ${seatId} (Occupé)"></div>`;
                }
                return `<div class="seat" data-seat="${seatId}" onclick="toggleSeat(this, '${seatId}')" title="Siège ${seatId}"></div>`;
            }).join('')}
        </div>
    `).join('');

    modalBody.innerHTML = `
        <div class="modal-movie-top">
            <div class="modal-title-wrap" style="margin-top: 20px;">
                <span class="spotlight-pill" style="margin-bottom: 8px;"><i class="fa-solid fa-ticket"></i> Réservation de Billetterie</span>
                <h2>${movieTitle}</h2>
                <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">
                    <i class="fa-solid fa-couch" style="color: var(--cinema-cyan);"></i> <strong>${roomName}</strong> • 
                    <i class="fa-regular fa-calendar" style="margin-left: 8px;"></i> <strong>${formatted.date} à ${formatted.time}</strong>
                </p>
            </div>
        </div>

        <div class="seat-map-container">
            <div class="screen-bar"></div>
            <div class="screen-label">Écran Géant Numérique</div>

            <div class="seats-grid">
                ${seatsHtml}
            </div>

            <div class="seat-legend">
                <div class="legend-item"><span class="legend-dot available"></span> Disponible</div>
                <div class="legend-item"><span class="legend-dot selected"></span> Votre sélection</div>
                <div class="legend-item"><span class="legend-dot occupied"></span> Occupé</div>
            </div>
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 16px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div>
                <p style="font-size: 0.82rem; color: var(--text-muted);">Sièges sélectionnés : <strong id="selected-seats-text" style="color: white;">Aucun</strong></p>
                <p style="font-size: 1.15rem; font-weight: 800; color: var(--cinema-accent); margin-top: 2px;">
                    Total : <span id="total-price-text">0.00 €</span>
                </p>
            </div>
            <button class="btn-spotlight-primary" id="btn-confirm-booking" onclick="confirmBooking('${movieTitle.replace(/'/g, "\\'")}', '${roomName.replace(/'/g, "\\'")}')" disabled style="opacity: 0.5; cursor: not-allowed;">
                <i class="fa-solid fa-check"></i> Confirmer la réservation
            </button>
        </div>
    `;

    modalBackdrop.classList.add('open');
}

function toggleSeat(element, seatId) {
    if (element.classList.contains('occupied')) return;

    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
    } else {
        element.classList.add('selected');
        selectedSeats.push(seatId);
    }

    // Update UI
    const seatsText = document.getElementById('selected-seats-text');
    const priceText = document.getElementById('total-price-text');
    const confirmBtn = document.getElementById('btn-confirm-booking');

    if (selectedSeats.length > 0) {
        seatsText.innerText = selectedSeats.join(', ');
        const total = (selectedSeats.length * TICKET_PRICE).toFixed(2);
        priceText.innerText = `${total} €`;
        confirmBtn.removeAttribute('disabled');
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
    } else {
        seatsText.innerText = 'Aucun';
        priceText.innerText = '0.00 €';
        confirmBtn.setAttribute('disabled', 'true');
        confirmBtn.style.opacity = '0.5';
        confirmBtn.style.cursor = 'not-allowed';
    }
}

function confirmBooking(movieTitle, roomName) {
    if (selectedSeats.length === 0) return;
    closeCinemaModal();
    showToast(`🎟️ Réservation confirmée ! ${selectedSeats.length} place(s) (${selectedSeats.join(', ')}) pour "${movieTitle}". Bon film !`, 'success');
}

function closeCinemaModal() {
    const modalBackdrop = document.getElementById('cinema-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
}

function closeModalOnBackdrop(e) {
    if (e.target.id === 'cinema-modal-backdrop') {
        closeCinemaModal();
    }
}

// -----------------------------------------------------------------------------
// HELPERS & TOAST
// -----------------------------------------------------------------------------

function formatDateTime(dateString) {
    if (!dateString) return { date: "Date à venir", time: "20:00" };
    try {
        const parts = dateString.split(' ');
        const datePart = parts[0];
        const timePart = parts[1] || "20:00";
        return {
            date: datePart,
            time: timePart
        };
    } catch (e) {
        return { date: dateString, time: "" };
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '<i class="fa-solid fa-circle-check" style="color:#10B981; font-size:1.1rem;"></i>';
    if (type === 'error') {
        icon = '<i class="fa-solid fa-circle-xmark" style="color:#EF4444; font-size:1.1rem;"></i>';
    } else if (type === 'info') {
        icon = '<i class="fa-solid fa-circle-info" style="color:#06B6D4; font-size:1.1rem;"></i>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 3800);
}
