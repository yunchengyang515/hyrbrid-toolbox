// Represents the Workout structure as it is stored in the database
export type Workout = {
  id: string // UUID
  created_at: string // ISO timestamp
  name: string
  description?: string
  duration_minute?: number
  intensity?: number
  type?: string
  user_id: string
}

// Represents the editable Workout data used in forms (no ID or timestamps needed)
export type WorkoutFormData = Omit<Workout, 'id' | 'created_at'>
