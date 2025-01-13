import { Activity, ActivitySchema } from '@/types/set.types'
import { getDbClient } from '../db.service'
import { AbstractRepository } from './abstract.repository'

const tableName = 'activity'
export class WorkoutExerciseRepository extends AbstractRepository {
  async getAllWorkoutExercises() {
    return getAllWorkoutExercises(this.currentUserId)
  }
  async getWorkoutExerciseById(id: string) {
    return getWorkoutExerciseById(id, this.currentUserId)
  }
  async createWorkoutExercise(workoutExercise: ActivitySchema) {
    return createWorkoutExercise(workoutExercise, this.currentUserId)
  }
  async updateWorkoutExercise(id: string, workoutExercise: Activity) {
    return updateWorkoutExercise(id, workoutExercise, this.currentUserId)
  }
  async deleteWorkoutExercise(id: string) {
    return deleteWorkoutExercise(id, this.currentUserId)
  }
  async getWorkoutExerciseByWorkoutId(workoutId: string) {
    return getWorkoutExerciseByWorkoutId(workoutId, this.currentUserId)
  }
  async deleteWorkoutExercisesByWorkoutId(workoutId: string) {
    return deleteWorkoutExercisesByWorkoutId(workoutId, this.currentUserId)
  }
}

export const getAllWorkoutExercises = async (userId: string) => {
  const client = getDbClient()
  const { data: workoutExercise, error } = await client
    .from(tableName)
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
    .from(tableName)
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
    .from(tableName)
    .select('*')
    .eq('workout_id', workoutId)
    .eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return workoutExercise
}

export const createWorkoutExercise = async (workoutExercise: Partial<Activity>, userId: string) => {
  const client = getDbClient()
  const { data, error } = await client
    .from(tableName)
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
  workoutExercise: Activity,
  userId: string,
) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('set')
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
    .from(tableName)
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const deleteWorkoutExercisesByWorkoutId = async (workoutId: string, userId: string) => {
  const client = getDbClient()
  const { data, error } = await client
    .from(tableName)
    .delete()
    .eq('workout_id', workoutId)
    .eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}
