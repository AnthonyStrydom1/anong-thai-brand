
import { useState } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';
import { useAdminSecurity } from '@/hooks/useAdminSecurity';

export const useRoleManagement = (onRoleUpdated: () => void) => {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { logAdminAction } = useAdminSecurity();

  const addRole = async (userId: string, role: string, userEmail: string) => {
    try {
      setUpdatingUserId(userId);
      
      await logAdminAction('create', 'user_role', userId, {
        role,
        user_email: userEmail,
        action: 'add_role'
      });

      await supabaseService.addUserRole(userId, role);
      
      toast({
        title: "Success",
        description: `${role} role added to ${userEmail}`
      });
      
      onRoleUpdated();
    } catch (error: any) {
      console.error('Error adding role:', error);
      
      await logAdminAction('create', 'user_role', userId, {
        error: error.message,
        role,
        user_email: userEmail
      }, false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to add role",
        variant: "destructive"
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const removeRole = async (userId: string, role: string, userEmail: string) => {
    try {
      setUpdatingUserId(userId);
      
      await logAdminAction('delete', 'user_role', userId, {
        role,
        user_email: userEmail,
        action: 'remove_role'
      });

      await supabaseService.removeUserRole(userId, role);
      
      toast({
        title: "Success",
        description: `${role} role removed from ${userEmail}`
      });
      
      onRoleUpdated();
    } catch (error: any) {
      console.error('Error removing role:', error);
      
      await logAdminAction('delete', 'user_role', userId, {
        error: error.message,
        role,
        user_email: userEmail
      }, false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to remove role",
        variant: "destructive"
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  return {
    addRole,
    removeRole,
    updatingUserId
  };
};
