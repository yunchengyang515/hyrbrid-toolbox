import { Workout } from '@/types/Workout'
import { WorkoutRepository } from '../repository/workout.repository'

export class WorkoutController {
  repository: WorkoutRepository
  constructor(repository: WorkoutRepository) {
    this.repository = repository
  }
  async getAllWorkouts() {
    return this.repository.getAllWorkouts()
  }
  async getWorkoutById(id: string) {
    return this.repository.getWorkoutById(id)
  }
  async createWorkout(workout: Workout) {
    return this.repository.createWorkout(workout)
  }
  async updateWorkout(id: string, workout: Workout) {
    return this.repository.updateWorkout(id, workout)
  }
  async deleteWorkout(id: string) {
    return this.repository.deleteWorkout(id)
  }
}
