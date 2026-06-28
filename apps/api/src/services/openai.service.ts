import { openai } from "../config/openai";

export async function askOpenAI(prompt: string) {
    const response = await openai.responses.create({
        model: "gpt-5",
        input: prompt,
    });

    return response.output_text;
}