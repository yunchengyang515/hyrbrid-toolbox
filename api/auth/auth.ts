export class AuthService {
  getCurrentUser() {
    return {
      id: '0d9697d2-3f7f-4463-8003-d5b168f8e137',
    }
  }

  checkRequest(request: Request) {
    const token = request.headers.get('Authorization')
    if (process.env.NEXT_PUBLIC_API_BASE_URL?.startsWith('http://localhost')) {
      return true
    }
    if (!token) {
      throw new Error('Unauthorized')
    }
    if (token !== `Bearer ${process.env.API_KEY}`) {
      throw new Error('Unauthorized')
    }
    return true
  }
}
