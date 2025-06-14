
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface SecurityAuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  created_at: string;
}

export const useSecurityAudit = () => {
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logSecurityEvent = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any,
    success: boolean = true
  ) => {
    try {
      console.log('Logging security event:', {
        action,
        resourceType,
        resourceId,
        details,
        success,
        timestamp: new Date().toISOString()
      });

      // Use the database function to log security events
      const { error } = await supabase.rpc('log_security_event', {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId || null,
        p_details: details || null,
        p_success: success
      });

      if (error) {
        console.error('Failed to log security event to database:', error);
        // Still log to console for debugging
        console.log('Security Event (fallback):', {
          action,
          resourceType,
          resourceId,
          details,
          success,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to log security event:', err);
    }
  };

  const getSecurityLogs = async (limit: number = 100) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching security logs:', error);
        setError(error.message);
        setLogs([]);
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch security logs';
      setError(errorMessage);
      setLogs([]);
      console.error('Error fetching security logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSecurityLogsByUser = async (userId: string, limit: number = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user security logs:', error);
        setError(error.message);
        return [];
      }
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user security logs';
      setError(errorMessage);
      console.error('Error fetching user security logs:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logs,
    isLoading,
    error,
    logSecurityEvent,
    getSecurityLogs,
    getSecurityLogsByUser
  };
};
