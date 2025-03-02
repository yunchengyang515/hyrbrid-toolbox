import GroqClient from 'groq-sdk'
import { ChatPromptService } from '../services/chat-prompt.service'
import { ChatSessionService } from '../services/chat-session.service'

export class ChatController {
  private client: GroqClient
  private systemPrompt: string
  private chatSessionService: ChatSessionService
  private chatPromptsService: ChatPromptService
  private model = 'llama3-70b-8192'

  constructor() {
    this.client = new GroqClient({
      apiKey: process.env.GROQ_API_KEY,
    })
    this.chatSessionService = new ChatSessionService()
    this.chatPromptsService = new ChatPromptService()
    this.systemPrompt = this.chatPromptsService.getFreePlannerBasePrompt()
  }

  async streamChat(message: string) {
    const completion = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: message },
      ],
      model: this.model,
      temperature: 0.7,
      max_tokens: 1500,
      stream: true,
    })

    return completion
  }

  async regularChat(message: string) {
    const completion = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: message },
      ],
      model: this.model,
      temperature: 0.7,
      max_tokens: 1500,
      stream: false,
    })

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  }

  async createFreeChatSession() {
    const sessionId = this.chatSessionService.createFreeSession()
    return sessionId
  }
}
