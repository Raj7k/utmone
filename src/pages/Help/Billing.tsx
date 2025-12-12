import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { CreditCard, TrendingUp } from "lucide-react";

const Billing = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Billing & Plans" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Billing & Plans</h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400">Understand pricing tiers, feature availability, usage limits, and upgrade options.</p>
    </div>

    <ProTip>
      Annual billing saves up to 20% compared to monthly. You can switch billing cycles anytime from Settings → Billing.
    </ProTip>

    <div className="space-y-3">
      <ExpandableArticle
        title="Managing your subscription"
        description="Upgrade, downgrade, or cancel your plan anytime from Settings."
        icon={CreditCard}
      >
        <h3>Viewing your plan</h3>
        <p>Go to Settings → Billing to see your current plan, usage, and billing history.</p>
        
        <h3>Upgrading</h3>
        <ol>
          <li>Go to Settings → Billing</li>
          <li>Click "Upgrade"</li>
          <li>Select your new plan</li>
          <li>Confirm payment</li>
        </ol>
        <p>Upgrades take effect immediately. You'll be charged the prorated difference.</p>
        
        <h3>Downgrading</h3>
        <ol>
          <li>Go to Settings → Billing</li>
          <li>Click "Change Plan"</li>
          <li>Select a lower tier</li>
          <li>Confirm the change</li>
        </ol>
        <p>Downgrades take effect at the end of your current billing period.</p>
        
        <h3>Cancellation</h3>
        <p>To cancel, go to Settings → Billing → Cancel Subscription. Your data remains accessible until the end of the billing period, then moves to our free tier.</p>
        
        <h3>Payment methods</h3>
        <p>We accept all major credit cards (Visa, Mastercard, Amex) and can arrange invoicing for annual Business and Enterprise plans.</p>
        
        <h3>Invoices</h3>
        <p>Access all invoices from Settings → Billing → Invoice History. Download PDF invoices for accounting.</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Usage limits explained"
        description="Links per month, clicks tracked, team members, custom domains."
        icon={TrendingUp}
      >
        <h3>What counts against limits</h3>
        <ul>
          <li><strong>Links per month</strong> — New links created in the current billing period</li>
          <li><strong>Clicks tracked</strong> — Total clicks across all links in the period</li>
          <li><strong>Team members</strong> — Active members in your workspace</li>
          <li><strong>Custom domains</strong> — Domains connected to your workspace</li>
        </ul>
        
        <h3>When you hit a limit</h3>
        <p>You'll see a warning before reaching limits. When reached:</p>
        <ul>
          <li><strong>Link limit</strong> — Can't create new links until next period or upgrade</li>
          <li><strong>Click limit</strong> — Links continue working, but analytics may be limited</li>
          <li><strong>Team limit</strong> — Can't invite new members until upgrade</li>
        </ul>
        
        <h3>Checking your usage</h3>
        <p>View current usage at Settings → Billing. Usage resets on your billing date.</p>
        
        <h3>Add-ons</h3>
        <p>Need more capacity without upgrading? Add-ons are available for additional links, clicks, domains, and team seats. Available on Growth and Business plans.</p>
      </ExpandableArticle>
    </div>

    <FeatureAvailability
      feature="Billing Management"
      availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
    />
  </HelpLayout>
);

export default Billing;
