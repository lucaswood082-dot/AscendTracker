document.addEventListener("DOMContentLoaded", () => {

  console.log("workouts.js loaded");

  const exerciseList = document.getElementById("exerciseList");
  const addExerciseBtn = document.getElementById("addExercise");
  const saveWorkoutBtn = document.getElementById("saveWorkout");
  const clearAllBtn = document.getElementById("clearAll");

  const clearModal = document.getElementById("clearModal");
  const cancelClearBtn = document.getElementById("cancelClear");
  const confirmClearBtn = document.getElementById("confirmClear");

  const DRAFT_KEY = "activeWorkoutDraft";
  let exercises = [];

  /* ---------------- POPUP ---------------- */
  function showPopup(message) {
    const popup = document.getElementById("saveToast");
    if (!popup) return;
    popup.textContent = message;
    popup.classList.add("show");
    popup.classList.remove("hidden");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 2000);
  }

  /* ---------------- LOCAL DATE ---------------- */
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
      workoutName: document.getElementById("workoutName")?.value || "",
      exercises: []
    };

    document.querySelectorAll(".exercise-item").forEach(li => {
      const name = li.querySelector(".exercise-name")?.value || "";
      const unilateral = li.querySelector(".unilateral-toggle")?.checked || false;

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

  /* ---------------- CREATE SET ---------------- */
  function createSetElement(isUnilateral, weightValue = "") {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.flexDirection = "column";
    li.style.marginBottom = "1rem";

    li.innerHTML = isUnilateral
      ? `
        <input type="number" placeholder="Left Reps" class="set-left reps-input" />
        <input type="number" placeholder="Right Reps" class="set-right reps-input" />
        <input type="number" placeholder="Weight" class="set-weight weight-input" value="${weightValue}" />
        <button class="remove-set remove-btn">Remove</button>
      `
      : `
        <input type="number" placeholder="Reps" class="set-reps reps-input" />
        <input type="number" placeholder="Weight" class="set-weight weight-input" value="${weightValue}" />
        <button class="remove-set remove-btn">Remove</button>
      `;

    li.querySelector(".remove-set").addEventListener("click", () => {
      li.remove();
      saveDraft();
    });

    return li;
  }

  /* ---------------- CREATE EXERCISE ---------------- */
  function createExerciseElement(exercise) {
    const li = document.createElement("li");
    li.classList.add("exercise-item");

    li.innerHTML = `
      <div class="exercise-header">
        <input class="exercise-name" placeholder="Exercise Name" value="${exercise.name}" />
        <span class="arrow">⌄</span>
      </div>

      <div class="exercise-body">
        <label class="toggle-switch">
          <input type="checkbox" class="unilateral-toggle" ${exercise.unilateral ? "checked" : ""}>
          <span class="slider"></span>
        </label>
        <button class="add-set">Add Set</button>
        <ul class="sets-list"></ul>
      </div>
    `;

    const body = li.querySelector(".exercise-body");
    const arrow = li.querySelector(".arrow");
    const setsList = li.querySelector(".sets-list");
    const addSetBtn = li.querySelector(".add-set");
    const unilateralToggle = li.querySelector(".unilateral-toggle");

    arrow.addEventListener("click", () => {
      body.style.display = body.style.display === "none" ? "block" : "none";
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
    const ex = { name: "", sets: [], unilateral: false };
    exercises.push(ex);
    exerciseList.appendChild(createExerciseElement(ex));
    saveDraft();
  });

  /* ---------------- CLEAR ALL (CUSTOM MODAL) ---------------- */
  clearAllBtn.addEventListener("click", () => {
    clearModal.classList.remove("hidden");
  });

  cancelClearBtn.addEventListener("click", () => {
    clearModal.classList.add("hidden");
  });

  confirmClearBtn.addEventListener("click", () => {
    exercises = [];
    exerciseList.innerHTML = "";
    saveDraft();
    clearModal.classList.add("hidden");
  });

  /* ---------------- SAVE WORKOUT ---------------- */
saveWorkoutBtn.addEventListener("click", () => {
  const workoutName = document.getElementById("workoutName").value.trim() || "Workout";

  exercises = [];

  let tonnage = 0;
  let totalSets = 0;
  let totalReps = 0;

  document.querySelectorAll(".exercise-item").forEach(li => {
    const name = li.querySelector(".exercise-name").value || "";
    const unilateral = li.querySelector(".unilateral-toggle").checked;
    const sets = [];

    li.querySelectorAll(".sets-list li").forEach(setLi => {
      totalSets++;

      if (unilateral) {
        const l = +setLi.querySelector(".set-left").value || 0;
        const r = +setLi.querySelector(".set-right").value || 0;
        const w = +setLi.querySelector(".set-weight").value || 0;
        const reps = l + r;

        totalReps += reps;
        tonnage += reps * w;
        sets.push({ leftReps: l, rightReps: r, weight: w });
      } else {
        const reps = +setLi.querySelector(".set-reps").value || 0;
        const w = +setLi.querySelector(".set-weight").value || 0;

        totalReps += reps;
        tonnage += reps * w;
        sets.push({ reps, weight: w });
      }
    });

    exercises.push({ name, unilateral, sets });
  });

  // Load existing workouts
  const storedWorkouts = JSON.parse(localStorage.getItem("workouts") || "[]");

  // Add new workout
  storedWorkouts.push({
    name: workoutName,
    date: new Date().toISOString().split("T")[0],
    exercises,
    tonnage,
    totalSets,
    totalReps
  });

  // Save back to localStorage
  localStorage.setItem("workouts", JSON.stringify(storedWorkouts));

  // Show "Workout Saved!" popup
  showPopup("Workout Saved!");

  // Reset form
  exercises = [];
  document.getElementById("exerciseList").innerHTML = "";
  document.getElementById("workoutName").value = "";
});

  /* ---------------- AUTO SAVE ---------------- */
  document.addEventListener("input", saveDraft);

  /* ---------------- INIT ---------------- */
  loadDraft();

});
