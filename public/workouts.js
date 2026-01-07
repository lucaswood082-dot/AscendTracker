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
  const IS_EDITING_KEY = "isEditingWorkout";

  let exercises = [];
  const EDIT_INDEX_KEY = "editingWorkoutIndex";
const EDIT_WORKOUT_KEY = "editingWorkout";






  /* ---------------- HAPTIC ---------------- */
  function triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  }

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
  loadDraft();

  /* ---------------- AUTO SAVE ON LEAVE ---------------- */

// When switching tabs, navigating away, or backgrounding app
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveDraft();
  }
});

// iOS / Safari / PWA safety net
window.addEventListener("pagehide", () => {
  saveDraft();
});

// Desktop / hard navigation
window.addEventListener("beforeunload", () => {
  saveDraft();
});
window.addEventListener("beforeunload", () => {
  saveDraft();
});

  /* ---------------- SAVE DRAFT ---------------- */
  function saveDraft() {
    const draft = {
      workoutName: document.getElementById("workoutName")?.value || "",
      exercises: exercises
    };

    document.querySelectorAll(".exercise-item").forEach((li, idx) => {
      const unilateral = li.querySelector(".unilateral-toggle")?.checked || false;
      exercises[idx].name = li.querySelector(".exercise-name")?.value || "";
      exercises[idx].unilateral = unilateral;
      exercises[idx].sets = [];

      li.querySelectorAll(".sets-list li").forEach(setLi => {
        if (unilateral) {
          exercises[idx].sets.push({
            leftReps: setLi.querySelector(".set-left")?.value || "",
            rightReps: setLi.querySelector(".set-right")?.value || "",
            weight: setLi.querySelector(".set-weight")?.value || ""
          });
        } else {
          exercises[idx].sets.push({
            reps: setLi.querySelector(".set-reps")?.value || "",
            weight: setLi.querySelector(".set-weight")?.value || ""
          });
        }
      });
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
  /* ---------------- LOAD EDIT WORKOUT ---------------- */
const editIndex = localStorage.getItem(EDIT_INDEX_KEY);
const editWorkout = localStorage.getItem(EDIT_WORKOUT_KEY);

if (editIndex !== null && editWorkout) {
  const data = JSON.parse(editWorkout);

  // Set workout name
  document.getElementById("workoutName").value = data.name;

  // Clear current draft
  exerciseList.innerHTML = "";
  exercises = [];

  // Load exercises
  data.exercises.forEach(ex => {
    exercises.push({
      name: ex.name,
      unilateral: ex.unilateral,
      sets: []
    });

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

  // Clear workout data copy, but KEEP index until save
localStorage.removeItem(EDIT_WORKOUT_KEY);
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

    const removeBtn = li.querySelector(".remove-set");

    let hovered = false;
    removeBtn.addEventListener("mouseenter", () => {
      if (!hovered) {
        triggerHaptic();
        hovered = true;
      }
    });

    removeBtn.addEventListener("mouseleave", () => {
      hovered = false;
    });

    removeBtn.addEventListener("click", () => {
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

  /* ---------------- CLEAR ALL ---------------- */
  clearAllBtn.addEventListener("click", () => {
    clearModal.classList.remove("hidden");
  });

  cancelClearBtn.addEventListener("click", () => {
    clearModal.classList.add("hidden");
  });

  confirmClearBtn.addEventListener("click", () => {
    exercises = [];
    exerciseList.innerHTML = "";
    localStorage.removeItem(DRAFT_KEY);
    clearModal.classList.add("hidden");
  });

  saveWorkoutBtn.addEventListener("click", () => {
  const workoutName =
    document.getElementById("workoutName").value.trim() || "Workout";

  // Gather exercises
  const exercisesToSave = [];
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

    exercisesToSave.push({ name, unilateral, sets });
  });

let storedWorkouts = JSON.parse(localStorage.getItem("workouts") || "[]");
storedWorkouts = storedWorkouts.filter(w => w); // remove nulls


  const editIdx = localStorage.getItem(EDIT_INDEX_KEY);
  const workoutData = {
    name: workoutName,
    date: new Date().toISOString().split("T")[0],
    exercises: exercisesToSave,
    tonnage,
    totalSets,
    totalReps
  };

  if (editIdx !== null) {
    const idx = parseInt(editIdx, 10);  // convert string → number
    storedWorkouts[idx] = workoutData;
    localStorage.removeItem(EDIT_INDEX_KEY);
    localStorage.removeItem(EDIT_WORKOUT_KEY);
  } else {
    storedWorkouts.push(workoutData);
  }

  console.log("SAVING WORKOUTS:", storedWorkouts);
  localStorage.setItem("workouts", JSON.stringify(storedWorkouts));

  // Clear UI
  showPopup("Workout Saved!");
  localStorage.removeItem(DRAFT_KEY);
  exercises = [];
  exerciseList.innerHTML = "";
  document.getElementById("workoutName").value = "";
});


if (editIdx !== null) {
    storedWorkouts[editIdx] = workoutData;
    localStorage.removeItem("editWorkoutIndex");
    localStorage.removeItem("editingWorkout");
  } else {
    storedWorkouts.push(workoutData); // ➕ NEW
  }

console.log("BEFORE SAVE:", storedWorkouts);
  localStorage.setItem("workouts", JSON.stringify(storedWorkouts));
localStorage.setItem("viewWorkout", JSON.stringify(workoutData)); // ✅ ADD THIS


  showPopup("Workout Saved!");

  localStorage.removeItem(DRAFT_KEY);
  exercises = [];
  exerciseList.innerHTML = "";
  document.getElementById("workoutName").value = "";
  

});