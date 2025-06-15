
import { useState } from 'react';
import { orderService, type CreateOrderData } from '@/services/orderService';
import { EmailService } from '@/services/emailService';
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

      console.log('📧 === EMAIL SENDING PROCESS START ===');
      console.log('📧 About to start email sending process');
      console.log('📧 Preparing to send order confirmation email for order:', order.order_number);
      
      // Validate email address
      const customerEmail = orderData.billing_address.email || orderData.shipping_address.email;
      console.log('📧 Customer email identified:', customerEmail);
      
      if (!customerEmail) {
        console.error('📧 ERROR: No customer email found in billing or shipping address');
        console.error('📧 Billing address:', orderData.billing_address);
        console.error('📧 Shipping address:', orderData.shipping_address);
        
        toast({
          title: "Order Created",
          description: "Order created successfully, but no email address found for confirmation.",
          variant: "destructive",
        });
        
        console.log('🚀 === ORDER CREATION END (no email) ===');
        return order;
      }
      
      // Prepare email data
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

      console.log('📧 Email data prepared successfully:', {
        orderNumber: emailData.orderNumber,
        customerEmail: emailData.customerEmail,
        itemCount: emailData.orderItems.length,
        totalAmount: emailData.totalAmount,
        hasValidEmail: !!emailData.customerEmail && emailData.customerEmail.includes('@')
      });

      console.log('📧 About to call EmailService.sendOrderConfirmation...');
      console.log('📧 Full email data being sent:', emailData);
      
      try {
        const emailResult = await EmailService.sendOrderConfirmation(emailData);
        console.log('📧 EmailService.sendOrderConfirmation returned:', emailResult);
        console.log('✅ Order confirmation email sent successfully');
        
        toast({
          title: "Confirmation Email Sent",
          description: "Order confirmation has been sent to your email.",
        });
      } catch (emailError) {
        console.error('❌ === EMAIL SENDING FAILED ===');
        console.error('❌ Failed to send order confirmation email:', emailError);
        console.error('❌ Email error details:', {
          message: emailError?.message || 'Unknown error',
          stack: emailError?.stack || 'No stack trace',
          name: emailError?.name || 'Unknown error type',
          toString: emailError?.toString() || 'Cannot convert to string'
        });
        console.error('❌ Full error object:', emailError);
        
        toast({
          title: "Order Created",
          description: "Order created successfully, but confirmation email failed to send. Please check your spam folder or contact support.",
          variant: "destructive",
        });
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
