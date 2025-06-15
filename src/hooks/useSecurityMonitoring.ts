import { useState, useEffect, useCallback } from 'react';
import { useSecurityAudit } from './useSecurityAudit';
import { securityService } from '@/services/securityService';

interface SecurityMetrics {
  rateLimitViolations: number;
  suspiciousActivities: number;
  activeRateLimits: number;
  activeSessions: number;
  cacheSize: number;
  recentEvents: any[];
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  details?: any;
}

export const useSecurityMonitoring = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    rateLimitViolations: 0,
    suspiciousActivities: 0,
    activeRateLimits: 0,
    activeSessions: 0,
    cacheSize: 0,
    recentEvents: []
  });
  
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const { logSecurityEvent, getSecurityLogs } = useSecurityAudit();

  const updateMetrics = useCallback(async () => {
    try {
      const serviceMetrics = securityService.getSecurityMetrics();
      const recentLogs = await getSecurityLogs(50);
      
      setMetrics({
        ...serviceMetrics,
        recentEvents: recentLogs.slice(0, 10)
      });

      // Check for security alerts
      const newAlerts: SecurityAlert[] = [];
      
      // Check for rate limit violations
      if (serviceMetrics.rateLimitViolations > 10) {
        newAlerts.push({
          id: `rate-limit-${Date.now()}`,
          type: 'warning',
          message: `High rate limit violations detected: ${serviceMetrics.rateLimitViolations}`,
          timestamp: new Date().toISOString()
        });
      }

      // Check for suspicious activities
      if (serviceMetrics.suspiciousActivities > 5) {
        newAlerts.push({
          id: `suspicious-${Date.now()}`,
          type: 'error',
          message: `Suspicious activities detected: ${serviceMetrics.suspiciousActivities}`,
          timestamp: new Date().toISOString()
        });
      }

      // Check for recent critical events
      const criticalEvents = recentLogs.filter(log => 
        log.details?.severity === 'critical' && 
        new Date(log.created_at) > new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
      );

      if (criticalEvents.length > 0) {
        newAlerts.push({
          id: `critical-${Date.now()}`,
          type: 'error',
          message: `${criticalEvents.length} critical security events in the last 15 minutes`,
          timestamp: new Date().toISOString(),
          details: criticalEvents
        });
      }

      setAlerts(prevAlerts => {
        const combinedAlerts = [...prevAlerts, ...newAlerts];
        // Keep only last 20 alerts
        return combinedAlerts.slice(-20);
      });

    } catch (error) {
      console.error('Failed to update security metrics:', error);
    }
  }, [getSecurityLogs]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    updateMetrics(); // Initial update
    
    // Update metrics every 30 seconds
    const interval = setInterval(updateMetrics, 30000);
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [updateMetrics]);

  const clearAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const logSecurityIncident = useCallback(async (
    type: string,
    details: any
  ) => {
    await logSecurityEvent(`SECURITY_INCIDENT_${type.toUpperCase()}`, 'security_monitoring', undefined, {
      incidentType: type,
      details,
      reportedAt: new Date().toISOString()
    });
    
    setAlerts(prev => [...prev, {
      id: `incident-${Date.now()}`,
      type: 'error',
      message: `Security incident reported: ${type}`,
      timestamp: new Date().toISOString(),
      details
    }]);
  }, [logSecurityEvent]);

  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  return {
    metrics,
    alerts,
    isMonitoring,
    clearAlert,
    clearAllAlerts,
    logSecurityIncident,
    updateMetrics
  };
};
