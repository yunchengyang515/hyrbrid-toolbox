import { WorkoutController } from '@/api/controller/workout.controller'
import { ExerciseRepository } from '@/api/data/repository/exercise.repository'
import { WorkoutExerciseRepository } from '@/api/data/repository/workout_exercise.respository'
import { WorkoutRepository } from '@/api/data/repository/workout.repository'
import { initializeHandler } from '@/api/endpoints/_request-handling/handler-initialize.service'
import { Endpoint } from '@/api/types'

const workoutRepository = new WorkoutRepository()
const workoutExerciseRepository = new WorkoutExerciseRepository()
const exerciseRepository = new ExerciseRepository()
const workoutController = new WorkoutController(
  workoutRepository,
  workoutExerciseRepository,
  exerciseRepository,
)

export async function GET(_request: Request) {
  const exercises = await workoutController.getAllWorkouts()
  return new Response(JSON.stringify(exercises))
}

export async function POST(request: Request) {
  const body = await request.json()
  const exercise = await workoutController.createWorkout(body)
  return new Response(JSON.stringify(exercise))
}

const handler: Endpoint = {
  GET,
  POST,
}

export default initializeHandler(handler)
