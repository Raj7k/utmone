import { Helmet } from "react-helmet";
import { ShoppingCart, TrendingUp, BarChart3, Zap, Shield, Globe, Target, DollarSign } from "lucide-react";
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

const EcommerceTracking = () => {
const journeySteps = [
    { id: "ad", label: "Facebook Ad", description: "First touch through paid social", time: "Day 0", weight: 30 },
    { id: "pdp", label: "Product Page", description: "Browsed product details", time: "Day 0", weight: 25 },
    { id: "cart", label: "Cart Abandonment", description: "Left without purchasing", time: "Day 2", weight: 20 },
    { id: "email", label: "Email Retarget", description: "Abandoned cart reminder", time: "Day 3", weight: 15 },
    { id: "purchase", label: "Purchase", description: "Completed checkout", time: "Day 4", weight: 10 },
  ];

  const beforeItems = [
    "Facebook claims 500 conversions",
    "Google claims 350 conversions",
    "Shopify shows 200 orders",
    "No one knows the truth",
    "Budget decisions based on guesswork",
  ];

  const afterItems = [
    "Single source of truth: 847 conversions",
    "Deduplicated cross-platform attribution",
    "Every dollar traced to its source",
    "Cross-device journeys connected",
    "Budget allocated to what actually works",
  ];

  const platforms = [
    { name: "Shopify" },
    { name: "WooCommerce" },
    { name: "BigCommerce" },
    { name: "Stripe" },
    { name: "Klaviyo" },
    { name: "Mailchimp" },
  ];

  const features = [
    { icon: Target, title: "cross-platform deduplication", description: "Stop counting the same conversion three times. We stitch sessions across Facebook, Google, and email." },
    { icon: TrendingUp, title: "revenue attribution", description: "Know exactly which ad, email, or post drove each sale. Down to the penny." },
    { icon: BarChart3, title: "real-time ROAS", description: "See your true return on ad spend as purchases happen. No waiting for reports." },
    { icon: Shield, title: "privacy-first tracking", description: "First-party data only. No cookies, no fingerprinting. GDPR and CCPA compliant." },
    { icon: Globe, title: "cross-device journeys", description: "Mobile ad to desktop purchase? We connect the dots across devices." },
    { icon: Zap, title: "instant integration", description: "One script, five minutes. Works with Shopify, WooCommerce, and every major platform." },
  ];

  const faqs = [
    { question: "How does utm.one differ from Shopify's built-in analytics?", answer: "Shopify only sees what happens on your store. We see the entire journey—from the first ad impression to the final purchase, across all channels and devices." },
    { question: "Will this work with my existing Facebook and Google tracking?", answer: "Absolutely. utm.one works alongside your existing pixels. We don't replace them—we unify them." },
    { question: "How do you handle returns and refunds?", answer: "We automatically adjust attribution when orders are refunded or cancelled. Your ROAS calculations stay accurate." },
    { question: "What about post-iOS 14 tracking challenges?", answer: "utm.one uses first-party data exclusively. We don't rely on third-party cookies or app tracking." },
  ];

  const calculatorInputs = [
    { id: "adSpend", label: "Monthly Ad Spend", defaultValue: 50000, prefix: "$" },
    { id: "currentROAS", label: "Current Attributed ROAS", defaultValue: 2.5, suffix: "x" },
    { id: "avgOrderValue", label: "Average Order Value", defaultValue: 85, prefix: "$" },
  ];

  const calculateROI = (inputs: Record<string, number>) => {
    const { adSpend, currentROAS, avgOrderValue } = inputs;
    const currentRevenue = adSpend * currentROAS;
    const hiddenRevenue = currentRevenue * 0.35;
    const trueROAS = (currentRevenue + hiddenRevenue) / adSpend;
    const additionalOrders = Math.round(hiddenRevenue / avgOrderValue);
    return {
      results: [
        { label: "Hidden Revenue Discovered", value: `$${hiddenRevenue.toLocaleString()}` },
        { label: "True ROAS", value: `${trueROAS.toFixed(1)}x` },
        { label: "Additional Orders Found", value: additionalOrders.toLocaleString() },
      ],
      highlight: { label: "Monthly Revenue Recovered", value: `$${hiddenRevenue.toLocaleString()}` },
    };
  };

  return (
    <ResourcesLayout>
      <Helmet>
        <title>Ecommerce Attribution | utm.one</title>
        <meta name="description" content="See where every dollar actually comes from. Unify Facebook, Google, and email attribution." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <UseCaseHero
          category="Ecommerce"
          categoryIcon={ShoppingCart}
          categoryColor="bg-emerald-100 text-emerald-700"
          headline="every cart has a story. hear it."
          subheadline="facebook claims 500 conversions. google says 350. shopify shows 200 orders. the truth is 847. we'll prove it."
          stats={[{ value: "35%", label: "hidden revenue found" }, { value: "3.2x", label: "avg ROAS improvement" }, { value: "< 5min", label: "to integrate" }]}
        />
        <section className="py-16 border-b border-border/50">
          <div className="max-w-[980px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedStatCard value="$2.4M" label="hidden revenue uncovered" description="Average for brands doing $10M+ annually" />
              <AnimatedStatCard value="847" label="true conversions" description="When platforms claimed 1,050 combined" />
              <AnimatedStatCard value="28%" label="budget reallocation" description="Moved to channels that actually convert" />
            </div>
          </div>
        </section>
        <BeforeAfterSection title="the attribution black box" subtitle="Every platform inflates their numbers. Every dashboard tells a different story." beforeTitle="the chaos" afterTitle="the clarity" beforeItems={beforeItems} afterItems={afterItems} />
        <SankeyJourneyFlow 
          title="watch a purchase happen" 
          subtitle="Every touchpoint captured. Every dollar attributed." 
          steps={journeySteps}
          destination={{ label: "Revenue", value: "$127.00" }}
        />
        <InteractiveDemo title="see your store's tracking" subtitle="Paste any product URL and watch utm.one generate perfect UTM structure." placeholder="https://your-store.com/products/best-seller" exampleUrl="https://store.example.com/products/wireless-headphones" />
        <PlatformIntegrationsGrid title="works with your stack" subtitle="One-click integrations with every major ecommerce platform." platforms={platforms} />
        <FeatureGrid title="built for ecommerce" subtitle="Every feature designed to answer: where do my sales actually come from?" features={features} />
        <IndustryROICalculator title="find your hidden revenue" subtitle="See how much revenue you're missing due to fragmented attribution." inputs={calculatorInputs} calculateROI={calculateROI} />
        <FAQSection title="questions from ecommerce teams" faqs={faqs} />
        <UseCaseCTA headline="see where your revenue actually comes from" subheadline="Stop making budget decisions based on conflicting platform data." />
      </div>
    </ResourcesLayout>
  );
};

export default EcommerceTracking;
