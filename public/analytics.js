console.log("Analytics loaded");

const tonnageEl = document.getElementById("tonnageValue");

// STEP 1: Get workouts
const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

console.log("Workouts:", workouts);

// STEP 2: Calculate tonnage
function calculateTotalTonnage(workouts) {
  let total = 0;

  workouts.forEach(workout => {
    workout.exercises?.forEach(exercise => {
      exercise.sets?.forEach(set => {
        const reps = Number(set.reps) || 0;
        const weight = Number(set.weight) || 0;
        total += reps * weight;
      });
    });
  });

  return total;
}

// STEP 3: Display
const totalTonnage = calculateTotalTonnage(workouts);
tonnageEl.textContent = totalTonnage + " kg";
