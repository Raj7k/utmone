import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PartnerTerms() {
  return (
    <div className="container max-w-4xl py-16 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-b from-label to-label/60 bg-clip-text text-transparent">
          Partner Program Terms
        </h1>
        <p className="text-xl text-secondary-label">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Structure</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul>
            <li>Standard partners earn 10% recurring commission on all payments from referred customers</li>
            <li>VIP partners (500+ conversions) earn 15% recurring commission</li>
            <li>Elite partners (1000+ conversions) earn 20% recurring commission</li>
            <li>Commission is calculated on the customer's subscription value (excluding taxes)</li>
            <li>Commissions are earned for as long as the referred customer remains active</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul>
            <li>Minimum payout threshold is $50 USD</li>
            <li>Payouts are processed within 3-5 business days of request</li>
            <li>Available payment methods: Stripe, PayPal, Bank Transfer</li>
            <li>Partners are responsible for any applicable taxes on commissions earned</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program Rules</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul>
            <li>Partners must not engage in spam, fraudulent activity, or misleading marketing</li>
            <li>Self-referrals are not permitted</li>
            <li>Cookie duration for referral tracking is 90 days</li>
            <li>utm.one reserves the right to terminate partnerships for violations of terms</li>
            <li>Partners must comply with all applicable advertising and marketing laws</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding & Marketing</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul>
            <li>Partners receive access to marketing materials including logos, banners, and templates</li>
            <li>Partners must not misrepresent their relationship with utm.one</li>
            <li>All promotional content must accurately represent utm.one's features and pricing</li>
            <li>utm.one reserves the right to review and request changes to partner marketing materials</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul>
            <li>Either party may terminate the partnership with 30 days' notice</li>
            <li>Commissions earned before termination will be paid out</li>
            <li>Partners must remove utm.one branding and stop promoting the product upon termination</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
