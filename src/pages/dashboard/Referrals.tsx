import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Referrals() {
  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Back to Dashboard Link */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-sm text-secondary-label hover:text-label transition-apple"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-label">Referrals</h2>
          <p className="text-sm text-secondary-label mt-1">Grow your audience through referrals</p>
        </div>
      </div>

      <Card variant="grouped">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Referral program is under development</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-apple text-secondary-label">
            We're building a comprehensive referral system that will help you grow your workspace
            through word-of-mouth marketing with automated tracking and rewards.
          </p>

          <div className="bg-muted/20 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-label">Planned Features:</h4>
            <ul className="space-y-1 text-sm text-secondary-label">
              <li>• Unique referral links per user</li>
              <li>• Automated reward tracking</li>
              <li>• Customizable incentive tiers</li>
              <li>• Real-time referral analytics</li>
              <li>• Integration with billing system</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://docs.utm.one" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
