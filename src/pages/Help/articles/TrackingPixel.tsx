import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const TrackingPixel = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Getting Started", href: "/help/getting-started" },
          { label: "Installing the Tracking Pixel" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Installing the Tracking Pixel</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          The utm.one tracking pixel enables advanced attribution, customer journey tracking, and 
          revenue measurement. Installation takes under 5 minutes.
        </p>

        <FeatureAvailability tier="free" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Why Install the Pixel?</h2>
        <p className="text-zinc-600 mb-4">
          Without the pixel, you only see click data. With the pixel installed, you unlock:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><strong>Journey Analytics:</strong> See the complete path visitors take across sessions</li>
          <li><strong>Revenue Attribution:</strong> Connect clicks to actual purchases and signups</li>
          <li><strong>Cross-Device Tracking:</strong> Identify visitors across desktop and mobile</li>
          <li><strong>Event Halo:</strong> Measure offline event impact on website traffic</li>
          <li><strong>Custom Event Tracking:</strong> Track conversions, form fills, and any custom action</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Installation Methods</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-zinc-900 mb-3">Method 1: Direct Script (Recommended)</h3>
          <p className="text-zinc-600 mb-4">Add this code snippet just before the closing <code>&lt;/head&gt;</code> tag:</p>
          
          <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm"><code>{`<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://pixel.utm.one/tracker.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','utmLayer','YOUR_WORKSPACE_ID');
</script>`}</code></pre>
          </div>
          
          <p className="text-zinc-600 text-sm">Replace <code>YOUR_WORKSPACE_ID</code> with your actual workspace ID found in Settings → Tracking.</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-zinc-900 mb-3">Method 2: Google Tag Manager</h3>
          <ol className="list-decimal pl-6 text-zinc-600 space-y-2">
            <li>Open Google Tag Manager and select your container</li>
            <li>Click "Tags" → "New"</li>
            <li>Choose "Custom HTML" tag type</li>
            <li>Paste the pixel code from Method 1</li>
            <li>Set trigger to "All Pages"</li>
            <li>Save and publish your container</li>
          </ol>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-zinc-900 mb-3">Method 3: NPM Package</h3>
          <p className="text-zinc-600 mb-4">For React, Vue, or other JS frameworks:</p>
          
          <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm"><code>{`npm install @utm-one/pixel

// In your app initialization
import { initUtmPixel } from '@utm-one/pixel';
initUtmPixel('YOUR_WORKSPACE_ID');`}</code></pre>
          </div>
        </div>

        <ProTip>
          Test your installation by visiting your site and checking the utm.one dashboard. 
          New pageviews should appear within 30 seconds.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Tracking Custom Events</h2>
        <p className="text-zinc-600 mb-4">
          Once the pixel is installed, you can track any custom event:
        </p>
        
        <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
          <pre className="text-sm"><code>{`// Track a purchase
window.utm.track('purchase', {
  revenue: 99.99,
  currency: 'USD',
  product_id: 'SKU-123'
});

// Track a form submission
window.utm.track('form_submit', {
  form_name: 'contact_form'
});

// Track a signup
window.utm.track('signup', {
  plan: 'starter'
});`}</code></pre>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Platform-Specific Guides</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">WordPress</h3>
            <p className="text-zinc-600 text-sm">Add to header via theme customizer or use a header scripts plugin</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Shopify</h3>
            <p className="text-zinc-600 text-sm">Add to theme.liquid before closing head tag</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Webflow</h3>
            <p className="text-zinc-600 text-sm">Project Settings → Custom Code → Head Code</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Squarespace</h3>
            <p className="text-zinc-600 text-sm">Settings → Advanced → Code Injection → Header</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Verifying Installation</h2>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Open your browser's developer tools (F12)</li>
          <li>Go to the Network tab</li>
          <li>Visit your website</li>
          <li>Filter by "utm.one" or "pixel"</li>
          <li>You should see a successful request (200 status)</li>
        </ol>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Privacy & Compliance</h2>
        <p className="text-zinc-600 mb-4">
          The utm.one pixel is designed with privacy in mind:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>No third-party cookies used</li>
          <li>First-party data only</li>
          <li>GDPR and CCPA compliant</li>
          <li>Configurable data retention periods</li>
          <li>Respects Do Not Track browser settings</li>
        </ul>

        <RelatedArticles
          articles={[
            { title: "Revenue Attribution Setup", href: "/help/attribution/revenue-setup" },
            { title: "Customer Journey Analytics", href: "/help/attribution/journey-analytics" },
            { title: "Event Halo Explained", href: "/help/events/event-halo" },
            { title: "API Documentation", href: "/help/integrations/api" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default TrackingPixel;
