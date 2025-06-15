
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
      console.log('📧 EmailService: Starting order confirmation email process');
      console.log('📧 EmailService: Validating email data...');
      
      // Validate required data
      if (!orderData.orderNumber) {
        throw new Error('Order number is missing');
      }
      if (!orderData.customerEmail) {
        throw new Error('Customer email is missing');
      }
      if (!orderData.orderItems || orderData.orderItems.length === 0) {
        throw new Error('Order items are missing');
      }
      
      console.log('📧 EmailService: Email data validation passed');
      console.log('📧 EmailService: Sending to:', orderData.customerEmail);
      console.log('📧 EmailService: Order number:', orderData.orderNumber);
      console.log('📧 EmailService: Items count:', orderData.orderItems.length);
      
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: orderData,
      });

      if (error) {
        console.error('📧 EmailService: Supabase function error:', error);
        throw new Error(`Failed to invoke order confirmation function: ${error.message}`);
      }

      console.log('📧 EmailService: Supabase function response:', data);
      console.log('✅ EmailService: Order confirmation email process completed successfully');
    } catch (error) {
      console.error('❌ EmailService: Error in sendOrderConfirmation:', error);
      console.error('❌ EmailService: Error details:', {
        message: error.message,
        stack: error.stack,
        orderNumber: orderData.orderNumber,
        customerEmail: orderData.customerEmail
      });
      throw error;
    }
  }
}
