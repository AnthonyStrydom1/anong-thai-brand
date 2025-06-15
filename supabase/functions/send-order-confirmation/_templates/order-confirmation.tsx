
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { OrderConfirmationEmailProps } from './types.ts'
import { EmailHeader } from './EmailHeader.tsx'
import { OrderDetails } from './OrderDetails.tsx'
import { OrderItems } from './OrderItems.tsx'
import { OrderSummary } from './OrderSummary.tsx'
import { PaymentInstructions } from './PaymentInstructions.tsx'
import { ShippingAddress } from './ShippingAddress.tsx'
import { EmailFooter } from './EmailFooter.tsx'
import { main, container, content, h1, greeting, bodyText } from './styles.ts'

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  orderItems,
  subtotal,
  vatAmount,
  shippingAmount,
  totalAmount,
  shippingAddress,
  orderDate,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation #{orderNumber} - Thank you for your order!</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailHeader />

          <Section style={content}>
            <Heading style={h1}>Order Confirmation</Heading>
            
            <Text style={greeting}>
              Hello {customerName},
            </Text>
            
            <Text style={bodyText}>
              Thank you for your order! We're excited to share the authentic taste of Thailand with you. 
              Your order has been confirmed and we'll begin preparing it right away.
            </Text>

            <OrderDetails orderNumber={orderNumber} orderDate={orderDate} />
            <OrderItems orderItems={orderItems} />
            <OrderSummary 
              subtotal={subtotal}
              vatAmount={vatAmount}
              shippingAmount={shippingAmount}
              totalAmount={totalAmount}
            />
            <PaymentInstructions orderNumber={orderNumber} />
            <ShippingAddress shippingAddress={shippingAddress} />
            <EmailFooter />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail
