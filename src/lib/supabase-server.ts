import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './supabase'

// Server component client
export const createSupabaseServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
