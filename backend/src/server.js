import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import portalRoutes from "./routes/PortalRoutes.js";
import { connectDBWithRetry, isDBConnected } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === "production";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, "../../frontend/dist");

app.set("trust proxy", 1);

if (!isProduction) {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
    })
  );
}

app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", db: isDBConnected() });
});

app.use("/api", rateLimiter, (req, res, next) => {
  if (!isDBConnected()) {
    return res
      .status(503)
      .json({ message: "Database unavailable, please try again shortly" });
  }
  next();
});

app.use("/api/portal", portalRoutes);

if (isProduction) {
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  } else {
    console.error(`Frontend build not found at ${frontendDist}`);
  }
}

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  if (res.headersSent) return next(error);
  res.status(500).json({ message: "Internal Server Error" });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
});

connectDBWithRetry();
