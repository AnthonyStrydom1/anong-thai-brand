
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { OrphanedUser } from './types';

export const useOrphanedUsers = () => {
  const [orphanedUsers, setOrphanedUsers] = useState<OrphanedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const fetchOrphanedUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('find_orphaned_auth_users');
      
      if (error) {
        console.error('Error fetching orphaned users:', error);
        toast({
          title: "Database Error",
          description: `Error calling find_orphaned_auth_users: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      if (!data || !Array.isArray(data)) {
        setOrphanedUsers([]);
        return;
      }

      const mappedUsers = data.map((user: any) => ({
        id: user.id || '',
        email: user.email || '',
        created_at: user.created_at || '',
        raw_user_meta_data: user.raw_user_meta_data || {},
        has_profile: Boolean(user.has_profile),
        has_customer: Boolean(user.has_customer),
        has_user_record: Boolean(user.has_user_record),
        user_roles: Array.isArray(user.user_roles) ? user.user_roles : []
      }));

      setOrphanedUsers(mappedUsers);
      
    } catch (error: any) {
      console.error('Unexpected error in fetchOrphanedUsers:', error);
      toast({
        title: "Application Error",
        description: `JavaScript error: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const linkUser = async (
    userId: string, 
    createProfile: boolean = true, 
    createCustomer: boolean = true, 
    createAdminRecord: boolean = false
  ) => {
    try {
      setIsLinking(userId);
      
      const { data, error } = await supabase.rpc('link_orphaned_user', {
        _user_id: userId,
        _create_profile: createProfile,
        _create_customer: createCustomer,
        _create_admin_record: createAdminRecord
      });

      if (error) {
        console.error('Error linking user:', error);
        toast({
          title: "Error",
          description: "Failed to link user: " + error.message,
          variant: "destructive"
        });
        return;
      }

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const response = data as any;
        
        if (response.success) {
          const actions = response.actions || [];
          const actionMessages = Array.isArray(actions) 
            ? actions.map((action: any) => typeof action === 'object' ? action.action : action).join(', ')
            : 'User linked';
          
          const userType = createAdminRecord ? 'admin user' : 'customer';
          
          toast({
            title: "Success!",
            description: `User linked successfully as ${userType}. Actions: ${actionMessages}`,
          });
          
          await fetchOrphanedUsers();
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to link user",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Unexpected response format from server",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while linking user.",
        variant: "destructive"
      });
    } finally {
      setIsLinking(null);
    }
  };

  const removeUser = async (userId: string, userEmail: string) => {
    try {
      setIsRemoving(userId);
      
      // First, clean up all related records in public schema
      const { error: cleanupError } = await supabase.rpc('cleanup_user_data' as any, {
        _user_id: userId
      });

      if (cleanupError) {
        console.error('Error cleaning up user data:', cleanupError);
        toast({
          title: "Error",
          description: `Failed to clean up user data: ${cleanupError.message}`,
          variant: "destructive"
        });
        return;
      }

      // Show warning about auth user deletion
      toast({
        title: "Partial Success",
        description: `User data cleaned up successfully. Note: The auth user ${userEmail} still exists and may need to be removed manually from the Supabase Auth dashboard.`,
        variant: "default"
      });
      
      await fetchOrphanedUsers();
    } catch (error: any) {
      console.error('Unexpected error removing user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while removing user.",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(null);
    }
  };

  const getOrphanedUsers = () => {
    // Show users who are missing either profile or customer records
    // Admin users (those with user_record) are considered complete even without roles in some cases
    return orphanedUsers.filter(user => 
      !user.has_profile || !user.has_customer
    );
  };

  useEffect(() => {
    fetchOrphanedUsers();
  }, []);

  return {
    orphanedUsers,
    isLoading,
    isLinking,
    isRemoving,
    fetchOrphanedUsers,
    linkUser,
    removeUser,
    getOrphanedUsers
  };
};
