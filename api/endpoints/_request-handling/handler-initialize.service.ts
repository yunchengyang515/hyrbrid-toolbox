import { Context } from '@netlify/functions'
import { Endpoint } from '../../types'

export const initializeHandler = (endpoint: Endpoint) => {
  return async function handlerWrapper(request: Request, context: Context) {
    const method = request.method
    const handlerMethod = endpoint[method]
    if (!handlerMethod) {
      return new Response('Method Not Allowed', { status: 405 })
    }
    return handlerMethod(request, context)
  }
}
