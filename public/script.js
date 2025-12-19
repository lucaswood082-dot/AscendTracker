let currentUser = null;
let currentWorkoutId = null;

// Elements
const authScreen = document.getElementById('auth-screen');
const mainScreen = document.getElementById('main-screen');
const contentDiv = document.getElementById('content');
const popup = document.getElementById('popup');

// Show popup
function showPopup(message) {
    popup.textContent = message;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 2000);
}

// Auth
document.getElementById('create-user-btn').onclick = async () => {
    const username = document.getElementById('username').value.trim();
    if (!username) return showPopup('Enter a username');
    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (res.ok) {
            currentUser = data;
            showMainScreen();
            showPopup('Account created!');
        } else {
            showPopup(data.message || 'Error creating user');
        }
    } catch (err) { showPopup(err.message); }
};

document.getElementById('login-btn').onclick = async () => {
    const username = document.getElementById('username').value.trim();
    if (!username) return showPopup('Enter a username');
    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (res.ok || res.status === 200) {
            currentUser = data;
            showMainScreen();
            showPopup('Logged in!');
        } else {
            showPopup(data.message || 'User not found');
        }
    } catch (err) { showPopup(err.message); }
};

// Navigation
document.getElementById('create-workout-nav').onclick = showCreateWorkout;
document.getElementById('view-workouts-nav').onclick = showWorkouts;

function showMainScreen() {
    authScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    showCreateWorkout();
}

// Create Workout
function showCreateWorkout() {
    contentDiv.innerHTML = `
        <h2>Create Workout</h2>
        <input type="text" id="workout-name" placeholder="Workout Name">
        <button id="save-workout-btn">Save Workout</button>
        <h3>Exercises</h3>
        <div id="exercise-list"></div>
        <input type="text" id="exercise-name" placeholder="Exercise Name">
        <input type="number" id="exercise-sets" placeholder="Sets">
        <input type="text" id="exercise-reps" placeholder="Reps (e.g., 10, 8, 6)">
        <input type="number" id="exercise-rpe" placeholder="RPE 1-10">
        <button id="add-exercise-btn">Add Exercise</button>
        <button id="view-workouts-btn">View My Workouts</button>
    `;

    document.getElementById('save-workout-btn').onclick = saveWorkout;
    document.getElementById('add-exercise-btn').onclick = addExercise;
    document.getElementById('view-workouts-btn').onclick = showWorkouts;
}

async function saveWorkout() {
    const name = document.getElementById('workout-name').value.trim();
    if (!name) return showPopup('Enter a workout name');
    try {
        const res = await fetch('/api/workouts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: currentUser.id, workoutName: name })
        });
        const data = await res.json();
        if (res.ok) {
            currentWorkoutId = data.id;
            showPopup('Workout saved!');
        } else {
            showPopup(data.message || 'Error saving workout');
        }
    } catch (err) { showPopup(err.message); }
}

async function addExercise() {
    if (!currentWorkoutId) return showPopup('Save workout first!');
    const name = document.getElementById('exercise-name').value.trim();
    const sets = document.getElementById('exercise-sets').value;
    const reps = document.getElementById('exercise-reps').value.trim();
    const rpe = document.getElementById('exercise-rpe').value;

    if (!name) return showPopup('Enter exercise name');

    try {
        const res = await fetch(`/api/workouts/${currentWorkoutId}/exercises`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, sets, reps, rpe })
        });
        const data = await res.json();
        if (res.ok) {
            showPopup('Exercise added!');
            displayExercises([data]);
            document.getElementById('exercise-name').value = '';
            document.getElementById('exercise-sets').value = '';
            document.getElementById('exercise-reps').value = '';
            document.getElementById('exercise-rpe').value = '';
        } else {
            showPopup(data.message || 'Error adding exercise');
        }
    } catch (err) { showPopup(err.message); }
}

function displayExercises(exercises) {
    const list = document.getElementById('exercise-list');
    exercises.forEach(ex => {
        const div = document.createElement('div');
        div.className = 'exercise-item';
        div.innerHTML = `${ex.name} - ${ex.sets} sets x ${ex.reps} reps @ RPE ${ex.rpe}`;
        list.appendChild(div);
    });
}

// View Workouts
async function showWorkouts() {
    contentDiv.innerHTML = `<h2>My Workouts</h2><div id="workout-list" class="workout-list"></div>`;
    const listDiv = document.getElementById('workout-list');

    try {
        const res = await fetch(`/api/workouts/${currentUser.id}`);
        const workouts = await res.json();
        if (workouts.length === 0) {
            listDiv.innerHTML = 'No workouts yet';
            return;
        }
        workouts.forEach(async workout => {
            const div = document.createElement('div');
            div.className = 'workout-item';
            div.innerHTML = `<strong>${workout.workoutName}</strong> <button onclick="viewWorkout(${workout.id})">View</button>`;
            listDiv.appendChild(div);
        });
    } catch (err) { showPopup(err.message); }
}

async function viewWorkout(workoutId) {
    contentDiv.innerHTML = `<h2>Exercises</h2><div id="exercise-list"></div><button onclick="showWorkouts()">Back</button>`;
    const listDiv = document.getElementById('exercise-list');

    try {
        const res = await fetch(`/api/workouts/${workoutId}/exercises`);
        const exercises = await res.json();
        if (exercises.length === 0) {
            listDiv.innerHTML = 'No exercises yet';
            return;
        }
        exercises.forEach(ex => {
            const div = document.createElement('div');
            div.className = 'exercise-item';
            div.innerHTML = `${ex.name} - ${ex.sets} sets x ${ex.reps} reps @ RPE ${ex.rpe}`;
            listDiv.appendChild(div);
        });
    } catch (err) { showPopup(err.message); }
}
