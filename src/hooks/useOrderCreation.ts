
import { useState } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { orderService } from '@/services/orderService';
import { toast } from '@/hooks/use-toast';
import { VATCalculator } from '@/utils/vatCalculator';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

interface OrderItem {
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface OrderRequest {
  customer_id: number;
  items: OrderItem[];
  shipping_address: OrderAddress;
  billing_address: OrderAddress;
  shipping_amount: number;
  shipping_method: string;
}

export const useOrderCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { logSecurityEvent } = useSecurityAudit();

  const createOrder = async (orderData: OrderRequest) => {
    setIsCreating(true);
    
    try {
      console.log('🛒 Creating order with data:', orderData);

      // Calculate totals using VAT-inclusive prices
      const orderTotals = VATCalculator.calculateOrderTotals(
        orderData.items.map(item => ({
          price: item.unit_price, // These are VAT-inclusive
          quantity: item.quantity
        })),
        orderData.shipping_amount // This is also VAT-inclusive
      );

      console.log('💰 Calculated order totals:', orderTotals);

      // Create the order with proper VAT breakdown
      const order = await orderService.createOrder({
        customer_id: orderData.customer_id,
        subtotal: orderTotals.subtotal, // VAT-exclusive subtotal
        vat_amount: orderTotals.vatAmount, // Extracted VAT amount
        shipping_amount: orderData.shipping_amount, // VAT-inclusive shipping
        total_amount: orderTotals.totalAmount, // VAT-inclusive total
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        shipping_method: orderData.shipping_method,
        currency: 'ZAR',
        status: 'pending',
        payment_status: 'pending'
      });

      console.log('📝 Order created:', order);

      // Create order items
      for (const item of orderData.items) {
        await orderService.createOrderItem({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_sku: item.product_sku,
          quantity: item.quantity,
          unit_price: item.unit_price, // VAT-inclusive unit price
          total_price: item.total_price // VAT-inclusive total price
        });
      }

      console.log('📦 Order items created');

      // Send order confirmation email with proper VAT breakdown
      try {
        console.log('📧 Sending order confirmation email...');
        
        const emailData = {
          orderNumber: order.order_number,
          customerName: `${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}`,
          customerEmail: orderData.shipping_address.email,
          orderItems: orderData.items,
          subtotal: orderTotals.subtotal, // VAT-exclusive
          vatAmount: orderTotals.vatAmount, // Extracted VAT
          shippingAmount: orderData.shipping_amount, // VAT-inclusive
          totalAmount: orderTotals.totalAmount, // VAT-inclusive
          shippingAddress: orderData.shipping_address,
          orderDate: new Date().toISOString()
        };

        const { data, error } = await supabaseService.supabase.functions.invoke(
          'send-order-confirmation',
          { body: emailData }
        );

        if (error) {
          console.error('❌ Email error:', error);
          // Don't fail the order creation for email errors
          toast({
            title: 'Order Created',
            description: `Order ${order.order_number} created successfully, but email notification failed.`,
          });
        } else {
          console.log('✅ Order confirmation email sent');
          toast({
            title: 'Order Created Successfully',
            description: `Order ${order.order_number} has been created and confirmation email sent.`,
          });
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't fail the order creation for email errors
        toast({
          title: 'Order Created',
          description: `Order ${order.order_number} created successfully, but email notification failed.`,
        });
      }

      await logSecurityEvent('order_created_with_email', 'order', order.id, {
        orderNumber: order.order_number,
        totalAmount: orderTotals.totalAmount,
        customerEmail: orderData.shipping_address.email
      });

      return order;
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      
      await logSecurityEvent('order_creation_failed', 'order', undefined, {
        error: error instanceof Error ? error.message : 'Unknown error',
        customerEmail: orderData.shipping_address.email
      }, false);

      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createOrder,
    isCreating
  };
};
