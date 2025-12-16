import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
          revenue measurement. Installation takes under 5 minutes with our simplified 2-section setup.
        </p>

        <FeatureAvailability tier="free" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Why Install the Pixel?</h2>
        <p className="text-zinc-600 mb-4">
          Without the pixel, you only see click data. With the pixel installed, you unlock:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><strong>Journey Analytics:</strong> See the complete path visitors take across sessions</li>
          <li><strong>Revenue Attribution:</strong> Connect clicks to actual purchases and signups</li>
          <li><strong>Cross-Device Tracking:</strong> Automatic 75-95% accuracy, upgradeable to 100%</li>
          <li><strong>Event Halo:</strong> Measure offline event impact on website traffic</li>
          <li><strong>Custom Event Tracking:</strong> Track conversions, form fills, and any custom action</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">2-Section Architecture</h2>
        <p className="text-zinc-600 mb-6">
          Our simplified setup has just 2 sections. Most users only need Section 1.
        </p>

        {/* Section 1: Main Pixel */}
        <div className="mb-8 border border-zinc-200 rounded-xl overflow-hidden">
          <div className="bg-zinc-50 px-4 py-3 flex items-center gap-3 border-b border-zinc-200">
            <Badge variant="default" className="bg-primary text-primary-foreground">ALL PAGES</Badge>
            <h3 className="text-lg font-semibold text-zinc-900 m-0">Section 1: Main Pixel</h3>
          </div>
          <div className="p-4">
            <p className="text-zinc-600 mb-4">
              Add this code snippet just before the closing <code>&lt;/head&gt;</code> tag on every page:
            </p>
            
            <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-sm"><code>{`<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='https://pixel.utm.one/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'YOUR_WORKSPACE_ID');
</script>`}</code></pre>
            </div>
            
            <p className="text-zinc-600 text-sm mb-4">
              Replace <code>YOUR_WORKSPACE_ID</code> with your actual workspace ID from{" "}
              <strong>Settings → Tracking</strong>.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 m-0">
                <strong>That's it!</strong> The main pixel automatically tracks pageviews, extracts UTM parameters, 
                and provides 75-95% cross-device accuracy without any additional code.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Revenue Tracking */}
        <div className="mb-8 border border-zinc-200 rounded-xl overflow-hidden">
          <div className="bg-zinc-50 px-4 py-3 flex items-center gap-3 border-b border-zinc-200">
            <Badge variant="outline" className="border-amber-500 text-amber-700">THANK-YOU PAGE ONLY</Badge>
            <h3 className="text-lg font-semibold text-zinc-900 m-0">Section 2: Revenue Tracking</h3>
          </div>
          <div className="p-4">
            <p className="text-zinc-600 mb-4">
              Add this code <strong>only on your thank-you/confirmation page</strong> after a purchase:
            </p>
            
            <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-sm"><code>{`<script>
utmone('track', 'purchase', { revenue: 99.99 });
</script>`}</code></pre>
            </div>
            
            <p className="text-zinc-600 text-sm">
              Replace <code>99.99</code> with your actual order value. This enables ROI calculations 
              and revenue attribution in your dashboard.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Platform-Specific Installation</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">WordPress</h3>
            <p className="text-zinc-600 text-sm mb-2">
              <strong>Option 1:</strong> Appearance → Customize → Additional CSS/Scripts
            </p>
            <p className="text-zinc-600 text-sm">
              <strong>Option 2:</strong> Install "Header Footer Code Manager" plugin and paste in Header section
            </p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Shopify</h3>
            <p className="text-zinc-600 text-sm">
              Online Store → Themes → Edit code → <code>theme.liquid</code> → paste before <code>&lt;/head&gt;</code>
            </p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Webflow</h3>
            <p className="text-zinc-600 text-sm">
              Project Settings → Custom Code → Head Code
            </p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Squarespace</h3>
            <p className="text-zinc-600 text-sm">
              Settings → Advanced → Code Injection → Header
            </p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Google Tag Manager</h3>
            <p className="text-zinc-600 text-sm">
              Tags → New → Custom HTML → paste pixel → Trigger: All Pages → Save & Publish
            </p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">React / Next.js</h3>
            <p className="text-zinc-600 text-sm">
              Add to <code>index.html</code> or use <code>useEffect</code> in your root component
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Platform-Specific Revenue Snippets</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-3">Shopify (checkout.liquid)</h3>
          <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm"><code>{`{% if first_time_accessed %}
<script>
utmone('track', 'purchase', { 
  revenue: {{ total_price | money_without_currency | remove: ',' }} 
});
</script>
{% endif %}`}</code></pre>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-3">WooCommerce (thankyou.php)</h3>
          <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm"><code>{`<script>
utmone('track', 'purchase', { 
  revenue: <?php echo $order->get_total(); ?> 
});
</script>`}</code></pre>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Tracking Custom Events</h2>
        <p className="text-zinc-600 mb-4">
          Once the pixel is installed, you can track any custom event using the <code>utmone()</code> function:
        </p>
        
        <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
          <pre className="text-sm"><code>{`// Track a purchase (with revenue)
utmone('track', 'purchase', {
  revenue: 99.99,
  currency: 'USD',
  order_id: 'ORD-123'
});

// Track a form submission
utmone('track', 'lead', {
  form_name: 'contact_form'
});

// Track a signup
utmone('track', 'signup', {
  plan: 'starter'
});`}</code></pre>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">100% Cross-Device Accuracy</h2>
        <p className="text-zinc-600 mb-4">
          The main pixel automatically achieves 75-95% cross-device accuracy using probabilistic matching. 
          To upgrade to 100% accuracy, add the <code>identify()</code> call after user login or signup:
        </p>
        
        <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 mb-4 overflow-x-auto">
          <pre className="text-sm"><code>{`// After successful login or signup
utmone('identify', 'user@email.com', 'John Doe');`}</code></pre>
        </div>

        <ProTip>
          The identify() call requires developer involvement. Go to <strong>Settings → Tracking</strong> and 
          use the "Developer Handoff" section to share platform-specific code snippets with your developer.
        </ProTip>

        {/* Advanced Section */}
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="advanced" className="border border-zinc-200 rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <span className="font-semibold text-zinc-900">Advanced: Funnel Tracking</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-zinc-600 mb-4">
                Track multi-step conversion funnels to identify drop-off points:
              </p>
              <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm"><code>{`// Step 1: User views pricing
utmone('track', 'funnel', { step: 'pricing_view' });

// Step 2: User clicks checkout
utmone('track', 'funnel', { step: 'checkout_start' });

// Step 3: User enters payment
utmone('track', 'funnel', { step: 'payment_info' });

// Step 4: Purchase complete
utmone('track', 'purchase', { revenue: 99.99 });`}</code></pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Verifying Installation</h2>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Open your browser's developer tools (F12)</li>
          <li>Go to the Network tab</li>
          <li>Visit your website</li>
          <li>Filter by "utm.one" or "pixel"</li>
          <li>You should see a successful request (200 status)</li>
          <li>Check your utm.one dashboard—pageviews should appear within 30 seconds</li>
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
            { title: "Conversion Tracking", href: "/help/attribution/conversion-tracking" },
            { title: "Identity Graph", href: "/help/attribution/identity-graph" },
            { title: "Event Halo Explained", href: "/help/events/event-halo" },
            { title: "API Documentation", href: "/help/integrations/api" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default TrackingPixel;
