import { getDbClient } from '../db'

export const getAllExercises = async () => {
  const client = getDbClient()
  const { data: exercise, error } = await client.from('exercise').select('*')
  if (error) {
    throw new Error(error.message)
  }
  return exercise
}
