
import { useState } from 'react';
import { supabaseService } from '@/services/supabaseService';

interface SecurityAuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
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
    details?: any
  ) => {
    try {
      const { error } = await supabaseService.supabase.rpc('log_security_event', {
        _action: action,
        _resource_type: resourceType,
        _resource_id: resourceId || null,
        _details: details || null
      });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to log security event:', err);
    }
  };

  const getSecurityLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabaseService.supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security logs');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logs,
    isLoading,
    error,
    logSecurityEvent,
    getSecurityLogs
  };
};
