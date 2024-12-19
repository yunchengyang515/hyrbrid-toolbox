import { Workout } from '@/types/Workout'
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
  async createWorkout(workout: Workout) {
    return this.workoutRepository.createWorkout(workout)
  }
  async updateWorkout(id: string, workout: Workout) {
    return this.workoutRepository.updateWorkout(id, workout)
  }
  async deleteWorkout(id: string) {
    return this.workoutRepository.deleteWorkout(id)
  }

  async mergeWorkoutWithExercises(workout: Workout) {
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
