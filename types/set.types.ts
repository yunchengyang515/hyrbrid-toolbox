export type SetDetail = {
  id: number
  distance?: number
  pace?: string
  reps?: number
  weight?: number
  rest?: number
  exercise_id: string
}

export type Activity = {
  id: string
  set_rep_detail: SetDetail[]
  workout_id: string
  session_id?: string
  exercise_id?: string
  user_id: string
  exercise_name: string
  exercise_type: string
}

export type ActivitySchema = {
  set_rep_detail: SetDetail[]
  workout_id?: string
  session_id?: string
  user_id: string
}
