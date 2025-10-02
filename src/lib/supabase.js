// Supabase configuration for Kyle O'Connor CMS
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Falling back to localStorage only.')
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      }
    })
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null
}

// Test connection function
export const testSupabaseConnection = async () => {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' }
  }

  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Supabase connection successful')
    return { success: true, data }
  } catch (err) {
    console.error('Supabase connection error:', err)
    return { success: false, error: err.message }
  }
}

// Database health check
export const checkDatabaseHealth = async () => {
  if (!supabase) {
    return {
      status: 'unavailable',
      message: 'Supabase not configured',
      timestamp: new Date().toISOString()
    }
  }

  try {
    const start = Date.now()
    const { error } = await supabase
      .from('cms_content')
      .select('count', { count: 'exact', head: true })

    const responseTime = Date.now() - start

    if (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
        responseTime
      }
    }

    return {
      status: 'healthy',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      responseTime
    }
  } catch (err) {
    return {
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString()
    }
  }
}