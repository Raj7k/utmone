import { Helmet } from "react-helmet";
import { Building2, Users, TrendingUp, Clock, Layers, GitBranch, Target, BarChart3 } from "lucide-react";
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

const SaasAttribution = () => {
  const journeySteps = [
    { id: "blog", label: "Blog Post", description: "Day 1: Organic search", weight: 25 },
    { id: "webinar", label: "Webinar", description: "Day 14: Email invite", weight: 35 },
    { id: "pricing", label: "Pricing Page", description: "Day 45: Direct visit", weight: 15 },
    { id: "demo", label: "Demo Request", description: "Day 62: LinkedIn ad", weight: 25 },
  ];

  const beforeItems = [
    "Last-touch says LinkedIn closed the deal",
    "Sales says it was the demo",
    "Marketing says it was the blog post",
    "No one knows the real journey",
    "Pipeline attribution is a guess",
  ];

  const afterItems = [
    "Full 94-day journey visible",
    "Every touchpoint credited fairly",
    "Blog gets 25%, webinar 35%, demo 40%",
    "Sales and marketing finally aligned",
    "Budget goes to what actually works",
  ];

  const platforms = [
    { name: "Salesforce" },
    { name: "HubSpot" },
    { name: "Pipedrive" },
    { name: "Segment" },
    { name: "Slack" },
    { name: "Google Analytics" },
  ];

  const features = [
    { icon: Clock, title: "long-cycle attribution", description: "6-month sales cycles? No problem. We track every touchpoint from first visit to closed-won." },
    { icon: Users, title: "account-based tracking", description: "Multiple stakeholders, one account. See how the entire buying committee engages." },
    { icon: GitBranch, title: "multi-touch models", description: "First-touch, last-touch, linear, time-decay, position-based. Choose what fits." },
    { icon: Layers, title: "identity stitching", description: "Anonymous visitor becomes known lead becomes customer. We connect every stage." },
    { icon: Target, title: "pipeline attribution", description: "Don't just track MQLs. Attribute actual pipeline and revenue to marketing efforts." },
    { icon: BarChart3, title: "dark funnel visibility", description: "Podcasts, communities, word-of-mouth. See the channels your CRM can't track." },
  ];

  const faqs = [
    { question: "How do you handle 6+ month sales cycles?", answer: "Our attribution window extends up to 365 days. We store every touchpoint and rebuild the journey when a deal closes." },
    { question: "Can you attribute to specific campaigns in my CRM?", answer: "Yes. We sync with Salesforce, HubSpot, and other CRMs to match touchpoints with your campaign structure." },
    { question: "How do you handle multiple people from the same company?", answer: "Account-based attribution groups all contacts under one account. See how the whole buying committee engages." },
    { question: "What about anonymous visitors who later become leads?", answer: "We create anonymous profiles from day one. When they convert, we stitch their entire history together." },
  ];

  const calculatorInputs = [
    { id: "acv", label: "Average Contract Value", defaultValue: 48000, prefix: "$" },
    { id: "salesCycle", label: "Sales Cycle (days)", defaultValue: 90 },
    { id: "monthlyPipeline", label: "Monthly Pipeline", defaultValue: 500000, prefix: "$" },
  ];

  const calculateROI = (inputs: Record<string, number>) => {
    const { acv, monthlyPipeline } = inputs;
    const unattributedPipeline = monthlyPipeline * 0.4;
    const dealsRecovered = Math.round(unattributedPipeline / acv);
    const annualImpact = unattributedPipeline * 12;
    return {
      results: [
        { label: "Dark Funnel Pipeline", value: `$${unattributedPipeline.toLocaleString()}` },
        { label: "Deals with Hidden Influence", value: dealsRecovered.toString() },
        { label: "Annual Pipeline Visibility", value: `$${annualImpact.toLocaleString()}` },
      ],
      highlight: { label: "Monthly Hidden Pipeline", value: `$${unattributedPipeline.toLocaleString()}` },
    };
  };

  return (
    <ResourcesLayout>
      <Helmet>
        <title>SaaS Attribution | utm.one</title>
        <meta name="description" content="B2B journeys take 6 months. Track every touchpoint from first visit to closed-won." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <UseCaseHero
          category="SaaS & B2B"
          categoryIcon={Building2}
          categoryColor="bg-blue-100 text-blue-700"
          headline="b2b journeys take 6 months. we watch every step."
          subheadline="your lead touched 47 pages before booking a demo. which one mattered? we'll show you."
          stats={[{ value: "40%", label: "dark funnel illuminated" }, { value: "94 days", label: "avg journey tracked" }, { value: "47", label: "touchpoints captured" }]}
        />
        <section className="py-16 border-b border-border/50">
          <div className="max-w-[980px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedStatCard value="$4.2M" label="pipeline attributed" description="That marketing thought was 'organic'" />
              <AnimatedStatCard value="40%" label="of deals" description="Had hidden marketing influence" />
              <AnimatedStatCard value="3.8x" label="ROI improvement" description="By reallocating to influenced channels" />
            </div>
          </div>
        </section>
        <BeforeAfterSection title="the 6-month black box" subtitle="B2B deals don't happen in one click. But most attribution tools only see the last one." beforeTitle="partial visibility" afterTitle="full journey" beforeItems={beforeItems} afterItems={afterItems} />
        <SankeyJourneyFlow 
          title="a real b2b journey" 
          subtitle="94 days, 47 touchpoints, one $48k deal." 
          steps={journeySteps}
          destination={{ label: "Closed Won", value: "$48,000" }}
        />
        <InteractiveDemo title="see your tracking in action" subtitle="Paste any landing page URL and watch utm.one generate perfect UTM structure." placeholder="https://your-saas.com/demo" exampleUrl="https://saas.example.com/request-demo" />
        <PlatformIntegrationsGrid title="connects to your CRM" subtitle="Bi-directional sync with your existing sales and marketing stack." platforms={platforms} />
        <FeatureGrid title="built for b2b complexity" subtitle="Features designed for long sales cycles and complex buying journeys." features={features} />
        <IndustryROICalculator title="illuminate your dark funnel" subtitle="See how much pipeline is influenced by marketing but attributed to 'direct'." inputs={calculatorInputs} calculateROI={calculateROI} />
        <FAQSection title="questions from b2b teams" faqs={faqs} />
        <UseCaseCTA headline="stop losing credit for the hard work" subheadline="Your marketing influences more deals than you know. Start proving it." />
      </div>
    </ResourcesLayout>
  );
};

export default SaasAttribution;
