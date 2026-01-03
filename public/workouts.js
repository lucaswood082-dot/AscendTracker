// =======================
// WORKOUTS.JS (EDIT SAFE)
// =======================

document.addEventListener("DOMContentLoaded", () => {

  console.log("workouts.js loaded");

  /* ---------------- DOM ---------------- */
  const exerciseList = document.getElementById("exerciseList");
  const addExerciseBtn = document.getElementById("addExercise");
  const saveWorkoutBtn = document.getElementById("saveWorkout");
  const clearAllBtn = document.getElementById("clearAll");

  const clearModal = document.getElementById("clearModal");
  const cancelClearBtn = document.getElementById("cancelClear");
  const confirmClearBtn = document.getElementById("confirmClear");

  const nameInput = document.getElementById("workoutName");

  /* ---------------- STORAGE KEYS ---------------- */
  const DRAFT_KEY = "activeWorkoutDraft";
  const EDIT_INDEX_KEY = "editingWorkoutIndex";
  const EDIT_WORKOUT_KEY = "editingWorkout";

  /* ---------------- STATE ---------------- */
  let exercises = [];

  const editingIndex = localStorage.getItem(EDIT_INDEX_KEY);
  const editingWorkout = JSON.parse(localStorage.getItem(EDIT_WORKOUT_KEY));

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

  /* ---------------- SAVE DRAFT ---------------- */
  function saveDraft() {
    const draft = {
      workoutName: nameInput.value,
      exercises
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  /* ---------------- LOAD DRAFT ---------------- */
  function loadDraft() {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;

    const draft = JSON.parse(saved);
    nameInput.value = draft.workoutName || "";
    exercises = draft.exercises || [];
    renderExercises();
  }

  /* ---------------- SET ELEMENT ---------------- */
  function createSetElement(unilateral, weight = "") {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.flexDirection = "column";
    li.style.marginBottom = "1rem";

    li.innerHTML = unilateral
      ? `
        <input class="set-left" placeholder="Left Reps" type="number">
        <input class="set-right" placeholder="Right Reps" type="number">
        <input class="set-weight" placeholder="Weight" type="number" value="${weight}">
        <button class="remove-set">Remove</button>
      `
      : `
        <input class="set-reps" placeholder="Reps" type="number">
        <input class="set-weight" placeholder="Weight" type="number" value="${weight}">
        <button class="remove-set">Remove</button>
      `;

    li.querySelector(".remove-set").onclick = () => {
      li.remove();
      saveDraft();
    };

    return li;
  }

  /* ---------------- EXERCISE ELEMENT ---------------- */
  function createExerciseElement(ex) {
    const li = document.createElement("li");
    li.className = "exercise-item";

    li.innerHTML = `
      <div class="exercise-header">
        <input class="exercise-name" value="${ex.name || ""}" placeholder="Exercise Name">
        <span class="arrow">⌄</span>
      </div>

      <div class="exercise-body">
        <label class="toggle-switch">
          <input type="checkbox" class="unilateral-toggle" ${ex.unilateral ? "checked" : ""}>
          <span class="slider"></span>
        </label>
        <button class="add-set">Add Set</button>
        <ul class="sets-list"></ul>
      </div>
    `;

    const body = li.querySelector(".exercise-body");
    const setsList = li.querySelector(".sets-list");
    const toggle = li.querySelector(".unilateral-toggle");

    li.querySelector(".arrow").onclick = () => {
      body.style.display = body.style.display === "none" ? "block" : "none";
    };

    li.querySelector(".add-set").onclick = () => {
      setsList.appendChild(createSetElement(toggle.checked));
      saveDraft();
    };

    toggle.onchange = () => {
      [...setsList.children].forEach(old => {
        const w = old.querySelector(".set-weight")?.value || "";
        setsList.replaceChild(createSetElement(toggle.checked, w), old);
      });
      saveDraft();
    };

    (ex.sets || []).forEach(set => {
      const el = createSetElement(ex.unilateral, set.weight || "");
      if (ex.unilateral) {
        el.querySelector(".set-left").value = set.leftReps || "";
        el.querySelector(".set-right").value = set.rightReps || "";
      } else {
        el.querySelector(".set-reps").value = set.reps || "";
      }
      setsList.appendChild(el);
    });

    return li;
  }

  /* ---------------- RENDER ---------------- */
  function renderExercises() {
    exerciseList.innerHTML = "";
    exercises.forEach(ex => exerciseList.appendChild(createExerciseElement(ex)));
  }

  /* ---------------- ADD EXERCISE ---------------- */
  addExerciseBtn.onclick = () => {
    exercises.push({ name: "", unilateral: false, sets: [] });
    renderExercises();
    saveDraft();
  };

  /* ---------------- CLEAR ---------------- */
  clearAllBtn.onclick = () => clearModal.classList.remove("hidden");
  cancelClearBtn.onclick = () => clearModal.classList.add("hidden");
  confirmClearBtn.onclick = () => {
    exercises = [];
    exerciseList.innerHTML = "";
    localStorage.removeItem(DRAFT_KEY);
    clearModal.classList.add("hidden");
  };

  /* ---------------- SAVE WORKOUT ---------------- */
  saveWorkoutBtn.onclick = () => {

    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

    let tonnage = 0, totalSets = 0, totalReps = 0;
    const compiled = [];

    document.querySelectorAll(".exercise-item").forEach(li => {
      const name = li.querySelector(".exercise-name").value;
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

      compiled.push({ name, unilateral, sets });
    });

    const workout = {
      name: nameInput.value || "Workout",
      date: new Date().toISOString().split("T")[0],
      exercises: compiled,
      tonnage,
      totalSets,
      totalReps
    };

    if (editingIndex !== null) {
      workouts[editingIndex] = workout;
    } else {
      workouts.push(workout);
    }

    localStorage.setItem("workouts", JSON.stringify(workouts));

    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(EDIT_INDEX_KEY);
    localStorage.removeItem(EDIT_WORKOUT_KEY);

    showPopup("Workout Saved!");
    exercises = [];
    exerciseList.innerHTML = "";
    nameInput.value = "";
  };

  /* ---------------- INIT ---------------- */
  if (editingWorkout && editingIndex !== null) {
    nameInput.value = editingWorkout.name || "";
    exercises = editingWorkout.exercises || [];
    renderExercises();
  } else {
    loadDraft();
  }

  document.addEventListener("input", saveDraft);

});
