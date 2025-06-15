
import { Section, Text, Link, Button } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { ctaSection, button, footerText, signature, link } from './styles.ts'

export const EmailFooter = () => {
  return (
    <>
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
    </>
  )
}
