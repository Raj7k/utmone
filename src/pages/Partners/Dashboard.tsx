import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, DollarSign, Users, TrendingUp, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePartner } from '@/hooks/usePartner';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import QRCode from 'react-qr-code';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { partner, referrals, requestPayout } = usePartner();
  const { toast } = useToast();
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!partner) {
    navigate('/partners/apply');
    return null;
  }

  const handleCopyLink = () => {
    if (partner.referral_url) {
      navigator.clipboard.writeText(partner.referral_url);
      toast({ title: 'referral link copied' });
    }
  };

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (amount < 50) {
      toast({
        title: 'minimum payout is $50',
        variant: 'destructive',
      });
      return;
    }
    if (amount > partner.pending_payout) {
      toast({
        title: 'insufficient balance',
        variant: 'destructive',
      });
      return;
    }
    requestPayout(amount);
    setIsPayoutDialogOpen(false);
    setPayoutAmount('');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'secondary',
      approved: 'default',
      suspended: 'destructive',
      terminated: 'destructive',
    };
    return colors[status] || 'secondary';
  };

  if (partner.status === 'pending') {
    return (
      <div className="container max-w-4xl py-16">
        <Alert>
          <AlertTitle>application under review</AlertTitle>
          <AlertDescription>
            your partner application is being reviewed. you'll receive an email once your application is approved.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-b from-label to-label/60 bg-clip-text text-transparent">partner dashboard</h1>
          <p className="text-secondary-label mt-2">
            track your referrals and earnings
          </p>
        </div>
        <Badge variant={getStatusColor(partner.status) as any}>
          {partner.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">total referrals</CardTitle>
            <Users className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partner.total_referrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partner.total_conversions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">total earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${partner.total_earnings.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">pending payout</CardTitle>
            <DollarSign className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${partner.pending_payout.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link to start earning commissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={partner.referral_url || ''}
              readOnly
              className="font-mono"
            />
            <Button onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={() => setShowQR(!showQR)}>
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
          {showQR && partner.referral_url && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCode value={partner.referral_url} size={200} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Assets</CardTitle>
          <CardDescription>
            Download promotional materials to share utm.one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">Logo Pack</h4>
              <p className="text-sm text-secondary-label">SVG and PNG logos in various sizes</p>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">Banner Images</h4>
              <p className="text-sm text-secondary-label">Social media and website banners</p>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">Email Templates</h4>
              <p className="text-sm text-secondary-label">Pre-written email copy</p>
              <Button variant="outline" size="sm">View Templates</Button>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">Social Posts</h4>
              <p className="text-sm text-secondary-label">Ready-to-share social media content</p>
              <Button variant="outline" size="sm">View Posts</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
          <CardDescription>
            Referrals and conversions over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-secondary-label">
            <p>Chart visualization coming soon</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>payouts</CardTitle>
              <CardDescription>
                request payout once you reach $50
              </CardDescription>
            </div>
            <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={partner.pending_payout < 50}>
                  request payout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>request payout</DialogTitle>
                  <DialogDescription>
                    enter the amount you'd like to withdraw (minimum $50)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">payout amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="50"
                      max={partner.pending_payout}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="50.00"
                    />
                    <p className="text-sm text-secondary-label mt-1">
                      available balance: ${partner.pending_payout.toFixed(2)}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleRequestPayout}>
                    request ${payoutAmount || '0.00'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-label">
            payouts are processed within 3-5 business days via {partner.payment_method}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>recent referrals</CardTitle>
          <CardDescription>
            users who signed up through your referral link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals && referrals.length > 0 ? (
            <div className="space-y-4">
              {referrals.slice(0, 10).map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <Badge variant={referral.status === 'converted' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                    <p className="text-sm text-secondary-label mt-1">
                      signed up: {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                    {referral.conversion_date && (
                      <p className="text-sm text-secondary-label">
                        converted: {new Date(referral.conversion_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {referral.commission_earned && (
                    <div className="text-right">
                      <p className="font-medium">
                        +${referral.commission_earned.toFixed(2)}
                      </p>
                      <p className="text-sm text-secondary-label">
                        {referral.commission_paid ? 'paid' : 'pending'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-label">no referrals yet</p>
              <p className="text-sm text-secondary-label">
                start sharing your referral link to earn commissions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
