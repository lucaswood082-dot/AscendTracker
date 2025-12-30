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
  let overallSets = 0;
  let overallReps = 0;

  if (workouts.length === 0) {
    analyticsList.innerHTML = `<li class="empty">No workouts saved yet.</li>`;
    totalDiv.textContent = "Overall Total Tonnage: 0 kg | Total Sets: 0 | Total Reps: 0";
    return;
  }

  // Sort by date newest first
  workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

  workouts.forEach(workout => {
    const tonnage = workout.tonnage || 0;
    const sets = workout.totalSets || 0;
    const reps = workout.totalReps || 0;

    overallTonnage += tonnage;
    overallSets += sets;
    overallReps += reps;

    const li = document.createElement("li");
    li.classList.add("workout-item");
    li.style.background = "#111827";
    li.style.color = "#e5e7eb";
    li.style.border = "1px solid #1f2937";
    li.style.borderRadius = "12px";
    li.style.padding = "1rem";
    li.style.marginBottom = "0.75rem";

    // Render exercises exactly as they were saved
    let exercisesHTML = "";
    workout.exercises.forEach(ex => {
      exercisesHTML += `<strong>${ex.name}</strong><br>`;
      ex.sets.forEach((set, i) => {
        if (ex.unilateral) {
          exercisesHTML += `Set ${i + 1}: Left ${set.leftReps} | Right ${set.rightReps} | Weight: ${set.weight} kg<br>`;
        } else {
          exercisesHTML += `Set ${i + 1}: Reps ${set.reps} | Weight: ${set.weight} kg<br>`;
        }
      });
      exercisesHTML += "<br>";
    });

    li.innerHTML = `
      <div style="color:#38bdf8; font-weight:600; margin-bottom:0.25rem;">${workout.name} (${workout.date})</div>
      ${exercisesHTML}
      <div>Tonnage: ${tonnage} kg | Sets: ${sets} | Reps: ${reps}</div>
    `;

    analyticsList.appendChild(li);
  });

  totalDiv.textContent = `Overall Total Tonnage: ${overallTonnage} kg | Total Sets: ${overallSets} | Total Reps: ${overallReps}`;
});
