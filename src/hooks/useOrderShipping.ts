
import { useState } from 'react';
import { enhancedShippingService } from '@/services/shipping/enhancedShippingService';
import { orderService } from '@/services/orders/orderService';
import { toast } from '@/hooks/use-toast';

export const useOrderShipping = () => {
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  const createShipmentForOrder = async (orderId: string) => {
    setIsCreatingShipment(true);
    
    try {
      // Get order details
      const order = await orderService.getOrder(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Parse shipping address
      const shippingAddress = typeof order.shipping_address === 'string' 
        ? JSON.parse(order.shipping_address) 
        : order.shipping_address;

      // Create shipment details
      const shipmentDetails = {
        orderId: order.id,
        orderNumber: order.order_number,
        weight: 1, // Default weight - should be calculated from order items
        dimensions: { length: 30, width: 20, height: 15 }, // Default dimensions
        declaredValue: order.total_amount,
        specialInstructions: `Order #${order.order_number}`
      };

      // Determine service type based on shipping method
      let serviceType = 'courier_guy_standard';
      if (order.shipping_method?.includes('express')) {
        serviceType = 'courier_guy_express';
      } else if (order.shipping_method?.includes('overnight')) {
        serviceType = 'courier_guy_overnight';
      }

      const result = await enhancedShippingService.createShipment(
        shippingAddress,
        shipmentDetails,
        serviceType
      );

      if (result.success && result.waybillNumber) {
        // Update order with tracking information
        await orderService.updateOrderStatus(orderId, 'shipped');
        // Note: You may need to add a method to update tracking number
        // await orderService.updateTrackingNumber(orderId, result.waybillNumber);
        
        toast({
          title: "Shipment Created",
          description: `Waybill ${result.waybillNumber} created successfully`,
        });

        return {
          success: true,
          waybillNumber: result.waybillNumber,
          trackingUrl: result.trackingUrl
        };
      } else {
        toast({
          title: "Manual Shipment Required",
          description: "Please create the shipment manually with Courier Guy",
          variant: "destructive"
        });

        return {
          success: false,
          requiresManualCreation: true
        };
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast({
        title: "Shipment Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });

      return { success: false, error };
    } finally {
      setIsCreatingShipment(false);
    }
  };

  const getShippingStatus = () => {
    const isApiEnabled = enhancedShippingService.isApiIntegrationEnabled();
    
    return {
      isApiEnabled,
      message: isApiEnabled 
        ? "Courier Guy API integration active" 
        : "Using estimated rates - API integration available"
    };
  };

  return {
    createShipmentForOrder,
    isCreatingShipment,
    getShippingStatus
  };
};
