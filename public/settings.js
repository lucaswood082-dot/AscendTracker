// =======================
// SETTINGS.JS (REAL SPOTIFY)
// =======================

const modalOverlay = document.getElementById("modalOverlay");
const modal = modalOverlay.querySelector(".modal");
const toast = document.getElementById("toast");

/* 🔴 YOU MUST PUT YOUR REAL CLIENT ID HERE */
const SPOTIFY_CLIENT_ID = "PASTE_YOUR_CLIENT_ID_HERE";
const REDIRECT_URI = window.location.origin + "/settings.html";
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing"
].join(" ");

// =======================
// UTILITIES
// =======================

function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2500);
}

function openModal({ title, description, actionsHTML }) {
  modal.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="popup-actions">${actionsHTML}</div>
  `;
  modalOverlay.style.display = "flex";
  requestAnimationFrame(() => modal.classList.add("show"));
}

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => {
    modalOverlay.style.display = "none";
    modal.innerHTML = "";
  }, 200);
}

modalOverlay.onclick = e => {
  if (e.target === modalOverlay) closeModal();
};

// =======================
// SPOTIFY AUTH
// =======================

function connectSpotify() {
  const authURL =
    "https://accounts.spotify.com/authorize" +
    "?client_id=" + SPOTIFY_CLIENT_ID +
    "&response_type=token" +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&scope=" + encodeURIComponent(SCOPES);

  window.location.href = authURL;
}

// Handle token after redirect
(function handleSpotifyRedirect() {
  if (window.location.hash.includes("access_token")) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get("access_token");
    localStorage.setItem("spotify_token", token);
    window.location.hash = "";
    showToast("Spotify connected");
  }
})();

// =======================
// SPOTIFY BUTTON
// =======================

document.getElementById("spotifyBtn").onclick = () => {
  const connected = !!localStorage.getItem("spotify_token");

  openModal({
    title: "Spotify",
    description: connected
      ? "Spotify is connected."
      : "Connect Spotify to control your music during workouts.",
    actionsHTML: connected
      ? `
        <button class="popup-back-btn" id="disconnectSpotify">Disconnect</button>
        <button class="popup-action-btn" id="closeSpotify">Done</button>
      `
      : `
        <button class="popup-back-btn" id="cancelSpotify">Back</button>
        <button class="popup-action-btn" id="connectSpotify">Connect</button>
      `
  });

  if (!connected) {
    document.getElementById("cancelSpotify").onclick = closeModal;
    document.getElementById("connectSpotify").onclick = connectSpotify;
  } else {
    document.getElementById("disconnectSpotify").onclick = () => {
      localStorage.removeItem("spotify_token");
      showToast("Spotify disconnected");
      closeModal();
    };
    document.getElementById("closeSpotify").onclick = closeModal;
  }
};
// =======================
// UNITS
// =======================

const UNIT_KEY = "weight_unit";

function getUnit() {
  return localStorage.getItem(UNIT_KEY) || "kg";
}

function setUnit(unit) {
  localStorage.setItem(UNIT_KEY, unit);
  showToast(`Units set to ${unit.toUpperCase()}`);
}

document.getElementById("unitsBtn").onclick = () => {
  const current = getUnit();

  openModal({
    title: "Units",
    description: "Choose how weights are displayed",
    actionsHTML: `
      <button class="popup-back-btn" id="kgBtn">KG</button>
      <button class="popup-back-btn" id="lbBtn">LB</button>
    `
  });

  document.getElementById("kgBtn").onclick = () => {
    setUnit("kg");
    closeModal();
  };

  document.getElementById("lbBtn").onclick = () => {
    setUnit("lb");
    closeModal();
  };
};


// =======================
// PLACEHOLDERS
// =======================


document.getElementById("exportWorkoutsBtn").onclick = () =>
  showToast("Export coming soon");

document.getElementById("termsBtn").onclick = () =>
  showToast("Terms coming soon");

document.getElementById("helpBtn").onclick = () =>
  showToast("Help coming soon");
