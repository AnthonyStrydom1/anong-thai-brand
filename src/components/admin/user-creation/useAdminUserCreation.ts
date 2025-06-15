
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
        console.log('Admin user already exists in users table, assigning admin role');
        
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
          
          console.log('User exists in auth, attempting to link existing admin user...');
          
          try {
            // Try to sign in to get the user ID
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password
            });

            if (signInData.user && !signInError) {
              const existingUserId = signInData.user.id;
              console.log('Found existing user ID:', existingUserId);
              
              // Sign them out immediately
              await supabase.auth.signOut();
              
              // Assign admin role
              const { error: roleError } = await supabase.rpc('assign_admin_role', {
                _user_id: existingUserId
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
              const { error: userError } = await supabase
                .from('users')
                .insert({
                  id: existingUserId,
                  email: formData.email,
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  auth_user_id: existingUserId
                });

              if (userError && !userError.message.includes('duplicate key')) {
                console.error('Admin user creation error:', userError);
                toast({
                  title: "Partial Success",
                  description: `Admin role assigned but user record creation failed: ${userError.message}`,
                  variant: "destructive"
                });
                return;
              }

              toast({
                title: "Success!",
                description: `Existing user ${formData.email} has been assigned admin role.`,
              });

              onUserCreated();
              return;
            }
          } catch (linkError) {
            console.error('Error linking existing admin user:', linkError);
          }
          
          toast({
            title: "User Already Exists",
            description: `A user with email ${formData.email} already exists in the authentication system. If this user needs admin access, please contact a system administrator.`,
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
        console.log('Auth user created, now creating admin user record');
        
        // First assign admin role - this must happen before creating the user record
        // because the link_auth_user trigger only creates user records for admin users
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
