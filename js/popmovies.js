// popapp - Pop-Movies Module
// Curated short films and series library

const PopMoviesModule = {
    // Movie data
    movies: [
        {
            id: 1,
            title: "The Last Train to Nairobi",
            type: "series",
            episode: "Ep 3 of 8",
            duration: "6:15",
            views: "2.4M",
            gradient: "linear-gradient(135deg,#1a0533,#8B1A4A)",
            featured: true
        },
        {
            id: 2,
            title: "Echoes",
            type: "standalone",
            episode: "Short Film",
            duration: "5:48",
            views: "1.2M",
            gradient: "linear-gradient(160deg,#0d0533,#3040A0)",
            featured: false
        },
        {
            id: 3,
            title: "Blood & Soil",
            type: "series",
            episode: "Ep 1 of 6",
            duration: "7:00",
            views: "890K",
            gradient: "linear-gradient(160deg,#1a0808,#8a2020)",
            featured: false
        },
        {
            id: 4,
            title: "Neon Sunrise",
            type: "standalone",
            episode: "Short Film",
            duration: "6:30",
            views: "560K",
            gradient: "linear-gradient(160deg,#001a1a,#004d4d)",
            featured: false
        },
        {
            id: 5,
            title: "Savanna Gold",
            type: "series",
            episode: "Ep 2 of 5",
            duration: "5:55",
            views: "1.8M",
            gradient: "linear-gradient(160deg,#1a1000,#5c4000)",
            featured: false
        }
    ],
    
    // Categories/genres
    categories: ['All', 'Thriller', 'Romance', 'Drama', 'Comedy', 'Sci-Fi'],
    activeCategory: 'All',
    
    // DOM element
    container: null,
    
    // Initialize
    init: function() {
        this.createScreen();
        this.attachEvents();
        console.log('PopMoviesModule: Initialized');
    },
    
    // Create the pop-movies screen HTML
    createScreen: function() {
        // Check if screen already exists
        if (document.getElementById('popmovies-screen')) return;
        
        const screenHTML = `
            <div class="screen hidden" id="popmovies-screen">
                <div class="status-bar">
                    <span>9:41</span>
                    <div style="display: flex; gap: 5px;">
                        <svg width="15" height="10" viewBox="0 0 16 11" fill="white">
                            <rect x="0" y="3" width="3" height="8" rx="1" opacity="0.4"/>
                            <rect x="4" y="2" width="3" height="9" rx="1" opacity="0.6"/>
                            <rect x="8" y="0" width="3" height="11" rx="1" opacity="0.8"/>
                            <rect x="12" y="0" width="3" height="11" rx="1"/>
                        </svg>
                        <div style="width:22px;height:11px;border:1.5px solid rgba(255,255,255,0.55);border-radius:3px;position:relative;">
                            <div style="position:absolute;top:2px;left:2px;right:3px;bottom:2px;background:white;border-radius:1px;"></div>
                            <div style="position:absolute;right:-4px;top:3px;width:2px;height:5px;background:rgba(255,255,255,0.55);border-radius:0 1px 1px 0;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="pm-header">
                    <span class="pm-title"><span class="pm-accent">pop</span>-movies</span>
                    <div class="pm-close" id="pm-close">✕</div>
                </div>
                
                <div class="pm-categories" id="pm-categories">
                    ${this.categories.map(cat => `<div class="pm-chip ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</div>`).join('')}
                </div>
                
                <div class="pm-grid" id="pm-grid">
                    ${this.renderMovies()}
                </div>
            </div>
        `;
        
        // Insert into body (outside phone frame? Let's add inside phone)
        const phone = document.querySelector('.phone');
        if (phone) {
            phone.insertAdjacentHTML('beforeend', screenHTML);
        }
        
        this.container = document.getElementById('popmovies-screen');
    },
    
    // Render movie grid
    renderMovies: function() {
        let html = '';
        
        this.movies.forEach(movie => {
            if (movie.featured) {
                // Featured movie takes 2 columns
                html += `
                    <div class="pm-card featured" data-movie-id="${movie.id}" style="background: ${movie.gradient}">
                        <div class="pm-card-overlay"></div>
                        <div class="pm-card-info">
                            <div class="pm-badge">${movie.type === 'series' ? 'series · ' + movie.episode : movie.episode}</div>
                            <div class="pm-card-title">${movie.title}</div>
                            <div class="pm-card-meta">▶ ${movie.duration} · ${movie.views} views</div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="pm-card" data-movie-id="${movie.id}" style="background: ${movie.gradient}">
                        <div class="pm-card-overlay"></div>
                        <div class="pm-card-info">
                            <div class="pm-badge">${movie.type === 'series' ? movie.episode : 'short'}</div>
                            <div class="pm-card-title">${movie.title}</div>
                            <div class="pm-card-meta">▶ ${movie.duration}</div>
                        </div>
                    </div>
                `;
            }
        });
        
        return html;
    },
    
    // Attach event listeners
    attachEvents: function() {
        // Close button
        const closeBtn = document.getElementById('pm-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // Category chips
        document.querySelectorAll('.pm-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const category = chip.getAttribute('data-category');
                this.filterByCategory(category);
            });
        });
        
        // Movie cards
        document.querySelectorAll('.pm-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const movieId = card.getAttribute('data-movie-id');
                const movie = this.movies.find(m => m.id == movieId);
                if (movie) {
                    alert(`🎬 "${movie.title}"\n⏱ ${movie.duration}\n👁 ${movie.views} views\n\nFull playback coming soon!`);
                }
            });
        });
    },
    
    // Filter movies by category
    filterByCategory: function(category) {
        this.activeCategory = category;
        
        // Update UI
        document.querySelectorAll('.pm-chip').forEach(chip => {
            chip.classList.remove('active');
            if (chip.getAttribute('data-category') === category) {
                chip.classList.add('active');
            }
        });
        
        // For demo, just show alert (real filtering would filter the grid)
        alert(`🎥 Showing ${category} content — coming soon!`);
    },
    
    // Show the pop-movies screen
    show: function() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    },
    
    // Hide the pop-movies screen
    hide: function() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    PopMoviesModule.init();
});

window.PopMoviesModule = PopMoviesModule;