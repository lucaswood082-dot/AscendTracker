document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users[0] || { username: "Lucas", workouts: [] };
  const workouts = currentUser.workouts || [];

  let index = 0;
  const view = document.getElementById("workoutView");
  let startX = 0;

  function renderCurrentWorkout() {
    if (workouts.length === 0) {
      view.innerHTML = `<div class="workout-box swipe-reset"><span class="empty">No workouts</span></div>`;
      return;
    }

    const workout = workouts[index];
    if (!workout) return;

    // Update workout totals if not already
    if (workout.sets === undefined || workout.reps === undefined || workout.tonnage === undefined) {
      let workoutTonnage = 0;
      let workoutSets = 0;
      let workoutReps = 0;

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

      workout.tonnage = workoutTonnage;
      workout.sets = workoutSets;
      workout.reps = workoutReps;
    }

    // Render workout in your existing structure
    window.analyticsUI?.renderWorkout(workout);
  }

  function showNext() {
    if (workouts.length === 0) return;
    index = (index + 1) % workouts.length;
    renderCurrentWorkout();
  }

  function showPrev() {
    if (workouts.length === 0) return;
    index = (index - 1 + workouts.length) % workouts.length;
    renderCurrentWorkout();
  }

  // Hook swipe events
  view.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  view.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) showNext();
    if (dx > 50) showPrev();
  });

  // Optional desktop buttons (arrows)
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  // Display the first workout on load
  renderCurrentWorkout();
});
