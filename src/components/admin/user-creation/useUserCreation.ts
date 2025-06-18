
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { WelcomeEmailService } from '@/services/welcomeEmailService';
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

      // Try to create the user in Supabase Auth
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

      // Handle the "user already registered" error specifically
      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('already exists') ||
            signUpError.message.includes('User already registered')) {
          
          console.log('User exists in auth, attempting to find and link existing user...');
          
          toast({
            title: "User Already Exists in Authentication System",
            description: `The email ${formData.email} is already registered in the authentication system. This user may have been created outside of the admin panel. Please contact the system administrator or try a different approach to assign roles to this existing user.`,
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
        console.log('Auth user created successfully, now assigning roles');
        
        // Assign roles to the user
        const roleAssignmentPromises = formData.roles.map(async (role) => {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: role as AppRole
            });

          if (roleError) {
            console.error(`Error assigning ${role} role:`, roleError);
            throw new Error(`Failed to assign ${role} role: ${roleError.message}`);
          }
        });

        await Promise.all(roleAssignmentPromises);

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
            return;
          }
        }

        // Send welcome email for non-admin users (regular customers)
        if (!formData.roles.includes('admin') && formData.firstName) {
          try {
            console.log('👋 UserCreation: Sending welcome email to new user:', formData.email);
            const customerName = formData.firstName + (formData.lastName ? ` ${formData.lastName}` : '');
            
            await WelcomeEmailService.sendWelcomeEmail({
              customerName: customerName,
              customerEmail: formData.email,
            });
            console.log('✅ UserCreation: Welcome email sent successfully');
          } catch (emailError: any) {
            console.error('❌ UserCreation: Failed to send welcome email:', emailError);
            // Don't fail the user creation process if email fails
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
        description: error.message || "An unexpected error occurred while creating the user.",
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
