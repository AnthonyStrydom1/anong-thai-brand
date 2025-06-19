
/**
 * Emergency Supabase utilities for critical operations
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const emergencySupabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Emergency error logging function
 */
export async function logEmergencyError(error: any, context?: Record<string, any>) {
  try {
    await emergencySupabase
      .from('error_logs')
      .insert({
        error_message: error.message || 'Unknown error',
        error_stack: error.stack,
        error_code: error.code,
        context: context || {},
        severity: error.severity || 'high',
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      })
  } catch (logError) {
    // Fallback to console if database logging fails
    console.error('Emergency logging failed:', logError)
    console.error('Original error:', error)
  }
}

/**
 * Check Supabase connection status
 */
export async function checkSupabaseHealth(): Promise<boolean> {
  try {
    const { data, error } = await emergencySupabase
      .from('health_check')
      .select('status')
      .limit(1)
    
    return !error
  } catch {
    return false
  }
}
