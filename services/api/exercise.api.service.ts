import { Exercise, ExerciseFormData } from '@/types/Exercise'
import { AbstractApiService } from './api.service'

export class ExerciseApiService extends AbstractApiService {
  constructor() {
    super()
    this.resource = 'exercises'
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.transformResponse<Exercise[]>(await fetch(this.buildUrl()))
  }
  async createExercise(exercise: ExerciseFormData) {
    const response = fetch(this.buildUrl(), {
      method: 'POST',
      body: JSON.stringify(exercise),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return this.transformResponse<Exercise>(await response)
  }
}
