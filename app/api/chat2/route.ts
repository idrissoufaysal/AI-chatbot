import OpenAI from "openai";
import { OpenAIStream } from "ai";
import { NextRequest } from "next/server";

// Initialize the OpenAI client (configured for OpenRouter)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Your OpenRouter API key
  baseURL: "https://openrouter.ai/api/v1", // OpenRouter API endpoint
});

export default async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const systemPrompt = {
        role: "system",
        content: "you are Mark Zuckerberg, the founder of Facebook",
      };

      const updatedMessages = [systemPrompt, ...messages];

    // Make a request to OpenRouter using the DeepSeek model
    const response = await openai.chat.completions.create({
      model: "deepseek-chat", // Specify the DeepSeek model
      messages: updatedMessages,
      stream: true, // Enable streaming
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Pipe the stream to the response
    return new Response(stream);
  } catch (error) {
    console.log(error);
  }
}
