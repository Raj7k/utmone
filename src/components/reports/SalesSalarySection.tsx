import { SalesSalaryTables } from "./SalesSalaryTables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { SalesOTEHistogram } from "./visualizations/SalesOTEHistogram";
import { CareerProgressionTimeline } from "./tools/CareerProgressionTimeline";
import { CalloutBox } from "./CalloutBox";
import { CheckCircle2 } from "lucide-react";

export const SalesSalarySection = () => {
  return (
    <section id="section-3" className="py-32 bg-background">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-blazeOrange text-white text-base px-4 py-2">Section 03</Badge>
            <Badge variant="outline" className="text-sm">10 min read</Badge>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            Global Sales Salary Benchmarks
          </h2>
        </div>

        {/* Opening Narrative */}
        <div className="prose prose-lg max-w-[750px] mx-auto mb-16">
          
          <div className="text-lg text-muted-foreground space-y-4 mb-12">
            <p className="lead text-xl">
              Sales compensation is the most volatile of any GTM function. <strong className="text-foreground">Winner-takes-most dynamics</strong> dominate: top performers earn 2-4× the median. Under-performers earn only base salary—or less, if companies claw back draws.
            </p>
            
            <p>
              <strong className="text-foreground">OTE (On-Target Earnings)</strong> is the critical metric in sales. OTE = Base Salary + Variable Compensation (commissions, bonuses) <em>assuming 100% quota attainment.</em> In reality, 40-60% of sales reps hit quota in any given quarter. The rest earn between base and OTE—or miss entirely.
            </p>

            <p>
              This creates <strong className="text-foreground">massive compensation variability:</strong> SDRs see ±10-15% variation, AEs see ±15-22%, Enterprise AEs see ±20-40%. Deal size, territory quality, market timing, product-market fit, quota structure, and individual performance all compound.
            </p>
          </div>

          {/* OTE Structure Explanation */}
          <div className="bg-[hsl(18,100%,51%)]/10 rounded-2xl p-8 mb-12 border border-[hsl(18,100%,51%)]/20">
            <h3 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[hsl(18,100%,51%)]" />
              Understanding OTE: Base + Variable
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">OTE is NOT guaranteed income.</strong> It's what you earn <em>if</em> you hit 100% of quota. Here's how it breaks down across sales roles:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm mt-4">
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">SDR/BDR Structure</p>
                  <p className="mb-2">Base: 55-65% of OTE</p>
                  <p className="mb-2">Variable: 35-45% of OTE</p>
                  <p className="text-xs">Lower risk, lower upside. Most SDRs hit quota (easier targets).</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">Account Executive</p>
                  <p className="mb-2">Base: 40-50% of OTE</p>
                  <p className="mb-2">Variable: 50-60% of OTE</p>
                  <p className="text-xs">Balanced risk/reward. 40-60% hit quota in mid-market SaaS.</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">Enterprise AE</p>
                  <p className="mb-2">Base: 30-45% of OTE</p>
                  <p className="mb-2">Variable: 55-70% of OTE</p>
                  <p className="text-xs">High risk, massive upside. Top performers make 3-5× base. Bottom 20% churn out.</p>
                </div>
              </div>
              <p className="mt-4">
              <strong className="text-foreground">Sales Leadership OTE shifts:</strong> VPs and CROs have higher base, lower upside multiple (60-70% base, 30-40% variable). Stability over volatility as you move up.
            </p>
          </div>

          {/* Sales OTE Distribution Visualization */}
          <div className="my-12">
            <SalesOTEHistogram />
          </div>
        </div>

          {/* SDR/BDR Deep Dive */}
          <h3 className="text-3xl font-display font-bold mb-6">SDR/BDR Deep Dive</h3>
          <div className="space-y-4 text-muted-foreground mb-10">
            <p>
              <strong className="text-foreground">Sales Development Representatives (SDRs)</strong> and <strong className="text-foreground">Business Development Representatives (BDRs)</strong> are the entry point into B2B sales. They generate pipeline by qualifying inbound leads (SDR) or running outbound prospecting (BDR).
            </p>
            <p>
              <strong className="text-foreground">Compensation structure:</strong> US SDRs earn $50K-$70K base with $80K-$105K OTE. UK/EU: $40K-$55K base, $65K-$85K OTE. India: $8K-$16K base, $12K-$22K OTE. LATAM: $12K-$25K base, $18K-$35K OTE.
            </p>
            <p>
              <strong className="text-foreground">AI Impact Warning:</strong> Low-skill outbound SDR work (cold email blasts, basic sequences, unqualified prospecting) is being automated by AI tools (Clay, Instantly, Apollo). SDRs who <em>orchestrate</em> AI—designing sequences, testing personalization strategies, analyzing response data—earn 10-22% premiums. SDRs who simply execute scripts are at risk.
            </p>
            <p>
              <strong className="text-foreground">Career progression:</strong> SDR → Senior SDR (12-18 months) → AE (18-36 months total). Companies prefer promoting SDRs to AEs (proven pipeline generation) over external hires. Salary jump from SDR to AE: +40-75%.
            </p>
            <div className="bg-[hsl(184,92%,18%)]/10 rounded-lg p-4 border border-[hsl(184,92%,18%)]/20">
              <p className="text-sm">
                <strong className="text-[hsl(184,92%,18%)]">Skills that separate top SDRs from average:</strong> Multi-channel prospecting (email + LinkedIn + phone), personalization at scale, qualification frameworks (BANT, MEDDIC), CRM hygiene, objection handling, pipeline velocity analysis, AI tool orchestration.
              </p>
            </div>
          </div>

          {/* Account Executive Deep Dive */}
          <h3 className="text-3xl font-display font-bold mb-6">Account Executive (AE) Deep Dive</h3>
          <div className="space-y-4 text-muted-foreground mb-10">
            <p>
              <strong className="text-foreground">Account Executives</strong> own the full sales cycle: discovery, demo, negotiation, close. They manage deals from qualified opportunity through signed contract. AEs are the revenue-generating engine of B2B SaaS.
            </p>
            <p>
              <strong className="text-foreground">Compensation structure:</strong> US AEs earn $80K-$120K base with $160K-$260K OTE (2-2.5× base multiplier). UK/EU: $55K-$90K base, $110K-$180K OTE. India: $18K-$40K base, $30K-$70K OTE. APAC: $60K-$100K base, $120K-$200K OTE.
            </p>
            <p>
              <strong className="text-foreground">OTE reality check:</strong> Only 40-60% of AEs hit 100% quota in mid-market B2B SaaS. Top 20% exceed 120% quota and earn accelerators (150-200% commission rates above quota). Bottom 20% earn 30-70% of OTE and often churn within 12-18 months.
            </p>
            <p>
              <strong className="text-foreground">Territory quality matters enormously.</strong> AE with Fortune 500 territory in strong ICP vertical can hit quota in 6 months. AE with SMB territory in weak-fit vertical struggles to hit 70%. Compensation gap: 30-60%. Companies rarely adjust quotas for territory quality, creating massive performance variability.
            </p>
            <p>
              <strong className="text-foreground">Deal size drives everything:</strong> AEs closing $10K-$50K deals (SMB/mid-market) earn $120K-$180K OTE. AEs closing $100K-$500K deals (mid-market/enterprise) earn $200K-$300K OTE. AEs closing $500K-$2M+ deals (enterprise/strategic) earn $300K-$500K+ OTE.
            </p>
          </div>

          {/* Enterprise AE Deep Dive */}
          <h3 className="text-3xl font-display font-bold mb-6">Enterprise / Strategic AE Deep Dive</h3>
          <div className="space-y-4 text-muted-foreground mb-10">
            <p>
              <strong className="text-foreground">Enterprise Account Executives</strong> close 6-7 figure deals with 6-18 month sales cycles. They navigate complex buyer committees (5-15 stakeholders), multi-threading relationships across champions, economic buyers, technical evaluators, legal, procurement, security.
            </p>
            <p>
              <strong className="text-foreground">Compensation is extreme:</strong> US Enterprise AEs earn $110K-$160K base with $220K-$400K+ OTE. Top-tier companies (Snowflake, Databricks, HashiCorp, Confluent, Datadog) pay $300K-$500K OTE for strong performers. Equity grants common at growth-stage startups (0.05-0.25% at Series B-D).
            </p>
            <p>
              <strong className="text-foreground">Winner-takes-most is most pronounced here.</strong> Top 10% of Enterprise AEs make 3-5× median. They close 2-3 massive deals per year while peers struggle to close 1. Commission accelerators above quota (150-200% rates) compound winnings. Bottom 20% earn only base salary ($110K-$160K) and often get managed out.
            </p>
            <p>
              <strong className="text-foreground">Why Enterprise AE is hardest sales role:</strong> Long cycles mean 6-18 months of relationship building before any revenue. Deals derail from budget cuts, priority shifts, champion departures, competitive losses, procurement negotiations. Success requires political navigation, executive presence, technical fluency, commercial acumen, persistence.
            </p>
            <div className="bg-[hsl(18,100%,51%)]/10 rounded-lg p-4 border border-[hsl(18,100%,51%)]/20">
              <p className="text-sm">
                <strong className="text-[hsl(18,100%,51%)]">Skills commanding highest premiums:</strong> Multi-threading (building relationships across buying committee), executive storytelling (CXO-level communication), commercial negotiation (pricing, contracts, SOWs), competitive displacement (winning against incumbent vendors), technical depth (understanding product architecture), forecasting accuracy.
              </p>
            </div>
          </div>

          {/* Sales Leadership Hierarchy */}
          <h3 className="text-3xl font-display font-bold mb-6">Sales Leadership Hierarchy</h3>
          <div className="space-y-4 text-muted-foreground mb-10">
            <p>
              <strong className="text-foreground">Frontline Sales Managers</strong> (managing 5-10 SDRs or AEs) earn $110K-$150K base, $180K-$260K OTE in US. They coach reps, remove blockers, forecast deals, manage pipelines. Promotion from IC AE typically requires 2-3 years of quota overachievement.
            </p>
            <p>
              <strong className="text-foreground">Directors of Sales</strong> (regional or segment owners managing 2-4 managers, 15-40 reps) earn $140K-$200K base, $250K-$400K OTE in US. They own regional/segment revenue targets, build playbooks, hire teams. Hired at Series B-C companies building sales organizations.
            </p>
            <p>
              <strong className="text-foreground">VP Sales / Chief Revenue Officer (CRO)</strong> owns all revenue: sales, partnerships, sometimes customer success and marketing. US compensation: $180K-$300K base, $350K-$600K OTE, equity (0.25-1.5% at Series B-D). CROs often come from VP Sales → VP Revenue → CRO path over 10-15 years.
            </p>
            <p>
              <strong className="text-foreground">Pay stabilization at leadership:</strong> Leadership OTE structure shifts to 60-70% base, 30-40% variable (inverse of IC ratios). Why? Leaders value stability, predictability, equity upside over commission volatility. Equity becomes larger component of comp (RSUs, options).
            </p>
          </div>
        </div>

        {/* Import Existing Sales Salary Tables */}
        <SalesSalaryTables />

        <CalloutBox className="mt-12">
          <strong>Critical Reality:</strong> Enterprise AE salaries can vary by ±40% for the same role title. The difference? Book of business size, industry vertical, sales cycle complexity, and quota attainment history. Your earning potential is tied directly to deal size and close rates.
        </CalloutBox>

        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-center">
            Your 10-Year Sales Career Path
          </h3>
          <p className="text-lg leading-[1.7] text-muted-foreground text-center max-w-[750px] mx-auto mb-8">
            See your earning trajectory from SDR to VP Sales. Switch between steady progression and fast-track scenarios to understand the time and compensation trade-offs.
          </p>
          <CareerProgressionTimeline />
        </div>

        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-8">
            What Drives Sales Compensation Extremes
          </h3>
          <div className="space-y-4 max-w-[750px] mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-deepSea">Deal size is everything</strong> — Enterprise AEs closing $500K+ deals earn 3× more than SMB reps closing $20K deals, even with similar win rates
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-deepSea">Quota attainment multiplies income</strong> — Reps consistently hitting 120%+ quota can double their OTE through accelerators and bonuses
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-deepSea">Industry vertical premiums</strong> — FinTech and Enterprise SaaS sales roles pay 25-40% more than e-commerce or consumer SaaS
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" aria-hidden="true" />
              <p className="text-lg leading-relaxed">
                <strong className="text-deepSea">AI is reshaping SDR roles</strong> — Companies are cutting SDR headcount by 30-50% and investing in AI-powered outbound, pushing survivors to focus on complex, high-touch accounts
              </p>
            </div>
          </div>
        </div>

        {/* Sales Volatility Analysis */}
        <div className="mt-16 mb-12">
          <h3 className="text-3xl font-display font-bold mb-8">Sales Compensation Volatility</h3>
          
          <div className="bg-[hsl(18,100%,51%)]/10 rounded-2xl p-8 border border-[hsl(18,100%,51%)]/20">
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Sales compensation volatility is at historic highs in 2025-2026.</strong> Economic uncertainty, longer sales cycles, tighter budgets, competitive displacement all compress quota attainment rates.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">SDR/BDR Volatility</p>
                  <p className="text-[hsl(18,100%,51%)] font-bold text-lg mb-1">±10-15%</p>
                  <p>Most predictable sales role. Targets based on activity (calls, emails, meetings booked) easier to hit than revenue quotas.</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">AE Volatility</p>
                  <p className="text-[hsl(18,100%,51%)] font-bold text-lg mb-1">±15-22%</p>
                  <p>Moderate volatility. Deal size, territory, timing all impact attainment. 40-60% hit quota in typical year.</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">Enterprise AE Volatility</p>
                  <p className="text-[hsl(18,100%,51%)] font-bold text-lg mb-1">±20-40%</p>
                  <p>Highest volatility. One lost deal = missing quarter. Deals shift across quarters. Winner-takes-most.</p>
                </div>
              </div>
              <p className="mt-4">
                <strong className="text-foreground">What drives volatility:</strong> Product-market fit strength, market timing (boom vs. downturn), competitive intensity, deal size relative to buyer budget, quota fairness, territory assignment, champion stability, procurement friction, contract cycles.
              </p>
            </div>
          </div>
        </div>

        {/* Equity in Sales */}
        <div className="mb-12">
          <h3 className="text-3xl font-display font-bold mb-6">Equity & Stock Options in Sales</h3>
          <div className="bg-muted/30 rounded-2xl p-8">
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Equity is common in sales at growth-stage startups (Series B-D), rare at mature/public companies.</strong> Sales reps get smaller equity grants than engineering/product (0.01-0.1% typical vs. 0.05-0.5% for ICs in eng), but grants compound for high performers and leadership.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <p className="font-semibold text-foreground mb-2">Typical Equity Grants (Series B-D):</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>SDR: 0.005-0.02% (rare to grant equity at this level)</li>
                    <li>AE: 0.01-0.05%</li>
                    <li>Enterprise AE: 0.03-0.1%</li>
                    <li>Sales Manager: 0.05-0.15%</li>
                    <li>Director of Sales: 0.1-0.3%</li>
                    <li>VP Sales: 0.25-0.75%</li>
                    <li>CRO: 0.5-1.5%</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Vesting Schedules:</p>
                  <p className="text-sm mb-4">Standard 4-year vest, 1-year cliff. If you leave before 1 year, you get nothing. After 1 year, 25% vests. Remaining 75% vests monthly over next 3 years.</p>
                  <p className="font-semibold text-foreground mb-2">Strike Prices & 409A:</p>
                  <p className="text-sm">Options granted at "fair market value" (409A valuation). If company raises at $1B valuation, your strike price might be $5-$10/share. You profit only if exit price {'>'}  strike price.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
