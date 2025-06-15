
import { Section, Row, Column, Hr, Text } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { 
  summarySection,
  summaryLabelColumn,
  summaryValueColumn,
  summaryLabel,
  summaryValue,
  totalDivider,
  totalLabel,
  totalValue
} from './styles/summary.ts'

interface OrderSummaryProps {
  subtotal: number
  vatAmount: number
  shippingAmount: number
  totalAmount: number
}

export const OrderSummary = ({ subtotal, vatAmount, shippingAmount, totalAmount }: OrderSummaryProps) => {
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`

  return (
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
  )
}
