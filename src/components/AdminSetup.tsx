import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Mail, Lock, UserPlus, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user, signUp } = useAuth();
  const { isAdmin, isLoading: rolesLoading } = useUserRoles();

  // Show loading while checking user roles
  if (rolesLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600">Checking admin status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show different content if user is already admin
  if (isAdmin()) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Admin Access Confirmed</span>
            </CardTitle>
            <CardDescription>
              You already have admin privileges for this system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold mb-2 flex items-center space-x-2 text-green-800">
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard Available</span>
              </h3>
              <p className="text-sm text-green-700 mb-3">
                You can now access all administrative features including user management, security monitoring, and system configuration.
              </p>
              <Button asChild className="w-full">
                <a href="/admin">Go to Admin Dashboard</a>
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2 text-blue-800">Available Admin Features:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Stock Management & Inventory Control</li>
                <li>• Order Management & Processing</li>
                <li>• Customer Management</li>
                <li>• Security Audit Logs & Monitoring</li>
                <li>• Product & Category Management</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSetupFirstAdmin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('setup_first_admin');
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Admin role has been assigned successfully.",
      });
      
      // Refresh the page to update admin status
      window.location.reload();
    } catch (error) {
      console.error('Error setting up admin:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set up admin access.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAdminToCurrentUser = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('assign_admin_role', {
        _user_id: user.id
      });
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Admin role has been assigned to your account.",
      });
      
      // Refresh the page to update admin status
      window.location.reload();
    } catch (error) {
      console.error('Error assigning admin role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign admin role.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create the user account
      await signUp(email, password);
      
      toast({
        title: "Success!",
        description: "Admin account created successfully. Please check your email to confirm your account, then sign in.",
      });
      
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowCreateAdmin(false);
    } catch (error: any) {
      console.error('Error creating admin account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Admin Setup</span>
          </CardTitle>
          <CardDescription>
            Set up admin access for user: {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showCreateAdmin ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Make Current User Admin</span>
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Assign admin role to your current account ({user.email}).
                </p>
                <Button 
                  onClick={handleAssignAdminToCurrentUser}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Assigning..." : "Make Me Admin"}
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Create New Admin Account</span>
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Create a new user account and assign admin privileges.
                </p>
                <Button 
                  onClick={() => setShowCreateAdmin(true)}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Create Admin Account
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-yellow-50">
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Setup First Admin</span>
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Make the first registered user (oldest account) an admin.
                </p>
                <Button 
                  onClick={handleSetupFirstAdmin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? "Setting up..." : "Setup First Admin"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateNewAdmin} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setShowCreateAdmin(false)}
                  className="p-2"
                >
                  ← Back
                </Button>
                <h3 className="text-lg font-semibold">Create Admin Account</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin-email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="admin-password" className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Password</span>
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="admin-confirm-password" className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Confirm Password</span>
                  </Label>
                  <Input
                    id="admin-confirm-password"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading || !email || !password || !confirmPassword}
                  className="w-full"
                >
                  {isLoading ? "Creating Account..." : "Create Admin Account"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
