import { HTTP_METHODS } from 'next/dist/server/web/http'
import { Context } from '@netlify/functions'

export interface Endpoint {
  [key: string]: (request: Request, context: Context) => Promise<Response>
}
