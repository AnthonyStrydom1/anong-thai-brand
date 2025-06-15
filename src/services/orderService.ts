import { supabaseService } from './supabaseService';
import { VATCalculator } from '@/utils/vatCalculator';
import { shippingService, ShippingRate } from './shippingService';
import type { Database } from "@/integrations/supabase/types";

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CreateOrderData {
  customer_id: number;
  items: OrderItem[];
  shipping_address: any;
  billing_address: any;
  shipping_amount?: number;
  shipping_method?: string;
  notes?: string;
}

export class OrderService {
  private generateOrderNumber(): string {
    // Generate format: ANONG123456 (6 random digits)
    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `ANONG${randomNumber}`;
  }

  async calculateShipping(address: { city: string; postalCode: string }, items: any[]): Promise<ShippingRate[]> {
    // Calculate total weight (simple estimation: 0.5kg per item)
    const totalWeight = items.reduce((total, item) => total + (item.quantity * 0.5), 0);
    
    return shippingService.calculateShipping(address, totalWeight);
  }

  async createOrder(orderData: CreateOrderData) {
    try {
      // Calculate VAT breakdown for the order
      const orderTotals = VATCalculator.calculateOrderTotals(
        orderData.items.map(item => ({
          price: item.unit_price,
          quantity: item.quantity
        })),
        orderData.shipping_amount || 0
      );

      console.log('Order VAT calculation:', orderTotals);

      // Generate order number client-side (will be overridden by DB function if empty)
      const orderNumber = this.generateOrderNumber();
      console.log('Generated order number:', orderNumber);

      // Create the order with proper VAT calculations
      const order: Database['public']['Tables']['orders']['Insert'] = {
        order_number: orderNumber,
        customer_id: orderData.customer_id,
        subtotal: orderTotals.totalExclVAT,
        vat_amount: orderTotals.vatAmount,
        shipping_amount: orderData.shipping_amount || 0,
        total_amount: orderTotals.totalAmount,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        shipping_method: orderData.shipping_method,
        notes: orderData.notes,
        status: 'pending',
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled'
      };

      console.log('Creating order with data:', order);

      // Create the order
      const createdOrder = await supabaseService.createOrder(order);
      console.log('Created order:', createdOrder);

      // Create order items
      for (const item of orderData.items) {
        console.log('Creating order item:', item);
        await supabaseService.createOrderItem({
          order_id: createdOrder.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_sku: item.product_sku,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        });
      }

      console.log('All order items created successfully');
      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string) {
    try {
      return await supabaseService.getOrder(orderId);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async getCustomerOrders(customerId: number) {
    try {
      return await supabaseService.getOrders(customerId);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      return await supabaseService.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    try {
      return await supabaseService.updatePaymentStatus(orderId, paymentStatus);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
