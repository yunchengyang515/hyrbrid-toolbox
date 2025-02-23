import { ChatController } from '@/api/controller/chat.controller'
import { Endpoint } from '@/api/types'
import { initializeHandler } from '../_request-handling/handler-initialize.service'

const chatController = new ChatController()

export async function POST(_request: Request) {
  // return new chat session id

  const chatSession = await chatController.createFreeChatSession()
  return new Response(JSON.stringify(chatSession))
}

const handler: Endpoint = { POST }
export default initializeHandler(handler)
