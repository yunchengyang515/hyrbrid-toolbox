import { ExerciseRepository } from '../_shared/repository/exercise.repository'

export const dynamic = 'force-dynamic' // static by default, unless reading the request
const exerciseRepository = new ExerciseRepository()

export async function GET(_request: Request) {
  const exercises = await exerciseRepository.getAllExercises()
  return new Response(JSON.stringify(exercises))
}

export async function POST(request: Request) {
  const body = await request.json()
  const exercise = await exerciseRepository.createExercise(body)
  return new Response(JSON.stringify(exercise))
}
