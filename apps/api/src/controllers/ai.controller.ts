import { Request, Response } from "express";
import { askOpenAI } from "../services/openai.service";

export async function askAI(req: Request, res: Response) {
    try {
        console.log("REQ BODY:", req.body);
        console.log("askAI start");
        const { prompt, imageBase64 } = req.body;

        if (!prompt && !imageBase64) {
            return res.status(400).json({ error: "Either prompt or image is required" })
        }



        console.log("calling askOpenAI");
        const answer = await askOpenAI({ prompt, imageBase64 });
        console.log("askOpenAI finished");

        return res.json({ answer });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: error instanceof Error ? error.message : "Failed to process AI request.",
        })
    }
}
