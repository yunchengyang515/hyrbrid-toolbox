export abstract class AbstractApiService {
  baseUrl: string
  resource: string = ''
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string
  }
  protected buildUrl(path: string[] = []) {
    return [this.baseUrl, this.resource, ...path].join('/')
  }

  protected getAuthHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token') || process.env.API_KEY}`,
    }
  }

  protected transformResponse<T>(response: Response) {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as Promise<T>
  }
}
