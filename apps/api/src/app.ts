import express from "express";
import cors from "cors";
import { aiRoutes, healthRoutes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);
app.use("/api/healh", healthRoutes);

export default app;
