
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export const useUserCreation = (onUserCreated: () => void) => {
  const [isCreating, setIsCreating] = useState(false);

  const createUser = async (formData: UserFormData) => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Email and password are required.",
        variant: "destructive"
      });
      return;
    }

    if (formData.roles.length === 0) {
      toast({
        title: "Error",
        description: "Please select a user role.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      console.log('Creating user:', formData.email, 'with roles:', formData.roles);

      // Check if user already exists in auth
      const { data: listUsersResponse } = await supabase.auth.admin.listUsers();
      const existingUsers = listUsersResponse?.users || [];
      const userExists = existingUsers.some(user => user.email === formData.email);
      
      if (userExists) {
        toast({
          title: "Error",
          description: `A user with email ${formData.email} already exists. Please use a different email address.`,
          variant: "destructive"
        });
        return;
      }

      // Create the user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        
        // Handle specific error cases
        if (signUpError.message.includes('already registered')) {
          toast({
            title: "Error",
            description: `User ${formData.email} already exists. Please use a different email address.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to create user account: ${signUpError.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      if (authData.user) {
        console.log('Auth user created, now assigning roles');
        
        // Assign roles to the user
        for (const role of formData.roles) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: role as AppRole
            });

          if (roleError) {
            console.error(`Error assigning ${role} role:`, roleError);
            toast({
              title: "Partial Success",
              description: `User created but failed to assign ${role} role: ${roleError.message}`,
              variant: "destructive"
            });
          }
        }

        // If user has admin role, create them in the users table
        if (formData.roles.includes('admin')) {
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              auth_user_id: authData.user.id
            });

          if (userError) {
            console.error('Admin user record creation error:', userError);
            toast({
              title: "Partial Success",
              description: `User and roles created but admin record failed: ${userError.message}`,
              variant: "destructive"
            });
          }
        }

        const roleText = formData.roles.length === 1 ? 
          `${formData.roles[0]} role` : 
          `${formData.roles.join(', ')} roles`;

        toast({
          title: "Success!",
          description: `User ${formData.email} created successfully with ${roleText}.`,
        });

        onUserCreated();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createUser,
    isCreating
  };
};
