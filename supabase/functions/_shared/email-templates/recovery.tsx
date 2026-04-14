/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

const LOGO_URL = 'https://vlnfwhpaajowjsqnkwyu.supabase.co/storage/v1/object/public/email-assets/logo.png'

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>reset your password for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt={siteName} width="120" height="40" style={logo} />
        <Heading style={h1}>reset your password</Heading>
        <Text style={text}>
          we received a request to reset your password for {siteName}. click the button below to choose a new password.
        </Text>
        <Button style={button} href={confirmationUrl}>
          reset password
        </Button>
        <Text style={footer}>
          if you didn't request a password reset, you can safely ignore this email. your password will not be changed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
const container = { padding: '40px 25px' }
const logo = { marginBottom: '24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(222, 47%, 11%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: 'hsl(222, 20%, 35%)', lineHeight: '1.6', margin: '0 0 25px' }
const button = { backgroundColor: 'hsl(240, 6%, 11%)', color: '#ffffff', fontSize: '14px', borderRadius: '12px', padding: '12px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: 'hsl(222, 20%, 35%)', margin: '30px 0 0', opacity: '0.7' }
