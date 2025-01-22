export type SessionSchema = {
  id: string
  created_at: string // ISO timestamp
  name: string
  description?: string
  duration_minute?: number
  intensity?: number
  type?: string
  user_id: string
  is_template?: boolean
  key_session?: boolean
}

export type SessionFormData = Omit<SessionSchema, 'id' | 'created_at' | 'user_id'>

export type Session = SessionSchema
