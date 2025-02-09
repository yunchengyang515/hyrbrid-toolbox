import { Session, SessionFormData } from '@/types/session.types'

// Mock data
const mockSessions: Session[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Morning Yoga',
    description: 'A gentle morning yoga session to start your day.',
    duration_minute: 30,
    intensity: 3,
    type: 'Yoga',
    user_id: 'user1',
    is_template: true,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'HIIT Workout',
    description: 'High-intensity interval training for maximum burn.',
    duration_minute: 45,
    intensity: 8,
    type: 'HIIT',
    user_id: 'user2',
    is_template: true,
  },
  // Add more mock sessions as needed
]

export class SessionTemplateApiService {
  async getAllSessions(): Promise<Session[]> {
    return Promise.resolve(mockSessions)
  }

  async createSession(newSession: SessionFormData): Promise<Session> {
    const createdSession: Session = {
      ...newSession,
      id: String(mockSessions.length + 1),
      created_at: new Date().toISOString(),
      user_id: 'mockUser',
    }
    mockSessions.push(createdSession)
    return Promise.resolve(createdSession)
  }

  async updateSession(updatedSession: Session): Promise<Session> {
    const index = mockSessions.findIndex((s) => s.id === updatedSession.id)
    if (index === -1) {
      return Promise.reject(new Error('Session not found'))
    }
    mockSessions[index] = updatedSession
    return Promise.resolve(updatedSession)
  }
}
