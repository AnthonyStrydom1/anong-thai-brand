
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Parse order data from metadata
    const orderData = JSON.parse(session.metadata?.order_data || '{}');
    
    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get auth header from request
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      userId = userData.user?.id;
    }

    // Get or create customer
    let customer;
    if (userId) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      customer = existingCustomer;
    }

    if (!customer) {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          user_id: userId,
          fullname: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
          email: orderData.customerInfo.email,
          first_name: orderData.customerInfo.firstName,
          last_name: orderData.customerInfo.lastName,
          phone: orderData.customerInfo.phone
        }])
        .select()
        .single();
      
      if (customerError) throw customerError;
      customer = newCustomer;
    }

    // Calculate totals
    const subtotal = orderData.total;
    const total_amount = subtotal;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: customer.id,
        status: 'paid',
        payment_status: 'paid',
        fulfillment_status: 'unfulfilled',
        subtotal: subtotal,
        shipping_amount: 0,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: total_amount,
        currency: 'USD',
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
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    for (const item of orderData.items) {
      const { error: itemError } = await supabase
        .from('order_items')
        .insert([{
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        }]);
      
      if (itemError) throw itemError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: {
          orderNumber: order.order_number,
          items: orderData.items,
          total: total_amount,
          customerInfo: orderData.customerInfo
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error handling payment success:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
