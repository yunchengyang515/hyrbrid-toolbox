import { Exercise } from '@/types/Exercise'
import { ApiService } from './api.service'

export class ExerciseApiService extends ApiService {
  constructor() {
    super()
    this.resource = 'exercises'
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.transformResponse<Exercise[]>(await fetch(this.buildUrl()))
  }
  async createExercise(exercise: Exercise) {
    return fetch(this.buildUrl(), {
      method: 'POST',
      body: JSON.stringify(exercise),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
