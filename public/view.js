// =======================
// VIEW.JS (UNITS 100% FIXED)
// =======================

const UNIT_KEY = "weight_unit";

/* =======================
   UNIT HELPERS
======================= */

function getUnit() {
  return localStorage.getItem(UNIT_KEY) || "kg";
}

function formatWeight(weightKg) {
  if (weightKg === undefined || weightKg === null) return "";

  const unit = getUnit();

  if (unit === "lb") {
    return `${(weightKg * 2.20462).toFixed(1)} lb`;
  }

  return `${weightKg} kg`;
}

/* =======================
   RENDER WORKOUT
======================= */

const container = document.getElementById("workoutContainer");

function renderWorkout() {
 localStorage.setItem("workouts", JSON.stringify(workouts));


  if (!workout || !container) {
    container.innerHTML = "<p>No workout found.</p>";
    return;
  }

  container.innerHTML = `<h2>${workout.name}</h2>`;

  workout.exercises.forEach(exercise => {
    const exDiv = document.createElement("div");
    exDiv.className = "exercise-card";

    exDiv.innerHTML = `<h3>${exercise.name}</h3>`;

    exercise.sets.forEach(set => {
      const setDiv = document.createElement("div");
      setDiv.className = "set-row";

      setDiv.innerHTML = `
        <span>${set.reps} reps</span>
        <span>${formatWeight(set.weight)}</span>
      `;

      exDiv.appendChild(setDiv);
    });

    container.appendChild(exDiv);
  });
}
function addLongPress(el, callback, delay = 500) {
  let timer;

  el.addEventListener("touchstart", () => {
    timer = setTimeout(callback, delay);
  });

  el.addEventListener("touchend", () => {
    clearTimeout(timer);
  });

  el.addEventListener("touchmove", () => {
    clearTimeout(timer);
  });

  // Desktop fallback
  el.addEventListener("mousedown", () => {
    timer = setTimeout(callback, delay);
  });

  el.addEventListener("mouseup", () => {
    clearTimeout(timer);
  });

  el.addEventListener("mouseleave", () => {
    clearTimeout(timer);
  });
}


/* =======================
   INITIAL LOAD
======================= */

renderWorkout();

/* =======================
   RE-RENDER WHEN RETURNING
   FROM SETTINGS
======================= */

window.addEventListener("focus", renderWorkout);
