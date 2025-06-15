
export interface OrderItem {
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface OrderConfirmationEmailProps {
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
