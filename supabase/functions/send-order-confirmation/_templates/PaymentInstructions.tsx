
import { Section, Heading, Text, Link } from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { 
  paymentSection,
  bankDetailsBox,
  bankDetail,
  paymentNote,
  bodyText,
  h2,
  link
} from './styles.ts'

interface PaymentInstructionsProps {
  orderNumber: string
}

export const PaymentInstructions = ({ orderNumber }: PaymentInstructionsProps) => {
  return (
    <Section style={paymentSection}>
      <Heading style={h2}>Payment Instructions</Heading>
      <Text style={bodyText}>
        Please make your EFT payment using the following details:
      </Text>
      
      <Section style={bankDetailsBox}>
        <Text style={bankDetail}><strong>Bank:</strong> Standard Bank</Text>
        <Text style={bankDetail}><strong>Account Name:</strong> Anong Thai Brand</Text>
        <Text style={bankDetail}><strong>Account Number:</strong> 123456789</Text>
        <Text style={bankDetail}><strong>Branch Code:</strong> 051001</Text>
        <Text style={bankDetail}><strong>Reference:</strong> {orderNumber}</Text>
      </Section>

      <Text style={paymentNote}>
        Please use your order number <strong>{orderNumber}</strong> as the payment reference 
        and email proof of payment to <Link href="mailto:orders@anongthaibrand.com" style={link}>orders@anongthaibrand.com</Link>
      </Text>
    </Section>
  )
}
