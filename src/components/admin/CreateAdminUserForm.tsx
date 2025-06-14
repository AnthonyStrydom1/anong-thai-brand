
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, User, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreateAdminUserFormProps {
  onUserCreated: () => void;
}

const CreateAdminUserForm = ({ onUserCreated }: CreateAdminUserFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createAdminUser = async () => {
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
      // First, check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Error",
          description: "A user with this email already exists.",
          variant: "destructive"
        });
        return;
      }

      // Create user using the sign up method - the trigger will handle profile creation
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

      if (authError) throw authError;

      if (authData.user) {
        // Wait for the database trigger to create the profile
        console.log('User created, waiting for profile creation by trigger...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Verify profile was created by trigger
        const { data: profile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileCheckError) {
          console.error('Error checking profile:', profileCheckError);
          toast({
            title: "Warning",
            description: `User created but profile verification failed: ${profileCheckError.message}`,
            variant: "destructive"
          });
        } else if (!profile) {
          toast({
            title: "Warning", 
            description: "User created but profile was not found. The trigger may have failed.",
            variant: "destructive"
          });
        } else {
          console.log('Profile created successfully by trigger');
        }

        // Now assign admin role
        const { error: roleError } = await supabase.rpc('assign_admin_role', {
          _user_id: authData.user.id
        });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          toast({
            title: "Warning",
            description: `User created but admin role assignment failed: ${roleError.message}. You can assign the role manually later.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: `Admin user ${formData.email} created successfully with admin role assigned.`,
          });
        }

        // Clear form
        setFormData({ email: '', password: '', firstName: '', lastName: '' });
        onUserCreated();
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New Admin User
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button 
          onClick={createAdminUser}
          disabled={isCreating || !formData.email || !formData.password}
          className="w-full"
        >
          {isCreating ? "Creating..." : "Create Admin User"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUserForm;
