export type SetDetail = {
  id: number
  duration?: string
  pace?: string
  reps?: string
  weight?: string
  rest?: string
}

export type WorkoutExercise = {
  id: string
  set_rep_detail: SetDetail[]
  workout_id: number
  exercise_id: number
  user_id: string
}
