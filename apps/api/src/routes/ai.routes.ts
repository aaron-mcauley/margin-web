import { Router } from "express";

const router = Router();

router.post("/ask", (_req, res) => {
    res.json({
        answer: "Hello from the AI route",
    });
});

export default router;