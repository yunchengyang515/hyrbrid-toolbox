import { WorkoutExercise } from '@/types/WorkoutExercise'
import { getDbClient } from '../db'

export class WorkoutExerciseRepository {
  async getAllWorkoutExercises() {
    return getAllWorkoutExercises()
  }
  async getWorkoutExerciseById(id: string) {
    return getWorkoutExerciseById(id)
  }
  async createWorkoutExercise(workoutExercise: WorkoutExercise) {
    return createWorkoutExercise(workoutExercise)
  }
  async updateWorkoutExercise(id: string, workoutExercise: WorkoutExercise) {
    return updateWorkoutExercise(id, workoutExercise)
  }
  async deleteWorkoutExercise(id: string) {
    return deleteWorkoutExercise(id)
  }
}

export const getAllWorkoutExercises = async () => {
  const client = getDbClient()
  const { data: workoutExercise, error } = await client.from('workout_exercise').select('*')
  if (error) {
    throw new Error(error.message)
  }
  return workoutExercise
}

export const getWorkoutExerciseById = async (id: string) => {
  const client = getDbClient()
  const { data: workoutExercise, error } = await client
    .from('workout_exercise')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return workoutExercise
}

export const createWorkoutExercise = async (workoutExercise: WorkoutExercise) => {
  const client = getDbClient()
  const { data, error } = await client.from('workout_exercise').insert(workoutExercise).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const updateWorkoutExercise = async (id: string, workoutExercise: WorkoutExercise) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('workout_exercise')
    .update({ ...workoutExercise, id })
    .eq('id', id)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const deleteWorkoutExercise = async (id: string) => {
  const client = getDbClient()
  const { data, error } = await client.from('workout_exercise').delete().eq('id', id).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
