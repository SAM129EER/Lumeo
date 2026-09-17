import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Lumeo API is working" });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;
