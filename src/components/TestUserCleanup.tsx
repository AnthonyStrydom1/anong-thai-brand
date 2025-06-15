
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const TestUserCleanup = () => {
  const [email, setEmail] = useState('anthonys@hpd.co.za');
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanup = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🧹 Starting user cleanup for:', email);
      
      const { data, error } = await supabase.functions.invoke('cleanup-test-user', {
        body: { email: email.trim() }
      });

      console.log('🧹 Cleanup response:', { data, error });

      if (error) {
        console.error('🧹 Cleanup error:', error);
        throw new Error(error.message || 'Failed to cleanup user');
      }

      console.log('✅ Cleanup successful:', data);
      
      toast({
        title: "Success!",
        description: `User ${email} has been completely removed from all tables.`,
      });

    } catch (error: any) {
      console.error('❌ Cleanup failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cleanup user. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test User Cleanup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email to cleanup:
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        
        <Button 
          onClick={handleCleanup}
          disabled={isLoading || !email.trim()}
          className="w-full"
        >
          {isLoading ? 'Cleaning up...' : 'Cleanup User'}
        </Button>
        
        <p className="text-xs text-gray-500">
          This will remove the user from all tables including auth, profiles, customers, user_roles, and mfa_challenges.
        </p>
      </CardContent>
    </Card>
  );
};

export default TestUserCleanup;
