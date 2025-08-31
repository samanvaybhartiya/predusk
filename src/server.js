import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import apiRouter from "./routes/api.js";
dotenv.config();
await connectDB();
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "*").split(",").map((s) => s.trim()),
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", apiRouter);
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "public")));
app.use((req, res) => res.status(404).json({ error: "Not Found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ error: "Internal Server Error", detail: err?.message });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Listening on :" + PORT));
