console.log("workouts.js loaded");

const exerciseList = document.getElementById("exerciseList");
const addExerciseBtn = document.getElementById("addExercise");
const saveWorkoutBtn = document.getElementById("saveWorkout");

let exercises = [];

/* ---------------- ADD EXERCISE ---------------- */
addExerciseBtn.addEventListener("click", () => {
  const exercise = { name: "", sets: [], unilateral: false };
  exercises.push(exercise);

  const li = document.createElement("li");
  li.classList.add("exercise-item");

  li.innerHTML = `
    <input type="text" placeholder="Exercise Name" class="exercise-name" />

    <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.5rem;">
      <label class="toggle-switch">
        <input type="checkbox" class="unilateral-toggle">
        <span class="slider"></span>
      </label>
      <span style="font-weight:600; font-size:0.9rem;">Unilateral</span>
    </div>

    <button class="add-set">Add Set</button>
    <ul class="sets-list"></ul>
  `;

  const addSetBtn = li.querySelector(".add-set");
  const setsList = li.querySelector(".sets-list");
  const unilateralToggle = li.querySelector(".unilateral-toggle");

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
      setsList.removeChild(setLi);
    });

    return setLi;
  }

  addSetBtn.addEventListener("click", () => {
    const setLi = createSetElement(unilateralToggle.checked);
    setsList.appendChild(setLi);
  });

  unilateralToggle.addEventListener("change", () => {
    const setLis = Array.from(setsList.children);
    setLis.forEach((setLi) => {
      const weightInput = setLi.querySelector(".set-weight");
      const weight = weightInput ? weightInput.value : "";
      const newSetLi = createSetElement(unilateralToggle.checked, weight);
      setsList.replaceChild(newSetLi, setLi);
    });
  });

  exerciseList.appendChild(li);
});

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

  // SHOW POPUP
  showPopup("Workout Saved!");

  // Save to localStorage
  const savedWorkouts = JSON.parse(localStorage.getItem("workouts") || "[]");
  savedWorkouts.push({
    name: document.getElementById("workoutName").value,
    exercises,
    date: new Date()
  });
  localStorage.setItem("workouts", JSON.stringify(savedWorkouts));
});
