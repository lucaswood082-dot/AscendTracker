const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database
const db = new sqlite3.Database("./ascendtracker.db");

// ---------- CREATE TABLES ----------
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      userId TEXT,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      workoutId TEXT,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sets (
      id TEXT PRIMARY KEY,
      exerciseId TEXT,
      reps INTEGER,
      weight REAL
    )
  `);
});

// ---------- USERS ----------
app.post("/api/users", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Missing username" });

  const id = uuidv4();
  db.run(
    "INSERT INTO users (id, username) VALUES (?, ?)",
    [id, username],
    err => {
      if (err) return res.status(400).json({ error: "Username exists" });
      res.json({ id, username });
    }
  );
});

app.get("/api/users/:username", (req, res) => {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [req.params.username],
    (err, row) => {
      if (!row) return res.status(404).json({ error: "User not found" });
      res.json(row);
    }
  );
});

// ---------- SAVE WORKOUT ----------
app.post("/api/workouts", (req, res) => {
  const { userId, name, exercises } = req.body;

  if (!userId || !name || !exercises)
    return res.status(400).json({ error: "Missing fields" });

  const workoutId = uuidv4();

  db.run(
    "INSERT INTO workouts (id, userId, name) VALUES (?, ?, ?)",
    [workoutId, userId, name],
    err => {
      if (err) return res.status(500).json(err);

      exercises.forEach(ex => {
        const exId = uuidv4();
        db.run(
          "INSERT INTO exercises (id, workoutId, name) VALUES (?, ?, ?)",
          [exId, workoutId, ex.name]
        );

        ex.sets.forEach(s => {
          db.run(
            "INSERT INTO sets (id, exerciseId, reps, weight) VALUES (?, ?, ?, ?)",
            [uuidv4(), exId, s.reps, s.weight]
          );
        });
      });

      res.json({ success: true });
    }
  );
});

// ---------- GET WORKOUTS (FIXED) ----------
app.get("/api/workouts", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  db.all(
    "SELECT * FROM workouts WHERE userId = ?",
    [userId],
    (err, workouts) => {
      if (err) return res.status(500).json(err);
      if (workouts.length === 0) return res.json([]);

      let completed = 0;
      const output = [];

      workouts.forEach(w => {
        db.all(
          "SELECT * FROM exercises WHERE workoutId = ?",
          [w.id],
          (err, exercises) => {
            exercises.forEach(ex => {
              db.all(
                "SELECT reps, weight FROM sets WHERE exerciseId = ?",
                [ex.id],
                (err, sets) => {
                  ex.sets = sets;
                }
              );
            });

            setTimeout(() => {
              output.push({ ...w, exercises });
              completed++;
              if (completed === workouts.length) {
                res.json(output);
              }
            }, 50);
          }
        );
      });
    }
  );
});

// ---------- START ----------
app.listen(PORT, () =>
  console.log(`AscendTracker running on http://localhost:${PORT}`)
);
