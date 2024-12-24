import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { CassandraStore } from "@langchain/community/vectorstores/cassandra";
import { Client } from "cassandra-driver";

export async function processDocuments(content: any) {
  // Convertir le contenu en format texte
  const text = JSON.stringify(content);
  
  // Diviser le texte en chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const docs = await splitter.createDocuments([text]);
  
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
  
  // Créer les embeddings et les stocker
  const vectorStore = await CassandraStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    {
      table: "kof_embeddings",
      keyspace: process.env.ASTRA_KEYSPACE!,
      dimensions: 1536,
      client: client,
    }
  );
  
  return vectorStore;
} 



