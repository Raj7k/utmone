import { Helmet } from "react-helmet";
import { Calendar, MapPin, Users, Wifi, QrCode, BarChart3, Globe, Zap } from "lucide-react";
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
} from "@/components/use-cases";
import { SankeyJourneyFlow } from "@/components/use-cases/SankeyJourneyFlow";

const EventMarketing = () => {
const journeySteps = [
    { id: "booth", label: "Booth Visit", description: "Badge scanned at trade show", time: "Day 0", weight: 20 },
    { id: "qr", label: "QR Scan", description: "Downloaded sales collateral", time: "Day 0", weight: 15 },
    { id: "halo", label: "Halo Traffic", description: "+1,200 visitors from event city", time: "Days 1-7", weight: 40 },
    { id: "followup", label: "Email Followup", description: "Nurtured via drip campaign", time: "Day 7+", weight: 25 },
  ];

  const beforeItems = [
    "Scanned 127 badges at Dreamforce",
    "CEO asks: 'What's the ROI?'",
    "You have spreadsheets, not answers",
    "Miss the 1,000+ halo visitors",
    "Can't justify next year's budget",
  ];

  const afterItems = [
    "127 direct leads captured",
    "1,247 halo visitors detected",
    "$2.4M pipeline attributed",
    "ROI calculated automatically",
    "Budget approved for next year",
  ];

  const platforms = [
    { name: "Salesforce" },
    { name: "HubSpot" },
    { name: "Slack" },
    { name: "Google Analytics" },
    { name: "Zapier" },
    { name: "Segment" },
  ];

  const features = [
    { icon: MapPin, title: "event halo detection", description: "Track the invisible 90%—visitors who saw your booth but didn't scan." },
    { icon: QrCode, title: "one-tap badge scanning", description: "Scan badges in under 2 seconds. Auto-enrich with LinkedIn data." },
    { icon: Globe, title: "control group comparison", description: "Las Vegas event vs Phoenix control. Statistical proof your event worked." },
    { icon: Wifi, title: "offline-first capture", description: "No wifi? No problem. Scan offline, sync when connected." },
    { icon: BarChart3, title: "live event dashboard", description: "Real-time traffic pulse during the event. See halo visitors arrive." },
    { icon: Zap, title: "instant CRM sync", description: "Leads appear in Salesforce before you leave the booth." },
  ];

  const faqs = [
    { question: "What is 'Event Halo' and how does it work?", answer: "Event Halo detects website traffic spikes from the event city during and after your event. We compare against a control city to isolate the event's impact." },
    { question: "How accurate is geo-temporal attribution?", answer: "We provide confidence intervals, not false precision. A typical result might be '1,247 halo visitors (95% CI: 1,100-1,400)'." },
    { question: "Does badge scanning work without internet?", answer: "Yes. Our scanner works completely offline. Scans sync automatically when you reconnect." },
    { question: "Can I attribute revenue to specific events?", answer: "Every lead from an event gets tagged. When they close months later, revenue is attributed back automatically." },
  ];

  const calculatorInputs = [
    { id: "eventCost", label: "Event Cost (booth + travel)", defaultValue: 75000, prefix: "$" },
    { id: "badgeScans", label: "Expected Badge Scans", defaultValue: 150 },
    { id: "avgDealValue", label: "Average Deal Value", defaultValue: 50000, prefix: "$" },
    { id: "conversionRate", label: "Lead to Deal Rate", defaultValue: 8, suffix: "%" },
  ];

  const calculateROI = (inputs: Record<string, number>) => {
    const { eventCost, badgeScans, avgDealValue, conversionRate } = inputs;
    const totalLeads = badgeScans + (badgeScans * 10);
    const expectedDeals = totalLeads * (conversionRate / 100);
    const expectedRevenue = expectedDeals * avgDealValue;
    const roi = ((expectedRevenue - eventCost) / eventCost) * 100;
    return {
      results: [
        { label: "Total Leads (Direct + Halo)", value: totalLeads.toLocaleString() },
        { label: "Expected Deals", value: Math.round(expectedDeals).toString() },
        { label: "Event ROI", value: `${Math.round(roi)}%` },
      ],
      highlight: { label: "Attributed Pipeline", value: `$${expectedRevenue.toLocaleString()}` },
    };
  };

  return (
    <ResourcesLayout>
      <Helmet>
        <title>Event Marketing Attribution | utm.one</title>
        <meta name="description" content="Track the invisible 90% from every event. Badge scanning, halo detection, and revenue attribution." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <UseCaseHero
          category="Event Marketing"
          categoryIcon={Calendar}
          categoryColor="bg-purple-100 text-purple-700"
          headline="you scanned 100 badges. 1,000 more people saw your booth."
          subheadline="event halo captures the invisible 90%. prove your events drive revenue, not just business cards."
          stats={[{ value: "10x", label: "more leads detected" }, { value: "< 2s", label: "to scan a badge" }, { value: "$2.4M", label: "avg pipeline attributed" }]}
        />
        <section className="py-16 border-b border-border/50">
          <div className="max-w-[980px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedStatCard value="1,247" label="halo visitors detected" description="From a single trade show booth" />
              <AnimatedStatCard value="127" label="badges scanned" description="The visible 10% of your impact" />
              <AnimatedStatCard value="$2.4M" label="pipeline attributed" description="Across direct + halo leads" />
            </div>
          </div>
        </section>
        <BeforeAfterSection title="the event attribution problem" subtitle="You spent $75k on a booth. The CEO wants ROI. Badge scans alone won't justify the budget." beforeTitle="what you report" afterTitle="what actually happened" beforeItems={beforeItems} afterItems={afterItems} />
        <SankeyJourneyFlow 
          title="from booth to closed deal" 
          subtitle="Every touchpoint tracked—from the first badge scan to the signed contract." 
          steps={journeySteps}
          destination={{ label: "Deal Closed", value: "$85,000" }}
        />
        <PlatformIntegrationsGrid title="syncs with your event stack" subtitle="Badge data flows directly to your CRM. No spreadsheet imports required." platforms={platforms} />
        <FeatureGrid title="built for field marketing" subtitle="Every feature designed to answer: what's the ROI of this event?" features={features} />
        <IndustryROICalculator title="calculate your event ROI" subtitle="See the full impact of your events—including the invisible halo visitors." inputs={calculatorInputs} calculateROI={calculateROI} />
        <FAQSection title="questions from event marketers" faqs={faqs} />
        <UseCaseCTA headline="prove your events drive revenue" subheadline="Stop counting business cards. Start measuring impact." />
      </div>
    </ResourcesLayout>
  );
};

export default EventMarketing;
