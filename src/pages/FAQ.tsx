import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { FAQSchema } from "@/components/seo/SchemaMarkup";

const FAQ = () => {
  const generalFAQs = [
    {
      question: "What is utm.one?",
      answer: (
        <div className="space-y-4">
          <p>
            utm.one is an enterprise link shortening and tracking platform with built-in UTM parameter management, branded QR code generation, and comprehensive analytics.
          </p>
          <p>
            We help marketing, sales, and operations teams maintain clean, consistent link tracking across all campaigns.
          </p>
        </div>
      ),
    },
    {
      question: "How is utm.one different from Bitly or Rebrandly?",
      answer: (
        <div className="space-y-4">
          <p>
            utm.one differentiates in three key areas:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>UTM-first design:</strong> Enforce consistent UTM naming conventions across your entire team</li>
            <li><strong>Branded QR codes:</strong> Generate multiple QR variants with logos, colors, and tracking</li>
            <li><strong>Enterprise governance:</strong> Centralized link management with approval workflows and audit logs</li>
          </ul>
        </div>
      ),
    },
    {
      question: "Do I need a custom domain?",
      answer: (
        <div className="space-y-4">
          <p>
            You can start with a utm.one subdomain (e.g., yourcompany.utm.one), but we strongly recommend using your own custom domain (e.g., go.yourcompany.com) for:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Higher click-through rates (users trust branded links)</li>
            <li>Consistent brand experience</li>
            <li>Better email deliverability</li>
            <li>Professional appearance</li>
          </ul>
          <p>
            Custom domains are available on all plans: Pro includes 1 domain, Business includes 5 domains, and Enterprise includes unlimited domains.
          </p>
        </div>
      ),
    },
  ];

  const accountFAQs = [
    {
      question: "How much does utm.one cost?",
      answer: (
        <div className="space-y-4">
          <p>
            We offer three plans:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Free:</strong> 100 links/month, 10K clicks/month, 90-day analytics</li>
            <li><strong>Pro ($20/month):</strong> 1,000 links/month, 1 custom domain, 100K clicks/month, 1-year analytics, priority support</li>
            <li><strong>Business ($99/month):</strong> 10K links, 5 custom domains, unlimited clicks, 3-year analytics, advanced features</li>
            <li><strong>Enterprise ($300/month):</strong> Unlimited links, unlimited domains, unlimited clicks, SSO, SLA, dedicated support</li>
          </ul>
          <p>
            All plans include unlimited team members (no per-seat pricing).
          </p>
          <Link to="/pricing" className="text-primary hover:underline font-medium">
            View detailed pricing →
          </Link>
        </div>
      ),
    },
    {
      question: "Can I invite my team?",
      answer: (
        <div className="space-y-4">
          <p>
            Yes! All paid plans include unlimited team members with no per-seat charges.
          </p>
          <p>
            Team members can have different roles (Admin, Editor, Viewer) with granular permissions for workspace management, link creation, and analytics access.
          </p>
        </div>
      ),
    },
    {
      question: "How do I cancel my subscription?",
      answer: (
        <div className="space-y-4">
          <p>
            You can cancel anytime from your workspace Settings → Billing page. Your subscription will remain active until the end of your current billing period.
          </p>
          <p>
            Your links will continue working after cancellation, but you'll lose access to analytics and advanced features.
          </p>
        </div>
      ),
    },
  ];

  const linksFAQs = [
    {
      question: "How do I create a short link?",
      answer: (
        <div className="space-y-4">
          <p>
            From your Dashboard, click "Create Link" and provide:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Destination URL (where the link redirects)</li>
            <li>Custom slug (the short part of the URL)</li>
            <li>Title (internal name for your team)</li>
            <li>UTM parameters (optional but recommended)</li>
          </ul>
          <Link to="/docs#first-link" className="text-primary hover:underline font-medium">
            View full guide →
          </Link>
        </div>
      ),
    },
    {
      question: "What are UTM parameters and why should I use them?",
      answer: (
        <div className="space-y-4">
          <p>
            UTM parameters are tags added to your URLs to track campaign performance in Google Analytics and other analytics platforms.
          </p>
          <p>
            The five parameters are:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>utm_source:</strong> Where traffic originates (e.g., google, newsletter)</li>
            <li><strong>utm_medium:</strong> Marketing medium (e.g., email, social, cpc)</li>
            <li><strong>utm_campaign:</strong> Campaign name (e.g., summer-sale-2024)</li>
            <li><strong>utm_term:</strong> Paid keywords (optional)</li>
            <li><strong>utm_content:</strong> Content differentiation (optional)</li>
          </ul>
          <Link to="/docs#utm-basics" className="text-primary hover:underline font-medium">
            Learn more about UTM parameters →
          </Link>
        </div>
      ),
    },
    {
      question: "Can I edit a link after creating it?",
      answer: (
        <div className="space-y-4">
          <p>
            Yes, you can edit the destination URL, title, description, and UTM parameters at any time.
          </p>
          <p>
            The short URL slug cannot be changed after creation to preserve link integrity and avoid broken links.
          </p>
        </div>
      ),
    },
    {
      question: "Do my links expire?",
      answer: (
        <div className="space-y-4">
          <p>
            Links are permanent by default and will work forever unless you:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Set an expiration date</li>
            <li>Set a maximum click limit</li>
            <li>Manually pause or archive the link</li>
          </ul>
          <p>
            We guarantee link permanence even if our service shuts down through our self-hosting option.
          </p>
        </div>
      ),
    },
  ];

  const qrFAQs = [
    {
      question: "How do I create a QR code?",
      answer: (
        <div className="space-y-4">
          <p>
            Every short link can generate multiple branded QR code variants.
          </p>
          <p>
            From the link detail page, click "Generate QR Code" and customize:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Brand colors</li>
            <li>Logo placement</li>
            <li>Corner style (square or rounded)</li>
            <li>Frame text</li>
            <li>Export format (PNG or SVG)</li>
          </ul>
        </div>
      ),
    },
    {
      question: "Can I track QR code scans separately?",
      answer: (
        <div className="space-y-4">
          <p>
            Yes! Each QR code variant has its own tracking ID, allowing you to see performance by QR code placement.
          </p>
          <p>
            For example, you can track "booth-left-standee" vs "booth-right-standee" to optimize your event setup.
          </p>
        </div>
      ),
    },
  ];

  const analyticsFAQs = [
    {
      question: "What analytics do I get?",
      answer: (
        <div className="space-y-4">
          <p>
            utm.one provides comprehensive click analytics including:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Total clicks and unique visitors</li>
            <li>Device breakdown (desktop, mobile, tablet)</li>
            <li>Browser and OS distribution</li>
            <li>Geographic location (country, region, city)</li>
            <li>Referrer sources</li>
            <li>Campaign performance (UTM-based rollups)</li>
            <li>Time-series trends</li>
          </ul>
        </div>
      ),
    },
    {
      question: "How long is analytics data stored?",
      answer: (
        <div className="space-y-4">
          <p>
            Data retention depends on your plan:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Free:</strong> 90 days</li>
            <li><strong>Pro:</strong> 1 year</li>
            <li><strong>Business:</strong> 3 years</li>
          </ul>
          <p>
            You can export your data at any time in CSV or Excel format.
          </p>
        </div>
      ),
    },
  ];

  const allFAQs = [
    ...generalFAQs.map(faq => ({ question: faq.question, answer: typeof faq.answer === 'string' ? faq.answer : '' })),
    ...accountFAQs.map(faq => ({ question: faq.question, answer: typeof faq.answer === 'string' ? faq.answer : '' })),
    ...linksFAQs.map(faq => ({ question: faq.question, answer: typeof faq.answer === 'string' ? faq.answer : '' })),
    ...qrFAQs.map(faq => ({ question: faq.question, answer: typeof faq.answer === 'string' ? faq.answer : '' })),
    ...analyticsFAQs.map(faq => ({ question: faq.question, answer: typeof faq.answer === 'string' ? faq.answer : '' }))
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="FAQ - Frequently Asked Questions"
        description="Common questions about utm.one answered: pricing, features, link management, UTM parameters, QR codes, analytics, and more."
        canonical="https://utm.one/faq"
        keywords={['utm.one faq', 'link shortener questions', 'UTM help', 'QR code FAQ', 'analytics questions']}
      />
      <FAQSchema questions={allFAQs} />
      <Navigation />

      {/* Hero */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Common questions about utm.one, answered.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-8 py-16 space-y-16">
        {/* General */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            General
          </h2>
          <FAQAccordion items={generalFAQs} />
        </section>

        {/* Account & Billing */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Account & Billing
          </h2>
          <FAQAccordion items={accountFAQs} />
        </section>

        {/* Links */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Links & UTM Parameters
          </h2>
          <FAQAccordion items={linksFAQs} />
        </section>

        {/* QR Codes */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            QR Codes
          </h2>
          <FAQAccordion items={qrFAQs} />
        </section>

        {/* Analytics */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Analytics & Reporting
          </h2>
          <FAQAccordion items={analyticsFAQs} />
        </section>

        {/* Still Need Help */}
        <section className="border-t border-border pt-16">
          <div className="bg-muted/20 border border-border rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link
              to="/support"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
