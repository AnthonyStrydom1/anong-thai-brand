
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminUserDeletion = (onUserDeleted: () => void) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const deleteAdminUser = async (userId: string, userEmail: string) => {
    if (!userId) return;
    
    setDeletingUserId(userId);
    try {
      console.log('Deleting admin user:', userId, userEmail);

      // First remove the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (roleError) {
        console.error('Error removing admin role:', roleError);
        throw roleError;
      }

      // Then remove from users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) {
        console.error('Error removing user record:', userError);
        throw userError;
      }

      toast({
        title: "Success!",
        description: `Admin user ${userEmail} has been removed.`,
      });

      onUserDeleted();
    } catch (error: any) {
      console.error('Error deleting admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin user.",
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
