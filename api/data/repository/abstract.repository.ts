import { AuthService } from '@/api/auth/auth'

export abstract class AbstractRepository {
  protected currentUserId: string
  constructor() {
    const authService = new AuthService()
    this.currentUserId = authService.getCurrentUser().id
  }
}
