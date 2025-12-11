import { Helmet } from "react-helmet";
import { Star, DollarSign, Link2, QrCode, TrendingUp, Users } from "lucide-react";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import {
  UseCaseHero,
  BeforeAfterSection,
  AnimatedStatCard,
  IndustryROICalculator,
  PlatformIntegrationsGrid,
  UseCaseCTA,
  FeatureGrid,
  FAQSection,
  InteractiveDemo,
} from "@/components/use-cases";
import { SankeyJourneyFlow } from "@/components/use-cases/SankeyJourneyFlow";

const InfluencerCampaigns = () => {
  const journeySteps = [
    { id: "post", label: "Instagram Post", description: "Creator shares link", weight: 30 },
    { id: "click", label: "Link Click", description: "Follower taps link", weight: 25 },
    { id: "browse", label: "Site Visit", description: "Browsing products", weight: 20 },
    { id: "return", label: "Return Visit", description: "2 weeks later", weight: 25 },
  ];

  const beforeItems = [
    '"This influencer got 50K views but did they sell anything?"',
    "Relying on discount codes that hurt your margins",
    "Can't compare creator performance fairly",
    "No visibility into what happens after the click",
    "Attribution disappears when followers switch devices",
  ];

  const afterItems = [
    '"Creator X drove $12,000 in sales last month"',
    "Track sales without discount codes",
    "Side-by-side creator comparison",
    "Full funnel visibility from click to purchase",
    "Cross-device journey tracking captures delayed conversions",
  ];

  const platforms = [
    { name: "Instagram" },
    { name: "TikTok" },
    { name: "YouTube" },
    { name: "Facebook" },
    { name: "LinkedIn" },
    { name: "Shopify" },
  ];

  const features = [
    { icon: Link2, title: "unique creator links", description: "Every influencer gets their own tracked link. See exactly who drives traffic and sales." },
    { icon: DollarSign, title: "revenue attribution", description: "Track actual revenue, not just clicks. Know which creators generate real business impact." },
    { icon: QrCode, title: "branded QR codes", description: "Give creators custom QR codes for stories, reels, and video content—all matching your brand." },
    { icon: TrendingUp, title: "performance comparison", description: "Side-by-side creator comparison. Identify your top performers and optimize spend." },
    { icon: Users, title: "creator portal", description: "Give influencers access to their own stats without exposing campaign-wide data." },
    { icon: Star, title: "no coupon codes needed", description: "Track creator-driven sales without discount codes that eat into your margins." },
  ];

  const faqs = [
    { question: "How do I track influencer sales without coupon codes?", answer: "Each influencer gets a unique tracked link. When their followers click and purchase, utm.one attributes the sale automatically—no discount code required." },
    { question: "Can influencers see their own performance?", answer: "Yes! Invite creators with 'Creator' role access to view their personal dashboard showing clicks, conversions, and revenue driven." },
    { question: "How does this compare to affiliate platforms?", answer: "utm.one focuses purely on attribution and analytics. No commission fees, no platform lock-in. Use your existing payment system for payouts." },
    { question: "What about tracking across multiple platforms?", answer: "Use consistent UTM structure across Instagram, TikTok, YouTube, and podcasts. Compare creator performance by platform." },
  ];

  const calculatorInputs = [
    { id: "creators", label: "Number of Creators", defaultValue: 10 },
    { id: "avgPayment", label: "Avg Payment per Creator", defaultValue: 2000, prefix: "$" },
    { id: "avgClicks", label: "Avg Monthly Clicks per Creator", defaultValue: 5000 },
  ];

  const calculateROI = (inputs: Record<string, number>) => {
    const { creators, avgPayment, avgClicks } = inputs;
    const totalSpend = creators * avgPayment;
    const totalClicks = creators * avgClicks;
    const estimatedRevenue = totalClicks * 0.025 * 85;
    const roas = estimatedRevenue / totalSpend;
    return {
      results: [
        { label: "Total Campaign Spend", value: `$${totalSpend.toLocaleString()}` },
        { label: "Estimated Revenue (2.5% CVR)", value: `$${Math.round(estimatedRevenue).toLocaleString()}` },
        { label: "Hidden Revenue Found (+35%)", value: `$${Math.round(estimatedRevenue * 0.35).toLocaleString()}` },
      ],
      highlight: { label: "True ROAS with utm.one", value: `${(roas * 1.35).toFixed(1)}x` },
    };
  };

  return (
    <ResourcesLayout>
      <Helmet>
        <title>Influencer Marketing Attribution | utm.one</title>
        <meta name="description" content="Track influencer campaigns without coupon codes. Unique creator links, revenue attribution, and performance comparison." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <UseCaseHero
          category="Influencer Marketing"
          categoryIcon={Star}
          categoryColor="bg-pink-100 text-pink-700"
          headline="every follower leaves a trail. we track it."
          subheadline="you spent $50k on influencers. google says $0 in revenue. we'll show you the $480k they actually drove."
          stats={[{ value: "3.2x", label: "avg ROAS improvement" }, { value: "$480k", label: "hidden revenue uncovered" }, { value: "42%", label: "lower CPA" }]}
        />
        <section className="py-16 border-b border-border/50">
          <div className="max-w-[980px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedStatCard value="3.2x" label="avg ROAS improvement" description="Compared to pre-utm.one campaigns" />
              <AnimatedStatCard value="$480k" label="hidden revenue uncovered" description="Per brand, on average" />
              <AnimatedStatCard value="42%" label="reduction in CPA" description="By cutting underperformers" />
            </div>
          </div>
        </section>
        <BeforeAfterSection title="the influencer attribution problem" subtitle="You're paying for creators but can't prove they work. Here's what changes." beforeTitle="the chaos" afterTitle="the clarity" beforeItems={beforeItems} afterItems={afterItems} />
        <SankeyJourneyFlow 
          title="watch followers become customers" 
          subtitle="See exactly how creator content drives revenue—even when conversions happen weeks later." 
          steps={journeySteps}
          destination={{ label: "Purchase", value: "$127.00" }}
        />
        <InteractiveDemo title="see your creator links in action" subtitle="Paste any product URL to see how utm.one generates unique tracked links." placeholder="https://your-store.com/products/best-seller" exampleUrl="https://store.example.com/products/summer-collection" />
        <PlatformIntegrationsGrid title="works across all creator platforms" subtitle="Track performance consistently across Instagram, TikTok, YouTube, and podcasts." platforms={platforms} />
        <FeatureGrid title="built for creator campaigns" subtitle="Everything you need to measure true influencer ROI." features={features} />
        <IndustryROICalculator title="calculate your influencer ROI" subtitle="See how much hidden revenue you're missing from creator campaigns." inputs={calculatorInputs} calculateROI={calculateROI} />
        <FAQSection title="questions from influencer marketers" faqs={faqs} />
        <UseCaseCTA headline="prove your creators drive revenue" subheadline="Join brands who use utm.one to measure true influencer ROI and optimize creator partnerships." />
      </div>
    </ResourcesLayout>
  );
};

export default InfluencerCampaigns;
