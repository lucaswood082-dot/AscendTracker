console.log("analytics.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  // -------------------- LOAD USER WORKOUTS --------------------
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users[0] || { username: "Lucas", workouts: [] };
  const workouts = currentUser.workouts || [];

  const analyticsList = document.getElementById("analyticsList");
  const totalDiv = document.getElementById("overallTonnage");

  if (!analyticsList) return;

  analyticsList.innerHTML = "";

  let overallTonnage = 0;

  // -------------------- SORT BY DATE (NEWEST FIRST) --------------------
  workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // -------------------- RENDER WORKOUTS --------------------
  workouts.forEach(workout => {
    // ✅ Use saved values (fallback for old workouts)
    const tonnage =
      typeof workout.tonnage === "number"
        ? workout.tonnage
        : calculateLegacyTonnage(workout);

    const sets = workout.totalSets ?? "—";
    const reps = workout.totalReps ?? "—";

    overallTonnage += tonnage;

    const li = document.createElement("li");
    li.classList.add("workout-item");

    li.innerHTML = `
      <div class="workout-card">
        <div class="workout-title">${workout.name}</div>
        <div class="workout-date">${workout.date}</div>

        <div class="workout-stats">
          <span>${tonnage.toLocaleString()} kg</span>
          <span>${sets} sets</span>
          <span>${reps} reps</span>
        </div>
      </div>
    `;

    analyticsList.appendChild(li);
  });

  // -------------------- DISPLAY OVERALL TOTAL --------------------
  if (totalDiv) {
    totalDiv.textContent = `Overall Tonnage: ${overallTonnage.toLocaleString()} kg`;
  }

  // -------------------- LEGACY FALLBACK --------------------
  function calculateLegacyTonnage(workout) {
    let total = 0;
    workout.exercises?.forEach(exercise => {
      exercise.sets?.forEach(set => {
        if (exercise.unilateral) {
          const left = Number(set.leftReps) || 0;
          const right = Number(set.rightReps) || 0;
          const weight = Number(set.weight) || 0;
          total += (left + right) * weight;
        } else {
          const reps = Number(set.reps) || 0;
          const weight = Number(set.weight) || 0;
          total += reps * weight;
        }
      });
    });
    return total;
  }

});
