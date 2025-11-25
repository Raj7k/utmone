import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Docs from "./pages/Docs";
import APIPlayground from "./pages/Docs/APIPlayground";
import SDKs from "./pages/Docs/SDKs";
import Resources from "./pages/Resources";
import Guides from "./pages/resources/Guides";
import UTMGuide from "./pages/resources/guides/UTMGuide";
import CleanTrackFramework from "./pages/resources/guides/CleanTrackFramework";
import TrackingArchitecture from "./pages/resources/guides/TrackingArchitecture";
import SimpleAnalytics from "./pages/resources/guides/SimpleAnalytics";
import GrowthAnalytics from "./pages/resources/guides/GrowthAnalytics";
import LLMSeo from "./pages/resources/guides/LLMSeo";
import LLMRanking from "./pages/resources/playbooks/LLMRanking";
import UTMGovernancePlaybook from "./pages/resources/playbooks/UTMGovernancePlaybook";
import StartupAnalyticsPlaybook from "./pages/resources/playbooks/StartupAnalyticsPlaybook";
import EventLedGrowthPlaybook from "./pages/resources/playbooks/EventLedGrowthPlaybook";
import NamingConventionPlaybook from "./pages/resources/playbooks/NamingConventionPlaybook";
import SalesMarketingAlignmentPlaybook from "./pages/resources/playbooks/SalesMarketingAlignmentPlaybook";
import Playbooks from "./pages/resources/Playbooks";
import Templates from "./pages/resources/Templates";
import Tools from "./pages/resources/Tools";
import UTMTemplate from "./pages/resources/templates/UTMTemplate";
import AuditChecklistTemplate from "./pages/resources/templates/AuditChecklistTemplate";
import CampaignBriefTemplate from "./pages/resources/templates/CampaignBriefTemplate";
import NamingTaxonomyTemplate from "./pages/resources/templates/NamingTaxonomyTemplate";
import CleanTrackModel from "./pages/resources/frameworks/CleanTrackModel";
import MinimalAnalyticsStack from "./pages/resources/frameworks/MinimalAnalyticsStack";
import AttributionClarityModel from "./pages/resources/frameworks/AttributionClarityModel";
import B2BAttributionFramework from "./pages/resources/frameworks/B2BAttributionFramework";
import AIMarketingPlaybook from "./pages/resources/playbooks/AIMarketingPlaybook";
import UTMExamples from "./pages/resources/examples/UTMExamples";
import NamingExamples from "./pages/resources/examples/NamingExamples";
import DashboardExamples from "./pages/resources/examples/DashboardExamples";
import UTMAudit from "./pages/resources/checklists/UTMAudit";
import AnalyticsHealth from "./pages/resources/checklists/AnalyticsHealth";
import CampaignLaunch from "./pages/resources/checklists/CampaignLaunch";

// Glossary term pages
import GlossaryUTM from "./pages/resources/glossary/utm";
import GlossarySource from "./pages/resources/glossary/source";
import GlossaryMedium from "./pages/resources/glossary/medium";
import GlossaryCampaign from "./pages/resources/glossary/campaign";
import GlossaryContent from "./pages/resources/glossary/content";
import GlossaryTerm from "./pages/resources/glossary/term";
import GlossaryTaxonomy from "./pages/resources/glossary/taxonomy";
import GlossaryNamingConvention from "./pages/resources/glossary/naming-convention";
import GlossaryTrackingArchitecture from "./pages/resources/glossary/tracking-architecture";
import GlossaryFirstTouch from "./pages/resources/glossary/first-touch";
import GlossaryLastTouch from "./pages/resources/glossary/last-touch";
import GlossaryMultiTouch from "./pages/resources/glossary/multi-touch";
import GlossaryLinear from "./pages/resources/glossary/linear";
import GlossaryTimeDecay from "./pages/resources/glossary/time-decay";
import GlossaryPaidSearch from "./pages/resources/glossary/paid-search";
import GlossaryPaidSocial from "./pages/resources/glossary/paid-social";
import GlossaryOrganicSocial from "./pages/resources/glossary/organic-social";
import GlossaryEmail from "./pages/resources/glossary/email";
import GlossarySEO from "./pages/resources/glossary/seo";
import GlossaryReferral from "./pages/resources/glossary/referral";
import GlossaryDirect from "./pages/resources/glossary/direct";
import GlossaryDisplay from "./pages/resources/glossary/display";
import GlossaryMQL from "./pages/resources/glossary/mql";
import GlossarySQL from "./pages/resources/glossary/sql";
import GlossarySAL from "./pages/resources/glossary/sal";
import GlossaryLeadScoring from "./pages/resources/glossary/lead-scoring";
import GlossaryConversionRate from "./pages/resources/glossary/conversion-rate";
import GlossaryPipeline from "./pages/resources/glossary/pipeline";
import GlossaryCohort from "./pages/resources/glossary/cohort";
import GlossaryARR from "./pages/resources/glossary/arr";
import GlossaryMRR from "./pages/resources/glossary/mrr";
import GlossaryCAC from "./pages/resources/glossary/cac";
import GlossaryLTV from "./pages/resources/glossary/ltv";
import GlossaryChurn from "./pages/resources/glossary/churn";
import GlossaryActivation from "./pages/resources/glossary/activation";
import GlossaryLinkShortener from "./pages/resources/glossary/link-shortener";
import GlossaryQRCode from "./pages/resources/glossary/qr-code";
import GlossaryRedirect from "./pages/resources/glossary/redirect";
import GlossaryCustomDomain from "./pages/resources/glossary/custom-domain";
import GlossaryLinkExpiration from "./pages/resources/glossary/link-expiration";
import GlossaryPQL from "./pages/resources/glossary/pql";
import GlossarySelfServeConversion from "./pages/resources/glossary/self-serve-conversion";
import GlossaryUsageThreshold from "./pages/resources/glossary/usage-threshold";
import GlossaryHealthScore from "./pages/resources/glossary/health-score";
import GlossaryRenewalMotion from "./pages/resources/glossary/renewal-motion";
import GlossaryQBR from "./pages/resources/glossary/qbr";
import GlossaryTimeToValue from "./pages/resources/glossary/time-to-value";
import GlossaryImplementationPlan from "./pages/resources/glossary/implementation-plan";
import GlossaryAdoptionMilestones from "./pages/resources/glossary/adoption-milestones";
import GlossaryEarlyChurnSignals from "./pages/resources/glossary/early-churn-signals";
import GlossaryReactivationCampaign from "./pages/resources/glossary/reactivation-campaign";
import GlossaryValueMoments from "./pages/resources/glossary/value-moments";
import GlossaryFunnelMath from "./pages/resources/glossary/funnel-math";
import GlossaryLeadVelocityRate from "./pages/resources/glossary/lead-velocity-rate";
import GlossaryConversionWaterfall from "./pages/resources/glossary/conversion-waterfall";
import GlossaryCommitForecast from "./pages/resources/glossary/commit-forecast";
import GlossaryPipelineCoverageRatio from "./pages/resources/glossary/pipeline-coverage-ratio";
import GlossaryRunRate from "./pages/resources/glossary/run-rate";
import GlossaryQualityScore from "./pages/resources/glossary/quality-score";
import GlossaryBidStrategy from "./pages/resources/glossary/bid-strategy";
import GlossaryCreativeFatigue from "./pages/resources/glossary/creative-fatigue";
import GlossaryBoothEngagementRate from "./pages/resources/glossary/booth-engagement-rate";
import GlossaryEventROIModel from "./pages/resources/glossary/event-roi-model";
import GlossaryPipelineInfluence from "./pages/resources/glossary/pipeline-influence";
import GlossarySolutionMapping from "./pages/resources/glossary/solution-mapping";
import GlossaryTechnicalValidation from "./pages/resources/glossary/technical-validation";
import GlossaryPilotSuccessCriteria from "./pages/resources/glossary/pilot-success-criteria";
import GlossaryGrossMargin from "./pages/resources/glossary/gross-margin";
import GlossaryCACPaybackPeriod from "./pages/resources/glossary/cac-payback-period";
import GlossaryRevenueRecognition from "./pages/resources/glossary/revenue-recognition";
import Checklists from "./pages/resources/Checklists";
import Frameworks from "./pages/resources/Frameworks";
import Examples from "./pages/resources/Examples";
import Glossary from "./pages/resources/Glossary";
import Academy from "./pages/resources/Academy";

// Reports
import Reports from "./pages/resources/Reports";
import SalaryBenchmark2026 from "./pages/resources/reports/SalaryBenchmark2026";

// Salary Tools
import SalaryNegotiationCoach from "./pages/resources/tools/SalaryNegotiationCoach";
import MarketValueCalculator from "./pages/resources/tools/MarketValueCalculator";
import CareerPathOptimizer from "./pages/resources/tools/CareerPathOptimizer";
import JobOfferAnalyzer from "./pages/resources/tools/JobOfferAnalyzer";
import TeamBudgetOptimizer from "./pages/resources/tools/TeamBudgetOptimizer";
import AIvsHumanROI from "./pages/resources/tools/AIvsHumanROI";
import CompensationTransparency from "./pages/resources/tools/CompensationTransparency";
import LinkedInRealityCheck from "./pages/resources/tools/LinkedInRealityCheck";
import Dashboard from "./pages/Dashboard";
import Links from "./pages/Links";
import LinkDetail from "./pages/LinkDetail";
import Analytics from "./pages/Analytics";
import OnboardingEnhanced from "./pages/OnboardingEnhanced";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import LifetimeDeal from "./pages/LifetimeDeal";
import Marketers from "./pages/solutions/Marketers";
import Sales from "./pages/solutions/Sales";
import MarketingOps from "./pages/solutions/MarketingOps";
import Developers from "./pages/solutions/Developers";
import EarlyAccess from "./pages/EarlyAccess";
import Invite from "./pages/Invite";
import ClaimAccess from "./pages/ClaimAccess";
import AdminDashboard from "./pages/admin/Dashboard";
import WaitlistManagement from "./pages/admin/WaitlistManagement";
import LandingManagement from "./pages/admin/LandingManagement";
import ProductAnalytics from "./pages/admin/ProductAnalytics";
import SystemMonitoring from "./pages/admin/SystemMonitoring";
import FeatureFlags from "./pages/admin/FeatureFlags";
import FlagDetails from "./pages/admin/FlagDetails";
import PartnersManagement from "./pages/admin/PartnersManagement";
import { AdminLayout } from "@/components/admin/AdminLayout";
import PartnerApply from "./pages/Partners/Apply";
import PartnerDashboard from "./pages/Partners/Dashboard";
import PartnerTerms from "./pages/Partners/Terms";
import ZapierIntegration from "./pages/integrations/Zapier";
import SlackIntegration from "./pages/integrations/Slack";
import IntegrationsSettings from "./pages/settings/Integrations";
import PasswordProtected from "./pages/PasswordProtected";
import APIDocumentation from "./pages/Docs/API";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Accessibility from "@/pages/Accessibility";
import Permanence from "@/pages/Permanence";
import Backups from "@/pages/settings/Backups";
import ApprovalQueue from "./pages/ApprovalQueue";
import DeveloperSettings from "./pages/DeveloperSettings";
import Backup from "./pages/Settings/Backup";
import { SkipToContent } from "@/components/SkipToContent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Feature Pages
import ShortLinks from "./pages/features/ShortLinks";
import UTMBuilder from "./pages/features/UTMBuilder";
import QRGenerator from "./pages/features/QRGenerator";
import AnalyticsFeature from "./pages/features/Analytics";
import EnterpriseControl from "./pages/features/EnterpriseControl";
import CleanTrack from "./pages/features/CleanTrack";
import PartnerProgram from "./pages/features/PartnerProgram";
import ClientWorkspaces from "./pages/ClientWorkspaces";
import AnalyticsShare from "./pages/AnalyticsShare";
import Features from "./pages/Features";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WorkspaceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SkipToContent />
            <ScrollToTop />
            <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<OnboardingEnhanced />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/links" element={<Links />} />
          <Route path="/links/:linkId" element={<LinkDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/waitlist" element={<AdminLayout><WaitlistManagement /></AdminLayout>} />
          <Route path="/admin/landing" element={<AdminLayout><LandingManagement /></AdminLayout>} />
          <Route path="/admin/product" element={<AdminLayout><ProductAnalytics /></AdminLayout>} />
          <Route path="/admin/system" element={<AdminLayout><SystemMonitoring /></AdminLayout>} />
          <Route path="/admin/feature-flags" element={<AdminLayout><FeatureFlags /></AdminLayout>} />
          <Route path="/admin/flags/:flagKey" element={<AdminLayout><FlagDetails /></AdminLayout>} />
          <Route path="/admin/partners" element={<AdminLayout><PartnersManagement /></AdminLayout>} />
          
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/domains" element={<Settings />} />
          <Route path="/settings/backups" element={<Backups />} />
          <Route path="/settings/backup" element={<Backup />} />
          <Route path="/settings/developer" element={<DeveloperSettings />} />
          <Route path="/approval-queue" element={<ApprovalQueue />} />
          <Route path="/password-protected" element={<PasswordProtected />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/permanence" element={<Permanence />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/lifetime-deal" element={<LifetimeDeal />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/api" element={<APIDocumentation />} />
          <Route path="/docs/playground" element={<APIPlayground />} />
          <Route path="/docs/sdks" element={<SDKs />} />
          
          {/* Feature Pages */}
          <Route path="/features" element={<Features />} />
          <Route path="/features/short-links" element={<ShortLinks />} />
          <Route path="/features/utm-builder" element={<UTMBuilder />} />
          <Route path="/features/qr-generator" element={<QRGenerator />} />
          <Route path="/features/analytics" element={<AnalyticsFeature />} />
          <Route path="/features/governance" element={<EnterpriseControl />} />
          <Route path="/features/clean-track" element={<CleanTrack />} />
          <Route path="/features/partner-program" element={<PartnerProgram />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/guides" element={<Guides />} />
          <Route path="/resources/guides/utm-guide" element={<UTMGuide />} />
          <Route path="/resources/guides/clean-track-framework" element={<CleanTrackFramework />} />
          <Route path="/resources/guides/tracking-architecture" element={<TrackingArchitecture />} />
          <Route path="/resources/guides/simple-analytics" element={<SimpleAnalytics />} />
          <Route path="/resources/guides/growth-analytics" element={<GrowthAnalytics />} />
          <Route path="/resources/guides/llm-seo" element={<LLMSeo />} />
          
          {/* Playbook Routes */}
          <Route path="/resources/playbooks/llm-ranking" element={<LLMRanking />} />
          <Route path="/resources/playbooks/utm-governance-playbook" element={<UTMGovernancePlaybook />} />
          <Route path="/resources/playbooks/startup-analytics-playbook" element={<StartupAnalyticsPlaybook />} />
          <Route path="/resources/playbooks/event-led-growth-playbook" element={<EventLedGrowthPlaybook />} />
          <Route path="/resources/playbooks/naming-convention-playbook" element={<NamingConventionPlaybook />} />
          <Route path="/resources/playbooks/sales-marketing-alignment" element={<SalesMarketingAlignmentPlaybook />} />
          <Route path="/resources/playbooks/ai-marketing" element={<AIMarketingPlaybook />} />
          <Route path="/resources/playbooks" element={<Playbooks />} />
          
          {/* Template Routes */}
          <Route path="/resources/templates" element={<Templates />} />
          <Route path="/resources/templates/utm-template" element={<UTMTemplate />} />
          <Route path="/resources/templates/audit-checklist-template" element={<AuditChecklistTemplate />} />
          <Route path="/resources/templates/campaign-brief-template" element={<CampaignBriefTemplate />} />
          <Route path="/resources/templates/naming-taxonomy-template" element={<NamingTaxonomyTemplate />} />
          
          {/* Tools Routes */}
          <Route path="/resources/tools" element={<Tools />} />
          <Route path="/resources/tools/salary-negotiation-coach" element={<SalaryNegotiationCoach />} />
          <Route path="/resources/tools/market-value-calculator" element={<MarketValueCalculator />} />
          <Route path="/resources/tools/career-path-optimizer" element={<CareerPathOptimizer />} />
          <Route path="/resources/tools/job-offer-analyzer" element={<JobOfferAnalyzer />} />
          <Route path="/resources/tools/team-budget-optimizer" element={<TeamBudgetOptimizer />} />
          <Route path="/resources/tools/ai-vs-human-roi" element={<AIvsHumanROI />} />
          <Route path="/resources/tools/compensation-transparency" element={<CompensationTransparency />} />
          <Route path="/resources/tools/linkedin-reality-check" element={<LinkedInRealityCheck />} />
          
          {/* Reports Routes */}
          <Route path="/resources/reports" element={<Reports />} />
            <Route path="/resources/reports/salary-benchmark-2026" element={<SalaryBenchmark2026 />} />
            <Route path="/resources/reports/salary-benchmark-2025" element={<SalaryBenchmark2026 />} /> {/* Legacy route redirect */}
          
          {/* Framework Routes */}
            <Route path="/resources/frameworks/clean-track-model" element={<CleanTrackModel />} />
            <Route path="/resources/frameworks/minimal-analytics-stack" element={<MinimalAnalyticsStack />} />
            <Route path="/resources/frameworks/attribution-clarity-model" element={<AttributionClarityModel />} />
            <Route path="/resources/frameworks/b2b-attribution" element={<B2BAttributionFramework />} />
            <Route path="/resources/examples/utm-examples" element={<UTMExamples />} />
            <Route path="/resources/examples/naming-examples" element={<NamingExamples />} />
            <Route path="/resources/examples/dashboard-examples" element={<DashboardExamples />} />
            <Route path="/resources/checklists/utm-audit" element={<UTMAudit />} />
            <Route path="/resources/checklists/analytics-health" element={<AnalyticsHealth />} />
            <Route path="/resources/checklists/campaign-launch" element={<CampaignLaunch />} />
            
            {/* Glossary term pages */}
            <Route path="/resources/glossary/utm" element={<GlossaryUTM />} />
            <Route path="/resources/glossary/source" element={<GlossarySource />} />
            <Route path="/resources/glossary/medium" element={<GlossaryMedium />} />
            <Route path="/resources/glossary/campaign" element={<GlossaryCampaign />} />
            <Route path="/resources/glossary/content" element={<GlossaryContent />} />
            <Route path="/resources/glossary/term" element={<GlossaryTerm />} />
            <Route path="/resources/glossary/taxonomy" element={<GlossaryTaxonomy />} />
            <Route path="/resources/glossary/naming-convention" element={<GlossaryNamingConvention />} />
            <Route path="/resources/glossary/tracking-architecture" element={<GlossaryTrackingArchitecture />} />
            <Route path="/resources/glossary/first-touch" element={<GlossaryFirstTouch />} />
            <Route path="/resources/glossary/last-touch" element={<GlossaryLastTouch />} />
            <Route path="/resources/glossary/multi-touch" element={<GlossaryMultiTouch />} />
            <Route path="/resources/glossary/linear" element={<GlossaryLinear />} />
            <Route path="/resources/glossary/time-decay" element={<GlossaryTimeDecay />} />
            <Route path="/resources/glossary/paid-search" element={<GlossaryPaidSearch />} />
            <Route path="/resources/glossary/paid-social" element={<GlossaryPaidSocial />} />
            <Route path="/resources/glossary/organic-social" element={<GlossaryOrganicSocial />} />
            <Route path="/resources/glossary/email" element={<GlossaryEmail />} />
            <Route path="/resources/glossary/seo" element={<GlossarySEO />} />
            <Route path="/resources/glossary/referral" element={<GlossaryReferral />} />
            <Route path="/resources/glossary/direct" element={<GlossaryDirect />} />
            <Route path="/resources/glossary/display" element={<GlossaryDisplay />} />
            <Route path="/resources/glossary/mql" element={<GlossaryMQL />} />
            <Route path="/resources/glossary/sql" element={<GlossarySQL />} />
            <Route path="/resources/glossary/sal" element={<GlossarySAL />} />
            <Route path="/resources/glossary/lead-scoring" element={<GlossaryLeadScoring />} />
            <Route path="/resources/glossary/conversion-rate" element={<GlossaryConversionRate />} />
            <Route path="/resources/glossary/pipeline" element={<GlossaryPipeline />} />
            <Route path="/resources/glossary/cohort" element={<GlossaryCohort />} />
            <Route path="/resources/glossary/arr" element={<GlossaryARR />} />
            <Route path="/resources/glossary/mrr" element={<GlossaryMRR />} />
            <Route path="/resources/glossary/cac" element={<GlossaryCAC />} />
            <Route path="/resources/glossary/ltv" element={<GlossaryLTV />} />
            <Route path="/resources/glossary/churn" element={<GlossaryChurn />} />
            <Route path="/resources/glossary/activation" element={<GlossaryActivation />} />
            <Route path="/resources/glossary/link-shortener" element={<GlossaryLinkShortener />} />
            <Route path="/resources/glossary/qr-code" element={<GlossaryQRCode />} />
            <Route path="/resources/glossary/redirect" element={<GlossaryRedirect />} />
            <Route path="/resources/glossary/custom-domain" element={<GlossaryCustomDomain />} />
            <Route path="/resources/glossary/link-expiration" element={<GlossaryLinkExpiration />} />
            <Route path="/resources/glossary/pql" element={<GlossaryPQL />} />
            <Route path="/resources/glossary/self-serve-conversion" element={<GlossarySelfServeConversion />} />
            <Route path="/resources/glossary/usage-threshold" element={<GlossaryUsageThreshold />} />
            <Route path="/resources/glossary/health-score" element={<GlossaryHealthScore />} />
            <Route path="/resources/glossary/renewal-motion" element={<GlossaryRenewalMotion />} />
            <Route path="/resources/glossary/qbr" element={<GlossaryQBR />} />
            <Route path="/resources/glossary/time-to-value" element={<GlossaryTimeToValue />} />
            <Route path="/resources/glossary/implementation-plan" element={<GlossaryImplementationPlan />} />
            <Route path="/resources/glossary/adoption-milestones" element={<GlossaryAdoptionMilestones />} />
            <Route path="/resources/glossary/early-churn-signals" element={<GlossaryEarlyChurnSignals />} />
            <Route path="/resources/glossary/reactivation-campaign" element={<GlossaryReactivationCampaign />} />
            <Route path="/resources/glossary/value-moments" element={<GlossaryValueMoments />} />
            <Route path="/resources/glossary/funnel-math" element={<GlossaryFunnelMath />} />
            <Route path="/resources/glossary/lead-velocity-rate" element={<GlossaryLeadVelocityRate />} />
            <Route path="/resources/glossary/conversion-waterfall" element={<GlossaryConversionWaterfall />} />
            <Route path="/resources/glossary/commit-forecast" element={<GlossaryCommitForecast />} />
            <Route path="/resources/glossary/pipeline-coverage-ratio" element={<GlossaryPipelineCoverageRatio />} />
            <Route path="/resources/glossary/run-rate" element={<GlossaryRunRate />} />
            <Route path="/resources/glossary/quality-score" element={<GlossaryQualityScore />} />
            <Route path="/resources/glossary/bid-strategy" element={<GlossaryBidStrategy />} />
            <Route path="/resources/glossary/creative-fatigue" element={<GlossaryCreativeFatigue />} />
            <Route path="/resources/glossary/booth-engagement-rate" element={<GlossaryBoothEngagementRate />} />
            <Route path="/resources/glossary/event-roi-model" element={<GlossaryEventROIModel />} />
            <Route path="/resources/glossary/pipeline-influence" element={<GlossaryPipelineInfluence />} />
            <Route path="/resources/glossary/solution-mapping" element={<GlossarySolutionMapping />} />
            <Route path="/resources/glossary/technical-validation" element={<GlossaryTechnicalValidation />} />
            <Route path="/resources/glossary/pilot-success-criteria" element={<GlossaryPilotSuccessCriteria />} />
            <Route path="/resources/glossary/gross-margin" element={<GlossaryGrossMargin />} />
            <Route path="/resources/glossary/cac-payback-period" element={<GlossaryCACPaybackPeriod />} />
            <Route path="/resources/glossary/revenue-recognition" element={<GlossaryRevenueRecognition />} />
          <Route path="/resources/templates" element={<Templates />} />
          <Route path="/resources/checklists" element={<Checklists />} />
          <Route path="/resources/frameworks" element={<Frameworks />} />
          <Route path="/resources/examples" element={<Examples />} />
          <Route path="/resources/glossary" element={<Glossary />} />
          <Route path="/resources/academy" element={<Academy />} />
          <Route path="/solutions/marketers" element={<Marketers />} />
          <Route path="/solutions/sales" element={<Sales />} />
          <Route path="/solutions/marketing-ops" element={<MarketingOps />} />
          <Route path="/solutions/developers" element={<Developers />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/invite/:code" element={<Invite />} />
          <Route path="/claim-access" element={<ClaimAccess />} />
          <Route path="/partners/apply" element={<PartnerApply />} />
          <Route path="/partners/dashboard" element={<PartnerDashboard />} />
          <Route path="/partners/terms" element={<PartnerTerms />} />
          <Route path="/integrations/zapier" element={<ZapierIntegration />} />
          <Route path="/integrations/slack" element={<SlackIntegration />} />
          <Route path="/settings/integrations" element={<IntegrationsSettings />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/workspaces" element={<ClientWorkspaces />} />
          <Route path="/analytics/share/:token" element={<AnalyticsShare />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
