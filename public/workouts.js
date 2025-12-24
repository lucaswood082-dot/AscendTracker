console.log("workouts.js loaded");

const exerciseList = document.getElementById("exerciseList");
const addExerciseBtn = document.getElementById("addExercise");
const saveWorkoutBtn = document.getElementById("saveWorkout");

let exercises = [];

/* ---------------- POPUP ---------------- */
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

function createSetElement(isUnilateral, weightValue = "") {
  const setLi = document.createElement("li");

  setLi.style.display = "flex";
  setLi.style.flexDirection = "column";
  setLi.style.marginBottom = "1rem";

  if (isUnilateral) {
    setLi.innerHTML = `
      <input type="number" placeholder="Left Reps" class="set-left reps-input" />
      <input type="number" placeholder="Right Reps" class="set-right reps-input" />
      <input type="number" placeholder="Weight" class="set-weight weight-input" value="${weightValue}" />
      <button class="remove-set remove-btn">Remove</button>
    `;
  } else {
    setLi.innerHTML = `
      <input type="number" placeholder="Reps" class="set-reps reps-input" />
      <input type="number" placeholder="Weight" class="set-weight weight-input" value="${weightValue}" />
      <button class="remove-set remove-btn">Remove</button>
    `;
  }

  // 🔧 INDIVIDUAL SPACING CONTROL
  setLi.querySelectorAll(".reps-input").forEach(el => {
    el.style.marginBottom = "0.3rem";   // reps → next input
  });

  setLi.querySelector(".weight-input").style.marginBottom = "0.4rem"; // weight → remove
  setLi.querySelector(".remove-btn").style.marginBottom = "0.25rem";  // after remove

  setLi.querySelector(".remove-set").addEventListener("click", () => {
    setLi.remove();
  });

  return setLi;
}

/* ---------------- CREATE EXERCISE ---------------- */
function createExerciseElement(exercise) {
  const li = document.createElement("li");
  li.classList.add("exercise-item");

  li.innerHTML = `
    <div class="exercise-header">
      <input
        type="text"
        placeholder="Exercise Name"
        class="exercise-name"
        value="${exercise.name}"
      />
      <span class="arrow">▼</span>
    </div>

    <div class="exercise-body">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.75rem;">
        <label class="toggle-switch">
          <input type="checkbox" class="unilateral-toggle" ${exercise.unilateral ? "checked" : ""}>
          <span class="slider"></span>
        </label>
        <span style="font-size:0.9rem;">Unilateral</span>
      </div>

      <button class="add-set" style="margin-bottom:0.75rem;">
        Add Set
      </button>

      <ul class="sets-list"></ul>
    </div>
  `;

  const body = li.querySelector(".exercise-body");
  const arrow = li.querySelector(".arrow");
  const addSetBtn = li.querySelector(".add-set");
  const setsList = li.querySelector(".sets-list");
  const unilateralToggle = li.querySelector(".unilateral-toggle");

  body.style.display = "block";

  arrow.addEventListener("click", () => {
    body.style.display = body.style.display === "none" ? "block" : "none";
    arrow.classList.toggle("open");
  });

  addSetBtn.addEventListener("click", () => {
    setsList.appendChild(createSetElement(unilateralToggle.checked));
  });

  unilateralToggle.addEventListener("change", () => {
    [...setsList.children].forEach(oldSet => {
      const weight = oldSet.querySelector(".set-weight")?.value || "";
      const newSet = createSetElement(unilateralToggle.checked, weight);
      setsList.replaceChild(newSet, oldSet);
    });
  });

  return li;
}

/* ---------------- RENDER ---------------- */
function renderExercises() {
  exerciseList.innerHTML = "";
  exercises.forEach(ex => {
    exerciseList.appendChild(createExerciseElement(ex));
  });
}

/* ---------------- ADD EXERCISE ---------------- */
addExerciseBtn.addEventListener("click", () => {
  exercises.push({ name: "", sets: [], unilateral: false });
  renderExercises();
});

/* ---------------- SAVE ---------------- */
saveWorkoutBtn.addEventListener("click", () => {
  exercises = [];

  document.querySelectorAll(".exercise-item").forEach(li => {
    const name = li.querySelector(".exercise-name").value;
    const unilateral = li.querySelector(".unilateral-toggle").checked;

    const sets = [];
    li.querySelectorAll(".sets-list li").forEach(setLi => {
      if (unilateral) {
        sets.push({
          leftReps: setLi.querySelector(".set-left").value,
          rightReps: setLi.querySelector(".set-right").value,
          weight: setLi.querySelector(".set-weight").value
        });
      } else {
        sets.push({
          reps: setLi.querySelector(".set-reps").value,
          weight: setLi.querySelector(".set-weight").value
        });
      }
    });

    exercises.push({ name, unilateral, sets });
  });

  const saved = JSON.parse(localStorage.getItem("workouts") || "[]");
  saved.push({
    name: document.getElementById("workoutName").value,
    exercises,
    date: new Date()
  });

  localStorage.setItem("workouts", JSON.stringify(saved));
  showPopup("Workout Saved!");
});
