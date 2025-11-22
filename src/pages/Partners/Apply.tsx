import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usePartner } from '@/hooks/usePartner';
import { Loader2 } from 'lucide-react';

export default function PartnerApply() {
  const navigate = useNavigate();
  const { partner, applyAsPartner } = usePartner();
  const [formData, setFormData] = useState({
    payment_email: '',
    payment_method: 'stripe',
    application_notes: '',
    agreed_to_terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (partner) {
    navigate('/partners/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed_to_terms) return;

    setIsSubmitting(true);
    try {
      await applyAsPartner({
        payment_email: formData.payment_email,
        payment_method: formData.payment_method,
        application_notes: formData.application_notes,
      });
      navigate('/partners/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">join the utm.one partner program</h1>
        <p className="text-xl text-muted-foreground">
          earn 10% recurring commission on every referral
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>partner application</CardTitle>
          <CardDescription>
            tell us about yourself and how you plan to promote utm.one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="payment_email">payment email</Label>
              <Input
                id="payment_email"
                type="email"
                required
                value={formData.payment_email}
                onChange={(e) => setFormData({ ...formData, payment_email: e.target.value })}
                placeholder="payments@example.com"
              />
              <p className="text-sm text-muted-foreground mt-1">
                we'll use this email to send your commission payouts
              </p>
            </div>

            <div>
              <Label htmlFor="payment_method">payment method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger id="payment_method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="application_notes">how will you promote utm.one?</Label>
              <Textarea
                id="application_notes"
                required
                value={formData.application_notes}
                onChange={(e) => setFormData({ ...formData, application_notes: e.target.value })}
                placeholder="Tell us about your audience, channels, and promotion strategy..."
                rows={6}
              />
              <p className="text-sm text-muted-foreground mt-1">
                include details about your reach, platforms, and marketing approach
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreed_to_terms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreed_to_terms: checked as boolean })
                }
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                i agree to the partner program terms and conditions, including the 10%
                commission structure and minimum $50 payout threshold
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!formData.agreed_to_terms || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  submitting application...
                </>
              ) : (
                'submit application'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">10% commission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              earn 10% recurring commission on all payments from your referrals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">$50 minimum</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              request payout once you reach $50 in earnings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">lifetime value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              earn commission for as long as your referrals remain customers
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
