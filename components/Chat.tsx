import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Chat() {

    const { messages, input, handleInputChange, handleSubmit } = useChat({
      api: '/api/chat',
    });
  
    return (
      <div className="max-w-3xl min-h-screen mx-auto p-5" >
        <h1>Chatbot Mark Zuckerberg</h1>
        <div className="overflow-y-scroll p-8 h-96" style={{padding: '10px', height: '400px'}}>
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              <strong>{msg.role === 'user' ? 'Vous' : 'Mark'}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <div className="flex gap-2">
  
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Posez une question à Mark..."
           className="flex-1"
          />
          <Button type="submit">Envoyer</Button>
            </div>
        </form>
      </div>
    );
  }