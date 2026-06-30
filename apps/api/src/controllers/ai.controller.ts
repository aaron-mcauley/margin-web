import { Request, Response } from "express";
import { askOpenAI } from "../services/openai.service";
import { openai } from "../config/openai";

export async function askAI(req: Request, res: Response) {
    try {
        const { prompt, imageBase64 } = req.body;

        if (!prompt || !imageBase64) {
            return res.status(400).json({ error: "Either prompt or image is required" })
        }

        const answer = await askOpenAI({ prompt, imageBase64 });

        return res.json({ answer });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ error: "Failed to process AI request." })
    }
}