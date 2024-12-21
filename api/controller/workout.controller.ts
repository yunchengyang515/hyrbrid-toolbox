import { Workout, WorkoutFormData, WorkoutWithExercises } from '@/types/Workout'
import { WorkoutExercise } from '@/types/WorkoutExercise'
import { ExerciseRepository } from '../data/repository/exercise.repository'
import { WorkoutExerciseRepository } from '../data/repository/workout_exercise.respository'
import { WorkoutRepository } from '../data/repository/workout.repository'

export class WorkoutController {
  workoutRepository: WorkoutRepository
  workoutExerciseRepository: WorkoutExerciseRepository
  exerciseRepository: ExerciseRepository
  constructor(
    workoutRepository: WorkoutRepository,
    workoutExerciseRepository: WorkoutExerciseRepository,
    exerciseRepository: ExerciseRepository,
  ) {
    this.workoutRepository = workoutRepository
    this.workoutExerciseRepository = workoutExerciseRepository
    this.exerciseRepository = exerciseRepository
  }
  async getAllWorkouts() {
    const workouts = await this.workoutRepository.getAllWorkouts()
    return Promise.all(workouts.map(this.mergeWorkoutWithExercises.bind(this)))
  }
  async getWorkoutById(id: string) {
    return this.mergeWorkoutWithExercises(await this.workoutRepository.getWorkoutById(id))
  }
  async createWorkout(workout: WorkoutFormData) {
    // Extract exercises from the workout data
    const { exercises, ...workoutData } = workout

    // Create the workout without exercises
    const createdWorkout = await this.workoutRepository.createWorkout(workoutData)

    // Add exercises to the workout
    await this.updateWorkoutExercises(createdWorkout.id, exercises)

    return this.mergeWorkoutWithExercises(createdWorkout)
  }
  async updateWorkout(id: string, workout: WorkoutWithExercises) {
    const updatedWorkout = await this.workoutRepository.updateWorkout(id, workout)
    await this.updateWorkoutExercises(id, workout.exercises)
    return this.mergeWorkoutWithExercises(updatedWorkout)
  }
  async deleteWorkout(id: string) {
    return this.workoutRepository.deleteWorkout(id)
  }

  private async updateWorkoutExercises(workoutId: string, exercises: WorkoutExercise[]) {
    // Delete existing workout exercises
    await this.workoutExerciseRepository.deleteWorkoutExercisesByWorkoutId(workoutId)

    // Add updated workout exercises
    for (const exercise of exercises) {
      await this.workoutExerciseRepository.createWorkoutExercise({
        ...exercise,
        workout_id: workoutId,
      })
    }
  }

  async mergeWorkoutWithExercises(workout: Workout): Promise<WorkoutWithExercises> {
    const workoutExercise = await this.workoutExerciseRepository.getWorkoutExerciseByWorkoutId(
      workout.id,
    )
    const workoutExerciseWithExerciseData = await Promise.all(
      workoutExercise.map(async (workoutExercise) => {
        const exerciseData = await this.exerciseRepository.getExerciseById(
          workoutExercise.exercise_id,
        )
        return {
          ...workoutExercise,
          exercise_type: exerciseData.type,
          exercise_name: exerciseData.name,
        }
      }),
    )
    return { ...workout, exercises: workoutExerciseWithExerciseData }
  }
}
