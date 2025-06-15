
import { Section, Row, Column, Img, Text } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { header, logo, brandColumn, brandName, brandTagline } from './styles.ts'

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
