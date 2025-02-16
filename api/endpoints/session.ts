import { SessionService } from '../services/session.service'

const sessionService = new SessionService()

export async function POST(_request: Request) {
  const { sessionId, sessionType } = await sessionService.createFreeSession()
  return new Response(JSON.stringify({ sessionId, sessionType }))
}
