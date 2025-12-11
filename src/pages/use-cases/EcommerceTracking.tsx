import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, TrendingUp, BarChart3, Target, Zap, Shield } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RelatedResources, PeopleAlsoRead } from "@/components/seo/RelatedResources";
import { Button } from "@/components/ui/button";

const EcommerceTracking = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Product-Level Attribution",
      description: "Track which campaigns drive sales for specific products, categories, and collections with granular UTM parameters."
    },
    {
      icon: TrendingUp,
      title: "Revenue Attribution",
      description: "Connect every dollar of revenue back to its source campaign, ad creative, and customer touchpoint."
    },
    {
      icon: BarChart3,
      title: "Multi-Touch Journey",
      description: "See the complete customer journey from first click to purchase across all marketing channels."
    },
    {
      icon: Target,
      title: "ROAS Optimization",
      description: "Calculate true Return on Ad Spend by attributing conversions to the exact campaigns that drove them."
    },
    {
      icon: Zap,
      title: "Real-Time Analytics",
      description: "Monitor campaign performance in real-time during flash sales, product launches, and promotional events."
    },
    {
      icon: Shield,
      title: "Clean Data Governance",
      description: "Enforce consistent UTM naming conventions across all marketing channels and team members."
    }
  ];

  const useCases = [
    {
      title: "Shopify & WooCommerce",
      description: "Track every product link, collection page, and checkout URL with consistent UTM parameters that integrate seamlessly with your ecommerce platform's analytics."
    },
    {
      title: "Email Marketing Campaigns",
      description: "Tag abandoned cart emails, product recommendations, and promotional newsletters to measure email-driven revenue accurately."
    },
    {
      title: "Influencer & Affiliate Programs",
      description: "Give each influencer unique tracked links to measure their true impact on sales, not just clicks."
    },
    {
      title: "Paid Advertising",
      description: "Track Facebook, Google, TikTok, and Pinterest ads with standardized UTMs that make cross-platform comparison possible."
    }
  ];

  const faqs = [
    {
      question: "How does utm.one integrate with Shopify?",
      answer: "utm.one works with any ecommerce platform including Shopify, WooCommerce, Magento, and BigCommerce. Simply use our tracked links in your marketing campaigns, and the UTM parameters flow through to your platform's analytics automatically."
    },
    {
      question: "Can I track revenue attribution without developer help?",
      answer: "Yes! Our tracking pixel takes 2 minutes to install. Once active, it automatically captures conversion events and attributes revenue to the campaigns that drove them."
    },
    {
      question: "How accurate is ecommerce attribution with utm.one?",
      answer: "utm.one uses Clean Track Intelligence™ to provide 95%+ attribution accuracy by combining first-party data, cross-device tracking, and probabilistic identity matching."
    },
    {
      question: "What's the difference between utm.one and Google Analytics for ecommerce?",
      answer: "While GA4 shows you traffic sources, utm.one provides revenue attribution at the campaign and creative level. You'll know exactly which Facebook ad creative drove $50,000 in sales, not just that 'Facebook' drove traffic."
    },
    {
      question: "Can I track influencer sales without coupon codes?",
      answer: "Absolutely. Each influencer gets unique tracked links that attribute sales directly to them, even without discount codes. This gives you accurate ROI data for influencer partnerships."
    },
    {
      question: "How do I handle multi-touch customer journeys?",
      answer: "utm.one captures every touchpoint in the customer journey and lets you choose your attribution model—first touch, last touch, linear, or time-decay—to understand how different channels contribute to sales."
    },
    {
      question: "Does utm.one work with my existing analytics tools?",
      answer: "Yes, utm.one enhances your existing stack. UTM parameters flow through to Google Analytics, and our API integrates with data warehouses, BI tools, and CRMs."
    },
    {
      question: "What ecommerce metrics can I track?",
      answer: "Track revenue, orders, average order value, conversion rate, customer lifetime value, and return on ad spend—all attributed to specific campaigns, channels, and creatives."
    }
  ];

  return (
    <>
      <SEO 
        title="Ecommerce UTM Tracking & Attribution | utm.one"
        description="Track every sale back to its source. utm.one provides ecommerce teams with revenue attribution, product-level tracking, and ROAS optimization for Shopify, WooCommerce, and more."
        canonical="https://utm.one/use-cases/ecommerce-tracking"
        keywords={["ecommerce tracking", "shopify utm", "revenue attribution", "ecommerce analytics", "product tracking", "ROAS optimization"]}
      />
      <ArticleSchema
        headline="Ecommerce UTM Tracking & Revenue Attribution"
        description="Complete guide to tracking ecommerce sales with UTM parameters and revenue attribution."
        author="utm.one"
        datePublished="2025-01-15"
        dateModified="2025-01-15"
        url="https://utm.one/use-cases/ecommerce-tracking"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Use Cases', url: 'https://utm.one/use-cases' },
          { name: 'Ecommerce Tracking', url: 'https://utm.one/use-cases/ecommerce-tracking' }
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                <ShoppingCart className="w-4 h-4" />
                Ecommerce
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
                Track Every Sale Back to Its Source
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
                Stop guessing which campaigns drive revenue. utm.one gives ecommerce teams 
                complete visibility into what's working—from first click to final purchase.
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
              The Ecommerce Attribution Problem
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h3 className="font-semibold text-zinc-900 mb-2">❌ Without utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "Facebook drove 10,000 clicks but how much revenue?"</li>
                  <li>• Inconsistent UTM parameters across team members</li>
                  <li>• Can't compare influencer ROI without coupon codes</li>
                  <li>• Multi-channel attribution is a black box</li>
                  <li>• Wasting ad spend on underperforming campaigns</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-emerald-200 border-2">
                <h3 className="font-semibold text-emerald-700 mb-2">✓ With utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "Facebook Ad Set #3 drove $47,000 in revenue"</li>
                  <li>• Enforced UTM naming conventions for clean data</li>
                  <li>• Track influencer sales without discount codes</li>
                  <li>• See the complete customer journey</li>
                  <li>• Optimize spend based on true ROAS</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              Ecommerce-Specific Features
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
              How Ecommerce Teams Use utm.one
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
              Ready to Track Your Ecommerce Revenue?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join thousands of ecommerce teams who use utm.one to understand exactly 
              which campaigns drive sales.
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
              currentPath="/use-cases/ecommerce-tracking"
              category="use-case"
            />
            <div className="mt-12">
              <PeopleAlsoRead 
                items={[
                  { title: "SaaS Attribution", url: "/use-cases/saas-attribution" },
                  { title: "utm.one vs Bitly", url: "/compare/utm-one-vs-bitly" },
                  { title: "UTM Guide", url: "/resources/guides/utm-guide" }
                ]}
              />
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

export default EcommerceTracking;
