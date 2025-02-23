import { chatSessionTypeMaxMessagesMap } from '@/api/configs'
import { ChatSession, ChatSessionType } from '@/types/chat_session.types'
import { getDbClient } from '../db.service'
import { AbstractRepository } from './abstract.repository'

const tableName = 'chat_session'

export class ChatSessionRepository extends AbstractRepository {
  async createSession(sessionType: ChatSessionType) {
    const client = getDbClient()
    const { error, data } = await client
      .from(tableName)
      .insert([
        {
          session_type: sessionType,
          message_count: 0,
          max_messages: chatSessionTypeMaxMessagesMap[sessionType],
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }
    return { sessionId: (data as ChatSession).id, sessionType }
  }

  async getSessionById(sessionId: string) {
    const client = getDbClient()
    const { data, error } = await client
      .from(tableName)
      .select('id, session_type, token_usage, message_count, max_messages')
      .eq('id', sessionId)
      .select()
      .single()

    if (error || !data) {
      throw new Error('Session not found')
    }
    return data
  }

  async incrementMessageCount(sessionId: string) {
    const session = await this.getSessionById(sessionId)
    await getDbClient()
      .from(tableName)
      .update({ message_count: session.message_count + 1 })
      .eq('id', sessionId)
  }
}
