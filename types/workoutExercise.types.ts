export type SetDetail = {
  id: number
  distance?: number
  pace?: string
  reps?: number
  weight?: number
  rest?: number
}

export type WorkoutExercise = {
  id: string
  set_rep_detail: SetDetail[]
  workout_id: string
  exercise_id: string
  user_id: string
  exercise_name: string
  exercise_type: string
}

export type WorkoutExerciseSchema = {
  set_rep_detail: SetDetail[]
  workout_id: string
  exercise_id: string
  user_id: string
}
