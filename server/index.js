import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Required for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve everything inside /public as static files
app.use(express.static(path.join(__dirname, "../public")));

// Optional: API test route
app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});

// Redirect root to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
