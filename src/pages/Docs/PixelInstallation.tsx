import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TableOfContents } from "@/components/resources/TableOfContents";

const PixelInstallation = () => {
  const [copied, setCopied] = useState(false);

  const pixelCode = `<!-- utm.one Conversion Tracking Pixel -->
<script>
  (function() {
    window.utmone = window.utmone || function() {
      (utmone.q = utmone.q || []).push(arguments);
    };
    
    // Track page view
    utmone('init', 'YOUR_PIXEL_ID');
    utmone('track', 'PageView');
  })();
</script>
<script async src="https://cdn.utm.one/pixel.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixelCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingNavigation />

      {/* Hero */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold text-foreground mb-6">
              tracking pixel installation
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Install the utm.one tracking pixel to capture conversion events and attribute them to your short links.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-16">
          {/* Main Content */}
          <div className="space-y-24">
            {/* Quick Start */}
            <section id="quick-start">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                quick start
              </h2>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Critical Requirement</h3>
                    <p className="text-muted-foreground text-sm">
                      Without the tracking pixel installed on your website, conversion tracking will not work. 
                      The pixel must be placed in the <code className="text-primary">&lt;head&gt;</code> section of your website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">get your pixel id</h3>
                      <p className="text-muted-foreground mb-4">
                        Navigate to Settings → Tracking Pixel in your utm.one dashboard to find your unique Pixel ID.
                      </p>
                      <Link to="/settings/integrations">
                        <Button variant="outline" size="sm">
                          Go to Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">copy the pixel code</h3>
                      <p className="text-muted-foreground mb-4">
                        Copy the tracking pixel snippet and replace YOUR_PIXEL_ID with your actual Pixel ID.
                      </p>
                      <div className="relative">
                        <pre className="bg-muted/50 p-4 rounded-xl overflow-x-auto text-sm">
                          <code>{pixelCode}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="absolute top-2 right-2"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">install on your website</h3>
                      <p className="text-muted-foreground">
                        Paste the pixel code in the <code className="text-primary">&lt;head&gt;</code> tag 
                        of your website, before the closing <code className="text-primary">&lt;/head&gt;</code> tag.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-2xl p-8 bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">verify installation</h3>
                      <p className="text-muted-foreground">
                        Check your browser console for confirmation that the pixel is loading correctly. 
                        You should see "utm.one pixel loaded" in the console.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Event Types */}
            <section id="event-types">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                tracking events
              </h2>
              
              <p className="text-lg text-foreground leading-relaxed mb-6">
                The utm.one pixel can track different types of conversion events beyond page views.
              </p>

              <div className="space-y-4">
                {[
                  { 
                    event: "PageView", 
                    desc: "Automatically tracked when the pixel loads. No additional code needed.",
                    code: `utmone('track', 'PageView');`
                  },
                  { 
                    event: "Lead", 
                    desc: "Track form submissions, newsletter signups, or lead generation events.",
                    code: `utmone('track', 'Lead');`
                  },
                  { 
                    event: "Purchase", 
                    desc: "Track e-commerce transactions with optional revenue data.",
                    code: `utmone('track', 'Purchase', { revenue: 99.99, currency: 'USD' });`
                  },
                  { 
                    event: "SignUp", 
                    desc: "Track account creation or user registration events.",
                    code: `utmone('track', 'SignUp');`
                  },
                  { 
                    event: "Custom", 
                    desc: "Track any custom event with your own event name.",
                    code: `utmone('track', 'Custom', { event_name: 'button_click' });`
                  },
                ].map((event) => (
                  <div key={event.event} className="border border-border rounded-xl p-6 bg-card">
                    <div className="flex items-start gap-4 mb-3">
                      <Code className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <code className="text-primary font-mono text-sm font-semibold">{event.event}</code>
                        <p className="text-muted-foreground mt-2 text-sm">{event.desc}</p>
                      </div>
                    </div>
                    <pre className="bg-muted/50 p-3 rounded-lg overflow-x-auto text-xs mt-4">
                      <code>{event.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>

            {/* Implementation Examples */}
            <section id="examples">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                implementation examples
              </h2>

              <div className="space-y-8">
                {/* React Example */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">React / Next.js</h3>
                  <pre className="bg-muted/50 p-6 rounded-2xl overflow-x-auto text-sm">
                    <code>{`// In your _app.js or layout component
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize pixel
    window.utmone('init', 'YOUR_PIXEL_ID');
    
    // Track page view on mount
    window.utmone('track', 'PageView');
  }, []);

  return <Component {...pageProps} />;
}

// Track conversion on button click
function CheckoutButton() {
  const handleClick = () => {
    window.utmone('track', 'Purchase', { 
      revenue: 99.99, 
      currency: 'USD' 
    });
  };
  
  return <button onClick={handleClick}>Complete Purchase</button>;
}`}</code>
                  </pre>
                </div>

                {/* Vanilla JS Example */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Vanilla JavaScript</h3>
                  <pre className="bg-muted/50 p-6 rounded-2xl overflow-x-auto text-sm">
                    <code>{`<!-- Add to your form submission -->
<form id="leadForm">
  <input type="email" name="email" required />
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Track lead conversion
    window.utmone('track', 'Lead');
    
    // Submit form
    this.submit();
  });
</script>`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting">
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                troubleshooting
              </h2>

              <div className="space-y-6">
                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Pixel not loading
                  </h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>• Check that the pixel code is in the <code className="text-primary">&lt;head&gt;</code> section</li>
                    <li>• Verify your Pixel ID is correct</li>
                    <li>• Check browser console for JavaScript errors</li>
                    <li>• Ensure ad blockers are disabled during testing</li>
                  </ul>
                </div>

                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Conversions not tracking
                  </h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>• Ensure the user clicked a utm.one short link first</li>
                    <li>• Check that the visitor_id cookie is set</li>
                    <li>• Verify event code is being called correctly</li>
                    <li>• Allow 5-10 minutes for events to appear in dashboard</li>
                  </ul>
                </div>

                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Need help?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Contact support if you're still experiencing issues. Include your Pixel ID and 
                    browser console errors if available.
                  </p>
                  <Link to="/support">
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <section className="border-t border-border pt-16">
              <div className="bg-muted/20 border border-border rounded-2xl p-12 text-center">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  pixel installed? what's next?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Now you can view conversion analytics and track your funnel performance.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/dashboard/analytics">
                    <Button variant="marketing">
                      View Analytics
                    </Button>
                  </Link>
                  <Link to="/docs/api">
                    <Button variant="outline">
                      API Documentation
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Table of Contents */}
          <TableOfContents />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PixelInstallation;
