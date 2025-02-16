import { SessionRepository } from '../data/repository/session.repository'

export class SessionService {
  private sessionRepository: SessionRepository

  constructor() {
    this.sessionRepository = new SessionRepository()
  }

  async createFreeSession(): Promise<{ sessionId: string; sessionType: string }> {
    const sessionId = crypto.randomUUID()
    return this.sessionRepository.createSession(sessionId, 'free')
  }

  async getSession(sessionId: string) {
    return this.sessionRepository.getSessionById(sessionId)
  }

  async isFreeSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId)
    return session.session_type === 'free'
  }

  async updateTokenUsage(sessionId: string, tokensUsed: number) {
    const session = await this.getSession(sessionId)

    if (session.token_usage + tokensUsed > session.max_tokens) {
      throw new Error('Free session limit reached. Upgrade to continue.')
    }

    await this.sessionRepository.updateTokenUsage(sessionId, session.token_usage + tokensUsed)
  }
}
