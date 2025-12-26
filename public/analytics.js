const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUser = users[0];

let totalTonnage = 0;
let totalSets = 0;
let totalReps = 0;

if (currentUser && Array.isArray(currentUser.workouts)) {
  currentUser.workouts.forEach(workout => {
    workout.exercises?.forEach(ex => {
      ex.sets?.forEach(set => {
        const weight = Number(set.weight) || 0;

        if (ex.unilateral) {
          const left = Number(set.leftReps) || 0;
          const right = Number(set.rightReps) || 0;
          const reps = left + right;

          if (reps > 0 && weight > 0) {
            totalTonnage += weight * reps;
            totalReps += reps;
            totalSets += 1;
          }
        } else {
          const reps = Number(set.reps) || 0;

          if (reps > 0 && weight > 0) {
            totalTonnage += weight * reps;
            totalReps += reps;
            totalSets += 1;
          }
        }
      });
    });
  });
}

/* UPDATE UI */
document.getElementById("tonnageValue").textContent =
  totalTonnage > 0 ? `${totalTonnage} kg` : "0 kg";
