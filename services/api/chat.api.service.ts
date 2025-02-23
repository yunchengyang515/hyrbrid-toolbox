import { AbstractApiService } from './api.service'

export class ChatApiService extends AbstractApiService {
  constructor() {
    super()
    this.resource = 'chat'
  }

  async sendMessage(message: string, sessionId: string): Promise<string> {
    const response = await fetch(this.buildUrl(), {
      method: 'POST',
      body: JSON.stringify({ message, stream: false, sessionId }),
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    })
    const { response: aiText } = await this.transformResponse<{ response: string }>(response)
    return aiText
  }
}
