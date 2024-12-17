import { Workout } from '@/types/Workout'
import { WorkoutExerciseRepository } from '../data/repository/workout_exercise.respository'
import { WorkoutRepository } from '../data/repository/workout.repository'

export class WorkoutController {
  workoutRepository: WorkoutRepository
  workoutExerciseRepository: WorkoutExerciseRepository
  constructor(
    workoutRepository: WorkoutRepository,
    workoutExerciseRepository: WorkoutExerciseRepository,
  ) {
    this.workoutRepository = workoutRepository
    this.workoutExerciseRepository = workoutExerciseRepository
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
    const exercises = await this.workoutExerciseRepository.getWorkoutExerciseByWorkoutId(workout.id)
    return { ...workout, exercises }
  }
}
