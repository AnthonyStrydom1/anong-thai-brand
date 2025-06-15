
import { Section, Row, Column, Heading, Text, Hr } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { OrderItem } from './types.ts'
import { 
  itemsSection, 
  itemRow, 
  itemNameColumn, 
  itemQtyColumn, 
  itemPriceColumn, 
  itemTotalColumn,
  itemName,
  itemSku,
  itemQty,
  itemPrice,
  itemTotal,
  itemDivider,
  h2
} from './styles.ts'

interface OrderItemsProps {
  orderItems: OrderItem[]
}

export const OrderItems = ({ orderItems }: OrderItemsProps) => {
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`

  return (
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
  )
}
