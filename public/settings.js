document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users[0] || { username: "Lucas", workouts: [], units: "kg", language: "en" };

  function showToast(message, duration = 2000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.transition = "opacity 0.5s ease";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.style.display = "none";
      toast.style.transition = "";
    }, 500);
  }, duration);
}

  // Pre-fill fields
  document.getElementById("username").value = user.username;
  document.getElementById("unitSelect").value = user.units || "kg";
  document.getElementById("languageSelect").value = user.language || "en";

  const modalOverlay = document.getElementById("modalOverlay");
  const modalText = document.getElementById("modalText");
  const modalOkBtn = document.getElementById("modalOkBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");

  function showModal(message, options = {}) {
    modalText.textContent = message;
    modalOverlay.style.display = "flex";
    modalOkBtn.textContent = options.okText || "OK";
    modalCancelBtn.style.display = options.showCancel ? "inline-block" : "none";
    return new Promise(resolve => {
      modalOkBtn.onclick = () => { modalOverlay.style.display = "none"; resolve(true); };
      modalCancelBtn.onclick = () => { modalOverlay.style.display = "none"; resolve(false); };
    });
  }

  function saveUser() {
    if (!users.length) users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Save Account
  document.getElementById("saveAccountBtn").addEventListener("click", async () => {
    user.username = document.getElementById("username").value.trim() || user.username;
    const newPassword = document.getElementById("password").value;
    if (newPassword) user.password = newPassword;
    saveUser();
    document.getElementById("password").value = "";
  showToast("Account updated successfully!");
  });

  // Save Units
  document.getElementById("saveUnitsBtn").addEventListener("click", async () => {
    user.units = document.getElementById("unitSelect").value;
    saveUser();
    await showModal(`Units saved as ${user.units.toUpperCase()}`);
  });

  // Save Language
  document.getElementById("saveLanguageBtn").addEventListener("click", async () => {
    user.language = document.getElementById("languageSelect").value;
    saveUser();
    await showModal(`Language saved as ${user.language.toUpperCase()}`);
  });

  // Export workouts as CSV
  document.getElementById("exportWorkoutsBtn").addEventListener("click", () => {
    if (!user.workouts || !user.workouts.length) {
      showModal("No workouts to export!");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Workout Name,Date,Exercise,Unilateral,Reps Left,Reps Right,Reps,Weight\n";

    user.workouts.forEach(w => {
      w.exercises.forEach(e => {
        e.sets.forEach(s => {
          if (e.unilateral) {
            csvContent += `${w.name},${w.date},${e.name},Yes,${s.leftReps},${s.rightReps},,${s.weight}${user.units}\n`;
          } else {
            csvContent += `${w.name},${w.date},${e.name},No,, ,${s.reps},${s.weight}${user.units}\n`;
          }
        });
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "workouts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Clear all workouts
  document.getElementById("clearWorkoutsBtn").addEventListener("click", async () => {
    const confirmClear = await showModal("Are you sure you want to delete all workouts?", { showCancel: true });
    if (confirmClear) {
      user.workouts = [];
      saveUser();
      showModal("All workouts cleared!");
    }
  });
});
