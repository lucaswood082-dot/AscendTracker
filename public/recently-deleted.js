document.addEventListener("DOMContentLoaded", () => {

  const list = document.getElementById("deletedList");
  const emptyText = document.getElementById("emptyText");

  const DELETED_KEY = "recentlyDeletedWorkouts";

  const deleted =
    JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");

  if (deleted.length === 0) {
    emptyText.style.display = "block";
    return;
  }

  deleted.forEach((workout, index) => {
    const row = document.createElement("div");
    row.className = "setting-row";

    row.innerHTML = `
      <div>
        <strong>${workout.name}</strong><br>
        <small>Deleted on ${workout.deletedAt}</small>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn-secondary restore-btn">Restore</button>
        <button class="btn-danger delete-btn">Delete</button>
      </div>
    `;

    // Restore
    row.querySelector(".restore-btn").addEventListener("click", () => {
      restoreWorkout(index);
    });

    // Permanently delete
    row.querySelector(".delete-btn").addEventListener("click", () => {
      permanentlyDelete(index);
    });

    list.appendChild(row);
  });

  function restoreWorkout(index) {
    const deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
    const workouts = JSON.parse(localStorage.getItem("workouts") || "[]");

    const restored = deleted.splice(index, 1)[0];
    delete restored.deletedAt;

    workouts.push(restored);

    localStorage.setItem("workouts", JSON.stringify(workouts));
    localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));

    location.reload();
  }

  function permanentlyDelete(index) {
    const deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
    deleted.splice(index, 1);
    localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    location.reload();
  }

});
