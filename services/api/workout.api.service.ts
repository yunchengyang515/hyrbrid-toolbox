import { Workout, WorkoutFormData } from '@/types/Workout'
import { AbstractApiService } from './api.service'

export class WorkoutApiService extends AbstractApiService {
  constructor() {
    super()
    this.resource = 'workout'
  }
  async getAllWorkouts() {
    return this.transformResponse<Workout[]>(await fetch(this.buildUrl()))
  }

  async createWorkout(workout: WorkoutFormData): Promise<Workout> {
    const response = fetch(this.buildUrl(), {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return this.transformResponse<Workout>(await response)
  }

  async updateWorkout(id: string, workout: WorkoutFormData): Promise<Workout> {
    //update workout pseudo code
    return {} as Workout
  }
}
