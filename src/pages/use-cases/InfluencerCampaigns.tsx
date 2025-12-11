import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, DollarSign, Link2, QrCode, TrendingUp, Users } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RelatedResources, PeopleAlsoRead } from "@/components/seo/RelatedResources";
import { Button } from "@/components/ui/button";

const InfluencerCampaigns = () => {
  const features = [
    {
      icon: Link2,
      title: "Unique Creator Links",
      description: "Generate unique tracked links for each influencer to measure their true impact on traffic and conversions."
    },
    {
      icon: DollarSign,
      title: "Revenue Attribution",
      description: "Track actual sales driven by each influencer—not just clicks—to calculate true ROI."
    },
    {
      icon: QrCode,
      title: "Branded QR Codes",
      description: "Give influencers custom QR codes for stories, posts, and video content with your brand colors."
    },
    {
      icon: TrendingUp,
      title: "Performance Comparison",
      description: "Compare influencer performance side-by-side to identify top performers and optimize spend."
    },
    {
      icon: Users,
      title: "Creator Dashboard",
      description: "Give influencers access to see their own performance stats without exposing campaign-wide data."
    },
    {
      icon: Star,
      title: "No Coupon Code Required",
      description: "Track influencer-driven sales without discount codes that cannibalize margin."
    }
  ];

  const useCases = [
    {
      title: "Instagram & TikTok Campaigns",
      description: "Track link-in-bio clicks, story swipe-ups, and video description links with unique UTM parameters per creator."
    },
    {
      title: "YouTube Sponsorships",
      description: "Give each YouTuber a unique link to measure video-driven traffic and conversions over time."
    },
    {
      title: "Podcast Sponsorships",
      description: "Create memorable vanity URLs (yourbrand.com/podcastname) that are easy to say and track."
    },
    {
      title: "Affiliate Programs",
      description: "Scale influencer partnerships with automated link generation and commission-ready reporting."
    }
  ];

  const faqs = [
    {
      question: "How do I track influencer sales without coupon codes?",
      answer: "Each influencer gets a unique tracked link. When their followers click and purchase, utm.one attributes the sale to that influencer automatically—no discount code needed."
    },
    {
      question: "Can influencers see their own performance?",
      answer: "Yes! Invite influencers as 'Creator' role to see their personal dashboard showing clicks, conversions, and revenue they've driven."
    },
    {
      question: "How does this compare to affiliate platforms?",
      answer: "utm.one focuses on attribution and analytics. You get the tracking data to make informed partnership decisions, then use your existing payment system for payouts."
    },
    {
      question: "Can I create vanity URLs for podcasts?",
      answer: "Yes! Create memorable short URLs like go.yourbrand.com/thepodcast that are easy to say in audio content."
    },
    {
      question: "How do I track Instagram Stories?",
      answer: "Generate unique links for each influencer's Story content. Our link preview optimization ensures your content looks great when shared."
    },
    {
      question: "Can I compare performance across platforms?",
      answer: "Absolutely. Use consistent UTM structure across Instagram, TikTok, YouTube, and podcasts to compare creator performance by platform."
    },
    {
      question: "How do I scale to hundreds of influencers?",
      answer: "Bulk link generation and API access let you create and manage links for large influencer programs efficiently."
    },
    {
      question: "What metrics can I track for influencers?",
      answer: "Track clicks, unique visitors, conversion rate, revenue, average order value, and customer lifetime value attributed to each influencer."
    }
  ];

  return (
    <>
      <SEO 
        title="Influencer Marketing Tracking & Attribution | utm.one"
        description="Track influencer campaigns without coupon codes. utm.one provides unique creator links, revenue attribution, and performance comparison for Instagram, TikTok, YouTube, and podcasts."
        canonical="https://utm.one/use-cases/influencer-campaigns"
        keywords={["influencer tracking", "creator marketing", "influencer attribution", "Instagram tracking", "TikTok analytics"]}
      />
      <ArticleSchema
        headline="Influencer Marketing Tracking & Attribution"
        description="Complete guide to tracking influencer campaign performance with utm.one."
        author="utm.one"
        datePublished="2025-01-15"
        dateModified="2025-01-15"
        url="https://utm.one/use-cases/influencer-campaigns"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Use Cases', url: 'https://utm.one/use-cases' },
          { name: 'Influencer Campaigns', url: 'https://utm.one/use-cases/influencer-campaigns' }
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Influencer Marketing
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
                Know Which Creators Actually Drive Sales
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
                Stop relying on coupon codes. Track influencer-driven revenue with unique 
                creator links and real-time attribution.
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
              The Influencer Attribution Problem
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h3 className="font-semibold text-zinc-900 mb-2">❌ Without utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "This influencer got 50K views but did they sell anything?"</li>
                  <li>• Relying on discount codes that hurt margins</li>
                  <li>• Can't compare creator performance fairly</li>
                  <li>• No visibility into post-click behavior</li>
                  <li>• Paying for vanity metrics, not results</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-pink-200 border-2">
                <h3 className="font-semibold text-pink-700 mb-2">✓ With utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "Creator X drove $12,000 in sales last month"</li>
                  <li>• Track sales without discount codes</li>
                  <li>• Side-by-side creator comparison</li>
                  <li>• Full conversion funnel visibility</li>
                  <li>• Pay for actual business impact</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              Influencer-Specific Features
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
              How Brands Use utm.one for Influencer Marketing
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
              Ready to Track Creator Performance?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join brands who use utm.one to measure true influencer ROI 
              and optimize creator partnerships.
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
              currentPath="/use-cases/influencer-campaigns"
              category="use-case"
            />
            <div className="mt-12">
              <PeopleAlsoRead 
                items={[
                  { title: "Ecommerce Tracking", url: "/use-cases/ecommerce-tracking" },
                  { title: "utm.one vs Firstpromoter", url: "/compare/utm-one-vs-firstpromoter" },
                  { title: "Partner Programs Guide", url: "/resources/playbooks/partner-programs" }
                ]}
              />
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

export default InfluencerCampaigns;
