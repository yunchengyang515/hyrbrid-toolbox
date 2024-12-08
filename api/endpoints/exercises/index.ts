import { HTTP_METHODS } from 'next/dist/server/web/http'
import type { Context } from '@netlify/functions'
import { ExerciseController } from '@/api/controller/exercise.controller'
import { ExerciseRepository } from '@/api/repository/exercise.repository'

export const dynamic = 'force-dynamic' // static by default, unless reading the request
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

export default async (req: Request, _context: Context) => {
  if (req.method === HTTP_METHODS[0]) {
    return GET(req)
  } else if (req.method === HTTP_METHODS[3]) {
    return POST(req)
  }
}
