import { Exercise } from '@/types/Exercise'
import { ExerciseRepository } from '../repository/exercise.repository'

export class ExerciseController {
  repository: ExerciseRepository
  constructor(repository: ExerciseRepository) {
    this.repository = repository
  }
  async getAllExercises() {
    return this.repository.getAllExercises()
  }
  async getExerciseById(id: string) {
    return this.repository.getExerciseById(id)
  }
  async createExercise(exercise: Exercise) {
    return this.repository.createExercise(exercise)
  }
  async updateExercise(id: string, exercise: Exercise) {
    return this.repository.updateExercise(id, exercise)
  }
  async deleteExercise(id: string) {
    return this.repository.deleteExercise(id)
  }
}
