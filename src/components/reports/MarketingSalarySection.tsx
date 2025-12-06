import { MarketingSalaryTables } from "./MarketingSalaryTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { MarketingRoleDemandPie } from "./visualizations/MarketingRoleDemandPie";
import { B2BvsB2CComparison } from "./visualizations/B2BvsB2CComparison";
import { CareerProgressionTimeline } from "./tools/CareerProgressionTimeline";
import { CalloutBox } from "./CalloutBox";
import { CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const MarketingSalarySection = () => {
  return (
    <section id="section-2" className="py-32 bg-muted/20">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-deepSea text-white text-base px-4 py-2">Section 02</Badge>
            <Badge variant="outline" className="text-sm">12 min read</Badge>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            Global Marketing Salary Benchmarks
          </h2>
        </div>

        {/* Opening Narrative */}
        <div className="prose prose-lg max-w-[750px] mx-auto mb-16">
          
          <div className="text-lg text-foreground space-y-4 mb-12">
            <p className="lead text-xl">
              Marketing compensation varies more dramatically than any other GTM function. The gap between highest-paid and lowest-paid marketing roles is <strong className="text-foreground">3.8×</strong>—wider than sales (2.7×), operations (2.1×), or product (2.3×).
            </p>
            
            <p>
              Why? <strong className="text-foreground">Marketing's impact on revenue isn't uniform.</strong> Some marketing roles—Product Marketing, Demand Generation, Marketing Operations—tie directly to pipeline, revenue, and deals closed. Others—content writing, social media management, basic SEO—have become commoditized by AI, freelancer platforms, and overseas talent.
            </p>

            <p>
              The result: Marketing compensation is fragmenting. High-value roles command 30-60% premiums over median. Low-value roles see stagnant or declining pay. Geography, industry, company stage, and skills compound these gaps.
            </p>
          </div>

          {/* Marketing Role Demand Visualization */}
          <div className="my-12">
            <MarketingRoleDemandPie />
          </div>

          {/* B2B vs B2C Divide */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" />
              The B2B vs. B2C Divide
            </h3>
            <p className="text-foreground mb-4">
              <strong className="text-foreground">B2B marketing pays 10-30% more than B2C marketing</strong> at equivalent levels. Why?
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-background rounded-lg p-4">
                <p className="font-semibold text-foreground mb-2">B2B Marketing Economics</p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Longer sales cycles (3-18 months)</li>
                  <li>Higher deal values ($50K-$1M+)</li>
                  <li>Complex buyer committees (5-12 stakeholders)</li>
                  <li>Strategic positioning & messaging crucial</li>
                  <li>Attribution more measurable</li>
                </ul>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="font-semibold text-foreground mb-2">B2C Marketing Economics</p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Faster cycles (seconds to weeks)</li>
                  <li>Lower deal values ($10-$500)</li>
                  <li>Single buyer decisions</li>
                  <li>Volume & efficiency prioritized</li>
                  <li>Attribution harder to isolate</li>
                </ul>
              </div>
            </div>
            <p className="text-foreground mt-4">
              <strong className="text-foreground">Exception:</strong> Performance Marketing and CRM/Lifecycle roles in B2C often match or exceed B2B pay due to direct revenue accountability and technical complexity.
            </p>
          </div>

          {/* B2B vs B2C Comparison Visualization */}
          <div className="my-12">
            <B2BvsB2CComparison />
          </div>

          {/* B2B Marketing Deep Dive */}
          <h3 className="text-3xl font-display font-bold mb-6">B2B Marketing Role Deep Dives</h3>
          
          {/* Product Marketing Manager */}
          <div className="mb-10">
            <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Product Marketing Manager (PMM)
              <Badge className="bg-[hsl(184,92%,18%)] text-white">Highest-Paid</Badge>
            </h4>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Why PMM is the highest-paid marketing role globally:</strong> Product marketers don't just promote products—they define how products are positioned, packaged, priced, and brought to market. They sit at the intersection of product, marketing, and sales, translating technical capabilities into business value stories that close deals.
              </p>
              <p>
                Unlike content marketing or social media, <strong className="text-foreground">AI cannot replicate positioning strategy.</strong> AI can write blog posts. It cannot determine whether your product should be positioned as "workflow automation for ops teams" or "AI copilot for revenue leaders." That strategic judgment—informed by market research, competitor analysis, buyer interviews, and sales feedback—is what drives PMM premiums.
              </p>
              <p>
                <strong className="text-foreground">Career progression:</strong> Associate PMM ($75K-$95K US) → Manager ($115K-$150K) → Senior Manager ($140K-$180K) → Director ($175K-$240K) → VP Product Marketing ($240K-$340K). Path typically requires 7-12 years with strong product knowledge and GTM strategy skills.
              </p>
              <div className="bg-[hsl(184,92%,18%)]/10 rounded-lg p-4 border border-[hsl(184,92%,18%)]/20">
                <p className="text-sm">
                  <strong className="text-[hsl(184,92%,18%)]">Skills commanding highest premiums:</strong> Competitive intelligence frameworks, GTM strategy & launch planning, sales enablement content creation, product storytelling for technical audiences, pricing & packaging strategy, analyst relations (Gartner, Forrester).
                </p>
              </div>
            </div>
          </div>

          {/* Demand Generation */}
          <div className="mb-10">
            <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Demand Generation
              <Badge className="bg-[hsl(184,92%,18%)] text-white">Pipeline-Accountable</Badge>
            </h4>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Demand Gen earns 15-25% more than brand or content marketing because <strong className="text-foreground">they own a number: pipeline generated.</strong> When the CEO asks "why are we missing revenue targets?", Demand Gen is in the room explaining lead quality, conversion rates, CAC, and campaign ROI.
              </p>
              <p>
                <strong className="text-foreground">Geographic salary variations are stark:</strong> US Demand Gen Managers earn $105K-$135K base. UK/EU: $60K-$85K. India: $18K-$30K. However, India sees fastest YoY growth (+28%) as global SaaS companies hire remote Demand Gen teams targeting western markets.
              </p>
              <p>
                <strong className="text-foreground">Skills that drive compensation:</strong> Marketing automation platforms (HubSpot, Marketo, Pardot), attribution modeling (first-touch, multi-touch, custom), AI-assisted campaign execution, ABM strategy, SQL for data analysis, conversion rate optimization, paid media strategy (LinkedIn, Google, Meta).
              </p>
            </div>
          </div>

          {/* Marketing Operations */}
          <div className="mb-10">
            <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Marketing Operations
              <Badge className="bg-[hsl(18,100%,51%)] text-white">Scarcity Premium</Badge>
            </h4>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Marketing Operations commands an <strong className="text-foreground">18-30% salary premium</strong> over generalist marketing roles due to technical scarcity. MarkOps professionals manage the entire marketing tech stack: CRM, marketing automation, analytics platforms, ABM tools, attribution systems, data warehouses.
              </p>
              <p>
                <strong className="text-foreground">Why MarkOps salaries are rising faster than other marketing roles:</strong> Marketing teams are drowning in tools (average B2B company has 15-40 marketing technologies). Most marketers lack technical skills to configure, maintain, and optimize these systems. MarkOps fills this gap.
              </p>
              <p>
                <strong className="text-foreground">Career trajectory is accelerating:</strong> MarkOps Manager → Senior Manager → Director of Marketing Operations → VP Marketing or VP Revenue Operations. Directors increasingly own Revenue Architecture (marketing + sales operations), which commands 15-20% premium over pure MarkOps roles.
              </p>
            </div>
          </div>

          {/* Content Marketing */}
          <div className="mb-10">
            <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Content Marketing
              <Badge variant="destructive">At Risk</Badge>
            </h4>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Content marketing compensation is under pressure.</strong> AI writing tools (ChatGPT, Claude, Jasper) have commoditized basic content creation. Blog posts, social posts, email copy, ad copy—tasks that once required $65K-$95K writers—can now be produced by AI at near-zero marginal cost.
              </p>
              <p>
                <strong className="text-foreground">What still commands value:</strong> Content strategy (not execution), technical content for developer audiences, original research & data-driven storytelling, video production & multimedia, thought leadership ghostwriting for executives. Writers who position themselves as strategists (not executors) maintain compensation.
              </p>
              <p>
                <strong className="text-foreground">Geographic arbitrage is accelerating:</strong> Companies hire writers in India ($8K-$15K), Philippines ($6K-$12K), Eastern Europe ($12K-$20K) instead of US ($65K-$95K). Remote work + AI tools make location irrelevant for content execution.
              </p>
            </div>
          </div>
        </div>

        {/* Import Existing Marketing Salary Tables */}
        <MarketingSalaryTables />

        <CalloutBox className="mt-12">
          <strong>Critical Insight:</strong> The highest-paid marketing roles aren't just "doing marketing"—they're building systems that generate predictable pipeline. Companies pay premiums for marketers who can automate, attribute, and prove ROI.
        </CalloutBox>

        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
            Your 10-Year Marketing Career Path
          </h3>
          <p className="text-lg leading-[1.7] text-muted-foreground text-center max-w-[750px] mx-auto mb-8">
            See how your salary could evolve from Coordinator to VP over the next decade. Choose your path and scenario to see realistic projections.
          </p>
          <CareerProgressionTimeline />
        </div>

        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-8">
            Why Marketing Salaries Vary So Much
          </h3>
          <div className="space-y-4 max-w-[750px] mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blazeOrange mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-blazeOrange">Skills beat titles</strong> — A Product Marketing Manager with SQL, analytics, and AI automation skills earns 40% more than one without
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blazeOrange mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-blazeOrange">B2B pays more than B2C</strong> — Enterprise B2B marketing roles command 25-35% premiums due to longer sales cycles and complex attribution
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blazeOrange mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-blazeOrange">Geography still matters</strong> — San Francisco PMMs earn 4.8× what Mexico City PMMs make, despite identical responsibilities
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blazeOrange mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-blazeOrange">Company size sweet spot</strong> — Firms with 51-500 employees offer the highest increases because marketing directly impacts pipeline quality
              </p>
            </div>
          </div>
        </div>

        {/* Geographic Spotlight - Vertical Stacked with Animation */}
        <div className="mt-16 mb-12">
          <h3 className="text-3xl font-display font-bold mb-8 text-center">Geographic Salary Spotlight</h3>
          
          <div className="max-w-[900px] mx-auto space-y-8">
            <ScrollReveal delay={0}>
              <Card className="hover:shadow-lg transition-apple hover:scale-101">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    🇺🇸 United States
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">San Francisco & Silicon Valley:</strong> Highest marketing salaries globally. PMM Directors earn $200K-$260K. Demand Gen Managers: $130K-$160K. 25-40% premium over national average.
                  </p>
                  <p>
                    <strong className="text-foreground">New York City:</strong> Second-highest market. Finance, media, enterprise SaaS drive demand. PMM compensation matches SF; Demand Gen slightly lower.
                  </p>
                  <p>
                    <strong className="text-foreground">Austin, Denver, Seattle:</strong> 10-18% lower than SF/NYC but cost-of-living adjusted purchasing power often higher. Remote-first companies anchoring salaries to these markets.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <Card className="hover:shadow-lg transition-apple hover:scale-101">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    🇮🇳 India
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Bangalore (Bengaluru):</strong> Highest marketing salaries in India. Senior PMMs: ₹30-45L ($36K-$54K). Demand Gen Managers: ₹20-35L ($24K-$42K). Global SaaS companies (Freshworks, Razorpay, Chargebee) compete with US remote roles.
                  </p>
                  <p>
                    <strong className="text-foreground">Mumbai, Delhi NCR, Hyderabad, Pune:</strong> 10-20% lower than Bangalore. Strong growth in MarkOps and Performance Marketing roles as companies invest in marketing automation.
                  </p>
                  <p>
                    <strong className="text-foreground">YoY Growth:</strong> India marketing salaries growing fastest globally (+22-32% YoY) due to global remote hiring and domestic SaaS boom.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="hover:shadow-lg transition-apple hover:scale-101">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    🇬🇧 🇪🇺 UK & Europe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">London:</strong> Highest European marketing salaries. PMM Directors: £80K-£110K ($100K-$140K). Demand Gen Managers: £60K-£85K. Fintech, enterprise software, consulting drive demand.
                  </p>
                  <p>
                    <strong className="text-foreground">Germany (Berlin, Munich):</strong> 10-20% below London but strong benefits, job security, and work-life balance. Growing demand for English-fluent marketers.
                  </p>
                  <p>
                    <strong className="text-foreground">Netherlands, Ireland:</strong> Tech hubs with competitive US-style compensation. Dublin attracting US tech companies; Amsterdam strong for B2B SaaS.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};