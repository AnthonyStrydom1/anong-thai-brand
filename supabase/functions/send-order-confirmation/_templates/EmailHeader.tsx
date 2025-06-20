
import { Section, Row, Column, Img, Text } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { header, logo, brandName, brandTagline } from './styles/header.ts'

export const EmailHeader = () => {
  return (
    <Section style={header}>
      <Row>
        <Column style={{ textAlign: 'center' as const, paddingBottom: '20px' }}>
          <Img
            src="https://anongthaibrand.com/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png"
            width="60"
            height="60"
            alt="Anong Thai Brand Logo"
            style={logo}
          />
          <Text style={brandName}>ANONG THAI BRAND</Text>
          <Text style={brandTagline}>Authentic Thai Flavors from Thailand</Text>
        </Column>
      </Row>
    </Section>
  )
}
