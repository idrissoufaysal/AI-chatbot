import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "ai/react";


const apiKey = process.env.GEMINI_API_KEY;

// Initialisez l'API Gemini
const genAI = new GoogleGenerativeAI(apiKey!);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export const runtime = "edge";

export const POST = async (req: Request) => {
  try {
    const { messages } = await req.json();
    console.log(messages);
    
    // Ajoutez le contexte pour Mark Zuckerberg
    const context = `
      Tu es Mark Zuckerberg, le fondateur de Facebook (maintenant Meta).
      Tu es passionné par la technologie, la connectivité mondiale et l'innovation.
      Réponds aux questions comme si tu étais Mark Zuckerberg en personnes.
    `;

    // Concaténez les messages pour former un prompt
    // const prompt = messages
    //   .map((msg) => `${msg.role === 'user' ? 'user' : 'assistant'}: ${msg.content}`)
    //   .join('\n');

     // Transformer les messages en un format attendu
    //  const formattedMessages = messages.map((msg: Message) => ({
    //   role: msg.role === "user" ? "user" : "model",
    //   parts: [{ text: msg.content }],
    // }));

    // Générez une réponse avec Gemini
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(messages + context);
    const responseText = result.response.text();
    console.log(responseText);
    
    //return responseText
    return NextResponse.json(responseText,{status: 200});

  } catch (error) {
    console.error('Erreur lors de la génération de la réponse :', error);
    return NextResponse.json({ error: 'Erreur lors de la génération de la réponse' }, { status: 500 });
  }
};

