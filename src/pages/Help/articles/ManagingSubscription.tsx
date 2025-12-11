import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Receipt, Calendar } from "lucide-react";

const ManagingSubscription = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/billing" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Managing your subscription</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Upgrade, downgrade, or manage your utm.one subscription.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing your plan</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Billing</strong></li>
            <li>See your current plan and usage</li>
            <li>View next billing date and amount</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Upgrading</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Billing</strong></li>
            <li>Click <strong>Change plan</strong></li>
            <li>Select your new plan</li>
            <li>Confirm payment</li>
            <li>New features are available immediately</li>
          </ol>
          <p className="text-zinc-600 mb-4">
            When upgrading mid-cycle, you'll be charged a prorated amount for the remaining 
            days in your billing period.
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Downgrading</h2>
          <p className="text-zinc-600 mb-4">
            When downgrading:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Your current plan continues until the end of the billing period</li>
            <li>The new plan takes effect at the start of the next period</li>
            <li>Check usage limits before downgrading to avoid disruption</li>
          </ul>

          <ProTip>
            Before downgrading, ensure your usage is within the new plan's limits. Links 
            over the limit will continue to work but you won't be able to create new ones.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Billing cycle</h2>
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Choose between monthly and annual billing:
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Monthly:</strong> Pay each month, cancel anytime</li>
            <li><strong>Annual:</strong> Pay upfront, save 10-20% depending on plan</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Payment methods</h2>
          <p className="text-zinc-600 mb-4">
            We accept:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>All major credit cards (Visa, Mastercard, Amex)</li>
            <li>Debit cards</li>
            <li>ACH bank transfer (Enterprise only)</li>
            <li>Wire transfer (Enterprise only)</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Invoices</h2>
          <div className="flex items-start gap-3 mb-4">
            <Receipt className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Access your invoices in Settings → Billing → Invoice history. 
                Download PDFs for accounting.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Canceling</h2>
          <p className="text-zinc-600 mb-4">
            To cancel your subscription:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Go to Settings → Billing</li>
            <li>Click <strong>Cancel subscription</strong></li>
            <li>Select your reason (helps us improve)</li>
            <li>Confirm cancellation</li>
          </ol>
          <p className="text-zinc-600 mb-4">
            After cancellation:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>You keep access until the end of your paid period</li>
            <li>Your links continue to work</li>
            <li>Account reverts to Free plan after the period ends</li>
            <li>Data is retained for 60 days, then deleted</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Need help?</strong> Contact support@utm.one if you have billing 
              questions or need assistance with your subscription.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default ManagingSubscription;
