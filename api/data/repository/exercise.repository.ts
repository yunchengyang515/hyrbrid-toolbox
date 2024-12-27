import { Exercise } from '@/types/exercise.types'
import { getDbClient } from '../db.service'
import { AbstractRepository } from './abstract.repository'

export class ExerciseRepository extends AbstractRepository {
  async getAllExercises() {
    return getAllExercises(this.currentUserId)
  }
  async getExerciseById(id: string) {
    return getExerciseById(id, this.currentUserId)
  }
  async createExercise(exercise: Partial<Exercise>) {
    return createExercise(exercise, this.currentUserId)
  }
  async updateExercise(id: string, exercise: Exercise) {
    return updateExercise(id, exercise, this.currentUserId)
  }
  async deleteExercise(id: string) {
    return deleteExercise(id, this.currentUserId)
  }
}

const getAllExercises = async (userId: string) => {
  const client = getDbClient()
  const { data: exercise, error } = await client.from('exercise').select('*').eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }
  return exercise
}

const getExerciseById = async (id: string, userId: string) => {
  const client = getDbClient()
  const { data: exercise, error } = await client
    .from('exercise')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return exercise
}

const createExercise = async (exercise: Partial<Exercise>, userId: string) => {
  const client = getDbClient()
  const newExercise = {
    ...exercise,
    user_id: userId,
  }
  const { error } = await client
    .from('exercise')
    .insert({
      ...exercise,
      user_id: userId,
    })
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return newExercise
}

const updateExercise = async (id: string, exercise: Exercise, userId: string) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('exercise')
    .update({ ...exercise, id })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

const deleteExercise = async (id: string, userId: string) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('exercise')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
