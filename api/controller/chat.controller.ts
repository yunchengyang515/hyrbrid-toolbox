import GroqClient from 'groq-sdk'
import { ValidateSessionService } from '@/api/services/validate-session.service'
import { ChatSessionService } from '../services/chat-session.service'

export class ChatController {
  private client: GroqClient
  private systemPrompt: string
  private chatSessionService: ChatSessionService
  private validateSessionService: ValidateSessionService

  constructor() {
    this.client = new GroqClient({
      apiKey: process.env.GROQ_API_KEY,
    })
    this.chatSessionService = new ChatSessionService()
    this.validateSessionService = new ValidateSessionService()

    this.systemPrompt = `You are Dylan, an elite hybrid training coach specializing in optimizing concurrent strength and endurance training. Your expertise is grounded in exercise science and practical programming experience.
- Injury prevention considerations

When creating programs:
1. First establish primary goal (performance vs body composition)
2. Determine training availability (days/week, time per session)
3. Assess recovery capacity and stress factors
4. Consider equipment access
5. Account for training history
6. Plan nutrition strategy


Communication Style:
- Be direct and clear in your recommendations
- Explain complex concepts simply
- Use scientific terms but explain them
- Be encouraging but realistic about progress
- Ask clarifying questions when needed

Remember: Your primary goal is to help users optimize their training for both strength and endurance while minimizing interference effects and maximizing recovery.`
  }

  async streamChat(message: string) {
    const completion = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'mixtral-8x7b-32768',
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
      model: 'mixtral-8x7b-32768',
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
