
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UserFormData } from './UserFormFields';

export const useAdminUserCreation = (onUserCreated: () => void) => {
  const [isCreating, setIsCreating] = useState(false);

  const createAdminUser = async (formData: UserFormData) => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Email and password are required.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      console.log('Creating admin user:', formData.email);

      // First, check if a user already exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        console.log('User already exists in users table, assigning admin role');
        
        // User already exists, just assign admin role
        const { error: roleError } = await supabase.rpc('assign_admin_role', {
          _user_id: existingUser.id
        });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          toast({
            title: "Error",
            description: `Failed to assign admin role: ${roleError.message}`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: `Admin role assigned to existing user ${formData.email}.`,
          });
          onUserCreated();
        }
        return;
      }

      // Create the user in Supabase Auth first
      console.log('Creating new user in auth system');
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
        console.log('Auth user created, now creating user record');
        
        // Create user record in our users table
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            auth_user_id: authData.user.id
          })
          .select()
          .single();

        if (userError) {
          console.error('User creation error:', userError);
          toast({
            title: "Partial Success",
            description: `Auth account created but user record failed: ${userError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('User record created, assigning admin role');

        // Assign admin role
        const { error: roleError } = await supabase.rpc('assign_admin_role', {
          _user_id: newUser.id
        });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          toast({
            title: "Partial Success",
            description: `User created but admin role assignment failed: ${roleError.message}`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: `Admin user ${formData.email} created successfully.`,
          });
        }

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
    createAdminUser,
    isCreating
  };
};
