import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { AppError } from "./utils/app-error.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Lumeo API is working" });
});

app.use("/api/auth", authRoutes);

// Catch-all for unhandled routes (404)
app.use("*", (req, _res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`, "NOT_FOUND"));
});

app.use(errorMiddleware);

export default app;
