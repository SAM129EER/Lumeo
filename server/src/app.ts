import express from "express";
import cors from "cors";
import helmet from "helmet";
import prisma from "./config/prisma.js";

import authRoutes from "./modules/auth/auth.routes.js";
import { get } from "node:http";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("api working");
});

app.use("/api/v1/auth", authRoutes);

export default app;
