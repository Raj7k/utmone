import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, FileText, Lock, Users, Palette, BarChart3 } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RelatedResources, PeopleAlsoRead } from "@/components/seo/RelatedResources";
import { Button } from "@/components/ui/button";

const AgencyClientReporting = () => {
  const features = [
    {
      icon: Building2,
      title: "Multi-Client Workspaces",
      description: "Isolated workspaces per client with separate domains, UTM conventions, and team permissions."
    },
    {
      icon: FileText,
      title: "White-Label Reports",
      description: "Generate branded PDF reports with your agency logo and client branding—no utm.one visible."
    },
    {
      icon: Lock,
      title: "Client Access Control",
      description: "Give clients read-only access to their analytics without seeing other accounts."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Assign team members to specific client accounts with role-based permissions."
    },
    {
      icon: Palette,
      title: "Custom Domains",
      description: "Use client-branded short domains (go.clientbrand.com) for professional campaign links."
    },
    {
      icon: BarChart3,
      title: "Cross-Client Analytics",
      description: "Agency-level dashboard comparing performance across all client accounts."
    }
  ];

  const useCases = [
    {
      title: "Campaign Reporting",
      description: "Generate beautiful monthly reports showing clicks, conversions, and revenue attribution for each client."
    },
    {
      title: "UTM Governance",
      description: "Enforce consistent UTM naming conventions across your team so every client gets clean, reliable data."
    },
    {
      title: "Client Onboarding",
      description: "Set up new client workspaces in minutes with custom domains, brand settings, and UTM templates."
    },
    {
      title: "Performance Benchmarking",
      description: "Compare campaign performance across clients to identify best practices and optimization opportunities."
    }
  ];

  const faqs = [
    {
      question: "Can I white-label utm.one for my agency?",
      answer: "Yes! Business and Enterprise plans include white-label options. Generate reports with your agency branding, and clients never see utm.one."
    },
    {
      question: "How many client workspaces can I create?",
      answer: "Business plans include 10 workspaces, Enterprise plans include unlimited. Each workspace is fully isolated with its own domains, UTMs, and analytics."
    },
    {
      question: "Can clients access their own analytics?",
      answer: "Yes. Invite clients as 'Viewer' role to see their analytics dashboards and reports without access to other accounts or admin functions."
    },
    {
      question: "How do I manage UTM consistency across team members?",
      answer: "Create UTM templates and enforce naming rules at the workspace level. utm.one prevents team members from creating non-compliant links."
    },
    {
      question: "Can I use different domains for each client?",
      answer: "Absolutely. Each client workspace can have its own custom short domains (go.client1.com, go.client2.com) for branded links."
    },
    {
      question: "How do I generate client reports?",
      answer: "One-click PDF export with customizable date ranges, metrics, and branding. Schedule automated monthly reports sent directly to clients."
    },
    {
      question: "Is there an agency-level dashboard?",
      answer: "Yes. See all client accounts in one view, compare performance, and identify which clients need attention."
    },
    {
      question: "How does billing work for agencies?",
      answer: "One agency subscription covers all client workspaces. No per-client fees. Scale to as many clients as you need."
    }
  ];

  return (
    <>
      <SEO 
        title="Agency UTM Tracking & Client Reporting | utm.one"
        description="Manage multiple clients with isolated workspaces, white-label reports, and UTM governance. utm.one helps agencies deliver professional campaign tracking at scale."
        canonical="https://utm.one/use-cases/agency-client-reporting"
        keywords={["agency UTM tracking", "client reporting", "white-label analytics", "multi-client management", "agency marketing tools"]}
      />
      <ArticleSchema
        headline="Agency UTM Tracking & Client Reporting"
        description="Complete guide to managing agency client campaigns with utm.one."
        author="utm.one"
        datePublished="2025-01-15"
        dateModified="2025-01-15"
        url="https://utm.one/use-cases/agency-client-reporting"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Use Cases', url: 'https://utm.one/use-cases' },
          { name: 'Agency Client Reporting', url: 'https://utm.one/use-cases/agency-client-reporting' }
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                <Building2 className="w-4 h-4" />
                Agencies
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
                Professional Client Reporting at Scale
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
                Manage dozens of clients with isolated workspaces, consistent UTM governance, 
                and beautiful white-label reports your clients will love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg">
                  <Link to="/early-access">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/solutions/agencies">See Agency Features</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 bg-zinc-50">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              The Agency Scaling Challenge
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h3 className="font-semibold text-zinc-900 mb-2">❌ Without utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• Spreadsheets for tracking client links</li>
                  <li>• Inconsistent UTM naming across team members</li>
                  <li>• Hours spent building manual reports</li>
                  <li>• No way to benchmark client performance</li>
                  <li>• Clients asking about third-party tools</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-orange-200 border-2">
                <h3 className="font-semibold text-orange-700 mb-2">✓ With utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• Isolated workspace per client</li>
                  <li>• Enforced UTM templates and naming rules</li>
                  <li>• One-click branded PDF reports</li>
                  <li>• Agency dashboard comparing all clients</li>
                  <li>• White-label—clients see your brand only</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              Built for Agency Workflows
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
              How Agencies Use utm.one
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
              Ready to Scale Your Agency?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join agencies who use utm.one to deliver professional client 
              reporting without the manual work.
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
              resources={[
                { title: "Influencer Campaigns", path: "/use-cases/influencer-campaigns", type: "guide" as const },
                { title: "Agency Solution Page", path: "/solutions/agencies", type: "guide" as const },
                { title: "utm.one vs Rebrandly", path: "/compare/utm-one-vs-rebrandly", type: "comparison" as const }
              ]}
            />
            <div className="mt-12">
              <PeopleAlsoRead currentPath="/use-cases/agency-client-reporting" />
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

export default AgencyClientReporting;
