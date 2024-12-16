import OpenAI from 'openai';
import { Client } from "cassandra-driver";
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { CassandraStore } from "@langchain/community/vectorstores/cassandra";

export const config = {
  runtime: "edge",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Méthode non autorisée", { status: 405 });
  }

  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // Initialiser Astra DB
  const client = new Client({
    cloud: {
      secureConnectBundle: process.env.ASTRA_SECURE_BUNDLE_PATH!,
    },
    credentials: {
      username: process.env.ASTRA_CLIENT_ID!,
      password: process.env.ASTRA_CLIENT_SECRET!,
    },
  });

  await client.connect();

  const vectorStore = await CassandraStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      table: "kof_embeddings",
      keyspace: process.env.ASTRA_KEYSPACE!,
      dimensions: 1536,
      cassandraClient: client,
    }
  );

  // Rechercher les documents pertinents
  const relevantDocs = await vectorStore.similaritySearch(lastMessage, 3);
  
  // Ajouter le contexte à la requête
  const contextualPrompt = `
    Contexte du site web KOF Corporation:
    ${relevantDocs.map(doc => doc.pageContent).join('\n')}
    
    Question: ${lastMessage}
    
    Répondez en utilisant uniquement les informations fournies ci-dessus.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [...messages.slice(0, -1), { role: "user", content: contextualPrompt }],
    temperature: 0.7,
    stream: true,
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(chunk.choices[0]?.delta?.content || '');
        }
        controller.close();
      },
    })
  );
}
