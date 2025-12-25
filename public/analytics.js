const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUser = users[0];

let totalTonnage = 0;
let totalSets = 0;
let totalReps = 0;

if (currentUser && Array.isArray(currentUser.workouts)) {
  currentUser.workouts.forEach(workout => {
    workout.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (ex.unilateral) {
          const left = parseInt(set.leftReps) || 0;
          const right = parseInt(set.rightReps) || 0;
          const weight = parseFloat(set.weight) || 0;
          totalTonnage += weight * (left + right);
          totalSets += 1;
          totalReps += left + right;
        } else {
          const reps = parseInt(set.reps) || 0;
          const weight = parseFloat(set.weight) || 0;
          totalTonnage += weight * reps;
          totalSets += 1;
          totalReps += reps;
        }
      });
    });
  });
}

document.getElementById("totalTonnage").textContent = totalTonnage ? totalTonnage + " kg" : "0 kg";
document.getElementById("totalSets").textContent = totalSets || 0;
document.getElementById("totalReps").textContent = totalReps || 0;
