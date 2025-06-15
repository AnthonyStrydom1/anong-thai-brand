
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAdminSecurity } from '@/hooks/useAdminSecurity';
import type { UserFormData } from './UserFormFields';

export const useAdminUserCreation = (onUserCreated: () => void) => {
  const [isCreating, setIsCreating] = useState(false);
  const { logAdminAction } = useAdminSecurity();

  const createAdminUser = async (formData: UserFormData) => {
    try {
      setIsCreating(true);
      
      // Log the attempt
      await logAdminAction('create', 'admin_user', undefined, {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        action: 'create_admin_user'
      });

      // First, create the user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create entry in users table
        const { error: userError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            auth_user_id: authData.user.id
          }]);

        if (userError) throw userError;

        // Assign admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: 'admin'
          }]);

        if (roleError) throw roleError;
      }

      toast({
        title: "Success!",
        description: `Admin user ${formData.email} created successfully.`
      });

      onUserCreated();
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      
      await logAdminAction('create', 'admin_user', undefined, {
        error: error.message,
        email: formData.email
      }, false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAdminUser,
    isCreating
  };
};
