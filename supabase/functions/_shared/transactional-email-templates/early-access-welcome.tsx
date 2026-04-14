import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'utm.one'
const SITE_URL = 'https://utmone.lovable.app'

interface EarlyAccessWelcomeProps {
  name?: string
  position?: number
  referralCode?: string
}

const EarlyAccessWelcomeEmail = ({ name, position, referralCode }: EarlyAccessWelcomeProps) => {
  const referralLink = referralCode ? `${SITE_URL}?ref=${referralCode}` : null

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`you're in — #${String(position ?? '???')} on the ${SITE_NAME} waitlist`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>{SITE_NAME}</Text>
          <Hr style={divider} />
          <Heading style={h1}>
            {name ? `welcome, ${name}` : 'welcome to the early circle'}
          </Heading>
          <Text style={text}>
            you're officially on the list. we'll let you know the moment your account is ready.
          </Text>

          {position && (
            <Section style={positionBox}>
              <Text style={positionLabel}>your queue position</Text>
              <Text style={positionNumber}>#{position}</Text>
            </Section>
          )}

          {referralLink && (
            <>
              <Text style={text}>
                want to move up? share your personal referral link — each signup bumps you closer to the front.
              </Text>
              <Section style={referralBox}>
                <Text style={referralLabel}>your referral link</Text>
                <Link href={referralLink} style={referralLinkStyle}>{referralLink}</Link>
              </Section>
              <Button style={button} href={referralLink}>
                share & move up →
              </Button>
            </>
          )}

          <Hr style={divider} />
          <Text style={footer}>
            you're receiving this because you signed up for early access on {SITE_NAME}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: EarlyAccessWelcomeEmail,
  subject: (data: Record<string, any>) =>
    data.position
      ? `you're #${data.position} on the ${SITE_NAME} waitlist`
      : `welcome to the ${SITE_NAME} early circle`,
  displayName: 'Early access welcome',
  previewData: { name: 'Sam', position: 42, referralCode: 'ABC123XY' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const logo = { fontSize: '18px', fontWeight: '700' as const, color: '#171717', letterSpacing: '-0.02em', margin: '0 0 24px' }
const divider = { borderColor: '#e5e5e5', margin: '24px 0' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#171717', lineHeight: '1.3', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#525252', lineHeight: '1.6', margin: '0 0 16px' }
const positionBox = { backgroundColor: '#fafafa', borderRadius: '12px', padding: '24px', textAlign: 'center' as const, margin: '24px 0' }
const positionLabel = { fontSize: '12px', color: '#a3a3a3', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 8px' }
const positionNumber = { fontSize: '48px', fontWeight: '800' as const, color: '#171717', margin: '0' }
const referralBox = { backgroundColor: '#fafafa', borderRadius: '8px', padding: '16px', margin: '16px 0' }
const referralLabel = { fontSize: '12px', color: '#a3a3a3', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 8px' }
const referralLinkStyle = { fontSize: '14px', color: '#171717', fontWeight: '600' as const, wordBreak: 'break-all' as const }
const button = {
  backgroundColor: '#171717',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block' as const,
  margin: '8px 0 0',
}
const footer = { fontSize: '12px', color: '#a3a3a3', lineHeight: '1.5', margin: '0' }
