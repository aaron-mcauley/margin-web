import { Request, Response } from "express";
import { askOpenAI } from "../services/openai.service";

export async function askAI(req: Request, res: Response) {
    try {
        const { prompt } = req.body;
        const answer = await askOpenAI(prompt);

        res.json({
            answer,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to contact OpenAI."
        });
    }
}