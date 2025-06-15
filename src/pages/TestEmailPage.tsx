
import React from 'react';
import NavigationBanner from '@/components/NavigationBanner';
import TestWelcomeEmail from '@/components/TestWelcomeEmail';

const TestEmailPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBanner />
      <div className="flex-1 container mx-auto py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Test Welcome Email</h1>
        <TestWelcomeEmail />
        <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2">Debugging Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open browser developer tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Click "Send Test Welcome Email" above</li>
            <li>Watch for detailed logs starting with 👋 or ❌</li>
            <li>Check your email inbox and spam folder</li>
            <li>If still no email, check Resend dashboard at resend.com</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestEmailPage;
