import { Workout } from '@/types/Workout'
import { AbstractApiService } from './api.service'

export class WorkoutApiService extends AbstractApiService {
  constructor() {
    super()
    this.resource = 'exercises'
  }
  async getAllWorkouts() {
    return this.transformResponse<Workout[]>(await fetch(this.buildUrl()))
  }

  async createWorkout(workout: Workout) {
    return fetch(this.buildUrl(), {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
