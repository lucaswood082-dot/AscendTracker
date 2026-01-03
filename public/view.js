// =======================
// VIEW.JS (EDIT + UNITS WORKING)
// =======================

const WORKOUTS_KEY = "workouts";
const VIEW_KEY = "viewWorkout";
const EDIT_KEY = "editWorkoutIndex";
const UNIT_KEY = "weight_unit";

/* =======================
   UNIT HELPERS
======================= */

function getUnit() {
  return localStorage.getItem(UNIT_KEY) || "kg";
}

function formatWeight(weightKg) {
  if (weightKg === undefined || weightKg === null) return "";

  if (getUnit() === "lb") {
    return `${(weightKg * 2.20462).toFixed(1)} lb`;
  }

  return `${weightKg} kg`;
}

/* =======================
   LOAD DATA
======================= */

const workouts = JSON.parse(localStorage.getItem(WORKOUTS_KEY)) || [];
const workout = JSON.parse(localStorage.getItem(VIEW_KEY));
const container = document.getElementById("workoutContainer");

/* =======================
   LONG PRESS HELPER
======================= */

function addLongPress(el, callback, delay = 500) {
  let timer;

  const start = () => {
    timer = setTimeout(callback, delay);
  };

  const cancel = () => {
    clearTimeout(timer);
  };

  el.addEventListener("touchstart", start);
  el.addEventListener("touchend", cancel);
  el.addEventListener("touchmove", cancel);

  el.addEventListener("mousedown", start);
  el.addEventListener("mouseup", cancel);
  el.addEventListener("mouseleave", cancel);
}

/* =======================
   EDIT WORKOUT HANDOFF
======================= */

function startEditWorkout() {
  const index = workouts.findIndex(w => w.id === workout.id);

  if (index === -1) return;

  localStorage.setItem(EDIT_KEY, index);
  localStorage.setItem("editingWorkout", JSON.stringify(workouts[index]));

  window.location.href = "workout.html";
}

/* =======================
   RENDER WORKOUT
======================= */

function renderWorkout() {
  if (!workout || !container) {
    container.innerHTML = "<p>No workout found.</p>";
    return;
  }

  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = workout.name;
  container.appendChild(title);

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

  // 🔥 LONG PRESS TO EDIT
  addLongPress(container, startEditWorkout);
}

/* =======================
   INIT
======================= */

renderWorkout();

/* =======================
   RE-RENDER ON UNIT CHANGE
======================= */

window.addEventListener("focus", renderWorkout);
