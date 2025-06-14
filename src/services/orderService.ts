
import { supabaseService } from './supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { shippingService, ShippingRate } from './shippingService';
import { VATCalculator } from '@/utils/vatCalculator';

interface CreateOrderData {
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      weight?: number;
    };
    quantity: number;
  }>;
  total: number;
  selectedShipping?: ShippingRate;
}

export class OrderService {
  // Generate order number in the frontend as fallback
  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}-${randomNum}`;
  }

  // Calculate shipping rates for an order
  async calculateShipping(customerInfo: CreateOrderData['customerInfo'], items: CreateOrderData['items']): Promise<ShippingRate[]> {
    const totalWeight = items.reduce((weight, item) => weight + (item.product.weight || 0.5) * item.quantity, 0);
    
    return shippingService.calculateShipping({
      city: customerInfo.city,
      postalCode: customerInfo.postalCode
    }, totalWeight);
  }

  async createOrder(orderData: CreateOrderData) {
    try {
      console.log('Starting order creation process...');
      console.log('Order data received:', orderData);
      
      // Get current user
      console.log('Getting current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('User not authenticated');
      }

      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }
      console.log('User authenticated:', user.id);

      // Get or create customer
      console.log('Getting or creating customer...');
      let customer = await supabaseService.getCurrentUserCustomer();
      
      if (!customer) {
        console.log('Customer not found, creating new customer...');
        try {
          customer = await supabaseService.createCustomer({
            fullname: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            email: orderData.customerInfo.email,
            first_name: orderData.customerInfo.firstName,
            last_name: orderData.customerInfo.lastName,
            phone: orderData.customerInfo.phone,
            total_orders: 0,
            total_spent: 0,
            is_active: true,
            user_id: user.id
          });
          console.log('Customer created successfully:', customer);
        } catch (customerError) {
          console.error('Failed to create customer:', customerError);
          throw new Error('Failed to create customer profile');
        }
      } else {
        console.log('Existing customer found:', customer.id);
      }

      // Calculate order totals with VAT breakdown
      const shippingCost = orderData.selectedShipping?.cost || 0;
      const totals = VATCalculator.calculateOrderTotals(
        orderData.items.map(item => ({ price: item.product.price, quantity: item.quantity })),
        shippingCost
      );

      const order_number = this.generateOrderNumber();

      console.log('Order calculations with VAT:', {
        ...totals,
        order_number,
        shipping_method: orderData.selectedShipping?.description || 'Standard Shipping'
      });

      // Create order
      console.log('Creating order...');
      const orderInsertData = {
        customer_id: customer.id,
        status: 'pending',
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
        subtotal: totals.subtotal,
        vat_amount: totals.vatAmount,
        shipping_amount: totals.shippingAmount,
        tax_amount: 0, // Keep for compatibility, VAT is handled separately
        discount_amount: 0,
        total_amount: totals.totalAmount,
        currency: 'ZAR',
        order_number: order_number,
        shipping_method: orderData.selectedShipping?.description || 'Standard Shipping',
        courier_service: 'courier_guy',
        estimated_delivery_days: orderData.selectedShipping?.estimatedDays || 3,
        billing_address: {
          first_name: orderData.customerInfo.firstName,
          last_name: orderData.customerInfo.lastName,
          address: orderData.customerInfo.address,
          city: orderData.customerInfo.city,
          postal_code: orderData.customerInfo.postalCode,
          phone: orderData.customerInfo.phone
        },
        shipping_address: {
          first_name: orderData.customerInfo.firstName,
          last_name: orderData.customerInfo.lastName,
          address: orderData.customerInfo.address,
          city: orderData.customerInfo.city,
          postal_code: orderData.customerInfo.postalCode,
          phone: orderData.customerInfo.phone
        }
      };

      console.log('Inserting order with data:', orderInsertData);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsertData)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error details:', {
          error: orderError,
          code: orderError.code,
          message: orderError.message,
          details: orderError.details,
          hint: orderError.hint
        });
        throw new Error(`Database error: ${orderError.message}`);
      }

      console.log('Order created successfully:', order);

      // Create order items
      console.log('Creating order items...');
      for (const [index, item] of orderData.items.entries()) {
        console.log(`Creating order item ${index + 1}:`, item);
        
        const orderItemData = {
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.id, // Using ID as SKU for now
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        };

        const { data: orderItem, error: itemError } = await supabase
          .from('order_items')
          .insert(orderItemData)
          .select()
          .single();

        if (itemError) {
          console.error(`Order item ${index + 1} creation error:`, itemError);
          throw new Error(`Failed to create order item: ${itemError.message}`);
        }

        console.log(`Order item ${index + 1} created:`, orderItem);
      }

      console.log('Order creation completed successfully');
      return order;
    } catch (error) {
      console.error('Order creation failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while creating the order');
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await supabaseService.getOrder(orderId);
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async getUserOrders() {
    try {
      console.log('Getting user orders...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('User not authenticated');
      }

      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }

      console.log('Fetching orders for user:', user.id);
      
      // Use the Supabase function to get customer orders
      const { data: orders, error } = await supabase
        .rpc('get_customer_orders', { user_uuid: user.id });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Fetched orders:', orders);
      return orders || [];
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
