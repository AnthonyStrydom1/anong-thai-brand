
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface OrderItem {
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  customerEmail: string
  orderItems: OrderItem[]
  subtotal: number
  vatAmount: number
  shippingAmount: number
  totalAmount: number
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  orderDate: string
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  customerEmail,
  orderItems,
  subtotal,
  vatAmount,
  shippingAmount,
  totalAmount,
  shippingAddress,
  orderDate,
}: OrderConfirmationEmailProps) => {
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`

  return (
    <Html>
      <Head />
      <Preview>Order Confirmation #{orderNumber} - Thank you for your order!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Row>
              <Column>
                <Img
                  src="https://anong.co.za/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png"
                  width="40"
                  height="40"
                  alt="ANONG Logo"
                  style={logo}
                />
              </Column>
              <Column style={brandColumn}>
                <Text style={brandName}>ANONG</Text>
                <Text style={brandTagline}>Authentic Thai Flavors</Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Order Confirmation</Heading>
            
            <Text style={greeting}>
              Hello {customerName},
            </Text>
            
            <Text style={bodyText}>
              Thank you for your order! We're excited to share the authentic taste of Thailand with you. 
              Your order has been confirmed and we'll begin preparing it right away.
            </Text>

            {/* Order Details Box */}
            <Section style={orderBox}>
              <Row>
                <Column style={orderInfoColumn}>
                  <Text style={orderLabel}>Order Number</Text>
                  <Text style={orderValue}>#{orderNumber}</Text>
                </Column>
                <Column style={orderInfoColumn}>
                  <Text style={orderLabel}>Order Date</Text>
                  <Text style={orderValue}>{new Date(orderDate).toLocaleDateString()}</Text>
                </Column>
              </Row>
            </Section>

            {/* Order Items */}
            <Section style={itemsSection}>
              <Heading style={h2}>Your Order</Heading>
              
              {orderItems.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Row>
                    <Column style={itemNameColumn}>
                      <Text style={itemName}>{item.product_name}</Text>
                      <Text style={itemSku}>SKU: {item.product_sku}</Text>
                    </Column>
                    <Column style={itemQtyColumn}>
                      <Text style={itemQty}>Qty: {item.quantity}</Text>
                    </Column>
                    <Column style={itemPriceColumn}>
                      <Text style={itemPrice}>{formatCurrency(item.unit_price)}</Text>
                    </Column>
                    <Column style={itemTotalColumn}>
                      <Text style={itemTotal}>{formatCurrency(item.total_price)}</Text>
                    </Column>
                  </Row>
                  {index < orderItems.length - 1 && <Hr style={itemDivider} />}
                </Section>
              ))}
            </Section>

            {/* Order Summary */}
            <Section style={summarySection}>
              <Row>
                <Column style={summaryLabelColumn}>
                  <Text style={summaryLabel}>Subtotal (excl. VAT):</Text>
                </Column>
                <Column style={summaryValueColumn}>
                  <Text style={summaryValue}>{formatCurrency(subtotal)}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={summaryLabelColumn}>
                  <Text style={summaryLabel}>VAT (15%):</Text>
                </Column>
                <Column style={summaryValueColumn}>
                  <Text style={summaryValue}>{formatCurrency(vatAmount)}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={summaryLabelColumn}>
                  <Text style={summaryLabel}>Shipping:</Text>
                </Column>
                <Column style={summaryValueColumn}>
                  <Text style={summaryValue}>
                    {shippingAmount > 0 ? formatCurrency(shippingAmount) : 'FREE'}
                  </Text>
                </Column>
              </Row>
              <Hr style={totalDivider} />
              <Row>
                <Column style={summaryLabelColumn}>
                  <Text style={totalLabel}>Total:</Text>
                </Column>
                <Column style={summaryValueColumn}>
                  <Text style={totalValue}>{formatCurrency(totalAmount)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Payment Instructions */}
            <Section style={paymentSection}>
              <Heading style={h2}>Payment Instructions</Heading>
              <Text style={bodyText}>
                Please make your EFT payment using the following details:
              </Text>
              
              <Section style={bankDetailsBox}>
                <Text style={bankDetail}><strong>Bank:</strong> Standard Bank</Text>
                <Text style={bankDetail}><strong>Account Name:</strong> ANONG Thai Kitchen</Text>
                <Text style={bankDetail}><strong>Account Number:</strong> 123456789</Text>
                <Text style={bankDetail}><strong>Branch Code:</strong> 051001</Text>
                <Text style={bankDetail}><strong>Reference:</strong> {orderNumber}</Text>
              </Section>

              <Text style={paymentNote}>
                Please use your order number <strong>{orderNumber}</strong> as the payment reference 
                and email proof of payment to <Link href="mailto:orders@anong.com" style={link}>orders@anong.com</Link>
              </Text>
            </Section>

            {/* Shipping Address */}
            <Section style={shippingSection}>
              <Heading style={h2}>Shipping Address</Heading>
              <Text style={addressText}>
                {shippingAddress.firstName} {shippingAddress.lastName}<br />
                {shippingAddress.address}<br />
                {shippingAddress.city}, {shippingAddress.postalCode}<br />
                Phone: {shippingAddress.phone}
              </Text>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Button href="https://anong.co.za/orders" style={button}>
                Track Your Order
              </Button>
            </Section>

            <Text style={footerText}>
              If you have any questions about your order, please contact us at{' '}
              <Link href="mailto:orders@anong.com" style={link}>orders@anong.com</Link> or 
              visit our website at <Link href="https://anong.co.za" style={link}>anong.co.za</Link>
            </Text>

            <Text style={signature}>
              Warm regards,<br />
              The ANONG Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail

// Styles matching ANONG brand theme
const main = {
  backgroundColor: '#f8f4ed', // anong-ivory
  fontFamily: 'Lato, Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#ffffff',
  borderRadius: '12px 12px 0 0',
  padding: '24px',
  borderBottom: '3px solid #d4af37', // anong-gold
}

const logo = {
  margin: '0',
}

const brandColumn = {
  paddingLeft: '12px',
}

const brandName = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#d4af37', // anong-gold
  margin: '0',
  fontFamily: 'Playfair Display, serif',
}

const brandTagline = {
  fontSize: '12px',
  color: '#1a1a1a', // anong-black
  margin: '0',
  fontStyle: 'italic',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  borderRadius: '0 0 12px 12px',
}

const h1 = {
  color: '#1a1a1a', // anong-black
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  fontFamily: 'Playfair Display, serif',
}

const h2 = {
  color: '#1a1a1a', // anong-black
  fontSize: '20px',
  fontWeight: '600',
  margin: '24px 0 16px',
  fontFamily: 'Playfair Display, serif',
}

const greeting = {
  fontSize: '16px',
  color: '#1a1a1a',
  margin: '0 0 16px',
}

const bodyText = {
  fontSize: '14px',
  color: '#2c2c2c', // anong-charcoal
  lineHeight: '1.6',
  margin: '0 0 20px',
}

const orderBox = {
  backgroundColor: '#faf8f5', // anong-cream
  border: '1px solid #d4af37', // anong-gold
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
}

const orderInfoColumn = {
  width: '50%',
}

const orderLabel = {
  fontSize: '12px',
  color: '#9db5a1', // anong-sage
  fontWeight: '600',
  margin: '0 0 4px',
  textTransform: 'uppercase',
}

const orderValue = {
  fontSize: '16px',
  color: '#1a1a1a',
  fontWeight: 'bold',
  margin: '0',
}

const itemsSection = {
  margin: '24px 0',
}

const itemRow = {
  padding: '12px 0',
}

const itemNameColumn = {
  width: '45%',
}

const itemQtyColumn = {
  width: '15%',
}

const itemPriceColumn = {
  width: '20%',
  textAlign: 'right' as const,
}

const itemTotalColumn = {
  width: '20%',
  textAlign: 'right' as const,
}

const itemName = {
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: '600',
  margin: '0 0 4px',
}

const itemSku = {
  fontSize: '12px',
  color: '#9db5a1',
  margin: '0',
}

const itemQty = {
  fontSize: '14px',
  color: '#2c2c2c',
  margin: '0',
}

const itemPrice = {
  fontSize: '14px',
  color: '#2c2c2c',
  margin: '0',
}

const itemTotal = {
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: '600',
  margin: '0',
}

const itemDivider = {
  borderColor: '#f0f0f0',
  margin: '8px 0',
}

const summarySection = {
  backgroundColor: '#faf8f5',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
}

const summaryLabelColumn = {
  width: '70%',
}

const summaryValueColumn = {
  width: '30%',
  textAlign: 'right' as const,
}

const summaryLabel = {
  fontSize: '14px',
  color: '#2c2c2c',
  margin: '4px 0',
}

const summaryValue = {
  fontSize: '14px',
  color: '#1a1a1a',
  margin: '4px 0',
}

const totalDivider = {
  borderColor: '#d4af37',
  borderWidth: '2px',
  margin: '16px 0 12px',
}

const totalLabel = {
  fontSize: '16px',
  color: '#1a1a1a',
  fontWeight: 'bold',
  margin: '0',
}

const totalValue = {
  fontSize: '18px',
  color: '#d4af37',
  fontWeight: 'bold',
  margin: '0',
}

const paymentSection = {
  margin: '32px 0',
}

const bankDetailsBox = {
  backgroundColor: '#2b3d2f', // anong-deep-green
  color: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  margin: '16px 0',
}

const bankDetail = {
  fontSize: '14px',
  color: '#ffffff',
  margin: '6px 0',
}

const paymentNote = {
  fontSize: '14px',
  color: '#2c2c2c',
  backgroundColor: '#fff3cd',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #d4af37',
  margin: '16px 0',
}

const shippingSection = {
  margin: '24px 0',
}

const addressText = {
  fontSize: '14px',
  color: '#2c2c2c',
  lineHeight: '1.5',
  backgroundColor: '#faf8f5',
  padding: '16px',
  borderRadius: '8px',
  margin: '8px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#d4af37',
  borderRadius: '8px',
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: 'none',
}

const link = {
  color: '#d4af37',
  textDecoration: 'underline',
}

const footerText = {
  fontSize: '14px',
  color: '#9db5a1',
  lineHeight: '1.5',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const signature = {
  fontSize: '14px',
  color: '#1a1a1a',
  margin: '24px 0 0',
  fontStyle: 'italic',
}
