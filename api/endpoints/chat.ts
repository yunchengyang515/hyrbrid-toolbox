// api/endpoints/chat.ts
import { ChatController } from '@/api/controller/chat.controller'
import { initializeHandler } from '@/api/endpoints/_request-handling/handler-initialize.service'
import { Endpoint } from '@/api/types'
import { AuthService } from '../auth/auth'

const chatController = new ChatController()
const auth = new AuthService()

export async function POST(request: Request) {
  const { message, stream = false } = await request.json()
  auth.checkRequest(request)

  if (stream) {
    const stream = (await chatController.streamChat(message)).toReadableStream()

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }
  const response = await chatController.regularChat(message)
  return new Response(JSON.stringify({ response }))
}

const handler: Endpoint = {
  POST,
}

export default initializeHandler(handler)
