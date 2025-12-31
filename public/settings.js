// ===== SETTINGS.JS =====

// Grab elements
const darkModeToggle = document.getElementById("darkModeToggle");
const hapticsToggle = document.getElementById("hapticsToggle");
const animationsToggle = document.getElementById("animationsToggle");
const autoSaveToggle = document.getElementById("autoSaveToggle");
const defaultRestTime = document.getElementById("defaultRestTime");
const unitsSelect = document.getElementById("unitsSelect");
const exportDataBtn = document.getElementById("exportData");
const clearDataBtn = document.getElementById("clearData");

// ===== LOAD SETTINGS =====
function loadSettings() {
  if (localStorage.getItem("darkMode") === "true") {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
  }

  if (localStorage.getItem("haptics") === "true") {
    hapticsToggle.checked = true;
  }

  if (localStorage.getItem("animations") === "true") {
    animationsToggle.checked = true;
  }

  if (localStorage.getItem("autoSaveDrafts") === "true") {
    autoSaveToggle.checked = true;
  }

  if (localStorage.getItem("defaultRestTime")) {
    defaultRestTime.value = localStorage.getItem("defaultRestTime");
  }

  if (localStorage.getItem("units")) {
    unitsSelect.value = localStorage.getItem("units");
  }
}

// ===== SAVE SETTINGS =====
function saveSetting(key, value) {
  localStorage.setItem(key, value);
}

// ===== DARK MODE =====
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
    saveSetting("darkMode", "true");
  } else {
    document.body.classList.remove("dark-mode");
    saveSetting("darkMode", "false");
  }
});

// ===== HAPTICS =====
hapticsToggle.addEventListener("change", () => {
  saveSetting("haptics", hapticsToggle.checked ? "true" : "false");
});

// ===== ANIMATIONS =====
animationsToggle.addEventListener("change", () => {
  saveSetting("animations", animationsToggle.checked ? "true" : "false");
});

// ===== AUTO-SAVE DRAFTS =====
autoSaveToggle.addEventListener("change", () => {
  saveSetting("autoSaveDrafts", autoSaveToggle.checked ? "true" : "false");
});

// ===== DEFAULT REST TIME =====
defaultRestTime.addEventListener("change", () => {
  let val = parseInt(defaultRestTime.value);
  if (isNaN(val) || val < 10) val = 10;
  if (val > 300) val = 300;
  defaultRestTime.value = val;
  saveSetting("defaultRestTime", val);
});

// ===== UNITS =====
unitsSelect.addEventListener("change", () => {
  saveSetting("units", unitsSelect.value);
});

// ===== EXPORT DATA =====
exportDataBtn.addEventListener("click", () => {
  const workoutsData = localStorage.getItem("workouts") || "[]";
  const blob = new Blob([workoutsData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workouts.json";
  a.click();
  URL.revokeObjectURL(url);
  alert("Workouts exported!");
});

// ===== CLEAR DATA =====
clearDataBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all workouts and settings? This cannot be undone.")) {
    localStorage.clear();
    location.reload();
  }
});

// ===== INITIALIZE =====
loadSettings();
