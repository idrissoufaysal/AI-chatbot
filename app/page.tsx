"use client";

import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useRef } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  // const { messages, input, handleInputChange, handleSubmit, error, isLoading } = useChat({
  //   api: "/api/chat2",
  // });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch("/api/chat");
      const data = await response.json();
      setMessages(data);
    }
    fetchMessages()
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log("Messages envoyer (client) :", messages);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true);

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    try {
      setMessages(prev => [...prev, userMessage]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data
      }]);

      setInput("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error)
      setError(error.message)
    }
    setIsLoading(false);
  };

  // Add error display


  return (
    <div className="flex justify-center items-center">
      <Card className="w-[640px] h-[98vh] grid grid-rows-[auto_1fr_auto]">
        <CardHeader>
          <CardTitle>Mark zukerberg Chatbot</CardTitle>
        </CardHeader>
        <ScrollArea className="h-full px-3">
          <CardContent className="space-y-1">
            {messages.map((message, index) => (
              <>
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex w-full">

                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user' ? ' text-white' : 'text-green-400'
                      }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
                <hr className="border w-full border-dark-4/80" />
              </>
            ))}
            <div ref={messagesEndRef} />
            {error && <p className="text-red-500">{error}</p>}
          </CardContent>
        </ScrollArea>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input placeholder="Ask Gemini something..." value={input} onChange={(e) => setInput(e.target.value)} />
            <Button type="submit" size="icon" disabled={isLoading || input === ""} >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}