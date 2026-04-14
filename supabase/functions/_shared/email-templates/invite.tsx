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
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

const LOGO_URL = 'https://vlnfwhpaajowjsqnkwyu.supabase.co/storage/v1/object/public/email-assets/logo.png'

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>you've been invited to join {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt={siteName} width="120" height="40" style={logo} />
        <Heading style={h1}>you've been invited</Heading>
        <Text style={text}>
          you've been invited to join{' '}
          <Link href={siteUrl} style={link}><strong>{siteName}</strong></Link>
          . click the button below to accept the invitation and create your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          accept invitation
        </Button>
        <Text style={footer}>
          if you weren't expecting this invitation, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
const container = { padding: '40px 25px' }
const logo = { marginBottom: '24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(222, 47%, 11%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: 'hsl(222, 20%, 35%)', lineHeight: '1.6', margin: '0 0 25px' }
const link = { color: 'inherit', textDecoration: 'underline' }
const button = { backgroundColor: 'hsl(240, 6%, 11%)', color: '#ffffff', fontSize: '14px', borderRadius: '12px', padding: '12px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: 'hsl(222, 20%, 35%)', margin: '30px 0 0', opacity: '0.7' }
