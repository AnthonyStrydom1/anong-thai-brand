
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DeletionPreview {
  user_id: string;
  items_to_delete: Array<{
    type: string;
    count: number;
    details?: any;
  }>;
}

interface DeletionResult {
  success: boolean;
  deleted?: Array<{
    type: string;
    [key: string]: any;
  }>;
  user_id?: string;
  auth_deletion_required?: boolean;
  error?: string;
}

export const useAdminUserDeletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [deletionPreview, setDeletionPreview] = useState<DeletionPreview | null>(null);

  const getDeletePreview = async (userId: string): Promise<DeletionPreview | null> => {
    try {
      setIsLoading(true);
      console.log('Getting deletion preview for user:', userId);

      const { data, error } = await supabase.rpc('admin_get_user_deletion_preview', {
        _user_id: userId
      });

      if (error) {
        console.error('Error getting deletion preview:', error);
        toast({
          title: "Error",
          description: "Failed to get deletion preview: " + error.message,
          variant: "destructive"
        });
        return null;
      }

      if (!data.success && data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      console.log('Deletion preview:', data);
      setDeletionPreview(data);
      return data;
    } catch (error: any) {
      console.error('Unexpected error getting deletion preview:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while getting deletion preview.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserComplete = async (
    userId: string, 
    deleteFromAuth: boolean = false
  ): Promise<DeletionResult | null> => {
    try {
      setIsLoading(true);
      console.log('Deleting user completely:', userId, 'Delete from auth:', deleteFromAuth);

      // First call our database function
      const { data, error } = await supabase.rpc('admin_delete_user_complete', {
        _user_id: userId,
        _delete_from_auth: deleteFromAuth
      });

      if (error) {
        console.error('Error deleting user from database:', error);
        toast({
          title: "Error",
          description: "Failed to delete user from database: " + error.message,
          variant: "destructive"
        });
        return null;
      }

      if (!data.success) {
        toast({
          title: "Error",
          description: data.error || "Failed to delete user",
          variant: "destructive"
        });
        return data;
      }

      console.log('Database deletion result:', data);

      // If requested, also delete from Supabase Auth
      if (deleteFromAuth) {
        try {
          const { error: authError } = await supabase.auth.admin.deleteUser(userId);
          
          if (authError) {
            console.error('Error deleting user from auth:', authError);
            toast({
              title: "Warning",
              description: `User data deleted from database, but failed to delete from auth: ${authError.message}`,
              variant: "destructive"
            });
          } else {
            console.log('User deleted from auth successfully');
          }
        } catch (authError: any) {
          console.error('Auth deletion error:', authError);
          toast({
            title: "Warning", 
            description: "User data deleted from database, but auth deletion failed. This might require service role permissions.",
            variant: "destructive"
          });
        }
      }

      toast({
        title: "Success!",
        description: `User and all associated data has been deleted successfully.${deleteFromAuth ? ' User also removed from authentication.' : ''}`,
      });

      setDeletionPreview(null);
      return data;
    } catch (error: any) {
      console.error('Unexpected error deleting user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting user.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    setDeletionPreview(null);
  };

  return {
    isLoading,
    deletionPreview,
    getDeletePreview,
    deleteUserComplete,
    clearPreview
  };
};
