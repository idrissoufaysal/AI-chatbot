"use client";

import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } = useChat({
    api: "/api/chat2",
  });

  console.log("Messages envoyer (client) :", messages);


  // Add error display


  return (
    <Card className="w-[440px] h-[600px] grid grid-rows-[auto_1fr_auto]">
      <CardHeader>
        <CardTitle>Gemini 2.0 Flash Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages?.map((message) => (
            <div key={message.id} className="flex gap-3 mb-4 text-sm">
              {message.role === "user" ? (
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                  <AvatarImage src="/user.jpg" alt="User" />
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarFallback>G</AvatarFallback>
                  <AvatarImage src="/placeholder-gemini.jpg" alt="Gemini" />
                </Avatar>
              )}
              <div className="grid gap-1">
                <p className="font-medium">{message.role === "user" ? "You" : "Gemini"}</p>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-4 text-sm">
              <Avatar>
                <AvatarFallback>G</AvatarFallback>
                <AvatarImage src="/placeholder-gemini.jpg" alt="Gemini" />
              </Avatar>
              <div className="grid gap-1">
                <p className="font-medium">Gemini</p>
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500">
              Error: {error.message}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input placeholder="Ask Gemini something..." value={input} onChange={handleInputChange} />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}