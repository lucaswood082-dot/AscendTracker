const express = require("express");
const router = express.Router();

module.exports = (db) => {

  // CREATE ACCOUNT
  router.post("/register", (req, res) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username required" });
    }

    db.get(
      "SELECT id FROM users WHERE username = ?",
      [username],
      (err, row) => {
        if (row) {
          return res.status(409).json({ error: "Username already exists" });
        }

        db.run(
          "INSERT INTO users (username) VALUES (?)",
          [username],
          function (err) {
            if (err) {
              return res.status(500).json({ error: "Failed to create user" });
            }

            res.json({ userId: this.lastID, username });
          }
        );
      }
    );
  });

  // LOGIN
  router.post("/login", (req, res) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username required" });
    }

    db.get(
      "SELECT id, username FROM users WHERE username = ?",
      [username],
      (err, user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json({ userId: user.id, username: user.username });
      }
    );
  });

  return router;
};
