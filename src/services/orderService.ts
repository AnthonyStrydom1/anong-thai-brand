
import { supabaseService } from './supabaseService';
import { supabase } from '@/integrations/supabase/client';

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
    };
    quantity: number;
  }>;
  total: number;
}

export class OrderService {
  // Generate order number in the frontend as fallback
  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}-${randomNum}`;
  }

  async createOrder(orderData: CreateOrderData) {
    try {
      console.log('Creating order with data:', orderData);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('User not authenticated');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get or create customer
      let customer = await supabaseService.getCurrentUserCustomer();
      
      if (!customer) {
        console.log('Creating new customer for user:', user.id);
        // Create customer if doesn't exist
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
        console.log('Customer created:', customer);
      }

      // Calculate totals
      const subtotal = orderData.total;
      const shipping_amount = 0; // Free shipping
      const tax_amount = 0; // No tax for now
      const total_amount = subtotal + shipping_amount + tax_amount;

      // Generate order number since the DB function doesn't exist
      const order_number = this.generateOrderNumber();

      // Create order directly using supabase client
      const orderInsertData = {
        customer_id: customer.id,
        status: 'pending',
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
        subtotal: subtotal,
        shipping_amount: shipping_amount,
        tax_amount: tax_amount,
        discount_amount: 0,
        total_amount: total_amount,
        currency: 'USD',
        order_number: order_number,
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
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      console.log('Order created successfully:', order);

      // Create order items
      for (const item of orderData.items) {
        console.log('Creating order item:', item);
        
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
          console.error('Order item creation error:', itemError);
          throw new Error(`Failed to create order item: ${itemError.message}`);
        }

        console.log('Order item created:', orderItem);
      }

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const orders = await supabaseService.getCustomerOrdersByUserId(user.id);
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
