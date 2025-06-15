
import { Section, Text, Link, Button } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { ctaSection, button, footerText, signature } from './styles/footer.ts'
import { link } from './styles/base.ts'

interface EmailFooterProps {
  orderNumber?: string;
}

export const EmailFooter = ({ orderNumber }: EmailFooterProps) => {
  // Create the correct order tracking URL - points to orders page with search parameter
  const trackingUrl = orderNumber 
    ? `https://anong.co.za/orders?search=${orderNumber}`
    : `https://anong.co.za/orders`;

  return (
    <>
      <Section style={ctaSection}>
        <Button href={trackingUrl} style={button}>
          Track Your Order #{orderNumber}
        </Button>
      </Section>

      <Text style={footerText}>
        If you have any questions about your order, please contact us at{' '}
        <Link href="mailto:orders@anongthaibrand.com" style={link}>orders@anongthaibrand.com</Link> or 
        visit our website at <Link href="https://anong.co.za" style={link}>anong.co.za</Link>
      </Text>

      <Text style={signature}>
        Warm regards,<br />
        The Anong Thai Brand Team<br />
        🙏 ขอบคุณครับ/ค่ะ 🙏
      </Text>
    </>
  )
}
