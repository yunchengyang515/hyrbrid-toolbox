import { ExerciseController } from '@/api/controller/exercise.controller'
import { ExerciseRepository } from '@/api/data/repository/exercise.repository'
import { initializeHandler } from '@/api/endpoints/_request-handling/handler-initialize.service'
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

async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...exerciseData } = body
  const exercise = await exerciseController.updateExercise(id, exerciseData)
  return new Response(JSON.stringify(exercise))
}

const handler: Endpoint = {
  GET,
  POST,
  PUT,
}

export default initializeHandler(handler)
