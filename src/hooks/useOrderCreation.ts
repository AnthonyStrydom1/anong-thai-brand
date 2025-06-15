
import { useState } from 'react';
import { orderService, type CreateOrderData } from '@/services/orderService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useOrderCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createOrder = async (orderData: CreateOrderData) => {
    setIsCreating(true);
    console.log('🚀 === ORDER CREATION START ===');
    console.log('🚀 Starting order creation process...');
    
    try {
      const order = await orderService.createOrder(orderData);
      console.log('✅ Order created successfully:', order);
      
      toast({
        title: "Order Created Successfully",
        description: `Order ${order.order_number} has been created.`,
      });

      // IMMEDIATE EMAIL SENDING - EXECUTE RIGHT HERE
      console.log('📧 === EMAIL SENDING PROCESS START ===');
      console.log('📧 Starting email process for order:', order.order_number);
      
      // Get customer email from form data
      const customerEmail = orderData.billing_address?.email || orderData.shipping_address?.email;
      console.log('📧 Customer email found:', customerEmail);
      
      if (!customerEmail) {
        console.error('📧 ERROR: No customer email available');
        toast({
          title: "Order Created",
          description: "Order created successfully, but no email address found for confirmation.",
          variant: "destructive",
        });
      } else {
        // Prepare email data structure
        const emailData = {
          orderNumber: order.order_number,
          customerName: `${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}`,
          customerEmail: customerEmail,
          orderItems: orderData.items.map(item => ({
            product_name: item.product_name,
            product_sku: item.product_sku,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
          })),
          subtotal: order.subtotal,
          vatAmount: order.vat_amount || 0,
          shippingAmount: order.shipping_amount || 0,
          totalAmount: order.total_amount,
          shippingAddress: {
            firstName: orderData.shipping_address.firstName,
            lastName: orderData.shipping_address.lastName,
            address: orderData.shipping_address.address,
            city: orderData.shipping_address.city,
            postalCode: orderData.shipping_address.postalCode,
            phone: orderData.shipping_address.phone,
          },
          orderDate: order.created_at || new Date().toISOString(),
        };

        console.log('📧 Email data prepared for:', customerEmail);
        console.log('📧 Email data structure:', emailData);
        console.log('📧 Calling Supabase function send-order-confirmation...');
        
        try {
          const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-order-confirmation', {
            body: emailData,
          });

          if (emailError) {
            console.error('❌ Email function error:', emailError);
            console.error('❌ Email error details:', emailError.message, emailError.stack);
            throw emailError;
          }

          console.log('✅ Email sent successfully:', emailResult);
          
          toast({
            title: "Confirmation Email Sent",
            description: "Order confirmation has been sent to your email.",
          });
          
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError);
          console.error('❌ Email error message:', emailError?.message);
          console.error('❌ Email error details:', emailError);
          
          toast({
            title: "Order Created",
            description: "Order created successfully, but confirmation email failed to send.",
            variant: "destructive",
          });
        }
      }
      
      console.log('📧 === EMAIL SENDING PROCESS END ===');
      console.log('🚀 === ORDER CREATION END ===');
      
      return order;
      
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      toast({
        title: "Order Creation Failed",
        description: "There was an error creating your order. Please try again.",
        variant: "destructive",
      });
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
