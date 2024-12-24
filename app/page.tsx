'use client'

import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { useEffect } from 'react'
import { scrapWebsite } from './utils/scraper'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      const info = await scrapWebsite('https://kofcorporation.com/')
      console.log(info);
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <div className="flex flex-col w-full max-w-2xl space-y-4 mb-20">
        {messages.map(m => (
          <Card key={m.id} className={`${m.role === 'assistant' ? 'bg-muted' : ''}`}>
            <CardContent className="p-4">
              <div className="font-semibold mb-2">
                {m.role === 'user' ? 'Vous' : 'Assistant'}
              </div>
              <div className="whitespace-pre-wrap">
                {m.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-2xl p-4 bg-background border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            placeholder="Écrivez votre message..."
            onChange={handleInputChange}
          />
          <Button type="submit">
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  )
}
