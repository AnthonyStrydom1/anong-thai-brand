
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WelcomeEmailService } from '@/services/welcomeEmailService';
import { toast } from '@/hooks/use-toast';

const TestWelcomeEmail = () => {
  const [email, setEmail] = useState('mariobad002@gmail.com');
  const [name, setName] = useState('Mario Test');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing welcome email for:', { email, name });
      
      await WelcomeEmailService.sendWelcomeEmail({
        customerEmail: email,
        customerName: name
      });
      
      toast({
        title: "Test Email Sent!",
        description: `Welcome email sent to ${email}. Check console for detailed logs.`
      });
    } catch (error: any) {
      console.error('❌ Test email failed:', error);
      toast({
        title: "Test Email Failed",
        description: error.message || "Failed to send test email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Test Welcome Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter test email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter test name"
          />
        </div>
        <Button 
          onClick={handleTestEmail} 
          disabled={isLoading || !email || !name}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Test Welcome Email'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestWelcomeEmail;
