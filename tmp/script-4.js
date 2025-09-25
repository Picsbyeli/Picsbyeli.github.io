
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
                