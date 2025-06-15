
import { Section, Row, Column, Heading, Text } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { OrderConfirmationEmailProps } from './types.ts'
import { orderBox, orderInfoColumn, orderLabel, orderValue } from './styles/order.ts'
import { h2 } from './styles/typography.ts'

interface OrderDetailsProps {
  orderNumber: string
  orderDate: string
}

export const OrderDetails = ({ orderNumber, orderDate }: OrderDetailsProps) => {
  return (
    <>
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
    </>
  )
}
