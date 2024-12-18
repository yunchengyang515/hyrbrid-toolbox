import { Workout, WorkoutFormData, WorkoutWithExercises } from '@/types/Workout'
import { AbstractApiService } from './api.service'

export class WorkoutApiService extends AbstractApiService {
  constructor() {
    super()
    this.resource = 'workout'
  }
  async getAllWorkouts() {
    return this.transformResponse<WorkoutWithExercises[]>(await fetch(this.buildUrl()))
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

  async updateWorkout(id: string, workout: WorkoutFormData): Promise<WorkoutWithExercises> {
    //update workout pseudo code
    return {} as WorkoutWithExercises
  }
}
