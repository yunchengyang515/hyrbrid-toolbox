import { ChatSessionService } from '../services/chat-session.service'

const sessionService = new ChatSessionService()

export async function POST(_request: Request) {
  const { sessionId, sessionType } = await sessionService.createFreeSession()
  return new Response(JSON.stringify({ sessionId, sessionType }))
}
