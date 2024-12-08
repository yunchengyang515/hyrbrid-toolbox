import { getClient } from '../db'

export const getAllExercises = async () => {
  const client = getClient()
  const { data: exercise, error } = await client.from('exercise').select('*')
  if (error) {
    throw new Error(error.message)
  }
  return exercise
}
