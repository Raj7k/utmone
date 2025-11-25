import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DashboardSkeleton } from "./components/SkeletonLoader";
import { SkipToContent } from "./components/SkipToContent";
import { NetworkStatus } from "./components/ui/network-status";
import { AppWithHelp } from "./components/AppWithHelp";

// Critical pages - not lazy loaded for fast initial load
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ComingSoonPage from "./pages/ComingSoon";

// Lazy-loaded pages for code splitting
// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import("./pages/dashboard/Overview"));
const DashboardLinks = lazy(() => import("./pages/dashboard/Links"));
const DashboardAnalytics = lazy(() => import("./pages/dashboard/Analytics"));
const DashboardQRCodes = lazy(() => import("./pages/dashboard/QRCodes"));
const Targeting = lazy(() => import("./pages/dashboard/Targeting"));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const Links = lazy(() => import("./pages/Links"));
const LinkDetail = lazy(() => import("./pages/LinkDetail"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const OnboardingEnhanced = lazy(() => import("./pages/OnboardingEnhanced"));
const Backups = lazy(() => import("./pages/settings/Backups"));
const Backup = lazy(() => import("./pages/Settings/Backup"));
const DeveloperSettings = lazy(() => import("./pages/DeveloperSettings"));
const ApprovalQueue = lazy(() => import("./pages/ApprovalQueue"));
const PasswordProtected = lazy(() => import("./pages/PasswordProtected"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Permanence = lazy(() => import("./pages/Permanence"));
const Pricing = lazy(() => import("./pages/Pricing"));
const LifetimeDeal = lazy(() => import("./pages/LifetimeDeal"));
const About = lazy(() => import("./pages/About"));
const Docs = lazy(() => import("./pages/Docs"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Support = lazy(() => import("./pages/Support"));
const APIDocumentation = lazy(() => import("./pages/Docs/API"));
const APIPlayground = lazy(() => import("./pages/Docs/APIPlayground"));
const SDKs = lazy(() => import("./pages/Docs/SDKs"));
const PublicQRGenerator = lazy(() => import("./pages/tools/QRGenerator"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));

// Admin pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const WaitlistManagement = lazy(() => import("./pages/admin/WaitlistManagement"));
const LandingManagement = lazy(() => import("./pages/admin/LandingManagement"));
const ProductAnalytics = lazy(() => import("./pages/admin/ProductAnalytics"));
const SystemMonitoring = lazy(() => import("./pages/admin/SystemMonitoring"));
const FeatureFlags = lazy(() => import("./pages/admin/FeatureFlags"));
const FlagDetails = lazy(() => import("./pages/admin/FlagDetails"));
const PartnersManagement = lazy(() => import("./pages/admin/PartnersManagement"));
const SystemTests = lazy(() => import("./pages/admin/SystemTests"));

// Feature Pages
const Features = lazy(() => import("./pages/Features"));
const ShortLinks = lazy(() => import("./pages/features/ShortLinks"));
const UTMBuilder = lazy(() => import("./pages/features/UTMBuilder"));
const QRGenerator = lazy(() => import("./pages/features/QRGenerator"));
const AnalyticsFeature = lazy(() => import("./pages/features/Analytics"));
const EnterpriseControl = lazy(() => import("./pages/features/EnterpriseControl"));
const CleanTrack = lazy(() => import("./pages/features/CleanTrack"));
const PartnerProgram = lazy(() => import("./pages/features/PartnerProgram"));

// Solution Pages
const Marketers = lazy(() => import("./pages/solutions/Marketers"));
const Sales = lazy(() => import("./pages/solutions/Sales"));
const MarketingOps = lazy(() => import("./pages/solutions/MarketingOps"));
const Developers = lazy(() => import("./pages/solutions/Developers"));

// Resource Pages
const Resources = lazy(() => import("./pages/Resources"));
const Guides = lazy(() => import("./pages/resources/Guides"));
const UTMGuide = lazy(() => import("./pages/resources/guides/UTMGuide"));
const CleanTrackFramework = lazy(() => import("./pages/resources/guides/CleanTrackFramework"));
const TrackingArchitecture = lazy(() => import("./pages/resources/guides/TrackingArchitecture"));
const SimpleAnalytics = lazy(() => import("./pages/resources/guides/SimpleAnalytics"));
const GrowthAnalytics = lazy(() => import("./pages/resources/guides/GrowthAnalytics"));
const LLMSeo = lazy(() => import("./pages/resources/guides/LLMSeo"));

// Playbooks
const Playbooks = lazy(() => import("./pages/resources/Playbooks"));
const LLMRanking = lazy(() => import("./pages/resources/playbooks/LLMRanking"));
const UTMGovernancePlaybook = lazy(() => import("./pages/resources/playbooks/UTMGovernancePlaybook"));
const StartupAnalyticsPlaybook = lazy(() => import("./pages/resources/playbooks/StartupAnalyticsPlaybook"));
const EventLedGrowthPlaybook = lazy(() => import("./pages/resources/playbooks/EventLedGrowthPlaybook"));
const NamingConventionPlaybook = lazy(() => import("./pages/resources/playbooks/NamingConventionPlaybook"));
const SalesMarketingAlignmentPlaybook = lazy(() => import("./pages/resources/playbooks/SalesMarketingAlignmentPlaybook"));
const AIMarketingPlaybook = lazy(() => import("./pages/resources/playbooks/AIMarketingPlaybook"));

// Templates
const Templates = lazy(() => import("./pages/resources/Templates"));
const UTMTemplate = lazy(() => import("./pages/resources/templates/UTMTemplate"));
const AuditChecklistTemplate = lazy(() => import("./pages/resources/templates/AuditChecklistTemplate"));
const CampaignBriefTemplate = lazy(() => import("./pages/resources/templates/CampaignBriefTemplate"));
const NamingTaxonomyTemplate = lazy(() => import("./pages/resources/templates/NamingTaxonomyTemplate"));

// Tools
const Tools = lazy(() => import("./pages/resources/Tools"));
const SalaryNegotiationCoach = lazy(() => import("./pages/resources/tools/SalaryNegotiationCoach"));
const MarketValueCalculator = lazy(() => import("./pages/resources/tools/MarketValueCalculator"));
const CareerPathOptimizer = lazy(() => import("./pages/resources/tools/CareerPathOptimizer"));
const JobOfferAnalyzer = lazy(() => import("./pages/resources/tools/JobOfferAnalyzer"));
const TeamBudgetOptimizer = lazy(() => import("./pages/resources/tools/TeamBudgetOptimizer"));
const AIvsHumanROI = lazy(() => import("./pages/resources/tools/AIvsHumanROI"));
const CompensationTransparency = lazy(() => import("./pages/resources/tools/CompensationTransparency"));
const LinkedInRealityCheck = lazy(() => import("./pages/resources/tools/LinkedInRealityCheck"));

// Reports
const Reports = lazy(() => import("./pages/resources/Reports"));
const SalaryBenchmark2026 = lazy(() => import("./pages/resources/reports/SalaryBenchmark2026"));

// Frameworks
const CleanTrackModel = lazy(() => import("./pages/resources/frameworks/CleanTrackModel"));
const MinimalAnalyticsStack = lazy(() => import("./pages/resources/frameworks/MinimalAnalyticsStack"));
const AttributionClarityModel = lazy(() => import("./pages/resources/frameworks/AttributionClarityModel"));
const B2BAttributionFramework = lazy(() => import("./pages/resources/frameworks/B2BAttributionFramework"));

// Examples
const UTMExamples = lazy(() => import("./pages/resources/examples/UTMExamples"));
const NamingExamples = lazy(() => import("./pages/resources/examples/NamingExamples"));
const DashboardExamples = lazy(() => import("./pages/resources/examples/DashboardExamples"));

// Checklists
const Checklists = lazy(() => import("./pages/resources/Checklists"));
const UTMAudit = lazy(() => import("./pages/resources/checklists/UTMAudit"));
const AnalyticsHealth = lazy(() => import("./pages/resources/checklists/AnalyticsHealth"));
const CampaignLaunch = lazy(() => import("./pages/resources/checklists/CampaignLaunch"));

// Glossary
const Glossary = lazy(() => import("./pages/resources/Glossary"));
const Frameworks = lazy(() => import("./pages/resources/Frameworks"));
const Examples = lazy(() => import("./pages/resources/Examples"));
const Academy = lazy(() => import("./pages/resources/Academy"));

// Glossary terms (70+ pages) - all lazy loaded
const GlossaryUTM = lazy(() => import("./pages/resources/glossary/utm"));
const GlossarySource = lazy(() => import("./pages/resources/glossary/source"));
const GlossaryMedium = lazy(() => import("./pages/resources/glossary/medium"));
const GlossaryCampaign = lazy(() => import("./pages/resources/glossary/campaign"));
const GlossaryContent = lazy(() => import("./pages/resources/glossary/content"));
const GlossaryTerm = lazy(() => import("./pages/resources/glossary/term"));
const GlossaryTaxonomy = lazy(() => import("./pages/resources/glossary/taxonomy"));
const GlossaryNamingConvention = lazy(() => import("./pages/resources/glossary/naming-convention"));
const GlossaryTrackingArchitecture = lazy(() => import("./pages/resources/glossary/tracking-architecture"));
const GlossaryFirstTouch = lazy(() => import("./pages/resources/glossary/first-touch"));
const GlossaryLastTouch = lazy(() => import("./pages/resources/glossary/last-touch"));
const GlossaryMultiTouch = lazy(() => import("./pages/resources/glossary/multi-touch"));
const GlossaryLinear = lazy(() => import("./pages/resources/glossary/linear"));
const GlossaryTimeDecay = lazy(() => import("./pages/resources/glossary/time-decay"));
const GlossaryPaidSearch = lazy(() => import("./pages/resources/glossary/paid-search"));
const GlossaryPaidSocial = lazy(() => import("./pages/resources/glossary/paid-social"));
const GlossaryOrganicSocial = lazy(() => import("./pages/resources/glossary/organic-social"));
const GlossaryEmail = lazy(() => import("./pages/resources/glossary/email"));
const GlossarySEO = lazy(() => import("./pages/resources/glossary/seo"));
const GlossaryReferral = lazy(() => import("./pages/resources/glossary/referral"));
const GlossaryDirect = lazy(() => import("./pages/resources/glossary/direct"));
const GlossaryDisplay = lazy(() => import("./pages/resources/glossary/display"));
const GlossaryMQL = lazy(() => import("./pages/resources/glossary/mql"));
const GlossarySQL = lazy(() => import("./pages/resources/glossary/sql"));
const GlossarySAL = lazy(() => import("./pages/resources/glossary/sal"));
const GlossaryLeadScoring = lazy(() => import("./pages/resources/glossary/lead-scoring"));
const GlossaryConversionRate = lazy(() => import("./pages/resources/glossary/conversion-rate"));
const GlossaryPipeline = lazy(() => import("./pages/resources/glossary/pipeline"));
const GlossaryCohort = lazy(() => import("./pages/resources/glossary/cohort"));
const GlossaryARR = lazy(() => import("./pages/resources/glossary/arr"));
const GlossaryMRR = lazy(() => import("./pages/resources/glossary/mrr"));
const GlossaryCAC = lazy(() => import("./pages/resources/glossary/cac"));
const GlossaryLTV = lazy(() => import("./pages/resources/glossary/ltv"));
const GlossaryChurn = lazy(() => import("./pages/resources/glossary/churn"));
const GlossaryActivation = lazy(() => import("./pages/resources/glossary/activation"));
const GlossaryLinkShortener = lazy(() => import("./pages/resources/glossary/link-shortener"));
const GlossaryQRCode = lazy(() => import("./pages/resources/glossary/qr-code"));
const GlossaryRedirect = lazy(() => import("./pages/resources/glossary/redirect"));
const GlossaryCustomDomain = lazy(() => import("./pages/resources/glossary/custom-domain"));
const GlossaryLinkExpiration = lazy(() => import("./pages/resources/glossary/link-expiration"));
const GlossaryPQL = lazy(() => import("./pages/resources/glossary/pql"));
const GlossarySelfServeConversion = lazy(() => import("./pages/resources/glossary/self-serve-conversion"));
const GlossaryUsageThreshold = lazy(() => import("./pages/resources/glossary/usage-threshold"));
const GlossaryHealthScore = lazy(() => import("./pages/resources/glossary/health-score"));
const GlossaryRenewalMotion = lazy(() => import("./pages/resources/glossary/renewal-motion"));
const GlossaryQBR = lazy(() => import("./pages/resources/glossary/qbr"));
const GlossaryTimeToValue = lazy(() => import("./pages/resources/glossary/time-to-value"));
const GlossaryImplementationPlan = lazy(() => import("./pages/resources/glossary/implementation-plan"));
const GlossaryAdoptionMilestones = lazy(() => import("./pages/resources/glossary/adoption-milestones"));
const GlossaryEarlyChurnSignals = lazy(() => import("./pages/resources/glossary/early-churn-signals"));
const GlossaryReactivationCampaign = lazy(() => import("./pages/resources/glossary/reactivation-campaign"));
const GlossaryValueMoments = lazy(() => import("./pages/resources/glossary/value-moments"));
const GlossaryFunnelMath = lazy(() => import("./pages/resources/glossary/funnel-math"));
const GlossaryLeadVelocityRate = lazy(() => import("./pages/resources/glossary/lead-velocity-rate"));
const GlossaryConversionWaterfall = lazy(() => import("./pages/resources/glossary/conversion-waterfall"));
const WaitlistStatus = lazy(() => import("./pages/WaitlistStatus"));
const GlossaryCommitForecast = lazy(() => import("./pages/resources/glossary/commit-forecast"));
const GlossaryPipelineCoverageRatio = lazy(() => import("./pages/resources/glossary/pipeline-coverage-ratio"));
const GlossaryRunRate = lazy(() => import("./pages/resources/glossary/run-rate"));
const GlossaryQualityScore = lazy(() => import("./pages/resources/glossary/quality-score"));
const GlossaryBidStrategy = lazy(() => import("./pages/resources/glossary/bid-strategy"));
const GlossaryCreativeFatigue = lazy(() => import("./pages/resources/glossary/creative-fatigue"));
const GlossaryBoothEngagementRate = lazy(() => import("./pages/resources/glossary/booth-engagement-rate"));
const GlossaryEventROIModel = lazy(() => import("./pages/resources/glossary/event-roi-model"));
const GlossaryPipelineInfluence = lazy(() => import("./pages/resources/glossary/pipeline-influence"));
const GlossarySolutionMapping = lazy(() => import("./pages/resources/glossary/solution-mapping"));
const GlossaryTechnicalValidation = lazy(() => import("./pages/resources/glossary/technical-validation"));
const GlossaryPilotSuccessCriteria = lazy(() => import("./pages/resources/glossary/pilot-success-criteria"));
const GlossaryGrossMargin = lazy(() => import("./pages/resources/glossary/gross-margin"));
const GlossaryCACPaybackPeriod = lazy(() => import("./pages/resources/glossary/cac-payback-period"));
const GlossaryRevenueRecognition = lazy(() => import("./pages/resources/glossary/revenue-recognition"));

// Partner & Integration Pages
const EarlyAccess = lazy(() => import("./pages/EarlyAccess"));
const Invite = lazy(() => import("./pages/Invite"));
const ClaimAccess = lazy(() => import("./pages/ClaimAccess"));
const PartnerApply = lazy(() => import("./pages/Partners/Apply"));
const PartnerDashboard = lazy(() => import("./pages/Partners/Dashboard"));
const PartnerTerms = lazy(() => import("./pages/Partners/Terms"));
const ZapierIntegration = lazy(() => import("./pages/integrations/Zapier"));
const SlackIntegration = lazy(() => import("./pages/integrations/Slack"));
const GTMSettings = lazy(() => import("./pages/Integrations/GTMSettings"));
const IntegrationsSettings = lazy(() => import("./pages/settings/Integrations"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ClientWorkspaces = lazy(() => import("./pages/ClientWorkspaces"));
const AnalyticsShare = lazy(() => import("./pages/AnalyticsShare"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WorkspaceProvider>
            <SkipToContent />
            <ScrollToTop />
            <NetworkStatus />
            <AppWithHelp>
              <Routes>
              {/* Critical pages - not lazy loaded */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
               
               {/* Public Tools */}
               <Route path="/tools/qr" element={<Suspense fallback={<DashboardSkeleton />}><PublicQRGenerator /></Suspense>} />
               
               {/* Invitation Acceptance */}
               <Route path="/accept-invite" element={<Suspense fallback={<DashboardSkeleton />}><AcceptInvite /></Suspense>} />
              
              {/* Dashboard Routes with DashboardLayout */}
              <Route path="/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Dashboard /></DashboardLayout></Suspense>} />
              <Route path="/dashboard/links" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardLinks /></DashboardLayout></Suspense>} />
              <Route path="/dashboard/analytics" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardAnalytics /></DashboardLayout></Suspense>} />
              <Route path="/dashboard/qr-codes" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardQRCodes /></DashboardLayout></Suspense>} />
              <Route path="/dashboard/targeting" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Targeting /></DashboardLayout></Suspense>} />
              <Route path="/dashboard/targeting/:linkId" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Targeting /></DashboardLayout></Suspense>} />
              
              {/* Lazy loaded pages with Suspense fallback */}
              <Route path="/onboarding" element={<Suspense fallback={<DashboardSkeleton />}><OnboardingEnhanced /></Suspense>} />
              <Route path="/links" element={<Suspense fallback={<DashboardSkeleton />}><Links /></Suspense>} />
              <Route path="/links/:linkId" element={<Suspense fallback={<DashboardSkeleton />}><LinkDetail /></Suspense>} />
              <Route path="/analytics" element={<Suspense fallback={<DashboardSkeleton />}><Analytics /></Suspense>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><AdminDashboard /></AdminLayout></Suspense>} />
              <Route path="/admin/waitlist" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><WaitlistManagement /></AdminLayout></Suspense>} />
              <Route path="/admin/landing" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><LandingManagement /></AdminLayout></Suspense>} />
              <Route path="/admin/product" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><ProductAnalytics /></AdminLayout></Suspense>} />
              <Route path="/admin/system" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><SystemMonitoring /></AdminLayout></Suspense>} />
              <Route path="/admin/feature-flags" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><FeatureFlags /></AdminLayout></Suspense>} />
              <Route path="/admin/flags/:flagKey" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><FlagDetails /></AdminLayout></Suspense>} />
              <Route path="/admin/partners" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><PartnersManagement /></AdminLayout></Suspense>} />
              <Route path="/admin/tests" element={<Suspense fallback={<DashboardSkeleton />}><AdminLayout><SystemTests /></AdminLayout></Suspense>} />
              
              <Route path="/settings" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />
              <Route path="/settings/domains" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />
              <Route path="/settings/backups" element={<Suspense fallback={<DashboardSkeleton />}><Backups /></Suspense>} />
              <Route path="/settings/backup" element={<Suspense fallback={<DashboardSkeleton />}><Backup /></Suspense>} />
              <Route path="/settings/developer" element={<Suspense fallback={<DashboardSkeleton />}><DeveloperSettings /></Suspense>} />
              <Route path="/approval-queue" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><ApprovalQueue /></DashboardLayout></Suspense>} />
              <Route path="/password-protected" element={<Suspense fallback={<DashboardSkeleton />}><PasswordProtected /></Suspense>} />
              <Route path="/accessibility" element={<Suspense fallback={<DashboardSkeleton />}><Accessibility /></Suspense>} />
              <Route path="/permanence" element={<Suspense fallback={<DashboardSkeleton />}><Permanence /></Suspense>} />
              <Route path="/pricing" element={<Suspense fallback={<DashboardSkeleton />}><Pricing /></Suspense>} />
              <Route path="/lifetime-deal" element={<Suspense fallback={<DashboardSkeleton />}><LifetimeDeal /></Suspense>} />
              <Route path="/about" element={<Suspense fallback={<DashboardSkeleton />}><About /></Suspense>} />
              <Route path="/docs" element={<Suspense fallback={<DashboardSkeleton />}><Docs /></Suspense>} />
              <Route path="/faq" element={<Suspense fallback={<DashboardSkeleton />}><FAQ /></Suspense>} />
              <Route path="/changelog" element={<Suspense fallback={<DashboardSkeleton />}><Changelog /></Suspense>} />
              <Route path="/support" element={<Suspense fallback={<DashboardSkeleton />}><Support /></Suspense>} />
              <Route path="/docs/api" element={<Suspense fallback={<DashboardSkeleton />}><APIDocumentation /></Suspense>} />
              <Route path="/docs/playground" element={<Suspense fallback={<DashboardSkeleton />}><APIPlayground /></Suspense>} />
              <Route path="/docs/sdks" element={<Suspense fallback={<DashboardSkeleton />}><SDKs /></Suspense>} />
              
              {/* Feature Pages */}
              <Route path="/features" element={<Suspense fallback={<DashboardSkeleton />}><Features /></Suspense>} />
              <Route path="/features/short-links" element={<Suspense fallback={<DashboardSkeleton />}><ShortLinks /></Suspense>} />
              <Route path="/features/utm-builder" element={<Suspense fallback={<DashboardSkeleton />}><UTMBuilder /></Suspense>} />
              <Route path="/features/qr-generator" element={<Suspense fallback={<DashboardSkeleton />}><QRGenerator /></Suspense>} />
              <Route path="/features/analytics" element={<Suspense fallback={<DashboardSkeleton />}><AnalyticsFeature /></Suspense>} />
              <Route path="/features/governance" element={<Suspense fallback={<DashboardSkeleton />}><EnterpriseControl /></Suspense>} />
              <Route path="/features/clean-track" element={<Suspense fallback={<DashboardSkeleton />}><CleanTrack /></Suspense>} />
              <Route path="/features/partner-program" element={<Suspense fallback={<DashboardSkeleton />}><PartnerProgram /></Suspense>} />
              <Route path="/resources" element={<Suspense fallback={<DashboardSkeleton />}><Resources /></Suspense>} />
              <Route path="/resources/guides" element={<Suspense fallback={<DashboardSkeleton />}><Guides /></Suspense>} />
              <Route path="/resources/guides/utm-guide" element={<Suspense fallback={<DashboardSkeleton />}><UTMGuide /></Suspense>} />
              <Route path="/resources/guides/clean-track-framework" element={<Suspense fallback={<DashboardSkeleton />}><CleanTrackFramework /></Suspense>} />
              <Route path="/resources/guides/tracking-architecture" element={<Suspense fallback={<DashboardSkeleton />}><TrackingArchitecture /></Suspense>} />
              <Route path="/resources/guides/simple-analytics" element={<Suspense fallback={<DashboardSkeleton />}><SimpleAnalytics /></Suspense>} />
              <Route path="/resources/guides/growth-analytics" element={<Suspense fallback={<DashboardSkeleton />}><GrowthAnalytics /></Suspense>} />
              <Route path="/resources/guides/llm-seo" element={<Suspense fallback={<DashboardSkeleton />}><LLMSeo /></Suspense>} />
              
              {/* Playbook Routes */}
              <Route path="/resources/playbooks/llm-ranking" element={<Suspense fallback={<DashboardSkeleton />}><LLMRanking /></Suspense>} />
              <Route path="/resources/playbooks/utm-governance-playbook" element={<Suspense fallback={<DashboardSkeleton />}><UTMGovernancePlaybook /></Suspense>} />
              <Route path="/resources/playbooks/startup-analytics-playbook" element={<Suspense fallback={<DashboardSkeleton />}><StartupAnalyticsPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/event-led-growth-playbook" element={<Suspense fallback={<DashboardSkeleton />}><EventLedGrowthPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/naming-convention-playbook" element={<Suspense fallback={<DashboardSkeleton />}><NamingConventionPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/sales-marketing-alignment" element={<Suspense fallback={<DashboardSkeleton />}><SalesMarketingAlignmentPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/ai-marketing" element={<Suspense fallback={<DashboardSkeleton />}><AIMarketingPlaybook /></Suspense>} />
              <Route path="/resources/playbooks" element={<Suspense fallback={<DashboardSkeleton />}><Playbooks /></Suspense>} />
              
              {/* Template Routes */}
              <Route path="/resources/templates" element={<Suspense fallback={<DashboardSkeleton />}><Templates /></Suspense>} />
              <Route path="/resources/templates/utm-template" element={<Suspense fallback={<DashboardSkeleton />}><UTMTemplate /></Suspense>} />
              <Route path="/resources/templates/audit-checklist-template" element={<Suspense fallback={<DashboardSkeleton />}><AuditChecklistTemplate /></Suspense>} />
              <Route path="/resources/templates/campaign-brief-template" element={<Suspense fallback={<DashboardSkeleton />}><CampaignBriefTemplate /></Suspense>} />
              <Route path="/resources/templates/naming-taxonomy-template" element={<Suspense fallback={<DashboardSkeleton />}><NamingTaxonomyTemplate /></Suspense>} />
              
              {/* Tools Routes */}
              <Route path="/resources/tools" element={<Suspense fallback={<DashboardSkeleton />}><Tools /></Suspense>} />
              <Route path="/resources/tools/salary-negotiation-coach" element={<Suspense fallback={<DashboardSkeleton />}><SalaryNegotiationCoach /></Suspense>} />
              <Route path="/resources/tools/market-value-calculator" element={<Suspense fallback={<DashboardSkeleton />}><MarketValueCalculator /></Suspense>} />
              <Route path="/resources/tools/career-path-optimizer" element={<Suspense fallback={<DashboardSkeleton />}><CareerPathOptimizer /></Suspense>} />
              <Route path="/resources/tools/job-offer-analyzer" element={<Suspense fallback={<DashboardSkeleton />}><JobOfferAnalyzer /></Suspense>} />
              <Route path="/resources/tools/team-budget-optimizer" element={<Suspense fallback={<DashboardSkeleton />}><TeamBudgetOptimizer /></Suspense>} />
              <Route path="/resources/tools/ai-vs-human-roi" element={<Suspense fallback={<DashboardSkeleton />}><AIvsHumanROI /></Suspense>} />
              <Route path="/resources/tools/compensation-transparency" element={<Suspense fallback={<DashboardSkeleton />}><CompensationTransparency /></Suspense>} />
              <Route path="/resources/tools/linkedin-reality-check" element={<Suspense fallback={<DashboardSkeleton />}><LinkedInRealityCheck /></Suspense>} />
              
              {/* Reports Routes */}
              <Route path="/resources/reports" element={<Suspense fallback={<DashboardSkeleton />}><Reports /></Suspense>} />
              <Route 
                path="/resources/reports/salary-benchmark-2026" 
                element={
                  <Suspense fallback={<DashboardSkeleton />}>
                    <ComingSoonPage 
                      title="2026 Global Salary Benchmark Report"
                      description="We're putting the finishing touches on this comprehensive report covering 15+ countries, 50+ roles, and 10 interactive tools. Join the waitlist to be notified when it launches."
                    />
                  </Suspense>
                } 
              />
              <Route 
                path="/resources/reports/salary-benchmark-2025" 
                element={
                  <Suspense fallback={<DashboardSkeleton />}>
                    <ComingSoonPage 
                      title="2025 Global Salary Benchmark Report"
                      description="We're putting the finishing touches on this comprehensive report. Join the waitlist to be notified when it launches."
                    />
                  </Suspense>
                } 
              />
              
              {/* Framework Routes */}
              <Route path="/resources/frameworks/clean-track-model" element={<Suspense fallback={<DashboardSkeleton />}><CleanTrackModel /></Suspense>} />
              <Route path="/resources/frameworks/minimal-analytics-stack" element={<Suspense fallback={<DashboardSkeleton />}><MinimalAnalyticsStack /></Suspense>} />
              <Route path="/resources/frameworks/attribution-clarity-model" element={<Suspense fallback={<DashboardSkeleton />}><AttributionClarityModel /></Suspense>} />
              <Route path="/resources/frameworks/b2b-attribution" element={<Suspense fallback={<DashboardSkeleton />}><B2BAttributionFramework /></Suspense>} />
              <Route path="/resources/examples/utm-examples" element={<Suspense fallback={<DashboardSkeleton />}><UTMExamples /></Suspense>} />
              <Route path="/resources/examples/naming-examples" element={<Suspense fallback={<DashboardSkeleton />}><NamingExamples /></Suspense>} />
              <Route path="/resources/examples/dashboard-examples" element={<Suspense fallback={<DashboardSkeleton />}><DashboardExamples /></Suspense>} />
              <Route path="/resources/checklists/utm-audit" element={<Suspense fallback={<DashboardSkeleton />}><UTMAudit /></Suspense>} />
              <Route path="/resources/checklists/analytics-health" element={<Suspense fallback={<DashboardSkeleton />}><AnalyticsHealth /></Suspense>} />
              <Route path="/resources/checklists/campaign-launch" element={<Suspense fallback={<DashboardSkeleton />}><CampaignLaunch /></Suspense>} />
              
              {/* Glossary term pages */}
              <Route path="/resources/glossary/utm" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryUTM /></Suspense>} />
              <Route path="/resources/glossary/source" element={<Suspense fallback={<DashboardSkeleton />}><GlossarySource /></Suspense>} />
              <Route path="/resources/glossary/medium" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryMedium /></Suspense>} />
              <Route path="/resources/glossary/campaign" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryCampaign /></Suspense>} />
              <Route path="/resources/glossary/content" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryContent /></Suspense>} />
              <Route path="/resources/glossary/term" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryTerm /></Suspense>} />
              <Route path="/resources/glossary/taxonomy" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryTaxonomy /></Suspense>} />
              <Route path="/resources/glossary/naming-convention" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryNamingConvention /></Suspense>} />
              <Route path="/resources/glossary/tracking-architecture" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryTrackingArchitecture /></Suspense>} />
              <Route path="/resources/glossary/first-touch" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryFirstTouch /></Suspense>} />
              <Route path="/resources/glossary/last-touch" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryLastTouch /></Suspense>} />
              <Route path="/resources/glossary/multi-touch" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryMultiTouch /></Suspense>} />
              <Route path="/resources/glossary/linear" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryLinear /></Suspense>} />
              <Route path="/resources/glossary/time-decay" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryTimeDecay /></Suspense>} />
              <Route path="/resources/glossary/paid-search" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryPaidSearch /></Suspense>} />
              <Route path="/resources/glossary/paid-social" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryPaidSocial /></Suspense>} />
              <Route path="/resources/glossary/organic-social" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryOrganicSocial /></Suspense>} />
              <Route path="/resources/glossary/email" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryEmail /></Suspense>} />
              <Route path="/resources/glossary/seo" element={<Suspense fallback={<DashboardSkeleton />}><GlossarySEO /></Suspense>} />
              <Route path="/resources/glossary/referral" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryReferral /></Suspense>} />
              <Route path="/resources/glossary/direct" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryDirect /></Suspense>} />
              <Route path="/resources/glossary/display" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryDisplay /></Suspense>} />
              <Route path="/resources/glossary/mql" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryMQL /></Suspense>} />
              <Route path="/resources/glossary/sql" element={<Suspense fallback={<DashboardSkeleton />}><GlossarySQL /></Suspense>} />
              <Route path="/resources/glossary/sal" element={<Suspense fallback={<DashboardSkeleton />}><GlossarySAL /></Suspense>} />
              <Route path="/resources/glossary/lead-scoring" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryLeadScoring /></Suspense>} />
              <Route path="/resources/glossary/conversion-rate" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryConversionRate /></Suspense>} />
              <Route path="/resources/glossary/pipeline" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryPipeline /></Suspense>} />
              <Route path="/resources/glossary/cohort" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryCohort /></Suspense>} />
              <Route path="/resources/glossary/arr" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryARR /></Suspense>} />
              <Route path="/resources/glossary/mrr" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryMRR /></Suspense>} />
              <Route path="/resources/glossary/cac" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryCAC /></Suspense>} />
              <Route path="/resources/glossary/ltv" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryLTV /></Suspense>} />
              <Route path="/resources/glossary/churn" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryChurn /></Suspense>} />
              <Route path="/resources/glossary/activation" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryActivation /></Suspense>} />
              <Route path="/resources/glossary/link-shortener" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryLinkShortener /></Suspense>} />
              <Route path="/resources/glossary/qr-code" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryQRCode /></Suspense>} />
              <Route path="/resources/glossary/redirect" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryRedirect /></Suspense>} />
              <Route path="/resources/glossary/custom-domain" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryCustomDomain /></Suspense>} />
              <Route path="/resources/glossary/link-expiration" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryLinkExpiration /></Suspense>} />
              <Route path="/resources/glossary/pql" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryPQL /></Suspense>} />
              <Route path="/resources/glossary/self-serve-conversion" element={<Suspense fallback={<DashboardSkeleton />}><GlossarySelfServeConversion /></Suspense>} />
              <Route path="/resources/glossary/usage-threshold" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryUsageThreshold /></Suspense>} />
              <Route path="/resources/glossary/health-score" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryHealthScore /></Suspense>} />
              <Route path="/resources/glossary/renewal-motion" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryRenewalMotion /></Suspense>} />
              <Route path="/resources/glossary/qbr" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryQBR /></Suspense>} />
              <Route path="/resources/glossary/time-to-value" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryTimeToValue /></Suspense>} />
              <Route path="/resources/glossary/implementation-plan" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryImplementationPlan /></Suspense>} />
              <Route path="/resources/glossary/adoption-milestones" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryAdoptionMilestones /></Suspense>} />
              <Route path="/resources/glossary/early-churn-signals" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryEarlyChurnSignals /></Suspense>} />
              <Route path="/resources/glossary/reactivation-campaign" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryReactivationCampaign /></Suspense>} />
              <Route path="/resources/glossary/value-moments" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryValueMoments /></Suspense>} />
              <Route path="/resources/glossary/funnel-math" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryFunnelMath /></Suspense>} />
              <Route path="/resources/glossary/lead-velocity-rate" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryLeadVelocityRate /></Suspense>} />
              <Route path="/resources/glossary/conversion-waterfall" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryConversionWaterfall /></Suspense>} />
              <Route path="/resources/glossary/commit-forecast" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryCommitForecast /></Suspense>} />
              <Route path="/resources/glossary/pipeline-coverage-ratio" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryPipelineCoverageRatio /></Suspense>} />
              <Route path="/resources/glossary/run-rate" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryRunRate /></Suspense>} />
              <Route path="/resources/glossary/quality-score" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryQualityScore /></Suspense>} />
              <Route path="/resources/glossary/bid-strategy" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryBidStrategy /></Suspense>} />
              <Route path="/resources/glossary/creative-fatigue" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryCreativeFatigue /></Suspense>} />
              <Route path="/resources/glossary/booth-engagement-rate" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryBoothEngagementRate /></Suspense>} />
              <Route path="/resources/glossary/event-roi-model" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryEventROIModel /></Suspense>} />
              <Route path="/resources/glossary/pipeline-influence" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryPipelineInfluence /></Suspense>} />
              <Route path="/resources/glossary/solution-mapping" element={<Suspense fallback={<DashboardSkeleton />}><GlossarySolutionMapping /></Suspense>} />
              <Route path="/resources/glossary/technical-validation" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryTechnicalValidation /></Suspense>} />
              <Route path="/resources/glossary/pilot-success-criteria" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryPilotSuccessCriteria /></Suspense>} />
              <Route path="/resources/glossary/gross-margin" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryGrossMargin /></Suspense>} />
              <Route path="/resources/glossary/cac-payback-period" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryCACPaybackPeriod /></Suspense>} />
              <Route path="/resources/glossary/revenue-recognition" element={<Suspense fallback={<DashboardSkeleton />}><GlossaryRevenueRecognition /></Suspense>} />
              <Route path="/resources/templates" element={<Suspense fallback={<DashboardSkeleton />}><Templates /></Suspense>} />
              <Route path="/resources/checklists" element={<Suspense fallback={<DashboardSkeleton />}><Checklists /></Suspense>} />
              <Route path="/resources/frameworks" element={<Suspense fallback={<DashboardSkeleton />}><Frameworks /></Suspense>} />
              <Route path="/resources/examples" element={<Suspense fallback={<DashboardSkeleton />}><Examples /></Suspense>} />
              <Route path="/resources/glossary" element={<Suspense fallback={<DashboardSkeleton />}><Glossary /></Suspense>} />
              <Route path="/resources/academy" element={<Suspense fallback={<DashboardSkeleton />}><Academy /></Suspense>} />
              <Route path="/solutions/marketers" element={<Suspense fallback={<DashboardSkeleton />}><Marketers /></Suspense>} />
              <Route path="/solutions/sales" element={<Suspense fallback={<DashboardSkeleton />}><Sales /></Suspense>} />
              <Route path="/solutions/marketing-ops" element={<Suspense fallback={<DashboardSkeleton />}><MarketingOps /></Suspense>} />
              <Route path="/solutions/developers" element={<Suspense fallback={<DashboardSkeleton />}><Developers /></Suspense>} />
              <Route path="/early-access" element={<Suspense fallback={<DashboardSkeleton />}><EarlyAccess /></Suspense>} />
              <Route path="/waitlist-status" element={<Suspense fallback={<DashboardSkeleton />}><WaitlistStatus /></Suspense>} />
              <Route path="/invite/:code" element={<Suspense fallback={<DashboardSkeleton />}><Invite /></Suspense>} />
              <Route path="/claim-access" element={<Suspense fallback={<DashboardSkeleton />}><ClaimAccess /></Suspense>} />
              <Route path="/partners/apply" element={<Suspense fallback={<DashboardSkeleton />}><PartnerApply /></Suspense>} />
              <Route path="/partners/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><PartnerDashboard /></Suspense>} />
              <Route path="/partners/terms" element={<Suspense fallback={<DashboardSkeleton />}><PartnerTerms /></Suspense>} />
              <Route path="/integrations/zapier" element={<Suspense fallback={<DashboardSkeleton />}><ZapierIntegration /></Suspense>} />
              <Route path="/integrations/slack" element={<Suspense fallback={<DashboardSkeleton />}><SlackIntegration /></Suspense>} />
              <Route path="/integrations/gtm" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><GTMSettings /></DashboardLayout></Suspense>} />
              <Route path="/settings/integrations" element={<Suspense fallback={<DashboardSkeleton />}><IntegrationsSettings /></Suspense>} />
              <Route path="/privacy-policy" element={<Suspense fallback={<DashboardSkeleton />}><PrivacyPolicy /></Suspense>} />
              <Route path="/client-workspaces" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><ClientWorkspaces /></DashboardLayout></Suspense>} />
              <Route path="/analytics/share/:token" element={<Suspense fallback={<DashboardSkeleton />}><AnalyticsShare /></Suspense>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<Suspense fallback={<DashboardSkeleton />}><NotFound /></Suspense>} />
            </Routes>
            </AppWithHelp>
          </WorkspaceProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
