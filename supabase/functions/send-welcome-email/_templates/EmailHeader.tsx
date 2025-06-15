
import { Section, Row, Column, Img, Text } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

const header = {
  backgroundColor: '#f8f9fa',
  padding: '20px 0',
  borderBottom: '1px solid #e9ecef',
}

const logo = {
  width: '50px',
  height: '50px',
}

const brandColumn = {
  verticalAlign: 'middle' as const,
  paddingLeft: '15px',
}

const brandName = {
  fontFamily: 'Playfair Display, serif',
  fontSize: '24px',
  fontWeight: '700',
  color: '#2c3e50',
  margin: '0',
  lineHeight: '1.2',
}

const brandTagline = {
  fontFamily: 'Lato, sans-serif',
  fontSize: '12px',
  color: '#7f8c8d',
  margin: '2px 0 0 0',
  fontWeight: '300',
}

export const EmailHeader = () => {
  return (
    <Section style={header}>
      <Row>
        <Column>
          <Img
            src="https://anong.co.za/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png"
            width="50"
            height="50"
            alt="Anong Thai Brand Logo"
            style={logo}
          />
        </Column>
        <Column style={brandColumn}>
          <Text style={brandName}>ANONG THAI BRAND</Text>
          <Text style={brandTagline}>Authentic Thai Flavors from Thailand</Text>
        </Column>
      </Row>
    </Section>
  )
}
