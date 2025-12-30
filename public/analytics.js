console.log("analytics.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users[0] || { username: "Lucas", workouts: [] };
  const workouts = currentUser.workouts || [];

  let overallTonnage = 0;
  let overallSets = 0;
  let overallReps = 0;

  // Calculate totals for all workouts
  workouts.forEach(workout => {
    let workoutSets = 0;
    let workoutReps = 0;
    let workoutTonnage = 0;

    workout.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (ex.unilateral) {
          const reps = (parseInt(set.leftReps) || 0) + (parseInt(set.rightReps) || 0);
          workoutReps += reps;
          workoutTonnage += reps * (parseFloat(set.weight) || 0);
          workoutSets += 1;
        } else {
          const reps = parseInt(set.reps) || 0;
          workoutReps += reps;
          workoutTonnage += reps * (parseFloat(set.weight) || 0);
          workoutSets += 1;
        }
      });
    });

    // Save totals into the workout object for renderWorkout
    workout.tonnage = workoutTonnage;
    workout.sets = workoutSets;
    workout.reps = workoutReps;

    overallTonnage += workoutTonnage;
    overallSets += workoutSets;
    overallReps += workoutReps;
  });

  // Update overall stats in HTML
  const totalTonnageEl = document.getElementById("overallTonnage");
  const totalSetsEl = document.getElementById("totalSets");
  const totalRepsEl = document.getElementById("totalReps");

  if (totalTonnageEl) totalTonnageEl.textContent = `${overallTonnage} kg`;
  if (totalSetsEl) totalSetsEl.textContent = overallSets;
  if (totalRepsEl) totalRepsEl.textContent = overallReps;

  // Render the first workout (if exists)
  if (workouts.length > 0 && window.analyticsUI?.renderWorkout) {
    window.analyticsUI.renderWorkout(workouts[0]);
  }
});
