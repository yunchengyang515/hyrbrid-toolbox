export interface ChatMessage {
  id: number
  content: string
  isUser: boolean
  timestamp?: Date
}

export const predefinedPrompts = [
  "What's a good workout for beginners?",
  'How can I improve my diet?',
  'Tell me about HIIT workouts.',
  'What are the benefits of yoga?',
  'How do I stay motivated?',
]
