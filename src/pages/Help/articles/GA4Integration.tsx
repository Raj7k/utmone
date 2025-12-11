import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const GA4Integration = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "GA4 integration" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">GA4 integration</h1>
      <p className="lead text-lg text-zinc-500">Send utm.one click data to Google Analytics 4 for unified reporting.</p>
      
      <h2>Why integrate with GA4?</h2>
      <ul>
        <li>See utm.one clicks alongside your other GA4 traffic</li>
        <li>Use GA4's powerful segmentation and reporting</li>
        <li>Combine with existing dashboards</li>
        <li>Attribution across utm.one and direct traffic</li>
      </ul>
      
      <h2>Setup steps</h2>
      <ol>
        <li>Go to Settings → Integrations → GA4</li>
        <li>Enter your GA4 Measurement ID (G-XXXXXXXXXX)</li>
        <li>Optionally add your Measurement Protocol API secret for server-side events</li>
        <li>Click "Connect"</li>
      </ol>
      
      <h2>What data is sent</h2>
      <ul>
        <li>Click events with link ID and destination</li>
        <li>UTM parameters attached to each event</li>
        <li>User properties (device, geo) when available</li>
        <li>Conversion events when tracked</li>
      </ul>
      
      <h2>Important notes</h2>
      <ul>
        <li>Data appears in GA4 within 24-48 hours</li>
        <li>Events appear under "utm_one_click" event name</li>
        <li>No PII is sent to GA4</li>
      </ul>
      
      <FeatureAvailability tier="growth" />
    </article>
    <RelatedArticles articles={[
      { title: "Tracking pixel installation", href: "/help/articles/tracking-pixel" },
      { title: "Analytics dashboard", href: "/help/articles/dashboard-overview" },
    ]} />
  </HelpLayout>
);

export default GA4Integration;
