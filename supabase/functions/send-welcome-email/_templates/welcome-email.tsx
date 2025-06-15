
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { EmailHeader } from './EmailHeader.tsx'
import { main, container, content, h1, greeting, bodyText, button, footerText, signature } from './styles.ts'

interface WelcomeEmailProps {
  customerName: string;
  loginUrl: string;
}

export const WelcomeEmail = ({
  customerName,
  loginUrl,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <Preview>Welcome to Anong Thai Brand - Your authentic Thai journey begins!</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailHeader />

          <Section style={content}>
            <Heading style={h1}>Welcome to Anong Thai!</Heading>
            
            <Text style={greeting}>
              Sawasdee {customerName}! 🙏
            </Text>
            
            <Text style={bodyText}>
              Welcome to the Anong Thai Brand family! We're thrilled to have you join us on this 
              authentic Thai culinary journey. Your account has been successfully created, and you're 
              now ready to explore our premium collection of traditional Thai products.
            </Text>

            <Text style={bodyText}>
              From aromatic spices and curry pastes to traditional sauces and specialty ingredients, 
              we bring you the authentic taste of Thailand, carefully sourced and crafted with love.
            </Text>

            <Section style={{ textAlign: 'center' as const, margin: '40px 0' }}>
              <Link
                href={loginUrl}
                style={button}
              >
                Sign In to Your Account
              </Link>
            </Section>

            <Text style={bodyText}>
              Here's what you can do with your new account:
            </Text>

            <Text style={bodyText}>
              • Browse our complete collection of authentic Thai products<br/>
              • Access exclusive recipes and cooking tips<br/>
              • Track your orders and delivery status<br/>
              • Enjoy personalized product recommendations<br/>
              • Get early access to new products and special offers
            </Text>

            <Text style={bodyText}>
              If you have any questions or need assistance, our customer service team is here to help. 
              We're passionate about sharing the rich flavors of Thailand with you!
            </Text>

            <Text style={footerText}>
              Thank you for choosing Anong Thai Brand. We look forward to being part of your culinary adventures!
            </Text>

            <Text style={signature}>
              With warm regards and authentic Thai flavors,<br/>
              The Anong Thai Brand Team 🌶️
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
