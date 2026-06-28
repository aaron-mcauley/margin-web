import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ?? "3001";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
}

export const env = {
    PORT,
    OPENAI_API_KEY,
}
