const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ascendtracker.db');

// Users table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL
)`);

// Workouts table
db.run(`CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    workoutName TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
)`);

// Exercises table
db.run(`CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workoutId INTEGER,
    name TEXT NOT NULL,
    sets INTEGER,
    reps TEXT,
    rpe INTEGER,
    FOREIGN KEY(workoutId) REFERENCES workouts(id)
)`);

module.exports = db;
