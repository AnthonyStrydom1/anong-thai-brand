
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface MfaVerificationEmailProps {
  verificationCode: string;
}

export const MfaVerificationEmail = ({
  verificationCode,
}: MfaVerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your ANONG verification code: {verificationCode}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Row>
              <Column>
                <Img
                  src="https://anongthaibrand.com/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png"
                  width="40"
                  height="40"
                  alt="ANONG Logo"
                  style={logo}
                />
              </Column>
              <Column style={brandColumn}>
                <Text style={brandName}>ANONG</Text>
                <Text style={brandTagline}>Authentic Thai Flavors</Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Account Verification</Heading>
            
            <Text style={greeting}>
              Sawasdee! 🙏
            </Text>
            
            <Text style={bodyText}>
              We're excited to welcome you to the ANONG family! To complete your sign-in and 
              ensure the security of your account, please use the verification code below.
            </Text>

            {/* Verification Code Box */}
            <Section style={codeSection}>
              <Text style={codeLabel}>Your Verification Code</Text>
              <Section style={codeBox}>
                <Text style={verificationCodeText}>{verificationCode}</Text>
              </Section>
              <Text style={codeNote}>
                This code will expire in <strong>5 minutes</strong>
              </Text>
            </Section>

            <Text style={bodyText}>
              Simply enter this code in the verification screen to access your account and 
              start exploring our authentic Thai ingredients and spices.
            </Text>

            {/* Security Notice */}
            <Section style={securitySection}>
              <Text style={securityTitle}>🔒 Security Notice</Text>
              <Text style={securityText}>
                If you didn't request this verification code, please ignore this email. 
                Your account remains secure and no action is needed.
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={footerText}>
              Need help? Contact us at{' '}
              <Link href="mailto:support@anongthaibrand.com" style={link}>support@anongthaibrand.com</Link>{' '}
              or visit our website at{' '}
              <Link href="https://anongthaibrand.com" style={link}>anongthaibrand.com</Link>
            </Text>

            <Text style={signature}>
              Thank you for choosing ANONG,<br />
              <em>Where authentic Thai flavors come to life</em>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>ANONG</Text>
            <Text style={footerTagline}>Bringing Thailand to Your Table</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MfaVerificationEmail

// Styles matching ANONG brand theme
const main = {
  backgroundColor: '#f8f4ed', // anong-ivory
  fontFamily: 'Lato, Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#ffffff',
  borderRadius: '12px 12px 0 0',
  padding: '24px',
  borderBottom: '3px solid #d4af37', // anong-gold
}

const logo = {
  margin: '0',
}

const brandColumn = {
  paddingLeft: '12px',
}

const brandName = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#d4af37', // anong-gold
  margin: '0',
  fontFamily: 'Playfair Display, serif',
}

const brandTagline = {
  fontSize: '12px',
  color: '#1a1a1a', // anong-black
  margin: '0',
  fontStyle: 'italic',
}

const content = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  borderRadius: '0 0 12px 12px',
}

const h1 = {
  color: '#1a1a1a', // anong-black
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  fontFamily: 'Playfair Display, serif',
  textAlign: 'center' as const,
}

const greeting = {
  fontSize: '18px',
  color: '#1a1a1a',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const bodyText = {
  fontSize: '14px',
  color: '#2c2c2c', // anong-charcoal
  lineHeight: '1.6',
  margin: '0 0 20px',
}

const codeSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
}

const codeLabel = {
  fontSize: '14px',
  color: '#1a1a1a', // anong-black
  fontWeight: '600',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
}

const codeBox = {
  backgroundColor: '#1a1a1a', // anong-black
  border: '2px solid #d4af37', // anong-gold
  borderRadius: '12px',
  padding: '24px',
  margin: '12px auto 16px',
  maxWidth: '280px',
}

const verificationCodeText = {
  fontSize: '36px',
  color: '#d4af37', // anong-gold
  fontWeight: 'bold',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'Monaco, Consolas, monospace',
  textAlign: 'center' as const,
}

const codeNote = {
  fontSize: '12px',
  color: '#d4af37', // anong-gold
  fontWeight: '600',
  margin: '0',
}

const securitySection = {
  backgroundColor: '#faf8f5', // anong-cream
  border: '1px solid #d4af37', // anong-gold
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const securityTitle = {
  fontSize: '14px',
  color: '#1a1a1a',
  fontWeight: '600',
  margin: '0 0 8px',
}

const securityText = {
  fontSize: '13px',
  color: '#2c2c2c',
  lineHeight: '1.5',
  margin: '0',
}

const divider = {
  borderColor: '#d4af37',
  margin: '32px 0',
}

const link = {
  color: '#d4af37',
  textDecoration: 'underline',
}

const footerText = {
  fontSize: '14px',
  color: '#2c2c2c',
  lineHeight: '1.5',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const signature = {
  fontSize: '14px',
  color: '#1a1a1a',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}

const footer = {
  backgroundColor: '#1a1a1a', // anong-black
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '0 0 12px 12px',
}

const footerBrand = {
  fontSize: '16px',
  color: '#d4af37', // anong-gold
  fontWeight: 'bold',
  margin: '0 0 4px',
  fontFamily: 'Playfair Display, serif',
}

const footerTagline = {
  fontSize: '12px',
  color: '#ffffff',
  margin: '0',
  fontStyle: 'italic',
}
