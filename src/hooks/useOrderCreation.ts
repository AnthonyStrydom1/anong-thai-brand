
import { useState } from 'react';
import { orderService, type CreateOrderData } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

export const useOrderCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createOrder = async (orderData: CreateOrderData) => {
    setIsCreating(true);
    try {
      const order = await orderService.createOrder(orderData);
      
      toast({
        title: "Order Created Successfully",
        description: `Order ${order.order_number} has been created.`,
      });
      
      return order;
    } catch (error) {
      console.error('Failed to create order:', error);
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
