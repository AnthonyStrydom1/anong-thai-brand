
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

      // First, check if a profile already exists for this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingProfile) {
        console.log('User profile already exists, assigning admin role');
        
        // User already exists, just assign admin role
        const { error: roleError } = await supabase.rpc('assign_admin_role', {
          _user_id: existingProfile.id
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

      // Check if user exists in auth but not in profiles
      console.log('Checking if user exists in auth system');
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
        console.error('Auth error:', signUpError);
        
        if (signUpError.message.includes('User already registered')) {
          console.log('User exists in auth but not in profiles - creating profile manually');
          
          // Get the user ID from auth.users using admin functions
          // Since we can't query auth.users directly, we'll need to create the profile
          // and let the user know they need to complete the setup
          toast({
            title: "User Exists in Auth",
            description: `User ${formData.email} exists in the auth system but not in profiles. Please ask them to sign in once to complete their profile setup, then try assigning admin role again.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: signUpError.message,
            variant: "destructive"
          });
        }
        return;
      }

      if (authData.user) {
        console.log('New user created successfully');
        
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify profile was created
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (!newProfile) {
          console.log('Profile not created by trigger, creating manually');
          // Create profile manually if trigger failed
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName
            });

          if (profileError) {
            console.error('Manual profile creation failed:', profileError);
            toast({
              title: "Partial Success",
              description: `User created but profile setup failed: ${profileError.message}`,
              variant: "destructive"
            });
            return;
          }
        }

        // Assign admin role
        const { error: roleError } = await supabase.rpc('assign_admin_role', {
          _user_id: authData.user.id
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
