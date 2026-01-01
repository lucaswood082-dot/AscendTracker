console.log("settings.js loaded");

const modalOverlay = document.getElementById("modalOverlay");
const modalText = document.getElementById("modalText");
const modalOkBtn = document.getElementById("modalOkBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const toast = document.getElementById("toast");

const buttons = {
  resetPasswordBtn: document.getElementById("resetPasswordBtn"),
  changeEmailBtn: document.getElementById("changeEmailBtn"),
  profilePictureBtn: document.getElementById("profilePictureBtn"),
  deleteAccountBtn: document.getElementById("deleteAccountBtn"),
  twoFactorBtn: document.getElementById("twoFactorBtn"),
  unitsBtn: document.getElementById("unitsBtn"),
  languageBtn: document.getElementById("languageBtn"),
  themeBtn: document.getElementById("themeBtn"),
  workoutHistoryBtn: document.getElementById("workoutHistoryBtn"),
  exportWorkoutsBtn: document.getElementById("exportWorkoutsBtn"),
  termsBtn: document.getElementById("termsBtn"),
  helpBtn: document.getElementById("helpBtn")
};

/* ---------------- MODAL FUNCTIONS ---------------- */
function openModal(message, options = {}) {
  modalText.textContent = message;
  modalOverlay.style.display = "flex";

  setTimeout(() => modalOverlay.querySelector(".modal").classList.add("show"), 10);

  if (options.showCancel) {
    modalCancelBtn.style.display = "inline-block";
  } else {
    modalCancelBtn.style.display = "none";
  }

  modalOkBtn.onclick = () => {
    modalOverlay.querySelector(".modal").classList.remove("show");
    setTimeout(() => (modalOverlay.style.display = "none"), 300);
    if (options.okCallback) options.okCallback();
  };

  modalCancelBtn.onclick = () => {
    modalOverlay.querySelector(".modal").classList.remove("show");
    setTimeout(() => (modalOverlay.style.display = "none"), 300);
    if (options.cancelCallback) options.cancelCallback();
  };
}

function showToast(message, duration = 2000) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, duration);
}

/* ---------------- BUTTON EVENTS ---------------- */

function addButtonListener(btn, message) {
  btn.addEventListener("click", () => openModal(message, { showCancel: true, okCallback: () => showToast(message + " OK clicked!") }));
}

addButtonListener(buttons.resetPasswordBtn, "Reset your password?");
addButtonListener(buttons.changeEmailBtn, "Change your email address?");
addButtonListener(buttons.profilePictureBtn, "Edit your profile picture?");
addButtonListener(buttons.deleteAccountBtn, "Delete your account?");
addButtonListener(buttons.twoFactorBtn, "Manage Two-Factor Authentication?");
addButtonListener(buttons.unitsBtn, "Change preferred units?");
addButtonListener(buttons.languageBtn, "Change app language?");
addButtonListener(buttons.themeBtn, "Change theme/color scheme?");
addButtonListener(buttons.workoutHistoryBtn, "View workout history?");
addButtonListener(buttons.exportWorkoutsBtn, "Export your workouts?");
addButtonListener(buttons.termsBtn, "View Terms of Service / Privacy Policy?");
addButtonListener(buttons.helpBtn, "View Help & Support / FAQ?");

/* ---------------- CLOSE MODAL ON OUTSIDE CLICK ---------------- */
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.querySelector(".modal").classList.remove("show");
    setTimeout(() => (modalOverlay.style.display = "none"), 300);
  }
});
