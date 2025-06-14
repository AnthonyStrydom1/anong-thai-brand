
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { orderService } from '@/services/orderService';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ShippingRate } from '@/services/shippingService';
import { VATCalculator } from '@/utils/vatCalculator';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

export const useCheckoutForm = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { logSecurityEvent } = useSecurityAudit();

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
    
    // Log input change for security monitoring
    logSecurityEvent('form_input_change', 'checkout', undefined, {
      field: name,
      length: value.length
    });

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate shipping when address fields change
    if ((name === 'city' || name === 'postalCode') && formData.city && formData.postalCode) {
      calculateShipping();
    }
  };

  const calculateShipping = async () => {
    if (!formData.city || !formData.postalCode || items.length === 0) return;

    setIsCalculatingShipping(true);
    try {
      const rates = await orderService.calculateShipping(
        { city: formData.city, postalCode: formData.postalCode },
        items
      );
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedShippingRate(rates[0]);
      }

      await logSecurityEvent('shipping_calculation', 'checkout', undefined, {
        city: formData.city,
        postalCode: formData.postalCode,
        ratesFound: rates.length
      });
    } catch (error) {
      console.error('Error calculating shipping:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    if (!checkRateLimit()) {
      toast({
        title: 'Too Many Requests',
        description: 'Please wait before submitting again.',
        variant: 'destructive'
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to complete your order.',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedShippingRate) {
      toast({
        title: 'Shipping Required',
        description: 'Please select a shipping method.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Validate all form data
      const emailValidation = enhancedSecurityService.validateEmail(formData.email);
      if (!emailValidation.isValid) {
        throw new Error('Invalid email address');
      }

      // Check for SQL injection in all fields
      for (const [key, value] of Object.entries(formData)) {
        const sqlCheck = enhancedSecurityService.containsSqlInjection(value);
        if (!sqlCheck.isValid) {
          await logSecurityEvent('sql_injection_attempt', 'checkout', undefined, {
            field: key,
            value: value.substring(0, 50) // Log first 50 chars only
          }, false);
          throw new Error('Invalid input detected');
        }
      }

      // Get or create customer
      let customer = await supabaseService.getCurrentUserCustomer();
      
      if (!customer) {
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
      }

      // Calculate order totals
      const orderTotals = VATCalculator.calculateOrderTotals(
        items.map(item => ({
          price: item.product.price,
          quantity: item.quantity
        })),
        selectedShippingRate.cost
      );

      // Create order
      const orderData = {
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
          phone: formData.phone
        },
        billing_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        shipping_amount: selectedShippingRate.cost,
        shipping_method: selectedShippingRate.description
      };

      const createdOrder = await orderService.createOrder(orderData);
      setOrderNumber(createdOrder.order_number);

      // Log successful order creation
      await logSecurityEvent('order_created', 'order', createdOrder.id, {
        orderNumber: createdOrder.order_number,
        totalAmount: orderTotals.totalAmount,
        itemCount: items.length
      });

      // Set order submission state
      setOrderSubmitted(true);
      setOrderData({
        orderNumber: createdOrder.order_number,
        total: orderTotals.totalAmount,
        email: formData.email,
        shippingAddress: orderData.shipping_address
      });

      clearCart();

      toast({
        title: 'Order Placed Successfully',
        description: `Your order ${createdOrder.order_number} has been placed.`
      });

    } catch (error) {
      console.error('Checkout error:', error);
      
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
    orderTotals: selectedShippingRate ? VATCalculator.calculateOrderTotals(
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
    )
  };
};
