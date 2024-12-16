import { Workout } from '@/types/Workout'
import { getDbClient } from '../db.service'
import { AbstractRepository } from './abstract.repository'

export class WorkoutRepository extends AbstractRepository {
  async getAllWorkouts() {
    return getAllWorkouts(this.currentUserId)
  }
  async getWorkoutById(id: string) {
    return getWorkoutById(id, this.currentUserId)
  }
  async createWorkout(workout: Workout) {
    return createWorkout(workout, this.currentUserId)
  }
  async updateWorkout(id: string, workout: Workout) {
    return updateWorkout(id, workout, this.currentUserId)
  }
  async deleteWorkout(id: string) {
    return deleteWorkout(id, this.currentUserId)
  }
}

const getAllWorkouts = async (userId: string) => {
  const client = getDbClient()
  const { data: workout, error } = await client.from('workout').select('*').eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return workout
}

const getWorkoutById = async (id: string, userId: string) => {
  const client = getDbClient()
  const { data: workout, error } = await client
    .from('workout')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return workout
}

const createWorkout = async (workout: Partial<Workout>, userId: string) => {
  const client = getDbClient()
  const newWorkout = {
    ...workout,
    user_id: userId,
  }
  const { error } = await client
    .from('workout')
    .insert({
      name: workout.name,
      description: workout.description,
      duration_minute: workout.duration_minute,
      intensity: workout.intensity,
      type: workout.type,
      user_id: userId,
    })
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return newWorkout
}

const updateWorkout = async (id: string, workout: Workout, userId: string) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('workout')
    .update({ ...workout, id })
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

const deleteWorkout = async (id: string, userId: string) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('workout')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
