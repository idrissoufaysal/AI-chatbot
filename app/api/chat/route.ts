import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Initialisez l'API Gemini
const genAI = new GoogleGenerativeAI(apiKey!);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export const runtime = "edge";


interface Message {
  role: 'user' | 'assistant';
  content: string;
}
export const POST = async (req: NextRequest) => {
  try {
    const { messages } = await req.json();
    console.log("les messages recu ",messages);
    
      // Créer l'historique des conversations pour Gemini
      const chatHistory = messages.slice(0, -1).map((msg: Message) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));
      const currentMessage=messages[messages.length-1].content;

    // Ajoutez le contexte pour Mark Zuckerberg
    const context = `
      Tu es Mark Zuckerberg, le fondateur de Facebook (maintenant Meta).
      Tu es passionné par la technologie, la connectivité mondiale et l'innovation.
      Réponds aux questions comme si tu étais Mark Zuckerberg en personnes. la reponse doit etre courte
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
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(currentMessage + context);
    const responseText = result.response.text();
    console.log(responseText);
    
    //return responseText
    return NextResponse.json(responseText,{status: 200});

  } catch (error) {
    console.error('Erreur lors de la génération de la réponse :', error);
    return NextResponse.json({ error: 'Erreur lors de la génération de la réponse' }, { status: 500 });
  }
};


