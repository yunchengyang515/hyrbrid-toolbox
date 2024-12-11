import { ApiService } from './api.service'

export class ExerciseApiService extends ApiService {
  constructor() {
    super()
    this.resource = 'exercises'
  }

  async getAllExercises() {
    return fetch(this.buildUrl())
  }
}
