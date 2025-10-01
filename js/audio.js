let audio = new Audio();
let playlist = [];
let current = 0;

document.getElementById("audio-upload").addEventListener("change", (e) => {
  playlist = Array.from(e.target.files);
  current = 0;
  playTrack();
});

function playTrack() {
  if (playlist.length === 0) return;
  audio.src = URL.createObjectURL(playlist[current]);
  audio.play();
  document.getElementById("now-playing").innerText = "Now Playing: " + playlist[current].name;
}

function togglePlay() {
  if (audio.paused) audio.play();
  else audio.pause();
}

function nextTrack() {
  if (playlist.length > 0) {
    current = (current + 1) % playlist.length;
    playTrack();
  }
}

function prevTrack() {
  if (playlist.length > 0) {
    current = (current - 1 + playlist.length) % playlist.length;
    playTrack();
  }
}