
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

      // Try to create a new user
      console.log('Creating new user account');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        
        if (authError.message.includes('User already registered')) {
          toast({
            title: "User Exists",
            description: `User ${formData.email} already exists in the system but not in profiles. Please contact support.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: authError.message,
            variant: "destructive"
          });
        }
        return;
      }

      if (authData.user) {
        console.log('New user created, waiting for profile creation');
        
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 2000));

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
