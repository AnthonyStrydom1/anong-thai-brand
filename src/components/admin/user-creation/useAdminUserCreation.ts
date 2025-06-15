
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

      // First, check if a user already exists in our users table (admin users only)
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        console.log('Admin user already exists in users table');
        toast({
          title: "Error",
          description: `An admin user with email ${formData.email} already exists in the system.`,
          variant: "destructive"
        });
        return;
      }

      // Create the user in Supabase Auth first
      console.log('Creating new admin user in auth system');
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
        
        // Handle existing user case
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('already exists') ||
            signUpError.message.includes('User already registered')) {
          
          toast({
            title: "User Already Exists in Authentication System",
            description: `The email ${formData.email} is already registered in the authentication system. This user may have been created outside of the admin panel. To make this user an admin, you'll need to use the general user creation form or contact a system administrator.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Authentication Error",
            description: `Failed to create user account: ${signUpError.message}`,
            variant: "destructive"
          });
        }
        return;
      }

      if (authData.user) {
        console.log('Auth user created, now creating admin user record');
        
        // First assign admin role - this must happen before creating the user record
        const { error: roleError } = await supabase.rpc('assign_admin_role', {
          _user_id: authData.user.id
        });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          toast({
            title: "Error",
            description: `Failed to assign admin role: ${roleError.message}`,
            variant: "destructive"
          });
          return;
        }

        // Create admin user record in our users table
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
          console.error('Admin user creation error:', userError);
          toast({
            title: "Partial Success",
            description: `Auth account and admin role created but user record failed: ${userError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('Admin user record created successfully');

        toast({
          title: "Success!",
          description: `Admin user ${formData.email} created successfully.`,
        });

        onUserCreated();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while creating the admin user.",
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
