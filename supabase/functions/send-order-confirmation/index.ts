import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { OrderConfirmationEmail } from './_templates/order-confirmation.tsx'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderItems: Array<{
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  subtotal: number;
  vatAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  orderDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting order confirmation email process...');

    // Check if RESEND_API_KEY is configured
    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(JSON.stringify({ 
        error: "Email service not configured",
        details: "RESEND_API_KEY is missing" 
      }), {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      });
    }

    const orderData: OrderConfirmationRequest = await req.json();
    console.log('Sending order confirmation email for order:', orderData.orderNumber);
    console.log('Recipient email:', orderData.customerEmail);

    // Render the React email template
    console.log('Rendering email template...');
    const html = await renderAsync(
      React.createElement(OrderConfirmationEmail, orderData)
    );
    console.log('Email template rendered successfully');

    // Send the email
    console.log('Sending email via Resend...');
    const emailResponse = await resend.emails.send({
      from: "Anong Thai Brand <noreply@anongthaibrand.com>",
      to: [orderData.customerEmail],
      subject: `Order Confirmation #${orderData.orderNumber} - Thank you for your order!`,
      html,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id,
      recipient: orderData.customerEmail 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation email:", error);
    
    // Log more detailed error information
    if (error.message) {
      console.error("Error message:", error.message);
    }
    if (error.response) {
      console.error("Error response:", error.response);
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send order confirmation email",
        details: error.message,
        type: error.name || "Unknown error"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
