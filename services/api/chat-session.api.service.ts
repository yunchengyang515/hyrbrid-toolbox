import { AbstractApiService } from './api.service'

export class ChatSessionApiService extends AbstractApiService {
  constructor() {
    super()
    this.resource = 'chat-session'
  }

  async getSessionId(): Promise<string> {
    const response = await fetch(this.buildUrl(['session']), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    })
    const { sessionId } = await this.transformResponse<{ sessionId: string }>(response)
    return sessionId
  }
}
