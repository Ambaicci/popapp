// PopApp - Feed Module (Connected to Backend)

const FeedModule = {
    videos: [],
    container: null,
    apiUrl: 'http://localhost:5000/api/videos',
    
    init: function() {
        this.container = document.getElementById('video-feed');
        if (!this.container) {
            console.error('Feed: No container found');
            return false;
        }
        this.loadVideos();
        return true;
    },
    
    loadVideos: async function() {
        try {
            console.log('Feed: Loading videos from backend...');
            const response = await fetch(this.apiUrl + '/feed');
            const videos = await response.json();
            
            console.log('Feed: Received', videos.length, 'videos');
            
            this.videos = videos.map(video => ({
                id: video.id,
                creator: video.username || '@user',
                title: video.title,
                tags: video.description || '',
                likes: video.likes || 0,
                videoSrc: video.video_url,
                thumbnail: video.thumbnail_url,
                userId: video.user_id
            }));
            
            this.render();
        } catch (error) {
            console.error('Feed: Error loading videos', error);
            if (this.container) {
                this.container.innerHTML = '<div style="color:white;text-align:center;padding:40px;">⚠️ Could not load videos. Make sure backend is running.</div>';
            }
        }
    },
    
    formatNumber: function(n) {
        if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n/1000).toFixed(1) + 'K';
        return n;
    },
    
    render: function() {
        if (!this.container) return;
        this.container.innerHTML = '';
        
        if (this.videos.length === 0) {
            this.container.innerHTML = '<div style="color:white;text-align:center;padding:40px;">🎬 No videos yet. Upload your first video!</div>';
            return;
        }
        
        for (let i = 0; i < this.videos.length; i++) {
            const video = this.videos[i];
            const div = document.createElement('div');
            div.className = 'feed-item';
            div.style.cssText = 'height:620px;position:relative;scroll-snap-align:start;background:#000;border-bottom:1px solid #222;';
            
            let videoHtml = '';
            if (video.videoSrc) {
                videoHtml = '<video src="' + video.videoSrc + '" autoplay loop muted playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"></video>';
            } else {
                videoHtml = '<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a0533,#000);"></div>';
            }
            
            div.innerHTML = videoHtml + `
                <div style="position:absolute;bottom:100px;left:16px;right:80px;color:white;z-index:10;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <span style="font-weight:bold;font-size:16px;">${video.creator}</span>
                        <span style="background:#FF4F2E;padding:4px 12px;border-radius:20px;font-size:11px;cursor:pointer;" class="follow-btn" data-id="${video.id}">Follow</span>
                    </div>
                    <div style="font-size:14px;margin-bottom:4px;">${video.title}</div>
                    <div style="font-size:11px;color:#aaa;">${video.tags}</div>
                </div>
                <div style="position:absolute;right:16px;bottom:120px;color:white;z-index:10;text-align:center;">
                    <div style="margin-bottom:16px;cursor:pointer;" class="like-btn" data-id="${video.id}">
                        <div style="font-size:24px;">❤️</div>
                        <div style="font-size:12px;" id="like-count-${video.id}">${this.formatNumber(video.likes)}</div>
                    </div>
                    <div style="margin-bottom:16px;">
                        <div style="font-size:24px;">💬</div>
                        <div style="font-size:12px;">0</div>
                    </div>
                    <div style="cursor:pointer;" class="share-btn" data-video="${video.videoSrc || ''}">
                        <div style="font-size:24px;">📤</div>
                        <div style="font-size:12px;">Share</div>
                    </div>
                </div>
            `;
            
            this.container.appendChild(div);
        }
        
        this.attachEvents();
    },
    
    attachEvents: function() {
        const likeBtns = document.querySelectorAll('.like-btn');
        for (let i = 0; i < likeBtns.length; i++) {
            likeBtns[i].removeEventListener('click', this.handleLike);
            likeBtns[i].addEventListener('click', this.handleLike.bind(this));
        }
        
        const followBtns = document.querySelectorAll('.follow-btn');
        for (let i = 0; i < followBtns.length; i++) {
            followBtns[i].removeEventListener('click', this.handleFollow);
            followBtns[i].addEventListener('click', this.handleFollow);
        }
        
        const shareBtns = document.querySelectorAll('.share-btn');
        for (let i = 0; i < shareBtns.length; i++) {
            shareBtns[i].removeEventListener('click', this.handleShare);
            shareBtns[i].addEventListener('click', this.handleShare);
        }
    },
    
    handleLike: function(e) {
        const btn = e.currentTarget;
        const id = btn.getAttribute('data-id');
        const countSpan = document.getElementById('like-count-' + id);
        const video = this.videos.find(v => v.id == id);
        
        if (video && !video.liked) {
            video.liked = true;
            video.likes++;
            countSpan.textContent = this.formatNumber(video.likes);
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => { btn.style.transform = ''; }, 200);
            
            fetch('http://localhost:5000/api/videos/' + id + '/like', { method: 'POST' }).catch(console.error);
        }
    },
    
    handleFollow: function(e) {
        const btn = e.currentTarget;
        if (btn.textContent === 'Follow') {
            btn.textContent = 'Following';
            btn.style.background = 'transparent';
            btn.style.border = '1px solid #444';
        } else {
            btn.textContent = 'Follow';
            btn.style.background = '#FF4F2E';
        }
    },
    
    handleShare: function(e) {
        const btn = e.currentTarget;
        const videoUrl = btn.getAttribute('data-video');
        if (videoUrl) {
            navigator.clipboard.writeText(videoUrl);
        } else {
            navigator.clipboard.writeText('Check out this video on PopApp!');
        }
        alert('🔗 Link copied!');
    },
    
    addVideo: function(videoData) {
        console.log('Feed: Adding new video', videoData.title);
        this.loadVideos();
    }
};

const checkInterval = setInterval(() => {
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen && !homeScreen.classList.contains('hidden')) {
        clearInterval(checkInterval);
        FeedModule.init();
    }
}, 100);

window.FeedModule = FeedModule;