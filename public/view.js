// =======================
// VIEW.JS (UNITS FIXED)
// =======================

const UNIT_KEY = "weight_unit";

// ---------- UNIT HELPERS ----------
function getUnit() {
  return localStorage.getItem(UNIT_KEY) || "kg";
}

function formatWeight(kg) {
  if (kg === undefined || kg === null) return "";

  const unit = getUnit();

  if (unit === "lb") {
    return `${(kg * 2.20462).toFixed(1)} lb`;
  }

  return `${kg} kg`;
}

// ---------- LOAD WORKOUT ----------
const workout = JSON.parse(localStorage.getItem("viewWorkout"));
const container = document.getElementById("workoutContainer");

if (!workout || !container) {
  container.innerHTML = "<p>No workout found.</p>";
  throw new Error("No workout or container missing");
}

container.innerHTML = `
  <h2>${workout.name}</h2>
`;

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
