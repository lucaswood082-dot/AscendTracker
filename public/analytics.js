document.addEventListener("DOMContentLoaded", () => {
  const view = document.getElementById("workoutView");
  let startX = 0;
  let index = 0;

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function getWorkouts() {
  return JSON.parse(localStorage.getItem("workouts")) || [];
}


  function calculateWorkoutStats(workout) {
    let tonnage = 0;
    let sets = 0;
    let reps = 0;

    workout.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (ex.unilateral) {
          const left = parseInt(set.leftReps) || 0;
          const right = parseInt(set.rightReps) || 0;
          const totalReps = left + right;

          reps += totalReps;
          tonnage += totalReps * (parseFloat(set.weight) || 0);
          sets += 1;
        } else {
          const r = parseInt(set.reps) || 0;

          reps += r;
          tonnage += r * (parseFloat(set.weight) || 0);
          sets += 1;
        }
      });
    });

    return { tonnage, sets, reps };
  }

  function persistWorkoutStats(workoutIndex, stats) {
    const users = getUsers();
    if (!users[0] || !users[0].workouts[workoutIndex]) return;

    users[0].workouts[workoutIndex].tonnage = stats.tonnage;
    users[0].workouts[workoutIndex].sets = stats.sets;
    users[0].workouts[workoutIndex].reps = stats.reps;

    saveUsers(users);
  }

  function renderCurrentWorkout() {
    const workouts = getWorkouts();

    // 🔹 If workouts were deleted in view.html
    if (workouts.length === 0) {
      view.innerHTML = `
        <div class="workout-box swipe-reset">
          <span class="empty">No workouts</span>
        </div>
      `;
      return;
    }

    // 🔹 Prevent index breaking if list shrinks
    if (index >= workouts.length) index = workouts.length - 1;
    if (index < 0) index = 0;

    const workout = workouts[index];
    const stats = calculateWorkoutStats(workout);

    // 🔹 Persist stats so analytics stays correct on reload
    persistWorkoutStats(index, stats);

    // 🔹 Send data to EXISTING UI renderer (unchanged)
    window.analyticsUI?.renderWorkout({
      ...workout,
      tonnage: stats.tonnage,
      sets: stats.sets,
      reps: stats.reps
    });
  }

  function nextWorkout() {
    const workouts = getWorkouts();
    if (!workouts.length) return;
    index = (index + 1) % workouts.length;
    renderCurrentWorkout();
  }

  function prevWorkout() {
    const workouts = getWorkouts();
    if (!workouts.length) return;
    index = (index - 1 + workouts.length) % workouts.length;
    renderCurrentWorkout();
  }

  // 🔹 Swipe support
  view.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  view.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) nextWorkout();
    if (dx > 50) prevWorkout();
  });

  // 🔹 Keyboard support
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextWorkout();
    if (e.key === "ArrowLeft") prevWorkout();
  });

  // 🔹 Re-sync analytics when workouts are added/deleted elsewhere
  window.addEventListener("storage", renderCurrentWorkout);

  // 🔹 Initial render
  renderCurrentWorkout();
});
