import { SessionService } from '../services/session.service'

export class ValidateSessionService {
  private sessionService: SessionService

  constructor() {
    this.sessionService = new SessionService()
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
}
