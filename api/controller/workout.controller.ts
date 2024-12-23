import { Workout, WorkoutFormData, WorkoutWithExercises } from '@/types/workout.types'
import { WorkoutExerciseSchema } from '@/types/workoutExercise.types'
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

    // Map exercises to the correct format and add them to the workout
    const mappedExercises: WorkoutExerciseSchema[] = exercises.map((exercise) => ({
      exercise_id: exercise.exercise_id,
      workout_id: createdWorkout.id,
      user_id: createdWorkout.user_id,
      set_rep_detail: exercise.set_rep_detail,
    }))
    await this.updateWorkoutExercises(createdWorkout.id, mappedExercises)

    return this.mergeWorkoutWithExercises(createdWorkout)
  }
  async updateWorkout(id: string, workout: WorkoutWithExercises) {
    // Extract exercises from the workout data
    const { exercises, ...workoutData } = workout

    // Update the workout without exercises
    const updatedWorkout = await this.workoutRepository.updateWorkout(id, workoutData)

    // Map exercises to the correct format and update them in the workout
    const mappedExercises: WorkoutExerciseSchema[] = exercises.map((exercise) => ({
      exercise_id: exercise.exercise_id,
      workout_id: updatedWorkout.id,
      user_id: updatedWorkout.user_id,
      set_rep_detail: exercise.set_rep_detail,
    }))
    await this.updateWorkoutExercises(id, mappedExercises)

    return this.mergeWorkoutWithExercises(updatedWorkout)
  }
  async deleteWorkout(id: string) {
    return this.workoutRepository.deleteWorkout(id)
  }

  private async updateWorkoutExercises(workoutId: string, exercises: WorkoutExerciseSchema[]) {
    await this.workoutExerciseRepository.deleteWorkoutExercisesByWorkoutId(workoutId)

    for (const exercise of exercises) {
      await this.workoutExerciseRepository.createWorkoutExercise({
        ...exercise,
        workout_id: workoutId,
      })
    }
  }

  async mergeWorkoutWithExercises(workout: Workout): Promise<WorkoutWithExercises> {
    const workoutExercises = await this.workoutExerciseRepository.getWorkoutExerciseByWorkoutId(
      workout.id,
    )
    const workoutExercisesWithDetails = await Promise.all(
      workoutExercises.map(async (workoutExercise) => {
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
    return { ...workout, exercises: workoutExercisesWithDetails }
  }
}
