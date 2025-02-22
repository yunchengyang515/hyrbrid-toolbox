import { ChatSessionType } from '@/types/chat_session.types'
import { ChatSessionRepository } from '../data/repository/chat_session.repository'

export class SessionService {
  private sessionRepository: ChatSessionRepository

  constructor() {
    this.sessionRepository = new ChatSessionRepository()
  }

  async createFreeSession(): Promise<{ sessionId: string; sessionType: string }> {
    return this.sessionRepository.createSession(ChatSessionType.FREE)
  }

  async getSession(sessionId: string) {
    return this.sessionRepository.getSessionById(sessionId)
  }

  async isFreeSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId)
    return session.session_type === 'free'
  }

  async enforceMessageLimit(sessionId: string) {
    const session = await this.getSession(sessionId)

    if (session.message_count >= session.max_messages) {
      throw new Error('Free session message limit reached. Upgrade to continue.')
    }

    await this.sessionRepository.incrementMessageCount(sessionId)
  }
}
