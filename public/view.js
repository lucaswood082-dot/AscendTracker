// =======================
// VIEW.JS (CLEAN + STABLE)
// =======================

const WORKOUTS_KEY = "workouts";
const VIEW_KEY = "viewWorkout";
const EDIT_KEY = "editWorkoutIndex";
const UNIT_KEY = "weight_unit";
const RECENTLY_DELETED_KEY = "recentlyDeletedWorkouts";

const container = document.getElementById("workoutContainer");

/* =======================
   UNIT HELPERS
======================= */

function getUnit() {
  return localStorage.getItem(UNIT_KEY) || "kg";
}

function formatWeight(weightKg) {
  if (weightKg == null) return "";
  if (getUnit() === "lb") {
    return `${(weightKg * 2.20462).toFixed(1)} lb`;
  }
  return `${weightKg} kg`;
}

/* =======================
   LOAD DATA (FRESH EACH TIME)
======================= */

function getWorkouts() {
  return JSON.parse(localStorage.getItem(WORKOUTS_KEY) || "[]");
}

function getViewedWorkout() {
  return JSON.parse(localStorage.getItem(VIEW_KEY));
}

/* =======================
   LONG PRESS
======================= */

function addLongPress(el, callback, delay = 500) {
  let timer;

  const start = () => {
    timer = setTimeout(callback, delay);
  };

  const cancel = () => clearTimeout(timer);

  el.addEventListener("touchstart", start);
  el.addEventListener("touchend", cancel);
  el.addEventListener("touchmove", cancel);

  el.addEventListener("mousedown", start);
  el.addEventListener("mouseup", cancel);
  el.addEventListener("mouseleave", cancel);
}

/* =======================
   EDIT WORKOUT
======================= */

function startEditWorkout() {
  const workouts = getWorkouts();
  const workout = getViewedWorkout();
  if (!workout) return;

  const index = workouts.findIndex(
    w => w.name === workout.name && w.date === workout.date
  );

  if (index === -1) return;

  localStorage.setItem(EDIT_KEY, index);
  localStorage.setItem("editingWorkout", JSON.stringify(workouts[index]));

  window.location.href = "workout.html";
}

/* =======================
   DELETE WORKOUT (INSTANT)
======================= */
function deleteCurrentWorkout() {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  const workout = JSON.parse(localStorage.getItem("viewWorkout"));

  if (!workout) {
    console.log("NO VIEWED WORKOUT");
    return;
  }

  const index = workouts.findIndex(
    w => w.name === workout.name && w.date === workout.date
  );

  if (index === -1) {
    console.log("WORKOUT NOT FOUND");
    return;
  }

  const recentlyDeleted =
    JSON.parse(localStorage.getItem("recentlyDeletedWorkouts")) || [];

  const [removed] = workouts.splice(index, 1);

  recentlyDeleted.unshift({
    ...removed,
    deletedAt: Date.now()
  });

  localStorage.setItem("workouts", JSON.stringify(workouts));
  localStorage.setItem(
    "recentlyDeletedWorkouts",
    JSON.stringify(recentlyDeleted)
  );

  localStorage.removeItem("viewWorkout");

  console.log("DELETED:", removed);
  console.log("RECENTLY DELETED:", recentlyDeleted);

  window.location.href = "view.html";
}
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  const workout = JSON.parse(localStorage.getItem(VIEW_KEY));

  if (!workout) return; // nothing to delete

  const index = workouts.findIndex(
    w => w.name === workout.name && w.date === workout.date
  );

  if (index === -1) return; // workout not found

  // get or create recently deleted array
  let deleted = JSON.parse(localStorage.getItem(RECENTLY_DELETED_KEY)) || [];

  // remove the workout from main array
  const [removed] = workouts.splice(index, 1);

  // add timestamp for recently deleted
  deleted.unshift({
    ...removed,
    deletedAt: Date.now()
  });

  // keep only latest 10
  deleted = deleted.slice(0, 10);

  // save back to localStorage
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  localStorage.setItem(RECENTLY_DELETED_KEY, JSON.stringify(deleted));

  // clear viewed workout so it doesn't ghost
  localStorage.removeItem(VIEW_KEY);

  // refresh page to reflect changes
  window.location.href = "view.html";


/* =======================
   RENDER
======================= */

function renderWorkout() {
  const workout = getViewedWorkout();

  if (!container) return;

  if (!workout) {
    container.innerHTML = "<p>No workout found.</p>";
    return;
  }

  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = workout.name;
  container.appendChild(title);

  workout.exercises.forEach(ex => {
    const card = document.createElement("div");
    
    card.className = "exercise-card";

    card.innerHTML = `<h3>${ex.name}</h3>`;

    ex.sets.forEach(set => {
      const row = document.createElement("div");
      row.className = "set-row";

      let repsText = "";

      if (ex.unilateral) {
        repsText = `${set.leftReps || 0} / ${set.rightReps || 0} reps`;
      } else {
        repsText = `${set.reps || 0} reps`;
      }

      row.innerHTML = `
        <span>${repsText}</span>
        <span>${formatWeight(set.weight)}</span>
      `;

      card.appendChild(row);
    });

    container.appendChild(card);
  });

  // long press anywhere to edit
  addLongPress(container, startEditWorkout);
}

/* =======================
   INIT
======================= */

renderWorkout();

// re-render if units change
window.addEventListener("focus", renderWorkout);

// expose delete function for your delete button
window.deleteCurrentWorkout = deleteCurrentWorkout;


