
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        setRoles(data?.map(r => r.role as UserRole) || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching user roles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch roles');
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isModerator = (): boolean => {
    return hasRole('moderator');
  };

  const assignRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase.rpc('assign_admin_role', {
        _user_id: userId
      });

      if (error) throw error;

      // Refresh roles if assigning to current user
      if (userId === user?.id) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        setRoles(data?.map(r => r.role as UserRole) || []);
      }
    } catch (err) {
      console.error('Error assigning role:', err);
      throw err;
    }
  };

  return {
    roles,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isModerator,
    assignRole
  };
};
