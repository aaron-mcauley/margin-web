import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
    res.send("Margin API is running")
});

app.post("/ask", async (req, res) => {
    res.json({
        answer: "Hello from the backend",

    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})



