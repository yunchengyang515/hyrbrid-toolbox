import { WorkoutExercise } from '@/types/WorkoutExercise'
import { getDbClient } from '../db.service'
import { AbstractRepository } from './abstract.repository'

export class WorkoutExerciseRepository extends AbstractRepository {
  async getAllWorkoutExercises() {
    return getAllWorkoutExercises(this.currentUserId)
  }
  async getWorkoutExerciseById(id: string) {
    return getWorkoutExerciseById(id, this.currentUserId)
  }
  async createWorkoutExercise(workoutExercise: WorkoutExercise) {
    return createWorkoutExercise(workoutExercise, this.currentUserId)
  }
  async updateWorkoutExercise(id: string, workoutExercise: WorkoutExercise) {
    return updateWorkoutExercise(id, workoutExercise, this.currentUserId)
  }
  async deleteWorkoutExercise(id: string) {
    return deleteWorkoutExercise(id, this.currentUserId)
  }
  async getWorkoutExerciseByWorkoutId(workoutId: string) {
    return getWorkoutExerciseByWorkoutId(workoutId, this.currentUserId)
  }
}

export const getAllWorkoutExercises = async (userId: string) => {
  const client = getDbClient()
  const { data: workoutExercise, error } = await client
    .from('workout_exercise')
    .select('*')
    .eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return workoutExercise
}

export const getWorkoutExerciseById = async (id: string, userId: string) => {
  const client = getDbClient()
  const { data: workoutExercise, error } = await client
    .from('workout_exercise')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return workoutExercise
}

export const getWorkoutExerciseByWorkoutId = async (workoutId: string, userId: string) => {
  const client = getDbClient()
  const { data: workoutExercise, error } = await client
    .from('workout_exercise')
    .select('*')
    .eq('workout_id', workoutId)
    .eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return workoutExercise
}

export const createWorkoutExercise = async (
  workoutExercise: Partial<WorkoutExercise>,
  userId: string,
) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('workout_exercise')
    .insert({
      ...workoutExercise,
      user_id: userId,
    })
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const updateWorkoutExercise = async (
  id: string,
  workoutExercise: WorkoutExercise,
  userId: string,
) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('workout_exercise')
    .update({ ...workoutExercise, id })
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const deleteWorkoutExercise = async (id: string, userId: string) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('workout_exercise')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
