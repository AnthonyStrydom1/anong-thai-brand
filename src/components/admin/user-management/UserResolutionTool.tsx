
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthUser {
  id: string;
  email?: string;
  raw_user_meta_data?: any;
}

interface UserInfo {
  email: string;
  hasAuthUser: boolean;
  authUserId?: string;
  hasCustomer: boolean;
  customerId?: number;
  customerUserId?: string;
  hasProfile: boolean;
  profileId?: string;
  authUser?: AuthUser;
  customer?: any;
  profile?: any;
}

const UserResolutionTool = () => {
  const [email, setEmail] = useState('anthonys@hpd.co.za');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const checkUserStatus = async () => {
    setIsLoading(true);
    try {
      // Normalize email to lowercase for consistent checking
      const normalizedEmail = email.toLowerCase().trim();
      
      // Check if customer exists
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      // Check if auth user exists
      const { data: authUsersResponse, error: authError } = await supabase.auth.admin.listUsers();
      const authUser = authUsersResponse?.users?.find((user: AuthUser) => 
        user.email?.toLowerCase() === normalizedEmail
      );

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      setUserInfo({
        email: normalizedEmail,
        hasAuthUser: !!authUser,
        authUserId: authUser?.id,
        hasCustomer: !!customer,
        customerId: customer?.id,
        customerUserId: customer?.user_id,
        hasProfile: !!profile,
        profileId: profile?.id,
        authUser,
        customer,
        profile
      });

      console.log('User status check:', {
        originalEmail: email,
        normalizedEmail,
        hasAuthUser: !!authUser,
        hasCustomer: !!customer,
        hasProfile: !!profile,
        authUserEmail: authUser?.email
      });

    } catch (error: any) {
      console.error('Error checking user status:', error);
      toast({
        title: "Error",
        description: "Failed to check user status: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createMissingRecords = async () => {
    if (!userInfo || !userInfo.hasAuthUser || !userInfo.authUser) {
      toast({
        title: "Error",
        description: "No auth user found to create records for",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const authUser = userInfo.authUser;

      // Create profile if missing
      if (!userInfo.hasProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email,
            first_name: authUser.raw_user_meta_data?.first_name,
            last_name: authUser.raw_user_meta_data?.last_name
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('Profile created successfully');
        }
      }

      // Create customer if missing
      if (!userInfo.hasCustomer) {
        const firstName = authUser.raw_user_meta_data?.first_name || '';
        const lastName = authUser.raw_user_meta_data?.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || authUser.email || '';

        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            user_id: authUser.id,
            fullname: fullName,
            email: authUser.email,
            first_name: firstName,
            last_name: lastName
          });

        if (customerError) {
          console.error('Customer creation error:', customerError);
          throw customerError;
        } else {
          console.log('Customer created successfully');
        }
      }

      toast({
        title: "Success!",
        description: "Missing records created successfully",
      });

      // Refresh user info
      await checkUserStatus();

    } catch (error: any) {
      console.error('Error creating missing records:', error);
      toast({
        title: "Error",
        description: "Failed to create missing records: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Resolution Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={checkUserStatus} disabled={isLoading}>
            Check Status
          </Button>
        </div>

        {userInfo && (
          <div className="space-y-3">
            <Alert>
              <AlertDescription>
                <strong>User Status for {userInfo.email}:</strong>
                <ul className="mt-2 space-y-1">
                  <li>✅ Auth User: {userInfo.hasAuthUser ? 'EXISTS' : 'MISSING'} {userInfo.authUserId && `(ID: ${userInfo.authUserId})`}</li>
                  <li>✅ Customer: {userInfo.hasCustomer ? 'EXISTS' : 'MISSING'} {userInfo.customerId && `(ID: ${userInfo.customerId})`}</li>
                  <li>✅ Profile: {userInfo.hasProfile ? 'EXISTS' : 'MISSING'} {userInfo.profileId && `(ID: ${userInfo.profileId})`}</li>
                </ul>
                {userInfo.authUser?.email && (
                  <p className="mt-2 text-sm text-gray-600">
                    Auth user email: {userInfo.authUser.email}
                  </p>
                )}
              </AlertDescription>
            </Alert>

            {userInfo.hasAuthUser && (!userInfo.hasCustomer || !userInfo.hasProfile) && (
              <Button onClick={createMissingRecords} disabled={isLoading}>
                Create Missing Records
              </Button>
            )}

            {!userInfo.hasAuthUser && (
              <Alert>
                <AlertDescription>
                  This user doesn't exist in auth. They need to sign up first or you need to create them through the admin user creation tool.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserResolutionTool;
