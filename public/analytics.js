/* ===============================
   ANALYTICS.JS – FINAL FIXED
   =============================== */

const WORKOUTS_KEY = "workouts";
const SETTINGS_KEY = "settings";

/* ---------- SETTINGS ---------- */
function getUnit() {
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  return settings.unit === "lb" ? "lb" : "kg";
}

/* ---------- DATA ---------- */
function getWorkouts() {
  return JSON.parse(localStorage.getItem(WORKOUTS_KEY)) || [];
}

function saveWorkouts(workouts) {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

/* ---------- STATS (KG ONLY) ---------- */
function calculateWorkoutStats(workout) {
  let tonnage = 0;
  let sets = 0;
  let reps = 0;

  workout.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      const weight = parseFloat(set.weight) || 0;

      if (ex.unilateral) {
        const left = parseInt(set.leftReps) || 0;
        const right = parseInt(set.rightReps) || 0;
        const totalReps = left + right;

        reps += totalReps;
        tonnage += totalReps * weight;
        sets += 1;
      } else {
        const r = parseInt(set.reps) || 0;

        reps += r;
        tonnage += r * weight;
        sets += 1;
      }
    });
  });

  return { tonnage, sets, reps };
}

/* ---------- RENDER ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const view = document.getElementById("workoutView");
  let startX = 0;
  let index = 0;

  function renderCurrentWorkout() {
    const workouts = getWorkouts();

    if (!workouts.length) {
      view.innerHTML = `
        <div class="workout-box swipe-reset">
          <span class="empty">No workouts</span>
        </div>
      `;
      return;
    }

    if (index >= workouts.length) index = workouts.length - 1;
    if (index < 0) index = 0;

    const workout = workouts[index];
    const stats = calculateWorkoutStats(workout);

    // persist raw stats (kg only)
    workouts[index] = {
      ...workout,
      tonnage: stats.tonnage,
      sets: stats.sets,
      reps: stats.reps
    };

    saveWorkouts(workouts);

    // ✅ SEND WHAT UI EXPECTS
    window.analyticsUI?.renderWorkout({
      ...workout,
      tonnage: stats.tonnage, // NUMBER
      sets: stats.sets,
      reps: stats.reps,
      unit: getUnit()         // kg or lb
    });
  }

  /* ---------- NAV ---------- */
  function nextWorkout() {
    if (!getWorkouts().length) return;
    index = (index + 1) % getWorkouts().length;
    renderCurrentWorkout();
  }

  function prevWorkout() {
    if (!getWorkouts().length) return;
    index = (index - 1 + getWorkouts().length) % getWorkouts().length;
    renderCurrentWorkout();
  }

  /* ---------- INPUT ---------- */
  view.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  view.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) nextWorkout();
    if (dx > 50) prevWorkout();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") nextWorkout();
    if (e.key === "ArrowLeft") prevWorkout();
  });

  /* ---------- LIVE SYNC ---------- */
  window.addEventListener("storage", e => {
    if (e.key === WORKOUTS_KEY || e.key === SETTINGS_KEY) {
      renderCurrentWorkout();
    }
  });

  renderCurrentWorkout();
});
