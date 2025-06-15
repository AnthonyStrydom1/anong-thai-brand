
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  auth_user_id?: string;
}

interface AllUser {
  id: string;
  email?: string;
  created_at: string;
  raw_user_meta_data?: any;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export const useUserManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [allUsers, setAllUsers] = useState<AllUser[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserRoles = async () => {
    try {
      console.log('Loading user roles...');
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) {
        console.error('Error loading user roles:', error);
        setUserRoles([]);
        return;
      }
      
      console.log('Loaded user roles:', data?.length || 0, 'roles');
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
      setUserRoles([]);
    }
  };

  const loadAdminUsers = async () => {
    try {
      console.log('Loading admin users from users table...');
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) {
        console.error('Error loading admin users:', usersError);
        setAdminUsers([]);
        return;
      }
      
      console.log('Loaded admin users:', usersData?.length || 0, 'users');
      setAdminUsers(usersData || []);
      
    } catch (error: any) {
      console.error('Error loading admin users:', error);
      setAdminUsers([]);
    }
  };

  const loadAllUsers = async () => {
    try {
      console.log('Loading all users...');
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error loading all users:', profilesError);
        setAllUsers([]);
        return;
      }
      
      console.log('Loaded all users:', profilesData?.length || 0, 'users');
      setAllUsers(profilesData || []);
      
    } catch (error: any) {
      console.error('Error loading all users:', error);
      setAllUsers([]);
    }
  };

  const loadData = async (viewMode: 'admin' | 'all') => {
    setIsLoading(true);
    
    try {
      console.log('Starting to load data for viewMode:', viewMode);
      
      // Always load user roles first
      await loadUserRoles();
      
      // Then load the appropriate user data
      if (viewMode === 'admin') {
        await loadAdminUsers();
      } else {
        await loadAllUsers();
      }
      
      console.log('Data loading completed successfully');
    } catch (error) {
      console.error('Error in loadData:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Always clear loading state
      setIsLoading(false);
    }
  };

  return {
    adminUsers,
    allUsers,
    userRoles,
    isLoading,
    loadData,
    loadUserRoles
  };
};
