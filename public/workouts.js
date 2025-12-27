console.log("workouts.js loaded");

const exerciseList = document.getElementById("exerciseList");
const addExerciseBtn = document.getElementById("addExercise");
const saveWorkoutBtn = document.getElementById("saveWorkout");

const DRAFT_KEY = "activeWorkoutDraft";

let exercises = [];

/* ---------------- POPUP ---------------- */
function showPopup(message) {
  const popup = document.getElementById("saveToast");
  popup.textContent = message;
  popup.classList.add("show");
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 2000);
}

/* ---------------- LOCAL DATE (FIXED) ---------------- */
function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ---------------- SAVE DRAFT ---------------- */
function saveDraft() {
  const draft = {
    workoutName: document.getElementById("workoutName").value || "",
    exercises: []
  };

  document.querySelectorAll(".exercise-item").forEach(li => {
    const name = li.querySelector(".exercise-name").value;
    const unilateral = li.querySelector(".unilateral-toggle").checked;

    const sets = [];
    li.querySelectorAll(".sets-list li").forEach(setLi => {
      if (unilateral) {
        sets.push({
          leftReps: setLi.querySelector(".set-left")?.value || "",
          rightReps: setLi.querySelector(".set-right")?.value || "",
          weight: setLi.querySelector(".set-weight")?.value || ""
        });
      } else {
        sets.push({
          reps: setLi.querySelector(".set-reps")?.value || "",
          weight: setLi.querySelector(".set-weight")?.value || ""
        });
      }
    });

    draft.exercises.push({ name, unilateral, sets });
  });

  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

/* ---------------- LOAD DRAFT ---------------- */
function loadDraft() {
  const saved = localStorage.getItem(DRAFT_KEY);
  if (!saved) return;

  const draft = JSON.parse(saved);
  document.getElementById("workoutName").value = draft.workoutName || "";

  exerciseList.innerHTML = "";
  exercises = [];

  draft.exercises.forEach(ex => {
    exercises.push(ex);
    const el = createExerciseElement(ex);
    const setsList = el.querySelector(".sets-list");

    ex.sets.forEach(set => {
      const setEl = createSetElement(ex.unilateral, set.weight || "");
      if (ex.unilateral) {
        setEl.querySelector(".set-left").value = set.leftReps || "";
        setEl.querySelector(".set-right").value = set.rightReps || "";
      } else {
        setEl.querySelector(".set-reps").value = set.reps || "";
      }
      setsList.appendChild(setEl);
    });

    exerciseList.appendChild(el);
  });
}

/* ---------------- CREATE SET ELEMENT ---------------- */
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

  setLi.querySelector(".remove-set").addEventListener("click", () => {
    setLi.remove();
    saveDraft();
  });

  return setLi;
}

/* ---------------- CREATE EXERCISE ---------------- */
function createExerciseElement(exercise) {
  const li = document.createElement("li");
  li.classList.add("exercise-item");

  li.innerHTML = `
    <div class="exercise-header">
      <input type="text" placeholder="Exercise Name" class="exercise-name" value="${exercise.name}" />
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
      <button class="add-set" style="margin-bottom:0.75rem;">Add Set</button>
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
    saveDraft();
  });

  unilateralToggle.addEventListener("change", () => {
    [...setsList.children].forEach(oldSet => {
      const weight = oldSet.querySelector(".set-weight")?.value || "";
      const newSet = createSetElement(unilateralToggle.checked, weight);
      setsList.replaceChild(newSet, oldSet);
    });
    saveDraft();
  });

  return li;
}

/* ---------------- ADD EXERCISE ---------------- */
addExerciseBtn.addEventListener("click", () => {
  const newExercise = { name: "", sets: [], unilateral: false };
  exercises.push(newExercise);
  exerciseList.appendChild(createExerciseElement(newExercise));
  saveDraft();
});
/* ---------------- CLEAR ALL ---------------- */
const clearAllBtn = document.getElementById("clearAll");

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all exercises?")) {
    exercises = [];
    exerciseList.innerHTML = "";
    saveDraft(); // also clear draft
  }
});

/* ---------------- SAVE WORKOUT ---------------- */
saveWorkoutBtn.addEventListener("click", () => {
  exercises = [];

  document.querySelectorAll(".exercise-item").forEach(li => {
    const name = li.querySelector(".exercise-name").value;
    const unilateral = li.querySelector(".unilateral-toggle").checked;

    const sets = [];
    li.querySelectorAll(".sets-list li").forEach(setLi => {
      if (unilateral) {
        sets.push({
          leftReps: parseInt(setLi.querySelector(".set-left").value) || 0,
          rightReps: parseInt(setLi.querySelector(".set-right").value) || 0,
          weight: parseFloat(setLi.querySelector(".set-weight").value) || 0
        });
      } else {
        sets.push({
          reps: parseInt(setLi.querySelector(".set-reps").value) || 0,
          weight: parseFloat(setLi.querySelector(".set-weight").value) || 0
        });
      }
    });

    exercises.push({ name, unilateral, sets });
  });

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users[0] || { username: "Lucas", workouts: [] };

  if (!currentUser.workouts) currentUser.workouts = [];

  const workoutObj = {
    name: document.getElementById("workoutName").value || "Unnamed Workout",
    exercises,
    date: getLocalDateString()
  };

  currentUser.workouts.push(workoutObj);

  if (!users.length) users.push(currentUser);
  localStorage.setItem("users", JSON.stringify(users));

  localStorage.removeItem(DRAFT_KEY); // ✅ clear draft ONLY on save

  showPopup("Workout Saved!");

  document.getElementById("workoutName").value = "";
  exerciseList.innerHTML = "";
  exercises = [];
});

/* ---------------- AUTO SAVE ---------------- */
document.addEventListener("input", saveDraft);

/* ---------------- INIT ---------------- */
loadDraft();
