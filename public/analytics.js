const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUser = users[0];

let totalTonnage = 0;
let totalSets = 0;
let totalReps = 0;

if (currentUser && Array.isArray(currentUser.workouts)) {
  currentUser.workouts.forEach(workout => {
    workout.exercises?.forEach(ex => {
      ex.sets?.forEach(set => {
        const weight = parseFloat(set.weight) || 0;

        if (ex.unilateral) {
          const left = parseInt(set.leftReps) || 0;
          const right = parseInt(set.rightReps) || 0;
          totalTonnage += weight * (left + right);
          totalReps += left + right;
        } else {
          const reps = parseInt(set.reps) || 0;
          totalTonnage += weight * reps;
          totalReps += reps;
        }

        totalSets += 1;
      });
    });
  });
}

document.getElementById("totalTonnage").textContent = `${totalTonnage} kg`;
document.getElementById("totalSets").textContent = totalSets;
document.getElementById("totalReps").textContent = totalReps;
