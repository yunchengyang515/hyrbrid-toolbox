import { Exercise } from '@/types/Exercise'

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Squat',
    description: 'A compound exercise targeting the lower body.',
    type: 'Strength',
    video_link: 'https://example.com/squat-video',
    equipment: ['Barbell', 'Squat Rack'],
  },
  {
    id: '2',
    name: 'Push-Up',
    type: 'Bodyweight',
    description: 'A bodyweight exercise targeting the chest, shoulders, and triceps.',
  },
  {
    id: '3',
    name: 'Plank',
    type: 'Core',
    description: 'An isometric core exercise.',
    equipment: [],
  },
  {
    id: '4',
    name: 'Kettlebell Swing',
    type: 'Cardio',
    video_link: 'https://example.com/kb-swing-video',
    equipment: ['Kettlebell'],
  },
]
