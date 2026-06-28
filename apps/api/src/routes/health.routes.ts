import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
    res.send("Margin API is running");
});

export default router;