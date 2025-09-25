
    // Runtime flag to enable E2E-only helpers when `?e2e=1` (or `?e2e`) is present.
    try {
        (function(){
            // Do not overwrite an existing __E2E__ flag (tests may set this via
            // page.addInitScript before page scripts run). Only set from URL if
            // it's currently undefined.
            if (typeof window.__E2E__ === 'undefined') {
                var params = new URLSearchParams(window.location.search || '');
                window.__E2E__ = params.get('e2e') === '1' || params.has('e2e');
            }
        })();
    } catch (e) { if (typeof window.__E2E__ === 'undefined') window.__E2E__ = false; }

    // If tests pre-set __E2E__, create a proxy for drawFromPool that lets
    // Playwright observe a function early and captures the real implementation
    // when the app assigns it later. This prevents races where the app's
    // closure-scoped function isn't yet reachable from the global scope.
    try {
        if (window.__E2E__) {
            try {
                (function(){
                    var realFn = null;
                    Object.defineProperty(window, 'drawFromPool', {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                            return typeof realFn === 'function' ? realFn : function(){ throw new Error('drawFromPool not initialized yet'); };
                        },
                        set: function(v) {
                            if (typeof v === 'function') {
                                realFn = v;
                                try {
                                    // Replace the property with the real function for future reads
                                    Object.defineProperty(window, 'drawFromPool', { value: v, writable: true, configurable: true, enumerable: true });
                                } catch (e) { /* ignore */ }
                            }
                        }
                    });
                })();
            } catch (e) { /* ignore */ }
        }
    } catch (e) {}

    // If E2E mode is enabled, expose a minimal, safe hook early so tests can
    // open the sign-in modal even if later JS fails or loads slowly.
    if (window.__E2E__) {
      (function(){
          try {
              window._testOpenSignin = function(){
                  try {
                      const m = document.getElementById('signin-modal');
                      if (!m) return false;
                      m.classList.remove('hidden');
                      m.style.display = 'flex';
                      m.setAttribute('aria-hidden', 'false');
                      const u = document.getElementById('si-username'); if (u) try{ u.focus(); } catch(e){}
                      return true;
                  } catch (e) { return false; }
              };
          } catch (e) { /* ignore */ }
      })();

      // Also, poll briefly for the app-defined `drawFromPool` function and
      // expose it on `window` as soon as it exists. This helps Playwright (and
      // other E2E harnesses) call the real implementation without racing the
      // app's load/initialization order.
      (function(){
          try {
              var tries = 0;
              var t = setInterval(function(){
                  try {
                      if (typeof drawFromPool === 'function') {
                          // Expose only when E2E flag present OR an admin user is stored in localStorage.
                          var expose = false;
                          try {
                              if (window.__E2E__) expose = true;
                          } catch (e) {}
                          try {
                              var raw = localStorage.getItem('burbleUser');
                              if (raw) {
                                  var u = JSON.parse(raw);
                                  if (u && u.isAdmin) expose = true;
                              }
                          } catch (e) {}
                          if (expose) {
                              try { window.drawFromPool = drawFromPool; } catch (e) {}
                          }
                          clearInterval(t);
                          return;
                      }
                  } catch (e) {}
                  tries++;
                  if (tries > 200) {
                      try { clearInterval(t); } catch(e){}
                  }
              }, 25);
          } catch (e) {}
      })();
    }
    


                // Quick, defensive population: run immediately where the select is defined
                (function immediatePopulate(){
                    try {
                        const sel = document.getElementById('audio-track');
                        if (!sel) return;
                        if (sel.options && sel.options.length > 0) return;
                        const tracks = [
                            'assets/audio/Marvel%20Opening%20Theme.mp3',
                            'assets/audio/NFL%20on%20FOX%20Theme%20Song.mp3',
                            'assets/audio/Pok%C3%A9mon%20Theme%20Song.mp3',
                            'assets/audio/Star%20Wars%20Main%20Theme%20(Full).mp3',
                            'assets/audio/The%20Price%20is%20Right%20theme%20song.mp3',
                            'assets/audio/30%20Second%20Timer%20With%20Jeopardy%20Thinking%20Music.mp3'
                        ];
                        tracks.forEach(src => {
                            const opt = document.createElement('option');
                            opt.value = src;
                            try { opt.text = decodeURIComponent(src.split('/').pop()); } catch(e){ opt.text = src; }
                            sel.appendChild(opt);
                        });
                        // expose helpers for tests (only in E2E mode)
                        try { if (window.__E2E__) { window.populateAudioSelect = function(){ return Array.from(sel.options).map(o=>o.value); }; window.defaultTracks = tracks.slice(); } } catch(e){}
                    } catch (e) { /* ignore */ }
                })();
                // centralized wiring is implemented inside the `enhanceAudioAndAuth()` IIFE
                // further down; avoid duplicate immediate fallbacks so there is a single
                // source of truth for modal/auth behavior.
                

