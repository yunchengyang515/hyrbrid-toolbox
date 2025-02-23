// api/endpoints/chat.ts
import { ChatController } from '@/api/controller/chat.controller'
import { initializeHandler } from '@/api/endpoints/_request-handling/handler-initialize.service'
import { Endpoint } from '@/api/types'
import { AuthService } from '../../auth/auth'
import { ValidateSessionService } from '../../services/validate-session.service'

const chatController = new ChatController()
const auth = new AuthService()
const validateSessionService = new ValidateSessionService()

export async function POST(request: Request) {
  auth.checkRequest(request) // Validate API key

  const { message, sessionId, stream = false } = await request.json()

  try {
    const session = await validateSessionService.validateSession(sessionId)
    if (session.message_count === 0) {
      await validateSessionService.validateFirstMessage(sessionId, message)
    }
    const response = stream
      ? (await chatController.streamChat(message)).toReadableStream()
      : await chatController.regularChat(message)

    await validateSessionService.enforceMessageLimit(sessionId)

    return stream
      ? new Response(response, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        })
      : new Response(JSON.stringify({ response }))
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 })
  }
}

const handler: Endpoint = { POST }
export default initializeHandler(handler)
