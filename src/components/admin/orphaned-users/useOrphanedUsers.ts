
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { OrphanedUser } from './types';

export const useOrphanedUsers = () => {
  const [orphanedUsers, setOrphanedUsers] = useState<OrphanedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState<string | null>(null);

  const fetchOrphanedUsers = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Calling find_orphaned_auth_users function...');
      
      const { data, error } = await supabase.rpc('find_orphaned_auth_users');
      
      console.log('📊 Raw response from find_orphaned_auth_users:', { data, error });
      
      if (error) {
        console.error('❌ Error from find_orphaned_auth_users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orphaned users: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Successfully got data:', data);
      console.log('📋 Data type:', typeof data);
      console.log('📋 Is array:', Array.isArray(data));
      
      if (data) {
        console.log('📋 First item structure:', data[0]);
      }

      // Handle the response more carefully
      if (data === null || data === undefined) {
        console.log('⚠️ No data returned, setting empty array');
        setOrphanedUsers([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error('❌ Data is not an array:', data);
        setOrphanedUsers([]);
        return;
      }

      // Map the data to ensure proper structure
      const mappedUsers = data.map((user: any, index: number) => {
        console.log(`📝 Processing user ${index}:`, user);
        
        return {
          id: user.id || '',
          email: user.email || '',
          created_at: user.created_at || '',
          raw_user_meta_data: user.raw_user_meta_data || {},
          has_profile: Boolean(user.has_profile),
          has_customer: Boolean(user.has_customer),
          has_user_record: Boolean(user.has_user_record),
          user_roles: Array.isArray(user.user_roles) ? user.user_roles : []
        };
      });

      console.log('✅ Mapped users:', mappedUsers);
      setOrphanedUsers(mappedUsers);
      
    } catch (error: any) {
      console.error('💥 Unexpected error in fetchOrphanedUsers:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching users.",
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

      // Handle the response more safely
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const response = data as any;
        
        if (response.success) {
          const actions = response.actions || [];
          const actionMessages = Array.isArray(actions) 
            ? actions.map((action: any) => typeof action === 'object' ? action.action : action).join(', ')
            : 'User linked';
          
          toast({
            title: "Success!",
            description: `User linked successfully. Actions: ${actionMessages}`,
          });
          
          // Refresh the list
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

  const getOrphanedUsers = () => {
    return orphanedUsers.filter(user => 
      !user.has_profile || !user.has_customer || user.user_roles.length === 0
    );
  };

  useEffect(() => {
    fetchOrphanedUsers();
  }, []);

  return {
    orphanedUsers,
    isLoading,
    isLinking,
    fetchOrphanedUsers,
    linkUser,
    getOrphanedUsers
  };
};
