export interface ChatMessage {
  id: number
  content: string
  isUser: boolean
  timestamp?: Date
}

export const predefinedPrompts = [
  'How to effectively combine strength and endurance training',
  'What are the best strategies to structure (and periodize) a hybrid training plan',
  'Recovery and injury prevention for hybrid athletes',
]
