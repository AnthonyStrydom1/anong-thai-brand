
import { Section, Heading, Text } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { shippingSection, addressText, h2 } from './styles.ts'

interface ShippingAddressProps {
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
}

export const ShippingAddress = ({ shippingAddress }: ShippingAddressProps) => {
  return (
    <Section style={shippingSection}>
      <Heading style={h2}>Shipping Address</Heading>
      <Text style={addressText}>
        {shippingAddress.firstName} {shippingAddress.lastName}<br />
        {shippingAddress.address}<br />
        {shippingAddress.city}, {shippingAddress.postalCode}<br />
        Phone: {shippingAddress.phone}
      </Text>
    </Section>
  )
}
