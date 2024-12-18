import { WorkoutFormData, WorkoutWithExercises } from '@/types/Workout'
import { AbstractApiService } from './api.service'

export class WorkoutApiService extends AbstractApiService {
  constructor() {
    super()
    this.resource = 'workout'
  }
  async getAllWorkouts() {
    return this.transformResponse<WorkoutWithExercises[]>(await fetch(this.buildUrl()))
  }

  async createWorkout(workout: WorkoutFormData): Promise<WorkoutWithExercises> {
    const response = fetch(this.buildUrl(), {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return this.transformResponse<WorkoutWithExercises>(await response)
  }
}
