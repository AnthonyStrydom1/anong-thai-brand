
import { useSecurityAudit } from './useSecurityAudit';
import { useAuth } from './useAuth';

export const useAdminSecurity = () => {
  const { logSecurityEvent } = useSecurityAudit();
  const { user } = useAuth();

  const logAdminAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any,
    success: boolean = true
  ) => {
    if (!user) {
      console.warn('Attempted to log admin action without authenticated user');
      return;
    }

    await logSecurityEvent(action, resourceType, resourceId, {
      ...details,
      adminUserId: user.id,
      timestamp: new Date().toISOString()
    }, success);
  };

  return {
    logAdminAction
  };
};
