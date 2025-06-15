
import { supabase } from '@/lib/supabase';

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderItems: Array<{
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  subtotal: number;
  vatAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  orderDate: string;
}

export class EmailService {
  static async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
    try {
      console.log('📧 === EmailService.sendOrderConfirmation START ===');
      console.log('📧 EmailService: Starting order confirmation email process');
      console.log('📧 EmailService: Received orderData:', {
        orderNumber: orderData.orderNumber,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        itemsCount: orderData.orderItems?.length,
        subtotal: orderData.subtotal,
        totalAmount: orderData.totalAmount
      });
      
      console.log('📧 EmailService: Validating email data...');
      
      // Validate required data
      if (!orderData.orderNumber) {
        console.error('📧 EmailService: Order number is missing');
        throw new Error('Order number is missing');
      }
      if (!orderData.customerEmail) {
        console.error('📧 EmailService: Customer email is missing');
        throw new Error('Customer email is missing');
      }
      if (!orderData.orderItems || orderData.orderItems.length === 0) {
        console.error('📧 EmailService: Order items are missing or empty');
        throw new Error('Order items are missing');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(orderData.customerEmail)) {
        console.error('📧 EmailService: Invalid email format:', orderData.customerEmail);
        throw new Error('Invalid email format');
      }
      
      console.log('📧 EmailService: Email data validation passed');
      console.log('📧 EmailService: Sending to:', orderData.customerEmail);
      console.log('📧 EmailService: Order number:', orderData.orderNumber);
      console.log('📧 EmailService: Items count:', orderData.orderItems.length);
      
      console.log('📧 EmailService: About to call supabase.functions.invoke...');
      console.log('📧 EmailService: Supabase client status:', {
        hasSupabase: !!supabase,
        hasFunctions: !!supabase?.functions,
        hasInvoke: !!supabase?.functions?.invoke
      });
      
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: orderData,
      });

      console.log('📧 EmailService: Supabase function invoke completed');
      console.log('📧 EmailService: Response data:', data);
      console.log('📧 EmailService: Response error:', error);

      if (error) {
        console.error('📧 EmailService: Supabase function error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          details: error
        });
        throw new Error(`Failed to invoke order confirmation function: ${error.message}`);
      }

      console.log('📧 EmailService: Supabase function response:', data);
      console.log('✅ EmailService: Order confirmation email process completed successfully');
      console.log('📧 === EmailService.sendOrderConfirmation END ===');
      
      return data;
    } catch (error) {
      console.error('❌ === EmailService ERROR ===');
      console.error('❌ EmailService: Error in sendOrderConfirmation:', error);
      console.error('❌ EmailService: Error details:', {
        message: error?.message || 'Unknown error message',
        stack: error?.stack || 'No stack trace available',
        orderNumber: orderData?.orderNumber || 'No order number',
        customerEmail: orderData?.customerEmail || 'No customer email',
        errorType: typeof error,
        errorName: error?.name || 'Unknown error name',
        errorToString: error?.toString ? error.toString() : 'Cannot convert to string'
      });
      console.error('❌ EmailService: Full error object:', error);
      console.error('❌ === EmailService ERROR END ===');
      throw error;
    }
  }
}
