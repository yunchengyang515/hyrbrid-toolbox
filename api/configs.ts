import { ChatSessionType } from '@/types/chat_session.types'

export const chatSessionTypeMaxMessagesMap = {
  [ChatSessionType.FREE]: 5,
  [ChatSessionType.PAID]: 100,
}
