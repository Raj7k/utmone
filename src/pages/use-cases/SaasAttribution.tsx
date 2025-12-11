import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Layers, Users, LineChart, GitBranch, Clock, Database } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RelatedResources, PeopleAlsoRead } from "@/components/seo/RelatedResources";
import { Button } from "@/components/ui/button";

const SaasAttribution = () => {
  const features = [
    {
      icon: GitBranch,
      title: "Multi-Touch Attribution",
      description: "Track the complete B2B buyer journey from first touch to closed-won across months of touchpoints."
    },
    {
      icon: Users,
      title: "Account-Based Tracking",
      description: "Attribute pipeline and revenue to campaigns at the account level, not just individual leads."
    },
    {
      icon: LineChart,
      title: "Pipeline Attribution",
      description: "See which campaigns generate pipeline, not just leads. Connect marketing spend to revenue."
    },
    {
      icon: Layers,
      title: "Content Attribution",
      description: "Understand which blog posts, webinars, and resources drive qualified leads."
    },
    {
      icon: Clock,
      title: "Long Sales Cycle Support",
      description: "Track touchpoints across 6-12 month enterprise sales cycles without losing attribution."
    },
    {
      icon: Database,
      title: "CRM Integration",
      description: "Push attribution data directly to Salesforce, HubSpot, or your CRM of choice."
    }
  ];

  const useCases = [
    {
      title: "Content Marketing",
      description: "Track which blog posts, ebooks, and webinars drive trial signups and eventually convert to paid customers."
    },
    {
      title: "Paid Acquisition",
      description: "Measure true CAC by channel. Know if your LinkedIn ads generate pipeline or just vanity metrics."
    },
    {
      title: "Product-Led Growth",
      description: "Attribute free trial signups and self-serve conversions to their original marketing touchpoints."
    },
    {
      title: "Outbound Sales",
      description: "Track email sequences, cold outreach, and sales touches alongside marketing attribution."
    }
  ];

  const faqs = [
    {
      question: "How does utm.one handle long B2B sales cycles?",
      answer: "utm.one maintains attribution data for up to 365 days, supporting even the longest enterprise sales cycles. Our identity graph connects anonymous visitors to known leads across their entire journey."
    },
    {
      question: "Can I integrate utm.one with Salesforce?",
      answer: "Yes! utm.one integrates with Salesforce, HubSpot, Pipedrive, and other CRMs. Attribution data flows directly to opportunity and account records."
    },
    {
      question: "How is this different from HubSpot's attribution?",
      answer: "HubSpot tracks touches within HubSpot. utm.one provides unified attribution across all channels—paid ads, organic, email, events, and sales touches—giving you a complete picture."
    },
    {
      question: "Can I track both marketing and sales touches?",
      answer: "Yes. utm.one captures marketing touches via UTM parameters and integrates with your CRM to include sales touches in the attribution model."
    },
    {
      question: "What attribution models does utm.one support?",
      answer: "We support first-touch, last-touch, linear, time-decay, U-shaped, and W-shaped models. You can compare models side-by-side to understand channel contribution."
    },
    {
      question: "How do I attribute pipeline, not just leads?",
      answer: "When you connect your CRM, utm.one tracks deals through the pipeline and attributes revenue to the campaigns that influenced each opportunity."
    },
    {
      question: "Does utm.one work with product-led growth models?",
      answer: "Absolutely. Track free trial signups, product activation, and self-serve upgrades back to their original marketing touchpoints."
    },
    {
      question: "Can I track account-based marketing campaigns?",
      answer: "Yes. utm.one supports account-based attribution, rolling up individual contact touches to the account level for ABM reporting."
    }
  ];

  return (
    <>
      <SEO 
        title="B2B SaaS Marketing Attribution | utm.one"
        description="Track the complete B2B buyer journey. utm.one provides SaaS companies with multi-touch attribution, pipeline tracking, and CRM integration for accurate marketing ROI."
        canonical="https://utm.one/use-cases/saas-attribution"
        keywords={["SaaS attribution", "B2B marketing attribution", "pipeline attribution", "multi-touch attribution", "marketing ROI"]}
      />
      <ArticleSchema
        headline="B2B SaaS Marketing Attribution"
        description="Complete guide to tracking SaaS marketing attribution across long sales cycles."
        author="utm.one"
        datePublished="2025-01-15"
        dateModified="2025-01-15"
        url="https://utm.one/use-cases/saas-attribution"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Use Cases', url: 'https://utm.one/use-cases' },
          { name: 'SaaS Attribution', url: 'https://utm.one/use-cases/saas-attribution' }
        ]}
      />
      <ResourcesLayout>
        {/* Hero */}
        <section className="py-20 border-b border-zinc-200">
          <div className="max-w-[980px] mx-auto px-8">
            <Link
              to="/use-cases"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Use Cases
            </Link>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Layers className="w-4 h-4" />
                SaaS & B2B
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
                Know What's Actually Driving Pipeline
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
                B2B sales cycles are long and complex. utm.one tracks every touchpoint 
                so you can attribute pipeline and revenue to the campaigns that matter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg">
                  <Link to="/early-access">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/features/attribution">See Attribution Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 bg-zinc-50">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              The B2B Attribution Challenge
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h3 className="font-semibold text-zinc-900 mb-2">❌ Without utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "We think content marketing works, but can't prove it"</li>
                  <li>• Lost attribution across 6+ month sales cycles</li>
                  <li>• Can't connect marketing spend to closed deals</li>
                  <li>• Sales and marketing argue about lead quality</li>
                  <li>• Reporting MQLs instead of pipeline</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-blue-200 border-2">
                <h3 className="font-semibold text-blue-700 mb-2">✓ With utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "Blog post X influenced $2.3M in pipeline"</li>
                  <li>• Track touchpoints across 12+ month cycles</li>
                  <li>• See exact ROI for every marketing dollar</li>
                  <li>• Shared attribution data in CRM</li>
                  <li>• Report on pipeline and revenue, not vanity metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              Built for B2B Complexity
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
                  <feature.icon className="w-8 h-8 text-zinc-900 mb-4" />
                  <h3 className="font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 bg-zinc-50">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              How SaaS Teams Use utm.one
            </h2>
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-zinc-200">
                  <h3 className="font-semibold text-zinc-900 mb-2">{useCase.title}</h3>
                  <p className="text-zinc-600">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-zinc-200">
                  <h3 className="font-semibold text-zinc-900 mb-2">{faq.question}</h3>
                  <p className="text-zinc-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-zinc-900 text-white">
          <div className="max-w-[980px] mx-auto px-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Prove Marketing ROI?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join SaaS teams who use utm.one to connect marketing spend 
              to pipeline and revenue.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/early-access">Start Free Trial</Link>
            </Button>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <RelatedResources 
              currentPath="/use-cases/saas-attribution"
              category="use-case"
            />
            <div className="mt-12">
              <PeopleAlsoRead 
                items={[
                  { title: "Ecommerce Tracking", url: "/use-cases/ecommerce-tracking" },
                  { title: "Agency Client Reporting", url: "/use-cases/agency-client-reporting" },
                  { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics" }
                ]}
              />
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

export default SaasAttribution;
