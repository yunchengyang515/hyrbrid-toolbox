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
  const workout = await workoutController.createWorkout(body)
  return new Response(JSON.stringify(workout))
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...workoutData } = body
  const updatedWorkout = await workoutController.updateWorkout(id, workoutData)
  return new Response(JSON.stringify(updatedWorkout))
}

const handler: Endpoint = {
  GET,
  POST,
  PUT,
}

export default initializeHandler(handler)
