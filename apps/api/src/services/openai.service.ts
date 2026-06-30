import { openai } from "../config/openai";

type AskOpenAIInput = {
    prompt?: string;
    imageBase64?: string;
};

export async function askOpenAI({ prompt, imageBase64 }: AskOpenAIInput) {
    if (imageBase64) {

        const response = await openai.responses.create({
            model: "gpt-5",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: prompt ?? "Read the handwritten or typed question in this image and answer it clearly. Return only the answer.",
                        },
                        {
                            type: "input_image",
                            image_url: imageBase64,
                            detail: "auto",
                        },
                    ],
                },
            ],
        });

        return response.output_text;
    }

    if (prompt) {
        const response = await openai.responses.create({
            model: "gpt-5",
            input: prompt,
        });
        return response.output_text;
    }

    throw new Error("Either prompt or imageBase64 is required");
}