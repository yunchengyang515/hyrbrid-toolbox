import { Exercise } from '@/types/Exercise'
import { getDbClient } from '../db.service'

export class ExerciseRepository {
  async getAllExercises() {
    return getAllExercises()
  }
  async getExerciseById(id: string) {
    return getExerciseById(id)
  }
  async createExercise(exercise: Exercise) {
    return createExercise(exercise)
  }
  async updateExercise(id: string, exercise: Exercise) {
    return updateExercise(id, exercise)
  }
  async deleteExercise(id: string) {
    return deleteExercise(id)
  }
}

const getAllExercises = async () => {
  const client = getDbClient()
  const { data: exercise, error } = await client.from('exercise').select('*')
  if (error) {
    throw new Error(error.message)
  }
  return exercise
}

const getExerciseById = async (id: string) => {
  const client = getDbClient()
  const { data: exercise, error } = await client.from('exercise').select('*').eq('id', id).single()
  if (error) {
    throw new Error(error.message)
  }
  return exercise
}

const createExercise = async (exercise: Exercise) => {
  const client = getDbClient()
  const { data, error } = await client.from('exercise').insert(exercise).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

const updateExercise = async (id: string, exercise: Exercise) => {
  const client = getDbClient()
  const { data, error } = await client
    .from('exercise')
    .update({ ...exercise, id })
    .eq('id', id)
    .single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}

const deleteExercise = async (id: string) => {
  const client = getDbClient()
  const { data, error } = await client.from('exercise').delete().eq('id', id).single()
  if (error) {
    throw new Error(error.message)
  }
  return data
}
