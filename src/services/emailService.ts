
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
      console.log('EmailService: Sending order confirmation email via edge function');
      console.log('EmailService: Order data:', {
        orderNumber: orderData.orderNumber,
        customerEmail: orderData.customerEmail,
        itemCount: orderData.orderItems.length
      });
      
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: orderData,
      });

      if (error) {
        console.error('EmailService: Error invoking send-order-confirmation function:', error);
        throw new Error(`Failed to send order confirmation: ${error.message}`);
      }

      console.log('EmailService: Order confirmation email sent successfully:', data);
    } catch (error) {
      console.error('EmailService: Error in sendOrderConfirmation:', error);
      throw error;
    }
  }
}
