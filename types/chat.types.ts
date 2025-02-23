export interface ChatMessage {
  id: number
  content: string
  isUser: boolean
  timestamp?: Date
}

export const predefinedPrompts = [
  'I want to compete in Hyrox—how do I balance running and lifting?',
  'I only have 3 days a week to train. How can I fit in both strength and endurance?',
  'What’s a good way to adjust my workouts if I’m short on time or feeling fatigued?',
  'Any tips on fueling back-to-back cardio and strength sessions?',
  'How do I recover faster while training for a hybrid race?',
]
