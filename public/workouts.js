console.log("workouts.js loaded");

const exerciseList = document.getElementById("exerciseList");
const addExerciseBtn = document.getElementById("addExercise");
const saveWorkoutBtn = document.getElementById("saveWorkout");

let exercises = [];

/* ---------------- SHOW POPUP FUNCTION ---------------- */
function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.add("show");
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 2000);
}

/* ---------------- CREATE SET ELEMENT ---------------- */
function createSetElement(isUnilateral, weightValue = "") {
  const setLi = document.createElement("li");

  if (isUnilateral) {
    setLi.innerHTML = `
      <input type="number" placeholder="Left Reps" class="set-left" />
      <input type="number" placeholder="Right Reps" class="set-right" />
      <input type="number" placeholder="Weight" class="set-weight" value="${weightValue}" />
      <button class="remove-set">Remove</button>
    `;
  } else {
    setLi.innerHTML = `
      <input type="number" placeholder="Reps" class="set-reps" />
      <input type="number" placeholder="Weight" class="set-weight" value="${weightValue}" />
      <button class="remove-set">Remove</button>
    `;
  }

  setLi.querySelector(".remove-set").addEventListener("click", () => {
    setLi.parentElement.removeChild(setLi);
  });

  return setLi;
}

/* ---------------- CREATE EXERCISE ELEMENT ---------------- */
function createExerciseElement(exercise) {
  const li = document.createElement("li");
  li.classList.add("exercise-item");

  li.innerHTML = `
    <div class="exercise-header">
      <input type="text" placeholder="Exercise Name" class="exercise-name" value="${exercise.name}" />
      <span class="arrow">▼</span>
    </div>

    <div class="exercise-body">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.5rem;">
        <label class="toggle-switch">
          <input type="checkbox" class="unilateral-toggle" ${exercise.unilateral ? "checked" : ""}>
          <span class="slider"></span>
        </label>
        <span style="font-weight:600; font-size:0.9rem;">Unilateral</span>
      </div>

      <button class="add-set">Add Set</button>
      <ul class="sets-list"></ul>
    </div>
  `;

  const header = li.querySelector(".exercise-header");
  const body = li.querySelector(".exercise-body");
  const arrow = li.querySelector(".arrow");
  const addSetBtn = li.querySelector(".add-set");
  const setsList = li.querySelector(".sets-list");
  const unilateralToggle = li.querySelector(".unilateral-toggle");
  const nameInput = li.querySelector(".exercise-name");

  // Initialize body as visible
  body.style.display = "block";

  // Collapse/expand with arrow rotation
  header.addEventListener("click", (e) => {
    if (e.target === nameInput) return; // Don't toggle when editing name
    const isCollapsed = body.style.display === "none";
    body.style.display = isCollapsed ? "block" : "none";
    arrow.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
  });

  // Add set
  addSetBtn.addEventListener("click", () => {
    const setLi = createSetElement(unilateralToggle.checked);
    setsList.appendChild(setLi);
  });

  // Toggle unilateral
  unilateralToggle.addEventListener("change", () => {
    const setLis = Array.from(setsList.children);
    setLis.forEach((setLi) => {
      const weightInput = setLi.querySelector(".set-weight");
      const weight = weightInput ? weightInput.value : "";
      const newSetLi = createSetElement(unilateralToggle.checked, weight);
      setsList.replaceChild(newSetLi, setLi);
    });
  });

  return li;
}

/* ---------------- RENDER ALL EXERCISES ---------------- */
function renderExercises() {
  exerciseList.innerHTML = "";
  exercises.forEach(ex => {
    const li = createExerciseElement(ex);
    exerciseList.appendChild(li);
  });
}

/* ---------------- ADD EXERCISE ---------------- */
addExerciseBtn.addEventListener("click", () => {
  exercises.push({ name: "", sets: [], unilateral: false });
  renderExercises();
});

/* ---------------- SAVE WORKOUT ---------------- */
saveWorkoutBtn.addEventListener("click", () => {
  const exerciseItems = document.querySelectorAll(".exercise-item");
  exercises = [];

  exerciseItems.forEach((li) => {
    const nameInput = li.querySelector(".exercise-name");
    const unilateralToggle = li.querySelector(".unilateral-toggle");

    const exercise = {
      name: nameInput.value,
      unilateral: unilateralToggle.checked,
      sets: []
    };

    const setLis = li.querySelectorAll(".sets-list li");
    setLis.forEach((setLi) => {
      if (unilateralToggle.checked) {
        exercise.sets.push({
          leftReps: setLi.querySelector(".set-left").value,
          rightReps: setLi.querySelector(".set-right").value,
          weight: setLi.querySelector(".set-weight").value
        });
      } else {
        exercise.sets.push({
          reps: setLi.querySelector(".set-reps").value,
          weight: setLi.querySelector(".set-weight").value
        });
      }
    });

    exercises.push(exercise);
  });

  console.log("Workout saved:", exercises);

  showPopup("Workout Saved!");

  const savedWorkouts = JSON.parse(localStorage.getItem("workouts") || "[]");
  savedWorkouts.push({
    name: document.getElementById("workoutName").value,
    exercises,
    date: new Date()
  });
  localStorage.setItem("workouts", JSON.stringify(savedWorkouts));
});
