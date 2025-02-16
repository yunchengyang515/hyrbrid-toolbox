import { getDbClient } from '../db.service'
import { AbstractRepository } from './abstract.repository'

const tableName = 'sessions'

export class SessionRepository extends AbstractRepository {
  async createSession(sessionId: string, sessionType: string) {
    const client = getDbClient()
    const { error } = await client
      .from(tableName)
      .insert([{ id: sessionId, session_type: sessionType }])

    if (error) {
      throw new Error(error.message)
    }
    return { sessionId, sessionType }
  }

  async getSessionById(sessionId: string) {
    const client = getDbClient()
    const { data, error } = await client
      .from(tableName)
      .select('id, session_type, token_usage, max_tokens')
      .eq('id', sessionId)
      .single()

    if (error || !data) {
      throw new Error('Session not found')
    }
    return data
  }

  async updateTokenUsage(sessionId: string, newTokenUsage: number) {
    const client = getDbClient()
    const { error } = await client
      .from(tableName)
      .update({ token_usage: newTokenUsage })
      .eq('id', sessionId)

    if (error) {
      throw new Error(error.message)
    }
  }
}
