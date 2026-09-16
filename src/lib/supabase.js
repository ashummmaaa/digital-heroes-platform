import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-digitalheroes.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Demo helper check
export const isDemoMode = () => {
  return !import.meta.env.VITE_SUPABASE_URL || 
         import.meta.env.VITE_SUPABASE_URL.includes('demo-digitalheroes') ||
         import.meta.env.VITE_SUPABASE_ANON_KEY === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo'
}
