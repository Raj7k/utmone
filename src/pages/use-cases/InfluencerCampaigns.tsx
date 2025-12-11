import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Star, DollarSign, Link2, QrCode, TrendingUp, Users, Instagram, Youtube, Radio, Share2, BarChart3, Zap } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RelatedResources, PeopleAlsoRead } from "@/components/seo/RelatedResources";
import {
  UseCaseHero,
  BeforeAfterSection,
  JourneyFlowVisualizer,
  AnimatedStatsGrid,
  InfluencerROICalculator,
  InfluencerPlatforms,
  UseCaseCTA,
  FeatureGrid,
  FAQSection,
  InteractiveDemo,
} from "@/components/use-cases";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const InfluencerCampaigns = () => {
  const features = [
    {
      icon: Link2,
      title: "unique creator links",
      description: "every influencer gets their own tracked link. see exactly who drives traffic and sales—no more guessing games."
    },
    {
      icon: DollarSign,
      title: "revenue attribution",
      description: "track actual revenue, not just clicks. know which creators generate real business impact."
    },
    {
      icon: QrCode,
      title: "branded QR codes",
      description: "give creators custom QR codes for stories, reels, and video content—all matching your brand."
    },
    {
      icon: TrendingUp,
      title: "performance comparison",
      description: "side-by-side creator comparison. identify your top performers and optimize spend accordingly."
    },
    {
      icon: Users,
      title: "creator portal",
      description: "give influencers access to their own stats without exposing campaign-wide data."
    },
    {
      icon: Star,
      title: "no coupon codes needed",
      description: "track creator-driven sales without discount codes that eat into your margins."
    }
  ];

  const faqs = [
    {
      question: "how do I track influencer sales without coupon codes?",
      answer: "each influencer gets a unique tracked link. when their followers click and purchase, utm.one attributes the sale automatically—no discount code required. this means you keep your full margin while getting complete attribution data."
    },
    {
      question: "can influencers see their own performance?",
      answer: "yes! invite creators with 'Creator' role access to view their personal dashboard. they'll see their clicks, conversions, and revenue driven—but won't have access to campaign-wide data or other creator performance."
    },
    {
      question: "how does this compare to affiliate platforms?",
      answer: "utm.one focuses purely on attribution and analytics. you get the tracking data to make informed partnership decisions, then use your existing payment system for payouts. no commission fees, no platform lock-in."
    },
    {
      question: "can I create vanity URLs for podcasts?",
      answer: "absolutely. create memorable short URLs like go.yourbrand.com/podcast that are easy to say in audio content. the link is unique to that podcast, so you'll know exactly how many listeners converted."
    },
    {
      question: "how do I track Instagram Stories?",
      answer: "generate unique links for each influencer's Story content. our link preview optimization ensures your content looks great when shared, and every swipe-up is tracked to the specific creator."
    },
    {
      question: "what about tracking across multiple platforms?",
      answer: "use consistent UTM structure across Instagram, TikTok, YouTube, and podcasts. utm.one lets you compare creator performance by platform, so you know where to invest your budget."
    },
    {
      question: "how do I scale to hundreds of influencers?",
      answer: "bulk link generation and API access let you create and manage links for large programs efficiently. import a spreadsheet of creators and generate unique links for everyone in seconds."
    },
    {
      question: "what metrics can I track for influencers?",
      answer: "track clicks, unique visitors, conversion rate, revenue, average order value, and customer lifetime value. all attributed to individual creators so you can calculate true ROI per partnership."
    },
    {
      question: "how long does attribution tracking last?",
      answer: "utm.one tracks the full customer journey, including delayed conversions. if someone clicks a creator's link today and purchases next month, you'll still see the attribution."
    },
    {
      question: "can I track affiliate links from multiple brands?",
      answer: "yes. each workspace can track multiple brands or campaigns. if you're an agency managing influencer programs for multiple clients, you can keep everything organized in separate workspaces."
    }
  ];

  const journeySteps = [
    { id: "post", icon: <Instagram className="w-5 h-5" />, label: "instagram post", sublabel: "creator shares link", utmCapture: "utm_source=instagram" },
    { id: "click", icon: <Share2 className="w-5 h-5" />, label: "link click", sublabel: "follower taps link", utmCapture: "utm_medium=influencer" },
    { id: "browse", icon: <BarChart3 className="w-5 h-5" />, label: "site visit", sublabel: "browsing products", utmCapture: "utm_campaign=summer_drop" },
    { id: "return", icon: <Zap className="w-5 h-5" />, label: "return visit", sublabel: "2 weeks later", utmCapture: "cross-device tracked" },
    { id: "purchase", icon: <DollarSign className="w-5 h-5" />, label: "purchase", sublabel: "revenue attributed", utmCapture: "$127 → @creator_name" },
  ];

  return (
    <>
      <SEO 
        title="Influencer Marketing Tracking & Attribution | utm.one"
        description="Track influencer campaigns without coupon codes. Unique creator links, revenue attribution, and performance comparison for Instagram, TikTok, YouTube, and podcasts."
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
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Use Cases', url: 'https://utm.one/use-cases' },
          { name: 'Influencer Campaigns', url: 'https://utm.one/use-cases/influencer-campaigns' }
        ]}
      />
      <ResourcesLayout>
        <UseCaseHero
          category="influencer marketing"
          categoryIcon={Star}
          categoryColor="bg-pink-50 text-pink-700"
          headline="every follower leaves a trail. we track it."
          subheadline="you spent $50k on influencers. google says $0 in revenue. we'll show you the $480k they actually drove."
          stats={[
            { value: "3.2x", label: "avg ROAS improvement" },
            { value: "$480k", label: "hidden revenue uncovered" },
            { value: "42%", label: "lower CPA" },
          ]}
          primaryCTA={{ label: "get early access", href: "/early-access" }}
          secondaryCTA={{ label: "see attribution demo", href: "/features/attribution" }}
        />

        <BeforeAfterSection
          title="the influencer attribution problem"
          beforeItems={[
            '"this influencer got 50K views but did they sell anything?"',
            "relying on discount codes that hurt your margins",
            "can't compare creator performance fairly",
            "no visibility into what happens after the click",
            "paying for vanity metrics instead of results",
            "attribution disappears when followers switch devices",
          ]}
          afterItems={[
            '"creator X drove $12,000 in sales last month"',
            "track sales without discount codes",
            "side-by-side creator comparison",
            "full funnel visibility from click to purchase",
            "pay creators based on actual business impact",
            "cross-device journey tracking captures delayed conversions",
          ]}
        />

        <JourneyFlowVisualizer
          title="watch followers become customers"
          subtitle="see exactly how creator content drives revenue—even when conversions happen weeks later"
          steps={journeySteps}
        />

        <PlatformTabsSection />

        <InteractiveDemo
          title="see your creator links in action"
          subtitle="paste any product URL to see how utm.one generates unique tracked links"
          placeholder="paste your product URL (e.g., shopify.com/products/...)"
        />

        <InfluencerROICalculator />

        <AnimatedStatsGrid
          title="real results from real brands"
          subtitle="brands using utm.one for influencer attribution"
          stats={[
            { value: 3.2, suffix: "x", label: "average ROAS improvement", description: "compared to pre-utm.one campaigns" },
            { value: 480, prefix: "$", suffix: "k", label: "hidden revenue uncovered", description: "per brand, on average" },
            { value: 42, suffix: "%", label: "reduction in CPA", description: "by cutting underperformers" },
            { value: 89, suffix: "%", label: "faster reporting", description: "vs manual spreadsheet tracking" },
          ]}
        />

        <FeatureGrid
          title="built for creator campaigns"
          subtitle="everything you need to measure true influencer ROI"
          features={features}
        />

        <InfluencerPlatforms />

        <FAQSection faqs={faqs} />

        <UseCaseCTA
          headline="prove your creators drive revenue"
          subheadline="join brands who use utm.one to measure true influencer ROI and optimize creator partnerships."
          primaryCTA={{ label: "get early access", href: "/early-access" }}
          secondaryCTA={{ label: "talk to sales", href: "/contact" }}
        />

        {/* Related Resources */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-[980px] mx-auto px-6 md:px-8">
            <RelatedResources 
              resources={[
                { title: "Ecommerce Tracking", path: "/use-cases/ecommerce-tracking", type: "guide" as const },
                { title: "utm.one vs Firstpromoter", path: "/compare/utm-one-vs-firstpromoter", type: "comparison" as const },
                { title: "Partner Programs Guide", path: "/resources/playbooks/partner-programs", type: "playbook" as const }
              ]}
            />
            <div className="mt-12">
              <PeopleAlsoRead currentPath="/use-cases/influencer-campaigns" />
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

// Platform-specific tabs section
const PlatformTabsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("instagram");

  const platforms = [
    { 
      id: "instagram", 
      label: "Instagram", 
      icon: Instagram,
      features: [
        "story swipe-up tracking with unique links per creator",
        "link-in-bio optimization with automatic UTM tagging",
        "reels and post caption link tracking",
        "cross-device attribution for mobile-first audiences",
      ]
    },
    { 
      id: "tiktok", 
      label: "TikTok", 
      icon: Share2,
      features: [
        "bio link tracking with creator-specific UTMs",
        "video description link performance",
        "short-form video attribution modeling",
        "hashtag challenge campaign measurement",
      ]
    },
    { 
      id: "youtube", 
      label: "YouTube", 
      icon: Youtube,
      features: [
        "video description link tracking",
        "pinned comment link attribution",
        "long-form content conversion windows",
        "subscriber vs. non-subscriber performance",
      ]
    },
    { 
      id: "podcasts", 
      label: "Podcasts", 
      icon: Radio,
      features: [
        "vanity URLs easy to say on air",
        "episode-specific attribution",
        "delayed conversion tracking (listeners buy later)",
        "host-read vs. programmatic ad comparison",
      ]
    },
  ];

  const activePlatform = platforms.find(p => p.id === activeTab) || platforms[0];

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="max-w-[980px] mx-auto px-6 md:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            platform-specific tracking
          </h2>
          <p className="text-lg text-muted-foreground">
            optimized for every creator platform
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setActiveTab(platform.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300
                ${activeTab === platform.id 
                  ? 'bg-foreground text-background shadow-lg' 
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                }
              `}
            >
              <platform.icon className="w-4 h-4" />
              {platform.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div 
          key={activeTab}
          className="bg-card p-8 rounded-2xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <activePlatform.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{activePlatform.label} tracking</h3>
              <p className="text-sm text-muted-foreground">optimized for {activePlatform.label.toLowerCase()} creators</p>
            </div>
          </div>

          <ul className="grid md:grid-cols-2 gap-4">
            {activePlatform.features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default InfluencerCampaigns;
