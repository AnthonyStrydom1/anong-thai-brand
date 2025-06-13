
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
      // For now, just log to console until the database function is properly set up
      console.log('Security Event:', {
        action,
        resourceType,
        resourceId,
        details,
        timestamp: new Date().toISOString(),
        userId: 'current-user' // Would get from auth context
      });
    } catch (err) {
      console.error('Failed to log security event:', err);
    }
  };

  const getSecurityLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, return empty data since the table types aren't available yet
      // Once the database migration is complete and types are updated, 
      // we can query the security_audit_log table directly
      setLogs([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security logs');
      setLogs([]);
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
