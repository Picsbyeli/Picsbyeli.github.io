let audio = new Audio();
let playlists = JSON.parse(localStorage.getItem("playlists") || "{}");
let currentPlaylist = null;
let currentIndex = 0;
let currentEmbed = null;

// Init playlists
function loadPlaylists() {
  const select = document.getElementById("playlist-select");
  select.innerHTML = "";

  Object.keys(playlists).forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  if (Object.keys(playlists).length > 0) {
    currentPlaylist = currentPlaylist || Object.keys(playlists)[0];
    select.value = currentPlaylist;
  }
}
loadPlaylists();

function createPlaylist() {
  const name = prompt("Enter playlist name:");
  if (!name || playlists[name]) return;

  playlists[name] = [];
  currentPlaylist = name;
  savePlaylists();
  loadPlaylists();
}

function savePlaylists() {
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

// Upload local songs
document.getElementById("audio-upload").addEventListener("change", (e) => {
  if (!currentPlaylist) {
    alert("Please create/select a playlist first!");
    return;
  }

  playlists[currentPlaylist] = playlists[currentPlaylist].concat(
    Array.from(e.target.files).map((file) => ({
      name: file.name,
      type: "local",
      url: URL.createObjectURL(file),
    }))
  );

  savePlaylists();
  currentIndex = playlists[currentPlaylist].length - e.target.files.length;
  playTrack();
});

// Add YouTube/Spotify/Apple Music links
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
    name = "YouTube: " + (url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop());
  }
  if (url.includes("spotify.com")) {
    type = "spotify";
    name = "Spotify: " + url.split("/").pop().split("?")[0];
  }
  if (url.includes("music.apple.com")) {
    type = "apple";
    name = "Apple Music: " + url.split("/").pop().split("?")[0];
  }

  playlists[currentPlaylist].push({ name, type, url });
  savePlaylists();
  input.value = "";
  currentIndex = playlists[currentPlaylist].length - 1;
  playTrack();
}

// Switch playlist
document.getElementById("playlist-select").addEventListener("change", (e) => {
  currentPlaylist = e.target.value;
  currentIndex = 0;
  playTrack();
});

// Play current track
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
    audio.play().catch(e => console.log("Autoplay prevented:", e));
  } else {
    let embedHtml = "";
    if (track.type === "youtube") {
      const vidId = track.url.split("v=")[1]?.split("&")[0] || track.url.split("/").pop();
      embedHtml = `<iframe width="300" height="80" src="https://www.youtube.com/embed/${vidId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
    } else if (track.type === "spotify") {
      const spotifyPath = track.url.split("spotify.com/")[1];
      embedHtml = `<iframe src="https://open.spotify.com/embed/${spotifyPath}" width="300" height="80" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
    } else if (track.type === "apple") {
      embedHtml = `<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="80" style="width:300px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="${track.url}"></iframe>`;
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
  if (audio.paused) audio.play();
  else audio.pause();
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