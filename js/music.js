// Enhanced Music Player with Search and API Integration
let audio = new Audio();
let playlists = JSON.parse(localStorage.getItem("playlists") || "{}");
let currentPlaylist = null;
let currentIndex = 0;
let currentEmbed = null;

// API Configuration (you'll need to add your actual API keys)
const SPOTIFY_CLIENT_ID = "836517f7831341f3a342af90f5c1390e"; // Spotify client ID
const SPOTIFY_CLIENT_SECRET = "07f314daeaad4525bbad0cbe3901487a"; // Spotify client secret
const YOUTUBE_API_KEY = "AIzaSyAtTsnqvnVajLBFyP69xqcD2EJC7h9nV1Q"; // YouTube API key

// Initialize playlists
function loadPlaylists() {
  const select = document.getElementById("playlist-select");
  select.innerHTML = "";

  // Add default playlist if none exist
  if (Object.keys(playlists).length === 0) {
    playlists["My Playlist"] = [];
    savePlaylists();
  }

  Object.keys(playlists).forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  currentPlaylist = currentPlaylist || Object.keys(playlists)[0];
  select.value = currentPlaylist;
}

function createPlaylist() {
  const name = prompt("Enter playlist name:");
  if (!name || playlists[name]) {
    if (playlists[name]) alert("Playlist name already exists!");
    return;
  }

  playlists[name] = [];
  currentPlaylist = name;
  savePlaylists();
  loadPlaylists();
}

function savePlaylists() {
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

// Enhanced Music Search
async function searchMusic() {
  const query = document.getElementById("music-search").value.trim();
  if (!query) return;

  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "🔍 Searching...";
  resultsContainer.classList.remove("hidden");

  let results = [];

  // Spotify Search
  try {
    const spotifyToken = localStorage.getItem("spotify_token");
    if (spotifyToken) {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        { headers: { Authorization: `Bearer ${spotifyToken}` } }
      );
      if (res.ok) {
        const data = await res.json();
        results.push(...data.tracks.items.map(t => ({
          name: `${t.name} - ${t.artists[0].name}`,
          url: t.external_urls.spotify,
          type: "spotify",
          platform: "🎵 Spotify"
        })));
      }
    }
  } catch (err) {
    console.warn("Spotify search failed:", err);
  }

  // YouTube Search
  try {
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query + " music")}&key=${YOUTUBE_API_KEY}`
    );
    if (ytRes.ok) {
      const ytData = await ytRes.json();
      results.push(...ytData.items.map(v => ({
        name: v.snippet.title.replace(/[^\w\s-]/g, '').substring(0, 50),
        url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
        type: "youtube",
        platform: "📺 YouTube"
      })));
    }
  } catch (err) {
    console.warn("YouTube search failed:", err);
  }

  // Demo results if no API keys configured
  if (results.length === 0) {
    results = [
      { name: `"${query}" - Sample Track 1`, url: "#", type: "demo", platform: "🎵 Demo" },
      { name: `"${query}" - Sample Track 2`, url: "#", type: "demo", platform: "📺 Demo" },
      { name: `"${query}" - Sample Track 3`, url: "#", type: "demo", platform: "🎵 Demo" }
    ];
  }

  resultsContainer.innerHTML = results.length > 0 
    ? results.map((r, i) => `
        <div class="search-result">
          <span class="platform">${r.platform}</span>
          <span class="track-name">${r.name}</span>
          <button onclick="addSearchResult('${r.url}','${r.type}','${r.name.replace(/'/g, '')}')">Add</button>
        </div>
      `).join("")
    : "<div>No results found. Try a different search term.</div>";
}

function addSearchResult(url, type, name) {
  if (url === "#") {
    alert("This is a demo result. Add your API keys to enable real search!");
    return;
  }
  addToPlaylist(url, type, name);
  document.getElementById("search-results").classList.add("hidden");
}

// OAuth Login Functions
function loginSpotify() {
  const redirectUri = encodeURIComponent(window.location.origin);
  const scope = encodeURIComponent("user-read-private user-read-email playlist-read-private");
  
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
}

function loginYouTube() {
  alert("YouTube search is enabled! Use the search box above to find YouTube videos.");
}

// Check for OAuth callbacks
function checkAuthCallback() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  if (params.get('access_token')) {
    localStorage.setItem('spotify_token', params.get('access_token'));
    window.location.hash = ''; // Clear the hash
    alert("Spotify login successful! You can now search Spotify tracks.");
  }
}

// Upload local songs
document.getElementById("audio-upload").addEventListener("change", (e) => {
  if (!currentPlaylist) {
    alert("Please create/select a playlist first!");
    return;
  }

  const newTracks = Array.from(e.target.files).map((file) => ({
    name: file.name,
    type: "local",
    url: URL.createObjectURL(file),
  }));

  playlists[currentPlaylist] = playlists[currentPlaylist].concat(newTracks);
  savePlaylists();
  currentIndex = playlists[currentPlaylist].length - e.target.files.length;
  playTrack();
});

// Add streaming links
function addLink() {
  if (!currentPlaylist) {
    alert("Please create/select a playlist first!");
    return;
  }

  const input = document.getElementById("link-input");
  const url = input.value.trim();
  if (!url) return;

  let type = "link";
  let name = url;
  
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    type = "youtube";
    name = "YouTube Video";
  }
  if (url.includes("spotify.com")) {
    type = "spotify";
    name = "Spotify Track";
  }
  if (url.includes("music.apple.com")) {
    type = "apple";
    name = "Apple Music Track";
  }

  addToPlaylist(url, type, name);
  input.value = "";
}

function addToPlaylist(url, type, name) {
  if (!currentPlaylist) {
    alert("Please create/select a playlist first!");
    return;
  }

  playlists[currentPlaylist].push({ name, type, url });
  savePlaylists();
  currentIndex = playlists[currentPlaylist].length - 1;
  playTrack();
}

// Switch playlist
document.getElementById("playlist-select").addEventListener("change", (e) => {
  currentPlaylist = e.target.value;
  currentIndex = 0;
  playTrack();
});

// Playback functions
function playTrack() {
  if (!currentPlaylist || playlists[currentPlaylist].length === 0) {
    document.getElementById("now-playing").innerText = "Now Playing: None";
    return;
  }

  const track = playlists[currentPlaylist][currentIndex];
  document.getElementById("now-playing").innerText = `Now Playing: ${track.name}`;
  cleanupEmbed();

  if (track.type === "local") {
    audio.src = track.url;
    audio.play().catch(e => console.log("Audio play failed:", e));
  } else {
    let embedHtml = "";
    if (track.type === "youtube") {
      const vidId = track.url.split("v=")[1]?.split("&")[0] || track.url.split("/").pop();
      embedHtml = `<iframe width="100%" height="80" src="https://www.youtube.com/embed/${vidId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
    } else if (track.type === "spotify") {
      const spotifyId = track.url.split("spotify.com/")[1];
      embedHtml = `<iframe src="https://open.spotify.com/embed/${spotifyId}" width="100%" height="80" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
    } else if (track.type === "apple") {
      embedHtml = `<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="80" style="width:100%;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="${track.url}"></iframe>`;
    }
    document.getElementById("embed-container").innerHTML = embedHtml;
    currentEmbed = track.type;
  }
}

function cleanupEmbed() {
  document.getElementById("embed-container").innerHTML = "";
  audio.pause();
  audio.src = "";
  currentEmbed = null;
}

function togglePlay() {
  if (currentEmbed) return; // embeds handle own playback
  if (audio.paused) {
    audio.play().catch(e => console.log("Audio play failed:", e));
  } else {
    audio.pause();
  }
}

function nextTrack() {
  if (!currentPlaylist) return;
  const list = playlists[currentPlaylist];
  if (list.length === 0) return;
  currentIndex = (currentIndex + 1) % list.length;
  playTrack();
}

function prevTrack() {
  if (!currentPlaylist) return;
  const list = playlists[currentPlaylist];
  if (list.length === 0) return;
  currentIndex = (currentIndex - 1 + list.length) % list.length;
  playTrack();
}

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.music-search-row')) {
    document.getElementById("search-results").classList.add("hidden");
  }
});

// Initialize
loadPlaylists();
checkAuthCallback();