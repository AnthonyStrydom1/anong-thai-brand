
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
      console.log('Sending order confirmation email via edge function');
      
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: orderData,
      });

      if (error) {
        console.error('Error invoking send-order-confirmation function:', error);
        throw new Error(`Failed to send order confirmation: ${error.message}`);
      }

      console.log('Order confirmation email sent successfully:', data);
    } catch (error) {
      console.error('Error in sendOrderConfirmation:', error);
      throw error;
    }
  }
}
