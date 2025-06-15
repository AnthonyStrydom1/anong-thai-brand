
import { supabase } from '@/lib/supabase';

interface WelcomeEmailData {
  customerName: string;
  customerEmail: string;
}

export class WelcomeEmailService {
  static async sendWelcomeEmail(emailData: WelcomeEmailData): Promise<void> {
    try {
      console.log('👋 === WelcomeEmailService.sendWelcomeEmail START ===');
      console.log('👋 WelcomeEmailService: Starting welcome email process');
      console.log('👋 WelcomeEmailService: Received emailData:', {
        customerName: emailData.customerName,
        customerEmail: emailData.customerEmail
      });
      
      // Validate required data
      if (!emailData.customerEmail) {
        console.error('👋 WelcomeEmailService: Customer email is missing');
        throw new Error('Customer email is missing');
      }
      if (!emailData.customerName) {
        console.error('👋 WelcomeEmailService: Customer name is missing');
        throw new Error('Customer name is missing');
      }
      
      console.log('👋 WelcomeEmailService: About to call supabase.functions.invoke...');
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: emailData,
      });

      console.log('👋 WelcomeEmailService: Supabase function invoke completed');
      console.log('👋 WelcomeEmailService: Response data:', data);
      console.log('👋 WelcomeEmailService: Response error:', error);

      if (error) {
        console.error('👋 WelcomeEmailService: Supabase function error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          details: error
        });
        throw new Error(`Failed to invoke welcome email function: ${error.message}`);
      }

      console.log('✅ WelcomeEmailService: Welcome email process completed successfully');
      console.log('👋 === WelcomeEmailService.sendWelcomeEmail END ===');
      
      return data;
    } catch (error: any) {
      console.error('❌ === WelcomeEmailService ERROR ===');
      console.error('❌ WelcomeEmailService: Error in sendWelcomeEmail:', error);
      console.error('❌ WelcomeEmailService: Error details:', {
        message: error?.message || 'Unknown error message',
        stack: error?.stack || 'No stack trace available',
        customerEmail: emailData?.customerEmail || 'No customer email',
        errorType: typeof error,
        errorName: error?.name || 'Unknown error name'
      });
      console.error('❌ === WelcomeEmailService ERROR END ===');
      throw error;
    }
  }
}
