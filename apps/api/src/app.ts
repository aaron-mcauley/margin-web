import express from "express";
import cors, { type CorsOptions } from "cors";
import { env } from "./config/env";
import { aiRoutes, healthRoutes } from "./routes";

const app = express();
const allowedOrigins = new Set(env.CORS_ORIGINS);
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "25mb" }));

// Log every incoming request
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Simple debug route
app.get("/debug", (_req, res) => {
    console.log("Debug route hit");
    res.send("Debug works!");
});

// Existing routes
app.use("/api/ai", aiRoutes);
app.use("/api/health", healthRoutes);

export default app;
