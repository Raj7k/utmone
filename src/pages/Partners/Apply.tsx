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
import { ValidationResult, validateEmailSmart } from '@/lib/emailValidator';

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
  const [emailValidation, setEmailValidation] = useState<ValidationResult | null>(null);

  if (partner) {
    navigate('/partners/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed_to_terms) return;

    const validation = validateEmailSmart(formData.payment_email);
    setEmailValidation(validation);
    if (!validation.isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedEmail = validation.normalizedEmail || formData.payment_email.trim().toLowerCase();

      await applyAsPartner({
        payment_email: normalizedEmail,
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
        <h1 className="text-4xl font-display font-bold mb-4 hero-gradient">join the utm.one partner program</h1>
        <p className="text-xl text-secondary-label">
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
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, payment_email: value });
                  setEmailValidation(validateEmailSmart(value));
                }}
                placeholder="payments@example.com"
                className={emailValidation?.reason === "disposable"
                  ? "border-amber-500"
                  : emailValidation?.isValid
                    ? "border-green-500"
                    : undefined}
              />
              <p className="text-sm text-secondary-label mt-1">
                we'll use this email to send your commission payouts
              </p>
              {emailValidation?.suggestion ? (
                <button
                  type="button"
                  onClick={() => {
                    const suggested = emailValidation.suggestion!;
                    setFormData({ ...formData, payment_email: suggested });
                    setEmailValidation(validateEmailSmart(suggested));
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 mt-1 hover:underline"
                >
                  {emailValidation.error} <span className="font-semibold">click to fix</span>
                </button>
              ) : !emailValidation?.isValid && emailValidation?.error ? (
                <p className={`text-xs mt-1 ${emailValidation.reason === "disposable" ? "text-amber-600 dark:text-amber-400" : "text-destructive"}`}>
                  {emailValidation.error}
                </p>
              ) : null}
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
              <p className="text-sm text-secondary-label mt-1">
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
                I agree to the <a href="/partners/terms" className="text-primary hover:underline" target="_blank">partner program terms and conditions</a>, including the 10%
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
            <p className="text-sm text-secondary-label">
              earn 10% recurring commission on all payments from your referrals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">$50 minimum</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-label">
              request payout once you reach $50 in earnings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">lifetime value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-label">
              earn commission for as long as your referrals remain customers
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
