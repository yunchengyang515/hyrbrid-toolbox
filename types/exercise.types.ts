export type ExerciseSchema = {
  id: string
  name: string
  description?: string
  type: string
  video_link?: string
  equipment?: string[]
  user_id: string
}

export type Exercise = ExerciseSchema

export type ExerciseFormData = Omit<ExerciseSchema, 'id' | 'user_id'>
