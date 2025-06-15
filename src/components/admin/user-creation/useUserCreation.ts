
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

      // First check if user exists in our public.users table
      const { data: existingPublicUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingPublicUser) {
        toast({
          title: "Error",
          description: `A user with email ${formData.email} already exists in the system. Please use a different email address.`,
          variant: "destructive"
        });
        return;
      }

      // Try to create the user in Supabase Auth using admin functions
      console.log('Attempting to create auth user...');
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

      // Handle different types of signup errors
      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('already exists') ||
            signUpError.message.includes('User already registered')) {
          
          console.log('User exists in auth, attempting to find and link existing user...');
          
          // User exists in auth.users but not in our tables
          // Let's try to get the existing auth user and create records for them
          try {
            // We can't directly query auth.users, so we'll try a different approach
            // Let's attempt to sign them in to get their ID, then sign them out
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password
            });

            if (signInData.user && !signInError) {
              const existingUserId = signInData.user.id;
              console.log('Found existing user ID:', existingUserId);
              
              // Sign them out immediately
              await supabase.auth.signOut();
              
              // Now create the user record in our tables
              // Assign roles first
              for (const role of formData.roles) {
                const { error: roleError } = await supabase
                  .from('user_roles')
                  .insert({
                    user_id: existingUserId,
                    role: role as AppRole
                  });

                if (roleError && !roleError.message.includes('duplicate key')) {
                  console.error(`Error assigning ${role} role:`, roleError);
                }
              }

              // If user has admin role, create them in the users table
              if (formData.roles.includes('admin')) {
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
                  console.error('Admin user record creation error:', userError);
                }
              }

              const roleText = formData.roles.length === 1 ? 
                `${formData.roles[0]} role` : 
                `${formData.roles.join(', ')} roles`;

              toast({
                title: "Success!",
                description: `Existing user ${formData.email} has been updated with ${roleText}.`,
              });

              onUserCreated();
              return;
            }
          } catch (linkError) {
            console.error('Error linking existing user:', linkError);
          }
          
          toast({
            title: "User Already Exists",
            description: `A user with email ${formData.email} already exists in the authentication system. If this is an existing user who needs role assignment, please contact a system administrator.`,
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
        console.log('Auth user created successfully, now assigning roles');
        
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
