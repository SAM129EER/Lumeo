import express from "express";
import cors from "cors";
import helmet from "helmet";
import prisma from "./config/prisma.js"
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Lumeo API is healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Lumeo API is unhealthy",
      database: "disconnected",
    });
  }
});

export default app;