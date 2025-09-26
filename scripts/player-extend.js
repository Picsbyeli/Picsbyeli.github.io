// scripts/player-extend.js
// Adds drag-and-drop + file input enhancement for the topbar audio player.
// Assumes base player code initialized #tp-file and exposes window.playerApi.addTracks.

window.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.body; // entire page acts as drop target
  const fileInput = document.getElementById("tp-file");

  if (!dropZone) return;

  // Visual highlight on drag over
  dropZone.addEventListener("dragover", (e) => {
    try {
      e.preventDefault();
      dropZone.style.outline = "3px dashed #4f46e5";
    } catch (_) {}
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.outline = "";
  });

  dropZone.addEventListener("drop", async (e) => {
    try {
      e.preventDefault();
      dropZone.style.outline = "";
      const files = [...(e.dataTransfer?.files || [])].filter((f) => f.type.startsWith("audio/"));
      if (!files.length) return;
      await handleFiles(files);
    } catch (err) {
      console.error("player-extend drop error", err);
    }
  });

  fileInput?.addEventListener("change", async (e) => {
    try {
      const files = [...(e.target?.files || [])];
      if (!files.length) return;
      await handleFiles(files);
      // Reset input so same file can be added again if desired
      e.target.value = "";
    } catch (err) {
      console.error("player-extend fileInput error", err);
    }
  });

  async function handleFiles(files) {
    const user = window.BurbleAuth?.auth?.currentUser;
    // If logged in and upload API available, push to cloud; else local blob URLs
    if (user && window.BurbleCloud?.uploadSong) {
      const uploaded = [];
      for (const f of files) {
        try {
          const { title, url } = await window.BurbleCloud.uploadSong(user.uid, f);
          uploaded.push({ title, url });
        } catch (e) {
          console.warn("Upload failed, falling back to local for", f.name, e);
          uploaded.push({ title: stripExt(f.name), url: URL.createObjectURL(f) });
        }
      }
      window.playerApi?.addTracks(uploaded);
    } else {
      const tracks = files.map((f) => ({ title: stripExt(f.name), url: URL.createObjectURL(f) }));
      window.playerApi?.addTracks(tracks);
    }
  }

  function stripExt(name) {
    return name.replace(/\.[^.]+$/, "");
  }
});
