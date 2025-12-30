console.log("analytics.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users[0];

  if (!currentUser || !Array.isArray(currentUser.workouts)) {
    console.warn("No workouts found");
    return;
  }

  const workouts = currentUser.workouts;

  const analyticsList = document.getElementById("analyticsList");
  const overallDiv = document.getElementById("overallTonnage");

  if (!analyticsList) return;

  analyticsList.innerHTML = "";

  let overallTonnage = 0;

  workouts.forEach(workout => {
    const tonnage = workout.tonnage || 0;
    const sets = workout.totalSets || 0;
    const reps = workout.totalReps || 0;

    overallTonnage += tonnage;

    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <h3>${workout.name || "Workout"}</h3>
      <p style="color:#9ca3af; font-size:0.85rem;">${workout.date || ""}</p>
      <p><strong>Tonnage:</strong> ${tonnage} kg</p>
      <p><strong>Sets:</strong> ${sets}</p>
      <p><strong>Reps:</strong> ${reps}</p>
    `;

    analyticsList.appendChild(li);
  });

  if (overallDiv) {
    overallDiv.textContent = `Overall Tonnage: ${overallTonnage} kg`;
  }

});
