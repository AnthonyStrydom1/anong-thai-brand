
import { useState } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';
import { useAdminSecurity } from '@/hooks/useAdminSecurity';

export const useAdminUserDeletion = (onUserDeleted: () => void) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const { logAdminAction } = useAdminSecurity();

  const deleteAdminUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to permanently delete user: ${userEmail}?`)) {
      return;
    }

    try {
      setDeletingUserId(userId);
      
      await logAdminAction('delete', 'admin_user', userId, {
        user_email: userEmail,
        action: 'delete_admin_user'
      });

      await supabaseService.deleteAdminUser(userId);
      
      toast({
        title: "Success",
        description: `Admin user ${userEmail} has been removed successfully.`
      });
      
      onUserDeleted();
    } catch (error: any) {
      console.error('Error deleting admin user:', error);
      
      await logAdminAction('delete', 'admin_user', userId, {
        error: error.message,
        user_email: userEmail
      }, false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin user",
        variant: "destructive"
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  return {
    deleteAdminUser,
    deletingUserId
  };
};
