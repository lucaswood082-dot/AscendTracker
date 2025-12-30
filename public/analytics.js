console.log("analytics.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  // -------------------- LOAD USER WORKOUTS --------------------
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users[0] || { username: "Lucas", workouts: [] };
  const workouts = currentUser.workouts || [];

  const analyticsList = document.getElementById("analyticsList");
  const totalDiv = document.getElementById("overallTonnage");

  if (!analyticsList || !totalDiv) return;

  analyticsList.innerHTML = "";

  let overallTonnage = 0;

  // -------------------- RENDER WORKOUTS --------------------
  if (workouts.length === 0) {
    analyticsList.innerHTML = `<li class="empty">No workouts saved yet.</li>`;
    totalDiv.textContent = "Overall Total Tonnage: 0 kg";
    return;
  }

  // Optional: sort by date newest first
  workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

  workouts.forEach(workout => {
    const tonnage = workout.tonnage || 0;
    overallTonnage += tonnage;

    const li = document.createElement("li");
    li.classList.add("workout-item");
    li.style.background = "#111827";
    li.style.color = "#e5e7eb";
    li.style.border = "1px solid #1f2937";
    li.style.borderRadius = "12px";
    li.style.padding = "1rem";
    li.style.marginBottom = "0.75rem";
    li.innerHTML = `
      <strong style="color:#38bdf8;">${workout.name}</strong> (${workout.date})<br>
      Total Tonnage: ${tonnage} kg<br>
      Sets: ${workout.totalSets || 0} | Reps: ${workout.totalReps || 0}
    `;
    analyticsList.appendChild(li);
  });

  totalDiv.textContent = `Overall Total Tonnage: ${overallTonnage} kg`;
});
