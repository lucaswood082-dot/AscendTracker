
// =======================
// SETTINGS.JS (CLEAN + FIXED)
// =======================

const modalOverlay = document.getElementById("modalOverlay");
const modal = modalOverlay.querySelector(".modal");
const toast = document.getElementById("toast");

// =======================
// UTILITIES
// =======================


function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

function openModal({ title, description, bodyHTML, actionsHTML }) {
  modal.innerHTML = `
    <h3>${title}</h3>
    ${description ? `<p>${description}</p>` : ""}
    ${bodyHTML}
    <div class="popup-actions">
      ${actionsHTML}
    </div>
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

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// =======================
// STORAGE HELPERS
// =======================

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

// =======================
// SHARED INPUT (UI MATCH)
// =======================

function sharedPopupInput(label, id, placeholder, type = "text") {
  return `
    <div class="popup-form">
      <label>${label}</label>
      <input
        type="${type}"
        id="${id}"
        placeholder="${placeholder}"
        class="popup-input"
      />
    </div>
  `;
}

// =======================
// RESET PASSWORD
// =======================

document.getElementById("resetPasswordBtn").onclick = () => {
  openModal({
    title: "Reset Password",
    description: "Choose a new password for your account.",
    bodyHTML: sharedPopupInput(
      "New Password",
      "resetPasswordInput",
      "At least 6 characters",
      "password"
    ),
    actionsHTML: `
      <button class="popup-back-btn" id="cancelResetPassword">Back</button>
      <button class="popup-action-btn" id="saveResetPassword">Save</button>
    `
  });

  document.getElementById("cancelResetPassword").onclick = closeModal;

  document.getElementById("saveResetPassword").onclick = () => {
    const newPassword = document.getElementById("resetPasswordInput").value.trim();

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    const users = getUsers();
    const currentUser = getCurrentUser();
    const index = users.findIndex(u => u.username === currentUser.username);

    if (index === -1) return;

    users[index].password = newPassword;
    saveUsers(users);
    setCurrentUser(users[index]);

    showToast("Password updated");
    closeModal();
  };
};

// =======================
// CHANGE USERNAME
// =======================

document.getElementById("changeUsernameBtn").onclick = () => {
  openModal({
    title: "Change Username",
    description: "This is how your account is identified.",
    bodyHTML: sharedPopupInput(
      "New Username",
      "changeUsernameInput",
      "Enter new username"
    ),
    actionsHTML: `
      <button class="popup-back-btn" id="cancelChangeUsername">Back</button>
      <button class="popup-action-btn" id="saveChangeUsername">Save</button>
    `
  });

  document.getElementById("cancelChangeUsername").onclick = closeModal;

  document.getElementById("saveChangeUsername").onclick = () => {
    const newUsername = document.getElementById("changeUsernameInput").value.trim();
    const users = getUsers();
    const currentUser = getCurrentUser();

    if (!newUsername) {
      showToast("Username cannot be empty");
      return;
    }

    if (users.some(u => u.username === newUsername)) {
      showToast("Username already taken");
      return;
    }

    const index = users.findIndex(u => u.username === currentUser.username);
    if (index === -1) return;

    users[index].username = newUsername;
    saveUsers(users);
    setCurrentUser(users[index]);

    showToast("Username updated");
    closeModal();
  };
};

// =======================
// DELETE ACCOUNT
// =======================

document.getElementById("deleteAccountBtn").onclick = () => {
  openModal({
    title: "Delete Account",
    description: "This action cannot be undone.",
    bodyHTML: `
      <p style="color:#ef4444;font-weight:600;">
        All your data will be permanently removed.
      </p>
    `,
    actionsHTML: `
      <button class="popup-back-btn" id="cancelDelete">Cancel</button>
      <button class="popup-action-btn" id="confirmDelete"
        style="background:#ef4444;color:#fff;">
        Delete
      </button>
    `
  });

  document.getElementById("cancelDelete").onclick = closeModal;

  document.getElementById("confirmDelete").onclick = () => {
    const users = getUsers();
    const currentUser = getCurrentUser();

    saveUsers(users.filter(u => u.username !== currentUser.username));
    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
  };
};

// =======================
// THEME SYSTEM (FIXED)
// =======================

const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${theme}-theme`);
  localStorage.setItem("theme", theme);
}

// Load theme on every page
(function () {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);
})();

themeBtn.onclick = () => {
  openModal({
    title: "Theme",
    description: "Choose how the app looks.",
    bodyHTML: `
      <div class="popup-form">
        <label>Theme</label>
        <button class="popup-action-btn" id="lightThemeBtn">Light Mode</button>
        <button class="popup-back-btn" id="darkThemeBtn">Dark Mode</button>
      </div>
    `,
    actionsHTML: `
      <button class="popup-back-btn" id="cancelTheme">Back</button>
    `
  });

  document.getElementById("cancelTheme").onclick = closeModal;

 document.getElementById("lightThemeBtn").onclick = () => {
  applyTheme("light");
};

document.getElementById("darkThemeBtn").onclick = () => {
  applyTheme("dark");
};

  };

// =======================
// PLACEHOLDER SETTINGS
// =======================

document.getElementById("languageBtn").onclick = () =>
  showToast("Language settings coming soon");

document.getElementById("unitsBtn").onclick = () =>
  showToast("Units settings coming soon");

document.getElementById("workoutHistoryBtn").onclick = () =>
  showToast("Workout history coming soon");

document.getElementById("exportWorkoutsBtn").onclick = () =>
  showToast("Export coming soon");

document.getElementById("termsBtn").onclick = () =>
  showToast("Terms coming soon");

document.getElementById("helpBtn").onclick = () =>
  showToast("Help coming soon");
document.getElementById("lightThemeBtn").addEventListener("click", () => {
  applyTheme("light");
});

document.getElementById("darkThemeBtn").addEventListener("click", () => {
  applyTheme("dark");
});
