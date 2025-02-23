import { ChatSession, ChatSessionType } from '@/types/chat_session.types'
import { predefinedPrompts } from '@/types/chat.types'
import { ChatSessionService } from './chat-session.service'

export class ValidateSessionService {
  private sessionService: ChatSessionService

  constructor() {
    this.sessionService = new ChatSessionService()
  }

  async validateSession(sessionId: string) {
    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    const session = await this.sessionService.getSession(sessionId)

    if (!session) {
      throw new Error('Invalid session')
    }

    return session
  }

  async enforceMessageLimit(sessionId: string) {
    await this.sessionService.enforceMessageLimit(sessionId)
  }

  async validateFirstMessage(session: ChatSession, message: string) {
    if (session.session_type === ChatSessionType.FREE && !predefinedPrompts.includes(message)) {
      throw new Error('First message of a free session must be one of the predefined prompts')
    }

    if (message.length > 200) {
      throw new Error('Message is too long')
    }
  }
}
