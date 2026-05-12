// popapp - Explore Module
// Discover trending creators, categories, and recommended content

const ExploreModule = {
    // Trending creators data
    trendingCreators: [
        { name: "@zara.films", followers: "3.2M", category: "Pop-Movies", avatar: "Z", gradient: "linear-gradient(135deg,#1a0533,#8B1A4A)" },
        { name: "@kipchoge.creates", followers: "1.8M", category: "Lifestyle", avatar: "K", gradient: "linear-gradient(135deg,#0a1f0e,#2d8a44)" },
        { name: "@amara.stories", followers: "2.1M", category: "Drama", avatar: "A", gradient: "linear-gradient(135deg,#180808,#8a2020)" },
        { name: "@neon_director", followers: "980K", category: "Sci-Fi", avatar: "N", gradient: "linear-gradient(135deg,#001a1a,#004d4d)" }
    ],
    
    // Categories for discovery
    categories: [
        { name: "Pop-Movies", icon: "🎬", color: "var(--pop)" },
        { name: "Tutorials", icon: "📚", color: "#4a90e2" },
        { name: "Trending", icon: "🔥", color: "#ff6b35" },
        { name: "New Releases", icon: "✨", color: "#9b59b6" }
    ],
    
    // Recommended videos
    recommendedVideos: [
        { title: "How to shoot cinematic on iPhone", creator: "@tutorials_hub", views: "456K", duration: "4:20", gradient: "linear-gradient(135deg,#0d0533,#3040A0)" },
        { title: "Behind the scenes: ECHOES", creator: "@amara.stories", views: "234K", duration: "3:45", gradient: "linear-gradient(135deg,#1a0808,#8a2020)" },
        { title: "Color grading masterclass", creator: "@neon_director", views: "178K", duration: "6:10", gradient: "linear-gradient(135deg,#001a1a,#004d4d)" }
    ],
    
    container: null,
    
    init: function() {
        this.createScreen();
        this.attachEvents();
        console.log('ExploreModule: Initialized');
    },
    
    createScreen: function() {
        if (document.getElementById('explore-screen')) return;
        
        const phone = document.querySelector('.phone');
        if (!phone) return;
        
        const screenHTML = `
            <div class="screen hidden" id="explore-screen">
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
                
                <div class="explore-header">
                    <span class="explore-title">Discover</span>
                    <div class="search-icon">🔍</div>
                </div>
                
                <!-- Categories -->
                <div class="explore-categories">
                    ${this.categories.map(cat => `
                        <div class="explore-cat-card" data-category="${cat.name}">
                            <div class="cat-icon" style="background: ${cat.color}20; border-color: ${cat.color}40;">
                                <span>${cat.icon}</span>
                            </div>
                            <span class="cat-name">${cat.name}</span>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Trending Creators -->
                <div class="explore-section">
                    <div class="section-header">
                        <span>🔥 Trending Creators</span>
                        <span class="see-all">See all →</span>
                    </div>
                    <div class="creator-horizontal">
                        ${this.trendingCreators.map(creator => `
                            <div class="creator-card" data-creator="${creator.name}">
                                <div class="creator-bg" style="background: ${creator.gradient}"></div>
                                <div class="creator-avatar-large">${creator.avatar}</div>
                                <div class="creator-name-large">${creator.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Recommended For You -->
                <div class="explore-section">
                    <div class="section-header">
                        <span>📺 Recommended For You</span>
                        <span class="see-all">See all →</span>
                    </div>
                    <div class="rec-grid">
                        ${this.recommendedVideos.map(video => `
                            <div class="rec-card" data-video="${video.title}">
                                <div class="rec-thumb" style="background: ${video.gradient}"></div>
                                <div class="rec-info">
                                    <div class="rec-title">${video.title}</div>
                                    <div class="rec-meta">${video.creator} · ${video.views} views</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="explore-close" id="explore-close">✕</div>
            </div>
        `;
        
        phone.insertAdjacentHTML('beforeend', screenHTML);
        this.container = document.getElementById('explore-screen');
    },
    
    attachEvents: function() {
        // Close button
        const closeBtn = document.getElementById('explore-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // Category cards
        document.querySelectorAll('.explore-cat-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                alert(`🔍 ${category} content — coming soon!`);
            });
        });
        
        // Creator cards
        document.querySelectorAll('.creator-card').forEach(card => {
            card.addEventListener('click', () => {
                const creator = card.getAttribute('data-creator');
                alert(`👤 Visit ${creator}'s profile — coming soon!`);
            });
        });
        
        // Recommended videos
        document.querySelectorAll('.rec-card').forEach(card => {
            card.addEventListener('click', () => {
                const video = card.getAttribute('data-video');
                alert(`🎬 Playing: ${video} — coming soon!`);
            });
        });
        
        // See all buttons
        document.querySelectorAll('.see-all').forEach(btn => {
            btn.addEventListener('click', () => {
                alert(`📱 Full list — coming soon!`);
            });
        });
    },
    
    show: function() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    },
    
    hide: function() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    ExploreModule.init();
});

window.ExploreModule = ExploreModule;