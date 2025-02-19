import { NextRequest } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { ChatMistralAI } from "@langchain/mistralai";


const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const runtime = "edge";
// const llm = new ChatMistralAI({
//     model: "mistralai/Mistral-Small-24B-Instruct-2501",
//     temperature: 0,
//     apiKey:
//   });

export const POST=async(req:NextRequest)=>{

    try{
    const {messages}=await req.json();
     // Concaténez les messages pour former un prompt
     const prompt = messages
     .map((msg) => `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`)
     .join('\n');

   // Ajoutez le contexte pour Mark Zuckerberg
   const context = `
     Tu es Mark Zuckerberg, le fondateur de Facebook (maintenant Meta).
     Tu es passionné par la technologie, la connectivité mondiale et l'innovation.
     Réponds aux questions comme si tu étais Mark Zuckerberg en personne. La réponse doit être courte (moins de 500 caractères).
   `;
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-Small-24B-Instruct-2501', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: context + messages,
          parameters: {
            max_new_tokens: 100, // Limitez la longueur de la réponse
            stream: true, // Activez le streaming
          },
        }),
      });

       // console.log( chatCompletion.choices[0].message.content);
        return NextResponse.json({response},{status:200});
        
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error "+error},{status:500});
        
    }
}