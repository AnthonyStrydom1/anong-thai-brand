
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseService } from '@/services/supabaseService';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import type { Database } from '@/integrations/supabase/types';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AddressInfo {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CheckoutFormData {
  contactInfo: ContactInfo;
  shippingAddress: AddressInfo;
  billingAddress: AddressInfo;
  useSameAddress: boolean;
  paymentMethod: 'bank-transfer' | 'credit-card';
  shippingMethod: 'standard' | 'express';
  notes?: string;
}

export const useCheckoutForm = () => {
  const { user } = useAuth();
  const { items, clearCart, getTotalPrice } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<CheckoutFormData>({
    contactInfo: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
    },
    shippingAddress: {
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'ZA',
    },
    billingAddress: {
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'ZA',
    },
    useSameAddress: true,
    paymentMethod: 'bank-transfer',
    shippingMethod: 'standard',
    notes: '',
  });

  const updateFormData = useCallback((section: keyof CheckoutFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  const calculateTotals = useCallback(() => {
    const subtotal = getTotalPrice();
    const taxRate = 0.15; // 15% VAT for South Africa
    const taxAmount = subtotal * taxRate;
    
    // Shipping costs based on method
    const shippingRates = {
      standard: 50,
      express: 150,
    };
    
    const shippingAmount = shippingRates[formData.shippingMethod];
    const totalAmount = subtotal + taxAmount + shippingAmount;

    return {
      subtotal,
      taxAmount,
      vatAmount: taxAmount, // VAT is the tax in South Africa
      shippingAmount,
      totalAmount,
    };
  }, [getTotalPrice, formData.shippingMethod]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const submitOrder = useCallback(async (): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    setIsSubmitting(true);

    try {
      // Get or create customer
      let customer = await supabaseService.getCurrentUserCustomer();
      
      if (!customer) {
        // Create new customer
        const customerData = {
          user_id: user.id,
          fullname: `${formData.contactInfo.firstName} ${formData.contactInfo.lastName}`,
          email: formData.contactInfo.email,
          first_name: formData.contactInfo.firstName,
          last_name: formData.contactInfo.lastName,
          phone: formData.contactInfo.phone,
          is_active: true,
          total_orders: 0,
          total_spent: 0,
          date_of_birth: null,
          last_order_date: null,
          marketing_consent: false,
        };
        
        customer = await supabaseService.createCustomer(customerData);
      }

      const totals = calculateTotals();
      
      // Determine addresses
      const shippingAddress = formData.shippingAddress;
      const billingAddress = formData.useSameAddress ? formData.shippingAddress : formData.billingAddress;

      // Create order
      const orderData: OrderInsert = {
        customer_id: customer.id,
        status: 'pending',
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        vat_amount: totals.vatAmount,
        shipping_amount: totals.shippingAmount,
        discount_amount: 0,
        total_amount: totals.totalAmount,
        currency: 'ZAR',
        shipping_method: formData.shippingMethod,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        notes: formData.notes || null,
        courier_service: 'courier_guy',
        estimated_delivery_days: formData.shippingMethod === 'express' ? 2 : 5,
      };

      const order = await supabaseService.createOrder(orderData);

      // Create order items
      for (const item of items) {
        const orderItemData: OrderItemInsert = {
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity,
        };

        await supabaseService.createOrderItem(orderItemData);
      }

      // Clear cart
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Your order has been placed. Order number: ${order.order_number}`,
      });

      return { success: true, orderId: order.id };

    } catch (error) {
      console.error('Error submitting order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      
      toast({
        title: "Error placing order",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [user, items, formData, calculateTotals, clearCart]);

  return {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    submitOrder,
    isSubmitting,
    calculateTotals,
  };
};
