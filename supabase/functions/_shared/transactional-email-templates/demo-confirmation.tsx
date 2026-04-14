import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'utm.one'
const CAL_LINK = 'https://cal.com/utm-one/demo'

interface DemoConfirmationProps {
  name?: string
  challenge?: string
}

const DemoConfirmationEmail = ({ name, challenge }: DemoConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>we got your request — let's get you on the calendar</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>{SITE_NAME}</Text>
        <Hr style={divider} />
        <Heading style={h1}>
          {name ? `hey ${name}, we're on it` : "hey, we're on it"}
        </Heading>
        <Text style={text}>
          thanks for reaching out. your demo request has been received and we're excited to show you what {SITE_NAME} can do.
        </Text>
        {challenge && (
          <Text style={text}>
            we'll tailor the demo around <strong>{challenge}</strong> — so you get real answers, not a generic walkthrough.
          </Text>
        )}
        <Section style={ctaSection}>
          <Text style={text}>
            if you haven't already, pick a time that works for you:
          </Text>
          <Button style={button} href={CAL_LINK}>
            book your slot →
          </Button>
        </Section>
        <Hr style={divider} />
        <Text style={footer}>
          you're receiving this because you requested a demo on {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DemoConfirmationEmail,
  subject: "your demo request is confirmed",
  displayName: 'Demo request confirmation',
  previewData: { name: 'Alex', challenge: 'Campaign Attribution' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#171717', letterSpacing: '-0.02em', margin: '0 0 24px' }
const divider = { borderColor: '#e5e5e5', margin: '24px 0' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#171717', lineHeight: '1.3', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#525252', lineHeight: '1.6', margin: '0 0 16px' }
const ctaSection = { margin: '24px 0' }
const button = {
  backgroundColor: '#171717',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block' as const,
}
const footer = { fontSize: '12px', color: '#a3a3a3', lineHeight: '1.5', margin: '0' }
