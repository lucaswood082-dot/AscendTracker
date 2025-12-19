const { v4: uuidv4 } = require("uuid");

module.exports = (db) => {
  const router = require("express").Router();

  // Create workout
  router.post("/", (req, res) => {
    const { userId, name } = req.body;
    if (!userId || !name) return res.status(400).json({ error: "Missing fields" });

    const id = uuidv4();
    const timestamp = new Date().toISOString();
    db.run(
      "INSERT INTO workouts(id, userId, name, timestamp) VALUES (?, ?, ?, ?)",
      [id, userId, name, timestamp],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, userId, name, timestamp });
      }
    );
  });

  // Get all workouts for a user
  router.get("/:userId", (req, res) => {
    const { userId } = req.params;
    db.all(
      "SELECT * FROM workouts WHERE userId = ? ORDER BY timestamp DESC",
      [userId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  // Add exercise to workout
  router.post("/:workoutId/exercises", (req, res) => {
    const { workoutId } = req.params;
    const { name, setsReps } = req.body;
    if (!name) return res.status(400).json({ error: "Exercise name required" });

    const id = uuidv4();
    db.run(
      "INSERT INTO exercises(id, workoutId, name, setsReps) VALUES (?, ?, ?, ?)",
      [id, workoutId, name, setsReps || ""],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, workoutId, name, setsReps });
      }
    );
  });

  // Get exercises for a workout
  router.get("/:workoutId/exercises", (req, res) => {
    const { workoutId } = req.params;
    db.all(
      "SELECT * FROM exercises WHERE workoutId = ?",
      [workoutId],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  });

  return router;
};
