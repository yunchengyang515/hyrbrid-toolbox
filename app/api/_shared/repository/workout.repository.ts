import { Workout } from '@/types/Workout'
import { getDbClient } from '../db'

export class WorkoutRepository {
  async getAllWorkouts() {
    return getAllWorkouts()
  }
  async getWorkoutById(id: string) {
    return getWorkoutById(id)
  }
  async createWorkout(workout: Workout) {
    return createWorkout(workout)
  }
  async updateWorkout(id: string, workout: Workout) {
    return updateWorkout(id, workout)
  }
  async deleteWorkout(id: string) {
    return deleteWorkout(id)
  }
}

export const getAllWorkouts = async () => {
  const client = getDbClient()
  const { data: workout, error } = await client.from('workout').select('*')
  if (error) {
    throw new Error(error.message)
  }
  return workout
}

export const getWorkoutById = async (id: string) => {
  const client = getDbClient()
  const { data: workout, error } = await client.from('workout').select('*').eq('id', id).single()
  if (error) {
    throw new Error(error.message)
  }
  return workout
}

export const createWorkout = async (workout: Workout) => {
  const client = getDbClient()
  const { data, error } = await client.from('workout').insert(workout).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const updateWorkout = async (id: string, workout: Workout) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('workout')
    .update({ ...workout, id })
    .eq('id', id)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const deleteWorkout = async (id: string) => {
  const client = getDbClient()
  const { data, error } = await client.from('workout').delete().eq('id', id).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
