import { Exercise } from './Exercise'

export type SetDetail = {
  id: number
  duration?: string
  pace?: string
  reps?: number
  weight?: number
  rest?: number
}

export type WorkoutExercise = {
  id: string
  set_rep_detail: SetDetail[]
  workout_id: number
  exercise_id: number
  user_id: string
  name: Pick<Exercise, 'name'>
  type: Pick<Exercise, 'type'>
}
