// Music persistence across game pages
(function() {
  // Check if we're on a game page (not the main index)
  if (window.location.pathname.includes('/games/') || window.location.pathname.includes('games/')) {
    
    // Create a minimal music player interface for game pages
    function createMiniMusicPlayer() {
      const savedMusicState = localStorage.getItem('musicState');
      if (!savedMusicState) return;
      
      try {
        const state = JSON.parse(savedMusicState);
        if (!state.currentTrack || !state.isPlaying) return;
        
        // Create floating mini player
        const miniPlayer = document.createElement('div');
        miniPlayer.id = 'floating-music-player';
        miniPlayer.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 10px 15px;
          border-radius: 25px;
          z-index: 10000;
          font-family: Arial, sans-serif;
          font-size: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
          text-align: center;
        `;
        
        miniPlayer.innerHTML = `
          <div style="margin-bottom: 5px; font-weight: bold;">${state.currentTrack.name}</div>
          <div style="font-size: 10px; opacity: 0.8;">${state.currentPlaylist}</div>
          <div style="margin-top: 5px; font-size: 10px; opacity: 0.6;">🎵 Music playing • Click to return to main page</div>
        `;
        
        // Click to return to main page
        miniPlayer.addEventListener('click', () => {
          window.location.href = '../index.html';
        });
        
        // Hover effects
        miniPlayer.addEventListener('mouseenter', () => {
          miniPlayer.style.transform = 'scale(1.05)';
          miniPlayer.style.background = 'rgba(0,0,0,0.9)';
        });
        
        miniPlayer.addEventListener('mouseleave', () => {
          miniPlayer.style.transform = 'scale(1)';
          miniPlayer.style.background = 'rgba(0,0,0,0.8)';
        });
        
        document.body.appendChild(miniPlayer);
        
        // Auto-hide after 5 seconds, show on hover
        setTimeout(() => {
          miniPlayer.style.opacity = '0.6';
          miniPlayer.style.transform = 'translateX(80%)';
        }, 5000);
        
        miniPlayer.addEventListener('mouseenter', () => {
          miniPlayer.style.opacity = '1';
          miniPlayer.style.transform = 'translateX(0) scale(1.05)';
        });
        
        miniPlayer.addEventListener('mouseleave', () => {
          miniPlayer.style.opacity = '0.6';
          miniPlayer.style.transform = 'translateX(80%)';
        });
        
      } catch (e) {
        console.log('Error creating mini music player:', e);
      }
    }
    
    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', createMiniMusicPlayer);
    
    // Also initialize immediately if DOM is already loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createMiniMusicPlayer);
    } else {
      createMiniMusicPlayer();
    }
  }
})();