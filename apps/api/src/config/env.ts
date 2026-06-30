import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT ?? "3001");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CORS_ORIGINS = process.env.CORS_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ];

if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
}

export const env = {
    PORT,
    CORS_ORIGINS,
    OPENAI_API_KEY,
};
