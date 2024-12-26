export type Exercise = {
  id: string
  name: string
  description?: string
  type: string
  video_link?: string
  equipment?: string[]
  user_id: string
}

export type ExerciseFormData = Omit<Exercise, 'id' | 'user_id'>
