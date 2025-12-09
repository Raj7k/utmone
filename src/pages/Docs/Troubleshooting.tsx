import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const troubleshootingItems = [
  {
    id: "domain-not-working",
    question: "My custom domain isn't working",
    answer: `Custom domains require two DNS configurations:
    
1. **TXT Record** for verification: Add a TXT record with name "_utm-verification" and your verification code.

2. **CNAME/A Record** for routing:
   - For subdomains (go.example.com): Add a CNAME pointing to go.utm.one
   - For root domains: Use ALIAS/ANAME if your registrar supports it, or use Cloudflare

**Common issues:**
- DNS changes can take up to 48 hours to propagate
- Make sure you're not including "https://" in the DNS value
- Check for typos in your verification code`
  },
  {
    id: "analytics-not-showing",
    question: "Analytics aren't showing any data",
    answer: `If your analytics dashboard is empty:

1. **Check the tracking pixel:** Ensure the pixel is installed correctly on your destination pages
2. **Verify the time range:** The date picker might be set to a period with no clicks
3. **Wait a few minutes:** Analytics update in near real-time, but there may be a slight delay
4. **Check ad blockers:** Some browsers or extensions block tracking scripts

**For new links:** It can take up to 5 minutes for the first click to appear in analytics.`
  },
  {
    id: "link-not-redirecting",
    question: "My link isn't redirecting properly",
    answer: `If your short link isn't working:

1. **Check if the link is active:** Go to the link detail page and verify status is "Active"
2. **Verify the destination URL:** Make sure the destination URL is valid and accessible
3. **Check expiration:** The link might have expired or hit its click limit
4. **Clear cache:** Try the link in an incognito window or clear your browser cache

**Edge cases:**
- Links with password protection require the password to redirect
- Geo-targeted links may redirect differently based on your location`
  },
  {
    id: "qr-not-scanning",
    question: "My QR code won't scan",
    answer: `QR code scanning issues are usually related to:

1. **Size too small:** Ensure the QR code is at least 1 inch (2.5cm) when printed
2. **Low contrast:** The QR code needs high contrast between foreground and background
3. **Logo too large:** If you've added a center logo, it might be covering too much of the code
4. **Image quality:** Download as SVG for print, not PNG at low resolution

**Testing tip:** Always test your QR code on multiple devices before printing.`
  },
  {
    id: "utm-not-appending",
    question: "UTM parameters aren't being added to my URLs",
    answer: `If UTM parameters aren't appearing:

1. **Check your link settings:** Verify UTM parameters are configured on the link
2. **Destination URL format:** If your destination already has a query string, we append with "&" not "?"
3. **UTM override:** Some destinations strip UTM parameters—check with your landing page platform

**Note:** UTM parameters are appended at redirect time, so they won't appear in the short URL itself.`
  },
  {
    id: "team-cant-access",
    question: "Team members can't access the workspace",
    answer: `If team members are having access issues:

1. **Check invitation status:** Verify the invite was sent and accepted
2. **Correct workspace:** Team members might be in a different workspace
3. **Role permissions:** Their role might not have access to certain features
4. **SSO configuration:** If using SSO, ensure their email domain is configured

**To resend an invite:** Go to Settings → Team → click the resend icon next to the member.`
  },
];

export default function Troubleshooting() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Troubleshooting - Documentation"
        description="Common issues and solutions for utm.one. Find answers to frequently encountered problems."
        canonical="https://utm.one/docs/troubleshooting"
        keywords={['troubleshooting', 'help', 'support', 'common issues', 'FAQ']}
      />

      <div className="max-w-4xl mx-auto px-8 py-16">
        <Link to="/docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          back to docs
        </Link>

        <div className="space-y-12">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">Troubleshooting</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              common issues and how to fix them.
            </p>
          </div>

          {/* Quick checks */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Before You Begin</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Check system status</h3>
                  <p className="text-sm text-muted-foreground">
                    Visit <Link to="/status" className="text-primary hover:underline">status.utm.one</Link> for any ongoing issues
                  </p>
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Clear cache</h3>
                  <p className="text-sm text-muted-foreground">
                    Try hard refresh (Cmd+Shift+R) or incognito mode
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Common Issues</h2>
            
            <Accordion type="single" collapsible className="space-y-2">
              {troubleshootingItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border border-border rounded-xl overflow-hidden bg-card">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="text-muted-foreground whitespace-pre-line pl-8">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Still need help */}
          <section className="bg-card border border-border rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to assist you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/support"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}