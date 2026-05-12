// PopApp - Complete Navigation Module
// Handles all screen switching: Home, Explore, Upload, Inbox, Profile
// Also handles menu items: Pop-Movies, Studio, Following, Trending, Tutorials

const NavigationModule = {
    currentScreen: 'home',
    
    // All screen elements
    screens: {
        home: null,
        explore: null,
        popmovies: null,
        inbox: null,
        profile: null,
        studio: null,
        following: null,
        trending: null,
        tutorials: null
    },
    
    init: function() {
        // Get all screen elements
        this.screens.home = document.getElementById('home-screen');
        this.screens.explore = document.getElementById('explore-screen');
        this.screens.popmovies = document.getElementById('popmovies-screen');
        this.screens.inbox = document.getElementById('inbox-screen');
        this.screens.profile = document.getElementById('profile-screen');
        this.screens.studio = document.getElementById('studio-screen');
        this.screens.following = document.getElementById('following-screen');
        this.screens.trending = document.getElementById('trending-screen');
        this.screens.tutorials = document.getElementById('tutorials-screen');
        
        this.attachEvents();
        console.log('Navigation: Complete module ready');
    },
    
    attachEvents: function() {
        // Bottom navigation tabs
        const homeTab = document.querySelector('[data-tab="home"]');
        const exploreTab = document.querySelector('[data-tab="explore"]');
        const inboxTab = document.querySelector('[data-tab="inbox"]');
        const profileTab = document.querySelector('[data-tab="profile"]');
        
        if (homeTab) homeTab.addEventListener('click', () => this.showScreen('home'));
        if (exploreTab) exploreTab.addEventListener('click', () => this.showScreen('explore'));
        if (inboxTab) inboxTab.addEventListener('click', () => this.showScreen('inbox'));
        if (profileTab) profileTab.addEventListener('click', () => this.showScreen('profile'));
        
        // Menu items (will be connected via menu.js)
        window.openScreen = (screenName) => this.showScreen(screenName);
    },
        showScreen: function(screenName) {
        // Map screen names to actual IDs
        const screenMap = {
            'popmovies': 'popmovies-screen',
            'tutorials': 'tutorials-screen',
            'trending': 'trending-screen',
            'studio': 'studio-screen',
            'following': 'following-screen'
        };
        
        const actualId = screenMap[screenName] || screenName + '-screen';
        
        // Hide all screens
        Object.keys(this.screens).forEach(key => {
            if (this.screens[key]) {
                this.screens[key].classList.add('hidden');
            }
        });
        
        // Show selected screen
        const targetScreen = document.getElementById(actualId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.currentScreen = screenName;
            console.log('Navigation: Showing', screenName);
        }
        
        this.updateActiveTab(screenName);
    },
    showScreen: function(screenName) {
        // Hide all screens
        Object.keys(this.screens).forEach(key => {
            if (this.screens[key]) {
                this.screens[key].classList.add('hidden');
            }
        });
        
        // Show selected screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            this.currentScreen = screenName;
            console.log('Navigation: Showing', screenName);
        } else {
            console.error('Screen not found:', screenName);
        }
        
        // Update active tab in bottom navigation
        this.updateActiveTab(screenName);
    },
    
    updateActiveTab: function(screenName) {
        const tabs = ['home', 'explore', 'inbox', 'profile'];
        tabs.forEach(tab => {
            const tabElement = document.querySelector(`[data-tab="${tab}"]`);
            if (tabElement) {
                if (tab === screenName) {
                    tabElement.classList.add('active');
                } else {
                    tabElement.classList.remove('active');
                }
            }
        });
    },
    
    // Helper method for menu to call
    openScreen: function(screenName) {
        this.showScreen(screenName);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    NavigationModule.init();
});

window.NavigationModule = NavigationModule;