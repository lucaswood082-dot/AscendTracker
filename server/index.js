import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Required for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public"))); // make sure public exists

app.use(cors());
app.use(express.json());

// Simple health check route for Render
app.get("/", (req, res) => {
  res.send("AscendTracker server running!");
});

// Optional test API route
app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
