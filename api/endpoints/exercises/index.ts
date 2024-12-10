import { ExerciseController } from '@/api/controller/exercise.controller'
import { ExerciseRepository } from '@/api/data/repository/exercise.repository'
import { initializeHandler } from '@/api/request-handling/handler-initialize.service'
import { Endpoint } from '@/api/types'

const exerciseRepository = new ExerciseRepository()
const exerciseController = new ExerciseController(exerciseRepository)

export async function GET(_request: Request) {
  const exercises = await exerciseController.getAllExercises()
  return new Response(JSON.stringify(exercises))
}

export async function POST(request: Request) {
  const body = await request.json()
  const exercise = await exerciseController.createExercise(body)
  return new Response(JSON.stringify(exercise))
}

const handler: Endpoint = {
  GET,
  POST,
}

export default initializeHandler(handler)
