
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { orderService, CreateOrderData } from "@/services/orderService";
import { ShippingRate } from "@/services/shippingService";
import { useCart } from "@/contexts/CartContext";
import { VATCalculator } from "@/utils/vatCalculator";

export const useCheckoutForm = () => {
  const { items, clearCart } = useCart();
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Calculate shipping when address changes
  useEffect(() => {
    if (formData.city && formData.postalCode && items.length > 0) {
      calculateShipping();
    }
  }, [formData.city, formData.postalCode, items]);

  const calculateShipping = async () => {
    if (!formData.city || !formData.postalCode) return;
    
    setIsCalculatingShipping(true);
    try {
      const rates = await orderService.calculateShipping(formData, items);
      setShippingRates(rates);
      if (rates.length > 0 && !selectedShippingRate) {
        setSelectedShippingRate(rates[0]);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      toast({
        title: "Shipping Error",
        description: "Could not calculate shipping rates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, t: any) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: t.authRequired,
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Validate form data
      const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode', 'phone'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      if (!selectedShippingRate) {
        toast({
          title: "Shipping Required",
          description: "Please select a shipping method.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Get customer ID from the customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError || !customerData) {
        toast({
          title: "Customer Error",
          description: "Could not find customer information. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Format shipping and billing addresses
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone
      };

      // Create order data in the correct format
      const orderDataForSubmission: CreateOrderData = {
        customer_id: customerData.id,
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        })),
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        shipping_amount: selectedShippingRate.cost,
        shipping_method: selectedShippingRate.description,
        notes: `Payment method: EFT Bank Transfer`
      };

      const order = await orderService.createOrder(orderDataForSubmission);
      
      const orderTotals = VATCalculator.calculateOrderTotals(
        items.map(item => ({ price: item.product.price, quantity: item.quantity })),
        selectedShippingRate.cost
      );

      const orderResult = {
        orderNumber: order.order_number,
        items: items,
        total: orderTotals.totalAmount,
        customerInfo: formData,
        shippingCost: selectedShippingRate.cost,
        vatAmount: orderTotals.vatAmount
      };

      setOrderData(orderResult);
      setOrderSubmitted(true);
      clearCart();
      
      toast({
        title: "Order Created Successfully!",
        description: `Your order #${order.order_number} has been created. Please proceed with EFT payment.`,
      });

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return {
    formData,
    orderSubmitted,
    orderData,
    isProcessing,
    shippingRates,
    selectedShippingRate,
    setSelectedShippingRate,
    isCalculatingShipping,
    handleInputChange,
    handleSubmit
  };
};
