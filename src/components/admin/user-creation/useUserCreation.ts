
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
        description: "At least one role must be selected.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      console.log('Creating user:', formData.email, 'with roles:', formData.roles);

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
        toast({
          title: "Error",
          description: `Failed to create user account: ${signUpError.message}`,
          variant: "destructive"
        });
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
              role: role
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

        toast({
          title: "Success!",
          description: `User ${formData.email} created successfully with ${formData.roles.join(', ')} role(s).`,
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
