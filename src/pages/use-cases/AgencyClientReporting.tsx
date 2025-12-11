import { Helmet } from "react-helmet";
import { Briefcase, FileText, Users, Lock, Palette, Clock, BarChart3, Send } from "lucide-react";
import {
  UseCaseHero,
  BeforeAfterSection,
  JourneyFlowVisualizer,
  AnimatedStatCard,
  IndustryROICalculator,
  PlatformIntegrationsGrid,
  UseCaseCTA,
  FeatureGrid,
  FAQSection,
} from "@/components/use-cases";

const AgencyClientReporting = () => {
  const journeySteps = [
    { id: "campaign", label: "Campaign Launch", description: "Links deployed" },
    { id: "tracking", label: "Auto-Tracking", description: "UTMs enforced" },
    { id: "data", label: "Data Collection", description: "Clicks, conversions" },
    { id: "report", label: "Report Generated", description: "White-labeled" },
    { id: "client", label: "Client Receives", description: "Scheduled delivery" },
  ];

  const beforeItems = [
    "Monday: Pull data from 6 platforms",
    "Tuesday: Build spreadsheets for 12 clients",
    "Wednesday: Create presentations",
    "Thursday: Send reports, chase approvals",
    "Friday: Start over for next month",
  ];

  const afterItems = [
    "Monday: Reports auto-generated overnight",
    "Tuesday: Review and approve with one click",
    "Wednesday: Clients receive white-labeled PDFs",
    "Thursday: Focus on strategy, not spreadsheets",
    "Friday: Actually leave on time",
  ];

  const platforms = [
    { name: "Salesforce", logo: "https://cdn.simpleicons.org/salesforce" },
    { name: "HubSpot", logo: "https://cdn.simpleicons.org/hubspot" },
    { name: "Google Analytics", logo: "https://cdn.simpleicons.org/googleanalytics" },
    { name: "Meta", logo: "https://cdn.simpleicons.org/meta" },
    { name: "Google Ads", logo: "https://cdn.simpleicons.org/googleads" },
    { name: "Slack", logo: "https://cdn.simpleicons.org/slack" },
  ];

  const features = [
    { icon: Palette, title: "white-label dashboards", description: "Your logo, your colors, your brand. Clients see a polished portal." },
    { icon: Users, title: "multi-client workspaces", description: "Complete data isolation between clients. Switch contexts instantly." },
    { icon: FileText, title: "automated reports", description: "Schedule weekly or monthly reports. PDF or interactive dashboard." },
    { icon: Lock, title: "granular permissions", description: "Give clients view-only access. Team members can edit. Admins control all." },
    { icon: BarChart3, title: "unified analytics", description: "Pull data from every platform into one view. No more spreadsheet copying." },
    { icon: Send, title: "client portal access", description: "Clients can log in anytime to see real-time data. Reduce status meetings." },
  ];

  const faqs = [
    { question: "How does white-labeling work?", answer: "Upload your logo, set brand colors, customize the domain. Clients see 'reports.youragency.com', not utm.one." },
    { question: "Can different team members access different clients?", answer: "Yes. Set up team permissions so account managers only see their clients. Admins see everything." },
    { question: "How do automated reports work?", answer: "Set a schedule and choose metrics. Reports generate automatically and deliver to client email or portal." },
    { question: "Can clients create their own links?", answer: "You control this. Give clients 'editor' access or keep them as 'viewers'. Your governance, your rules." },
  ];

  const calculatorInputs = [
    { id: "clients", label: "Number of Active Clients", defaultValue: 12 },
    { id: "hoursPerReport", label: "Hours per Monthly Report", defaultValue: 4 },
    { id: "hourlyRate", label: "Your Effective Hourly Rate", defaultValue: 150, prefix: "$" },
  ];

  const calculateROI = (inputs: Record<string, number>) => {
    const { clients, hoursPerReport, hourlyRate } = inputs;
    const currentHours = clients * hoursPerReport;
    const savedHours = currentHours * 0.85;
    const monthlySavings = savedHours * hourlyRate;
    const annualSavings = monthlySavings * 12;
    return {
      results: [
        { label: "Hours Saved Monthly", value: `${Math.round(savedHours)} hrs` },
        { label: "Monthly Value Recovered", value: `$${monthlySavings.toLocaleString()}` },
        { label: "Annual Value Recovered", value: `$${annualSavings.toLocaleString()}` },
      ],
      highlight: { label: "Time Back Per Month", value: `${Math.round(savedHours)} hours` },
    };
  };

  return (
    <>
      <Helmet>
        <title>Agency Client Reporting | utm.one</title>
        <meta name="description" content="White-labeled dashboards, automated reports, and multi-client management for agencies." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <UseCaseHero
          category="Agencies"
          categoryIcon={Briefcase}
          categoryColor="bg-orange-100 text-orange-700"
          headline="your clients want proof. give them poetry."
          subheadline="beautiful reports that show exactly what your work delivered. white-labeled, automated, impossible to argue with."
          stats={[{ value: "85%", label: "less time on reports" }, { value: "12", label: "clients managed per AM" }, { value: "< 5min", label: "to onboard new client" }]}
        />
        <section className="py-16 border-b border-border/50">
          <div className="max-w-[980px] mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedStatCard value="40 hrs" label="saved per month" description="Average for 12-client agency" />
              <AnimatedStatCard value="$6,000" label="monthly value recovered" description="At $150/hr effective rate" />
              <AnimatedStatCard value="3x" label="more clients per AM" description="Without additional headcount" />
            </div>
          </div>
        </section>
        <BeforeAfterSection title="the reporting treadmill" subtitle="Every month, your team spends days building reports instead of strategy." beforeTitle="the old way" afterTitle="the utm.one way" beforeItems={beforeItems} afterItems={afterItems} />
        <section className="py-20 bg-muted/30">
          <div className="max-w-[980px] mx-auto px-6 md:px-8">
            <JourneyFlowVisualizer title="from campaign to client inbox" subtitle="Set it once. Reports flow automatically. Your team focuses on what matters." steps={journeySteps} />
          </div>
        </section>
        <PlatformIntegrationsGrid title="pulls data from everywhere" subtitle="Connect all your client's platforms. One dashboard, all the data." platforms={platforms} />
        <FeatureGrid title="built for agency scale" subtitle="Every feature designed to help you manage more clients without more headcount." features={features} />
        <IndustryROICalculator title="calculate your time savings" subtitle="See how many hours you'll get back each month by automating reporting." inputs={calculatorInputs} calculateROI={calculateROI} />
        <FAQSection title="questions from agency teams" faqs={faqs} />
        <UseCaseCTA headline="scale your agency without scaling your team" subheadline="Stop drowning in reports. Start delighting clients with automated insights." />
      </div>
    </>
  );
};

export default AgencyClientReporting;
