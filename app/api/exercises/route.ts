import { getAllExercises } from '../_shared/repository/exercise.repository'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

export async function GET(_request: Request) {
  const exercises = await getAllExercises()
  return new Response(JSON.stringify(exercises))
}
