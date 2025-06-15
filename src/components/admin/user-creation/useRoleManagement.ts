
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const useRoleManagement = (onRolesUpdated: () => void) => {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const addRole = async (userId: string, role: string, userEmail?: string) => {
    setUpdatingUserId(userId);
    try {
      console.log(`Adding ${role} role to user:`, userId);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role as AppRole
        });
      
      if (error) {
        // Check if it's a duplicate role error
        if (error.code === '23505') {
          toast({
            title: "Info",
            description: `User already has the ${role} role.`,
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: `${role.charAt(0).toUpperCase() + role.slice(1)} role assigned to ${userEmail || 'user'}`,
        });
      }
      
      onRolesUpdated();
    } catch (error) {
      console.error(`Error adding ${role} role:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to assign ${role} role.`,
        variant: "destructive"
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const removeRole = async (userId: string, role: string, userEmail?: string) => {
    setUpdatingUserId(userId);
    try {
      console.log(`Removing ${role} role from user:`, userId);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role as AppRole);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: `${role.charAt(0).toUpperCase() + role.slice(1)} role removed from ${userEmail || 'user'}`,
      });
      
      onRolesUpdated();
    } catch (error) {
      console.error(`Error removing ${role} role:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to remove ${role} role.`,
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
