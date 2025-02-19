import OpenAI from "openai";
import { StreamingTextResponse, OpenAIStream } from "ai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const systemPrompt = {
      role: "system",
      content: "you are Mark Zuckerberg, the founder of Facebook",
    };

    const updatedMessages = [systemPrompt, ...messages];

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: updatedMessages,
      stream: true,
    });

    // Create a proper streaming response
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse instead of plain Response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
}