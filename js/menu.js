// PopApp - Menu (Simplified)
(function() {
    var panel = document.getElementById('menuPanel');
    var btn = document.getElementById('menuButton');
    
    if (!btn || !panel) return;
    
    // Open/close on button click
    btn.onclick = function(e) {
        e.stopPropagation();
        if (panel.style.display === 'flex') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'flex';
        }
    };
    
    // Close when clicking outside
    document.onclick = function(e) {
        if (panel.style.display === 'flex' && !btn.contains(e.target) && !panel.contains(e.target)) {
            panel.style.display = 'none';
        }
    };
    
    // Studio link
    var studioItem = document.getElementById('studioMenuItem');
    if (studioItem) {
        studioItem.onclick = function(e) {
            e.stopPropagation();
            window.location.href = 'studio.html';
        };
    }
    
    console.log('Menu ready');
})();