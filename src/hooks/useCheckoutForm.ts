import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { orderService } from '@/services/orderService';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ShippingRate } from '@/services/shippingService';
import { VATCalculator } from '@/utils/vatCalculator';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useOrderCreation } from '@/hooks/useOrderCreation';

export const useCheckoutForm = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { logSecurityEvent } = useSecurityAudit();
  const { createOrder: createOrderWithEmail, isCreating } = useOrderCreation();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [csrfToken] = useState(() => enhancedSecurityService.generateCSRFToken());

  // Rate limiting for form submissions
  const checkRateLimit = () => {
    return enhancedSecurityService.checkRateLimit('checkout_form', {
      maxRequests: 3,
      windowMs: 300000 // 5 minutes
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    console.log('📝 Form input change:', { name, value: value.substring(0, 20) + '...', length: value.length });
    
    // Log input change for security monitoring
    logSecurityEvent('form_input_change', 'checkout', undefined, {
      field: name,
      length: value.length
    });

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      console.log('📋 Updated form data:', Object.keys(updated).reduce((acc, key) => {
        acc[key] = updated[key as keyof typeof updated] ? 'has_value' : 'empty';
        return acc;
      }, {} as Record<string, string>));
      return updated;
    });

    // Auto-calculate shipping when both city and postal code are filled
    if ((name === 'city' || name === 'postalCode') && value.trim()) {
      const newFormData = { ...formData, [name]: value };
      if (newFormData.city && newFormData.postalCode && items.length > 0) {
        console.log('🚚 Triggering shipping calculation...');
        setTimeout(() => calculateShippingForAddress(newFormData.city, newFormData.postalCode), 500);
      }
    }
  };

  const calculateShippingForAddress = async (city: string, postalCode: string) => {
    if (!city || !postalCode || items.length === 0) {
      console.log('⚠️ Missing shipping calculation requirements:', { 
        city, 
        postalCode, 
        itemsCount: items.length 
      });
      return;
    }

    setIsCalculatingShipping(true);
    try {
      console.log('🚚 Calculating shipping for:', { city, postalCode });
      
      const rates = await orderService.calculateShipping(
        { city, postalCode },
        items
      );
      
      console.log('📦 Shipping rates received:', rates);
      setShippingRates(rates);
      
      if (rates.length > 0) {
        setSelectedShippingRate(rates[0]);
        console.log('✅ Auto-selected shipping rate:', rates[0]);
      }

      await logSecurityEvent('shipping_calculation', 'checkout', undefined, {
        city,
        postalCode,
        ratesFound: rates.length
      });
    } catch (error) {
      console.error('❌ Error calculating shipping:', error);
      await logSecurityEvent('shipping_calculation_failed', 'checkout', undefined, {
        error: error instanceof Error ? error.message : 'Unknown error'
      }, false);
      
      toast({
        title: 'Shipping Error',
        description: 'Unable to calculate shipping rates. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const calculateShipping = () => {
    if (formData.city && formData.postalCode) {
      calculateShippingForAddress(formData.city, formData.postalCode);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Check required fields
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.firstName?.trim()) errors.push('First name is required');
    if (!formData.lastName?.trim()) errors.push('Last name is required');
    if (!formData.address?.trim()) errors.push('Address is required');
    if (!formData.city?.trim()) errors.push('City is required');
    if (!formData.postalCode?.trim()) errors.push('Postal code is required');
    if (!formData.phone?.trim()) errors.push('Phone number is required');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (errors.length > 0) {
      console.error('❌ Form validation errors:', errors);
      toast({
        title: 'Form Validation Error',
        description: errors.join(', '),
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🛒 Starting order submission...');
    console.log('📋 Current form data:', formData);
    console.log('🛍️ Cart items:', items);
    console.log('📦 Selected shipping:', selectedShippingRate);

    // Rate limiting check
    if (!checkRateLimit()) {
      toast({
        title: 'Too Many Requests',
        description: 'Please wait before submitting again.',
        variant: 'destructive'
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    if (!user) {
      console.error('❌ No user found');
      toast({
        title: 'Authentication Required',
        description: 'Please log in to complete your order.',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedShippingRate) {
      console.error('❌ No shipping rate selected');
      toast({
        title: 'Shipping Required',
        description: 'Please select a shipping method.',
        variant: 'destructive'
      });
      return;
    }

    if (items.length === 0) {
      console.error('❌ Empty cart');
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty. Please add items before checking out.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    console.log('⏳ Processing order with data:', {
      userEmail: user.email,
      itemCount: items.length,
      shippingCost: selectedShippingRate.cost,
      formData: Object.keys(formData).reduce((acc, key) => {
        acc[key] = formData[key as keyof typeof formData] ? 'filled' : 'empty';
        return acc;
      }, {} as Record<string, string>)
    });

    try {
      // Validate email
      const emailValidation = enhancedSecurityService.validateEmail(formData.email);
      if (!emailValidation.isValid) {
        throw new Error('Invalid email address format');
      }

      // Check for SQL injection in all fields
      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          const sqlCheck = enhancedSecurityService.containsSqlInjection(value);
          if (!sqlCheck.isValid) {
            await logSecurityEvent('sql_injection_attempt', 'checkout', undefined, {
              field: key,
              value: value.substring(0, 50)
            }, false);
            throw new Error('Invalid input detected in form data');
          }
        }
      }

      // Get or create customer
      let customer = await supabaseService.getCurrentUserCustomer();
      console.log('👤 Customer lookup result:', customer ? 'found' : 'not found');
      
      if (!customer) {
        console.log('👤 Creating new customer...');
        const customerData = {
          user_id: user.id,
          fullname: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          is_active: true,
          total_orders: 0,
          total_spent: 0
        };
        customer = await supabaseService.createCustomer(customerData);
        console.log('✅ Customer created:', customer.id);
      }

      // Calculate order totals
      const orderTotals = VATCalculator.calculateOrderTotals(
        items.map(item => ({
          price: item.product.price,
          quantity: item.quantity
        })),
        selectedShippingRate.cost
      );

      console.log('💰 Order totals calculated:', orderTotals);

      // Create order data
      const orderRequestData = {
        customer_id: customer.id,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        })),
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
          email: formData.email // ADD EMAIL TO SHIPPING ADDRESS
        },
        billing_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
          email: formData.email // ADD EMAIL TO BILLING ADDRESS
        },
        shipping_amount: selectedShippingRate.cost,
        shipping_method: selectedShippingRate.description
      };

      console.log('📝 Creating order with data:', {
        customerId: customer.id,
        itemCount: orderRequestData.items.length,
        totalAmount: orderTotals.totalAmount
      });

      console.log('🔄 USING useOrderCreation.createOrder (WITH EMAIL LOGIC)');
      const createdOrder = await createOrderWithEmail(orderRequestData);
      console.log('✅ Order created successfully:', createdOrder.order_number);

      // Log successful order creation
      await logSecurityEvent('order_created', 'order', createdOrder.id, {
        orderNumber: createdOrder.order_number,
        totalAmount: orderTotals.totalAmount,
        itemCount: items.length
      });

      // Prepare order success data with proper structure
      const successOrderData = {
        orderNumber: createdOrder.order_number,
        total: orderTotals.totalAmount,
        items: items.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price
          },
          quantity: item.quantity
        })),
        customerInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      };

      console.log('📄 Setting order success data:', successOrderData);

      // Set order data and mark as submitted
      setOrderNumber(createdOrder.order_number);
      setOrderData(successOrderData);
      setOrderSubmitted(true);

      // Clear cart after successful order
      clearCart();
      console.log('🛒 Cart cleared');

      toast({
        title: 'Order Placed Successfully',
        description: `Your order ${createdOrder.order_number} has been placed.`
      });

    } catch (error) {
      console.error('❌ Checkout error:', error);
      
      await logSecurityEvent('checkout_failed', 'order', undefined, {
        error: error instanceof Error ? error.message : 'Unknown error',
        formData: {
          email: formData.email,
          hasFirstName: !!formData.firstName,
          hasLastName: !!formData.lastName,
          hasAddress: !!formData.address
        }
      }, false);

      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate order totals for display
  const orderTotals = selectedShippingRate ? VATCalculator.calculateOrderTotals(
    items.map(item => ({
      price: item.product.price,
      quantity: item.quantity
    })),
    selectedShippingRate.cost
  ) : VATCalculator.calculateOrderTotals(
    items.map(item => ({
      price: item.product.price,
      quantity: item.quantity
    })),
    0
  );

  return {
    formData,
    shippingRates,
    selectedShippingRate,
    isCalculatingShipping,
    isProcessing,
    orderNumber,
    orderSubmitted,
    orderData,
    handleInputChange,
    setSelectedShippingRate,
    handleSubmit,
    calculateShipping,
    orderTotals
  };
};
