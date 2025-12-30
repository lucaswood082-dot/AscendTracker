console.log("analytics.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  // -------------------- UTILITY: Calculate Tonnage --------------------
  function calculateWorkoutTonnage(workout) {
    let total = 0;
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (exercise.unilateral) {
          const left = parseFloat(set.leftReps) || 0;
          const right = parseFloat(set.rightReps) || 0;
          const weight = parseFloat(set.weight) || 0;
          total += (left + right) * weight;
        } else {
          const reps = parseFloat(set.reps) || 0;
          const weight = parseFloat(set.weight) || 0;
          total += reps * weight;
        }
      });
    });
    return total;
  }

  // -------------------- LOAD USER WORKOUTS --------------------
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users[0] || { username: "Lucas", workouts: [] };
  const workouts = currentUser.workouts || [];

  const analyticsList = document.getElementById("analyticsList"); // Make sure this exists in HTML
  analyticsList.innerHTML = "";

  let overallTonnage = 0;

  // -------------------- RENDER WORKOUTS --------------------
  workouts.forEach(workout => {
    const tonnage = calculateWorkoutTonnage(workout);
    overallTonnage += tonnage;

    const li = document.createElement("li");
    li.classList.add("workout-item");
    li.innerHTML = `
      <strong>${workout.name}</strong> (${workout.date})<br>
      Total Tonnage: ${tonnage} kg
    `;
    analyticsList.appendChild(li);
  });

  // -------------------- DISPLAY OVERALL TOTAL --------------------
  const totalDiv = document.getElementById("overallTonnage"); // Make sure this exists in HTML
  if (totalDiv) {
    totalDiv.textContent = `Overall Total Tonnage: ${overallTonnage} kg`;
  }

  // -------------------- OPTIONAL: SORT WORKOUTS BY DATE --------------------
  // workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

});
