export abstract class ApiService {
  baseUrl: string
  resource: string = ''
  constructor() {
    this.baseUrl = process.env.API_BASE_URL as string
  }
  protected buildUrl(path: string[] = []) {
    return `${this.baseUrl}/${this.resource}/${path.join('/')}`
  }
}
