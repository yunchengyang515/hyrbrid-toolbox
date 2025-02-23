export enum ChatSessionType {
  FREE = 'free',
  PAID = 'paid',
}

export type ChatSession = {
  id: string
  created_at: string
  expires_at: string
  session_type: ChatSessionType
  message_count: number
  max_messages: number
}
