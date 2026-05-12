
// popapp - Splash Screen Module
const SplashScreen = {
    splashElement: null,
    homeElement: null,
    animationDuration: 3900,
    transitionTimer: null,

    init: function() {
        this.splashElement = document.getElementById('splash-screen');
        this.homeElement = document.getElementById('home-screen');
        
        if (!this.splashElement || !this.homeElement) {
            console.error('SplashScreen: Required elements not found');
            return false;
        }
        
        this.startTimer();
        console.log('SplashScreen: Animation started');
        return true;
    },

    startTimer: function() {
        this.transitionTimer = setTimeout(() => {
            this.transitionToHome();
        }, this.animationDuration);
    },

    transitionToHome: function() {
        if (!this.splashElement || !this.homeElement) return;
        
        this.splashElement.classList.add('hidden');
        this.homeElement.classList.remove('hidden');
        
        // Dispatch event for other modules
        const event = new CustomEvent('popapp:splashComplete');
        document.dispatchEvent(event);
        console.log('SplashScreen: Transition complete');
    },

    skip: function() {
        if (this.transitionTimer) {
            clearTimeout(this.transitionTimer);
        }
        this.transitionToHome();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    SplashScreen.init();
});

window.SplashScreen = SplashScreen;