import { createClient } from '@supabase/supabase-js'

export const getClient = () => {
  const supabaseUrl = process.env.SUPABASE_API_URL
  const supabaseKey = process.env.SUPABASE_API_KEY
  if (!supabaseKey) {
    throw new Error('Supabase key is not defined')
  }
  if (!supabaseUrl) {
    throw new Error('Supabase URL is not defined')
  }
  return createClient(supabaseUrl, supabaseKey)
}
