console.log("settings.js loaded");

const UNIT_KEY = "weight_unit";

const modalOverlay = document.getElementById("modalOverlay");
const modal = document.getElementById("modal");
const toast = document.getElementById("toast");

function vibrate() {
  navigator.vibrate?.(10);
}

function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2200);
}

function openModal(html) {
  modal.innerHTML = html;
  modalOverlay.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);
}

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => {
    modalOverlay.style.display = "none";
    modal.innerHTML = "";
  }, 200);
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

/* ===== ACCOUNT ===== */
document.getElementById("resetPasswordBtn").onclick = () => {
  vibrate();
  openModal(`
    <h3>Reset Password</h3>
    <input id="newPass" type="password" placeholder="New password">
    <div class="popup-actions">
      <button class="popup-back-btn" onclick="closeModal()">Back</button>
      <button class="popup-action-btn" onclick="savePassword()">Save</button>
    </div>
  `);
};

function savePassword() {
  const pass = document.getElementById("newPass").value.trim();
  if (!pass) return showToast("Enter a password");

  let user = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users = users.map(u => u.username === user.username ? { ...u, password: pass } : u);
  user.password = pass;

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  closeModal();
  showToast("Password updated");
}

document.getElementById("changeUsernameBtn").onclick = () => {
  vibrate();
  openModal(`
    <h3>Change Username</h3>
    <input id="newUsername" placeholder="New username">
    <div class="popup-actions">
      <button class="popup-back-btn" onclick="closeModal()">Back</button>
      <button class="popup-action-btn" onclick="saveUsername()">Save</button>
    </div>
  `);
};

function saveUsername() {
  const newName = document.getElementById("newUsername").value.trim();
  if (!newName) return showToast("Enter username");

  let user = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.username === newName)) {
    return showToast("Username exists");
  }

  users = users.map(u => u.username === user.username ? { ...u, username: newName } : u);
  user.username = newName;

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  closeModal();
  showToast("Username updated");
}

document.getElementById("deleteAccountBtn").onclick = () => {
  vibrate();
  openModal(`
    <h3>Delete Account</h3>
    <p>This cannot be undone.</p>
    <div class="popup-actions">
      <button class="popup-back-btn" onclick="closeModal()">Cancel</button>
      <button class="popup-action-btn danger" onclick="confirmDelete()">Delete</button>
    </div>
  `);
};

function confirmDelete() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users = users.filter(u => u.username !== user.username);

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("currentUser");
  localStorage.removeItem("workouts");

  window.location.href = "index.html";
}

/* ===== SPOTIFY ===== */
document.getElementById("spotifyBtn").onclick = () => {
  vibrate();
  openModal(`
    <h3>Spotify</h3>
    <p>Open Spotify Web Player</p>
    <div class="popup-actions">
      <button class="popup-back-btn" onclick="closeModal()">Back</button>
      <button class="popup-action-btn" onclick="window.open('https://open.spotify.com','_blank')">Open</button>
    </div>
  `);
};

/* ===== EXPORT ===== */
document.getElementById("exportWorkoutsBtn").onclick = () => {
  vibrate();
  exportWorkouts();
};

/* ===== UNITS (FIXED) ===== */
document.getElementById("unitsBtn").onclick = () => {
  vibrate();
  openModal(`
    <h3>Units</h3>
    <div class="unit-btns">
      <button id="kgBtn">KG</button>
      <button id="lbBtn">LBS</button>
    </div>
    <div class="popup-actions">
      <button class="popup-back-btn" onclick="closeModal()">Done</button>
    </div>
  `);
  updateUnitUI();
};

/* 🔥 THIS IS THE IMPORTANT PART 🔥 */
document.addEventListener("click", (e) => {
  if (e.target.id === "kgBtn") {
    localStorage.setItem(UNIT_KEY, "kg");
    updateUnitUI();
    vibrate();
  }

  if (e.target.id === "lbBtn") {
    localStorage.setItem(UNIT_KEY, "lb");
    updateUnitUI();
    vibrate();
  }
});

function updateUnitUI() {
  const unit = localStorage.getItem(UNIT_KEY) || "kg";
  const kg = document.getElementById("kgBtn");
  const lb = document.getElementById("lbBtn");
  if (!kg || !lb) return;

  kg.classList.toggle("active", unit === "kg");
  lb.classList.toggle("active", unit === "lb");
}

function exportWorkouts() {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

  if (workouts.length === 0) {
    alert("No workouts to export.");
    return;
  }

  let list = workouts.map((w, i) => `
  <label class="export-row">
    <input type="checkbox" value="${i}" checked>
    <span class="custom-checkbox"></span>
    ${w.name}
  </label>
`).join("");


  openModal(`
    <h3>Export Workouts</h3>
    <div class="export-list">
      ${list}
    </div>
    <div class="popup-actions">
      <button class="popup-back-btn" onclick="closeModal()">Cancel</button>
      <button class="popup-action-btn" onclick="exportSelectedWorkouts()">Export</button>
    </div>
  `);
}
function exportSelectedWorkouts() {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  const checked = [...document.querySelectorAll(".export-list input:checked")];

  if (checked.length === 0) {
    alert("Select at least one workout.");
    return;
  }

  let csv = "Workout,Exercise,Set,Weight,Reps\n";

  checked.forEach(box => {
    const workout = workouts[box.value];

    workout.exercises.forEach(ex => {
      ex.sets.forEach((set, i) => {
        csv += `"${workout.name}","${ex.name}",${i + 1},${set.weight},${set.reps}\n`;
      });
    });
  });

  downloadCSV(csv);
  closeModal();
}
function downloadCSV(csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `workouts-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// Function to trigger light haptic
function haptic() {
  if (navigator.vibrate) navigator.vibrate(10); // 10ms light tap
}

// Apply to all buttons inside settings page
document.querySelectorAll(".settings-page button").forEach(btn => {
  btn.addEventListener("click", () => {
    haptic();
  });
});
