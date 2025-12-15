/**
 * MarketingRoutes - All public/marketing routes
 * 
 * IMPORTANT: This file must NOT import any dashboard components or hooks.
 * Marketing routes use MarketingShell (minimal providers) for fast FCP.
 */

import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MarketingSkeleton } from "@/components/SkeletonLoader";

// Feature Pages
const Features = React.lazy(() => import("@/public/routes/Features"));
const HowItWorks = React.lazy(() => import("@/pages/HowItWorksNew"));
const ShortLinks = React.lazy(() => import("@/pages/features/ShortLinks"));
const UTMBuilder = React.lazy(() => import("@/pages/features/UTMBuilder"));
const QRGenerator = React.lazy(() => import("@/pages/features/QRGenerator"));
const CustomerJourney = React.lazy(() => import("@/pages/features/CustomerJourney"));
const IdentityResolution = React.lazy(() => import("@/pages/features/IdentityResolution"));
const BayesianAttribution = React.lazy(() => import("@/pages/features/BayesianAttribution"));
const JourneyValuation = React.lazy(() => import("@/pages/features/JourneyValuation"));
const AnalyticsFeature = React.lazy(() => import("@/pages/features/Analytics"));
const EnterpriseControl = React.lazy(() => import("@/pages/features/EnterpriseControl"));
const CleanTrack = React.lazy(() => import("@/pages/features/CleanTrack"));
const PartnerProgram = React.lazy(() => import("@/pages/features/PartnerProgram"));
const Integrations = React.lazy(() => import("@/pages/features/Integrations"));
const PredictiveAnalytics = React.lazy(() => import("@/pages/features/PredictiveAnalytics"));
const AttributionGraph = React.lazy(() => import("@/pages/features/AttributionGraph"));
const SmartRouting = React.lazy(() => import("@/pages/features/SmartRouting"));
const LinkImmunity = React.lazy(() => import("@/pages/features/LinkImmunity"));
const Workspaces = React.lazy(() => import("@/pages/features/Workspaces"));
const Reporting = React.lazy(() => import("@/pages/features/Reporting"));
const CustomDomains = React.lazy(() => import("@/pages/features/CustomDomains"));
const Automation = React.lazy(() => import("@/pages/features/Automation"));
const AccessibilityFeature = React.lazy(() => import("@/pages/features/Accessibility"));
const EventHalo = React.lazy(() => import("@/pages/features/EventHalo"));
const AIIntelligence = React.lazy(() => import("@/pages/features/AIIntelligence"));
const Sentinel = React.lazy(() => import("@/pages/features/Sentinel"));
const BrickBuilderFeature = React.lazy(() => import("@/pages/features/BrickBuilder"));
const LinkPagesFeature = React.lazy(() => import("@/pages/features/LinkPages"));

// Solutions
const SolutionsHub = React.lazy(() => import("@/pages/Solutions"));
const EnterpriseSolution = React.lazy(() => import("@/pages/solutions/Enterprise"));
const AgenciesSolution = React.lazy(() => import("@/pages/solutions/Agencies"));
const DevelopersSolution = React.lazy(() => import("@/pages/solutions/Developers"));
const Startups = React.lazy(() => import("@/pages/solutions/Startups"));
const ReportingTeam = React.lazy(() => import("@/pages/solutions/ReportingTeam"));
const RevOps = React.lazy(() => import("@/pages/solutions/RevOps"));
const Marketers = React.lazy(() => import("@/pages/solutions/Marketers"));
const Sales = React.lazy(() => import("@/pages/solutions/Sales"));
const MarketingOps = React.lazy(() => import("@/pages/solutions/MarketingOps"));
const Developers = React.lazy(() => import("@/pages/solutions/Developers"));
const PartnerManagers = React.lazy(() => import("@/pages/solutions/PartnerManagers"));
const FieldMarketing = React.lazy(() => import("@/pages/solutions/FieldMarketing"));

// Resources - List Pages
const Resources = React.lazy(() => import("@/pages/Resources"));
const Guides = React.lazy(() => import("@/pages/resources/Guides"));
const Playbooks = React.lazy(() => import("@/pages/resources/Playbooks"));
const Templates = React.lazy(() => import("@/pages/resources/Templates"));
const Checklists = React.lazy(() => import("@/pages/resources/Checklists"));
const Frameworks = React.lazy(() => import("@/pages/resources/Frameworks"));
const Examples = React.lazy(() => import("@/pages/resources/Examples"));
const Glossary = React.lazy(() => import("@/pages/resources/Glossary"));
const Academy = React.lazy(() => import("@/pages/resources/Academy"));
const Reports = React.lazy(() => import("@/pages/resources/Reports"));
const ResourceTools = React.lazy(() => import("@/pages/resources/Tools"));

// Resources - Guides (7)
const UTMGuide = React.lazy(() => import("@/pages/resources/guides/UTMGuide"));
const CleanTrackFramework = React.lazy(() => import("@/pages/resources/guides/CleanTrackFramework"));
const TrackingArchitecture = React.lazy(() => import("@/pages/resources/guides/TrackingArchitecture"));
const SimpleAnalytics = React.lazy(() => import("@/pages/resources/guides/SimpleAnalytics"));
const GrowthAnalytics = React.lazy(() => import("@/pages/resources/guides/GrowthAnalytics"));
const LLMSeo = React.lazy(() => import("@/pages/resources/guides/LLMSeo"));
const BayesianTesting = React.lazy(() => import("@/pages/resources/guides/BayesianTesting"));

// Resources - Playbooks (9)
const LLMRanking = React.lazy(() => import("@/pages/resources/playbooks/LLMRanking"));
const UTMGovernancePlaybook = React.lazy(() => import("@/pages/resources/playbooks/UTMGovernancePlaybook"));
const AIMarketingPlaybook = React.lazy(() => import("@/pages/resources/playbooks/AIMarketingPlaybook"));
const B2BArchitectsPlaybook = React.lazy(() => import("@/pages/resources/playbooks/B2BArchitectsPlaybook"));
const EventLedGrowthPlaybook = React.lazy(() => import("@/pages/resources/playbooks/EventLedGrowthPlaybook"));
const HRKatalystReferralPlaybook = React.lazy(() => import("@/pages/resources/playbooks/HRKatalystReferralPlaybook"));
const NamingConventionPlaybook = React.lazy(() => import("@/pages/resources/playbooks/NamingConventionPlaybook"));
const SalesMarketingAlignmentPlaybook = React.lazy(() => import("@/pages/resources/playbooks/SalesMarketingAlignmentPlaybook"));
const StartupAnalyticsPlaybook = React.lazy(() => import("@/pages/resources/playbooks/StartupAnalyticsPlaybook"));

// Resources - Templates (4)
const UTMTemplate = React.lazy(() => import("@/pages/resources/templates/UTMTemplate"));
const CampaignBriefTemplate = React.lazy(() => import("@/pages/resources/templates/CampaignBriefTemplate"));
const NamingTaxonomyTemplate = React.lazy(() => import("@/pages/resources/templates/NamingTaxonomyTemplate"));
const AuditChecklistTemplate = React.lazy(() => import("@/pages/resources/templates/AuditChecklistTemplate"));

// Resources - Checklists (3)
const UTMAudit = React.lazy(() => import("@/pages/resources/checklists/UTMAudit"));
const CampaignLaunch = React.lazy(() => import("@/pages/resources/checklists/CampaignLaunch"));
const AnalyticsHealth = React.lazy(() => import("@/pages/resources/checklists/AnalyticsHealth"));

// Resources - Examples (3)
const UTMExamples = React.lazy(() => import("@/pages/resources/examples/UTMExamples"));
const NamingExamples = React.lazy(() => import("@/pages/resources/examples/NamingExamples"));
const DashboardExamples = React.lazy(() => import("@/pages/resources/examples/DashboardExamples"));

// Resources - Frameworks (4)
const B2BAttributionFramework = React.lazy(() => import("@/pages/resources/frameworks/B2BAttributionFramework"));
const CleanTrackModel = React.lazy(() => import("@/pages/resources/frameworks/CleanTrackModel"));
const MinimalAnalyticsStack = React.lazy(() => import("@/pages/resources/frameworks/MinimalAnalyticsStack"));
const AttributionClarityModel = React.lazy(() => import("@/pages/resources/frameworks/AttributionClarityModel"));

// Resources - Reports (1)
const GTMInsights2026 = React.lazy(() => import("@/pages/resources/reports/GTMInsights2026"));

// Resources - Tools (8)
const SalaryNegotiationCoach = React.lazy(() => import("@/pages/resources/tools/SalaryNegotiationCoach"));
const MarketValueCalculator = React.lazy(() => import("@/pages/resources/tools/MarketValueCalculator"));
const CareerPathOptimizer = React.lazy(() => import("@/pages/resources/tools/CareerPathOptimizer"));
const JobOfferAnalyzer = React.lazy(() => import("@/pages/resources/tools/JobOfferAnalyzer"));
const TeamBudgetOptimizer = React.lazy(() => import("@/pages/resources/tools/TeamBudgetOptimizer"));
const AIvsHumanROI = React.lazy(() => import("@/pages/resources/tools/AIvsHumanROI"));
const CompensationTransparency = React.lazy(() => import("@/pages/resources/tools/CompensationTransparency"));
const LinkedInRealityCheck = React.lazy(() => import("@/pages/resources/tools/LinkedInRealityCheck"));

// Resources - Glossary (70 terms)
const GlossaryActivation = React.lazy(() => import("@/pages/resources/glossary/activation"));
const GlossaryAdoptionMilestones = React.lazy(() => import("@/pages/resources/glossary/adoption-milestones"));
const GlossaryArr = React.lazy(() => import("@/pages/resources/glossary/arr"));
const GlossaryBidStrategy = React.lazy(() => import("@/pages/resources/glossary/bid-strategy"));
const GlossaryBoothEngagementRate = React.lazy(() => import("@/pages/resources/glossary/booth-engagement-rate"));
const GlossaryCacPaybackPeriod = React.lazy(() => import("@/pages/resources/glossary/cac-payback-period"));
const GlossaryCac = React.lazy(() => import("@/pages/resources/glossary/cac"));
const GlossaryCampaign = React.lazy(() => import("@/pages/resources/glossary/campaign"));
const GlossaryChurn = React.lazy(() => import("@/pages/resources/glossary/churn"));
const GlossaryCohort = React.lazy(() => import("@/pages/resources/glossary/cohort"));
const GlossaryCommitForecast = React.lazy(() => import("@/pages/resources/glossary/commit-forecast"));
const GlossaryContent = React.lazy(() => import("@/pages/resources/glossary/content"));
const GlossaryConversionRate = React.lazy(() => import("@/pages/resources/glossary/conversion-rate"));
const GlossaryConversionWaterfall = React.lazy(() => import("@/pages/resources/glossary/conversion-waterfall"));
const GlossaryCreativeFatigue = React.lazy(() => import("@/pages/resources/glossary/creative-fatigue"));
const GlossaryCustomDomain = React.lazy(() => import("@/pages/resources/glossary/custom-domain"));
const GlossaryDirect = React.lazy(() => import("@/pages/resources/glossary/direct"));
const GlossaryDisplay = React.lazy(() => import("@/pages/resources/glossary/display"));
const GlossaryEarlyChurnSignals = React.lazy(() => import("@/pages/resources/glossary/early-churn-signals"));
const GlossaryEmail = React.lazy(() => import("@/pages/resources/glossary/email"));
const GlossaryEventRoiModel = React.lazy(() => import("@/pages/resources/glossary/event-roi-model"));
const GlossaryFirstTouch = React.lazy(() => import("@/pages/resources/glossary/first-touch"));
const GlossaryFunnelMath = React.lazy(() => import("@/pages/resources/glossary/funnel-math"));
const GlossaryGrossMargin = React.lazy(() => import("@/pages/resources/glossary/gross-margin"));
const GlossaryHealthScore = React.lazy(() => import("@/pages/resources/glossary/health-score"));
const GlossaryImplementationPlan = React.lazy(() => import("@/pages/resources/glossary/implementation-plan"));
const GlossaryLastTouch = React.lazy(() => import("@/pages/resources/glossary/last-touch"));
const GlossaryLeadScoring = React.lazy(() => import("@/pages/resources/glossary/lead-scoring"));
const GlossaryLeadVelocityRate = React.lazy(() => import("@/pages/resources/glossary/lead-velocity-rate"));
const GlossaryLinear = React.lazy(() => import("@/pages/resources/glossary/linear"));
const GlossaryLinkExpiration = React.lazy(() => import("@/pages/resources/glossary/link-expiration"));
const GlossaryLinkShortener = React.lazy(() => import("@/pages/resources/glossary/link-shortener"));
const GlossaryLtv = React.lazy(() => import("@/pages/resources/glossary/ltv"));
const GlossaryMedium = React.lazy(() => import("@/pages/resources/glossary/medium"));
const GlossaryMql = React.lazy(() => import("@/pages/resources/glossary/mql"));
const GlossaryMrr = React.lazy(() => import("@/pages/resources/glossary/mrr"));
const GlossaryMultiTouch = React.lazy(() => import("@/pages/resources/glossary/multi-touch"));
const GlossaryNamingConvention = React.lazy(() => import("@/pages/resources/glossary/naming-convention"));
const GlossaryOrganicSocial = React.lazy(() => import("@/pages/resources/glossary/organic-social"));
const GlossaryPaidSearch = React.lazy(() => import("@/pages/resources/glossary/paid-search"));
const GlossaryPaidSocial = React.lazy(() => import("@/pages/resources/glossary/paid-social"));
const GlossaryPilotSuccessCriteria = React.lazy(() => import("@/pages/resources/glossary/pilot-success-criteria"));
const GlossaryPipelineCoverageRatio = React.lazy(() => import("@/pages/resources/glossary/pipeline-coverage-ratio"));
const GlossaryPipelineInfluence = React.lazy(() => import("@/pages/resources/glossary/pipeline-influence"));
const GlossaryPipeline = React.lazy(() => import("@/pages/resources/glossary/pipeline"));
const GlossaryPql = React.lazy(() => import("@/pages/resources/glossary/pql"));
const GlossaryQbr = React.lazy(() => import("@/pages/resources/glossary/qbr"));
const GlossaryQrCode = React.lazy(() => import("@/pages/resources/glossary/qr-code"));
const GlossaryQualityScore = React.lazy(() => import("@/pages/resources/glossary/quality-score"));
const GlossaryReactivationCampaign = React.lazy(() => import("@/pages/resources/glossary/reactivation-campaign"));
const GlossaryRedirect = React.lazy(() => import("@/pages/resources/glossary/redirect"));
const GlossaryReferral = React.lazy(() => import("@/pages/resources/glossary/referral"));
const GlossaryRenewalMotion = React.lazy(() => import("@/pages/resources/glossary/renewal-motion"));
const GlossaryRevenueRecognition = React.lazy(() => import("@/pages/resources/glossary/revenue-recognition"));
const GlossaryRunRate = React.lazy(() => import("@/pages/resources/glossary/run-rate"));
const GlossarySal = React.lazy(() => import("@/pages/resources/glossary/sal"));
const GlossarySelfServeConversion = React.lazy(() => import("@/pages/resources/glossary/self-serve-conversion"));
const GlossarySeo = React.lazy(() => import("@/pages/resources/glossary/seo"));
const GlossarySolutionMapping = React.lazy(() => import("@/pages/resources/glossary/solution-mapping"));
const GlossarySource = React.lazy(() => import("@/pages/resources/glossary/source"));
const GlossarySql = React.lazy(() => import("@/pages/resources/glossary/sql"));
const GlossaryTaxonomy = React.lazy(() => import("@/pages/resources/glossary/taxonomy"));
const GlossaryTechnicalValidation = React.lazy(() => import("@/pages/resources/glossary/technical-validation"));
const GlossaryTerm = React.lazy(() => import("@/pages/resources/glossary/term"));
const GlossaryTimeDecay = React.lazy(() => import("@/pages/resources/glossary/time-decay"));
const GlossaryTimeToValue = React.lazy(() => import("@/pages/resources/glossary/time-to-value"));
const GlossaryTrackingArchitecture = React.lazy(() => import("@/pages/resources/glossary/tracking-architecture"));
const GlossaryUsageThreshold = React.lazy(() => import("@/pages/resources/glossary/usage-threshold"));
const GlossaryUtm = React.lazy(() => import("@/pages/resources/glossary/utm"));
const GlossaryValueMoments = React.lazy(() => import("@/pages/resources/glossary/value-moments"));

// Help
const HelpIndex = React.lazy(() => import("@/pages/Help/index"));
const HelpGettingStarted = React.lazy(() => import("@/pages/Help/GettingStarted"));
const HelpLinks = React.lazy(() => import("@/pages/Help/Links"));
const HelpUTM = React.lazy(() => import("@/pages/Help/UTM"));
const HelpQRCodes = React.lazy(() => import("@/pages/Help/QRCodes"));
const HelpAnalytics = React.lazy(() => import("@/pages/Help/Analytics"));
const HelpAttribution = React.lazy(() => import("@/pages/Help/Attribution"));
const HelpEvents = React.lazy(() => import("@/pages/Help/Events"));
const HelpAdvanced = React.lazy(() => import("@/pages/Help/Advanced"));
const HelpTeam = React.lazy(() => import("@/pages/Help/Team"));
const HelpIntegrations = React.lazy(() => import("@/pages/Help/Integrations"));
const HelpDomains = React.lazy(() => import("@/pages/Help/Domains"));
const HelpBilling = React.lazy(() => import("@/pages/Help/Billing"));
const HelpSecurity = React.lazy(() => import("@/pages/Help/Security"));
const HelpSentinel = React.lazy(() => import("@/pages/Help/Sentinel"));

// Docs
const Docs = React.lazy(() => import("@/public/routes/Docs"));
const APIDocumentation = React.lazy(() => import("@/pages/Docs/API"));
const APIPlayground = React.lazy(() => import("@/pages/Docs/APIPlayground"));
const SDKs = React.lazy(() => import("@/pages/Docs/SDKs"));
const PixelInstallation = React.lazy(() => import("@/pages/Docs/PixelInstallation"));
const RevenueAttribution = React.lazy(() => import("@/pages/Docs/RevenueAttribution"));
const CRMIntegrations = React.lazy(() => import("@/pages/Docs/CRMIntegrations"));
const ChromeExtensionDocs = React.lazy(() => import("@/pages/Docs/ChromeExtension"));
const GeoTargetingDocs = React.lazy(() => import("@/pages/Docs/GeoTargeting"));
const IdentityGraphDocs = React.lazy(() => import("@/pages/Docs/IdentityGraph"));
const SmartInsightsDocs = React.lazy(() => import("@/pages/Docs/SmartInsights"));
const TroubleshootingDocs = React.lazy(() => import("@/pages/Docs/Troubleshooting"));

// Tools (public)
const ToolsHub = React.lazy(() => import("@/pages/tools/ToolsHub"));
const PublicQRGenerator = React.lazy(() => import("@/pages/tools/QRGenerator"));
const PublicURLShortener = React.lazy(() => import("@/pages/tools/URLShortener"));
const PublicUTMBuilder = React.lazy(() => import("@/pages/tools/UTMBuilder"));
const UTMBuilderLinkedIn = React.lazy(() => import("@/pages/tools/UTMBuilderLinkedIn"));
const UTMBuilderFacebook = React.lazy(() => import("@/pages/tools/UTMBuilderFacebook"));
const UTMBuilderGoogleAds = React.lazy(() => import("@/pages/tools/UTMBuilderGoogleAds"));
const UTMBuilderTikTok = React.lazy(() => import("@/pages/tools/UTMBuilderTikTok"));
const UTMBuilderEmail = React.lazy(() => import("@/pages/tools/UTMBuilderEmail"));
const PublicLinkHealthChecker = React.lazy(() => import("@/pages/tools/LinkHealthChecker"));
const DecisionFrameworks = React.lazy(() => import("@/pages/tools/DecisionFrameworks"));
const Scanner = React.lazy(() => import("@/pages/tools/Scanner"));
const Casino = React.lazy(() => import("@/pages/tools/Casino"));
const Galaxy = React.lazy(() => import("@/pages/tools/Galaxy"));
const QRTest = React.lazy(() => import("@/pages/tools/QRTest"));

// Legal
const PrivacyLegal = React.lazy(() => import("@/pages/legal/PrivacyLegal"));
const TermsLegal = React.lazy(() => import("@/pages/legal/TermsLegal"));
const PermanenceTerms = React.lazy(() => import("@/pages/legal/PermanenceTerms"));
const DataSecurity = React.lazy(() => import("@/pages/legal/DataSecurity"));
const CookiePolicy = React.lazy(() => import("@/pages/legal/CookiePolicy"));
const AcceptableUse = React.lazy(() => import("@/pages/legal/AcceptableUse"));
const Subprocessors = React.lazy(() => import("@/pages/legal/Subprocessors"));
const DPA = React.lazy(() => import("@/pages/legal/DPA"));
const SupportPolicy = React.lazy(() => import("@/pages/legal/SupportPolicy"));

// Compare
const CompareHub = React.lazy(() => import("@/pages/Compare"));
const UtmOneVsBitly = React.lazy(() => import("@/pages/compare/UtmOneVsBitly"));
const UtmOneVsRebrandly = React.lazy(() => import("@/pages/compare/UtmOneVsRebrandly"));
const UtmOneVsShortIo = React.lazy(() => import("@/pages/compare/UtmOneVsShortIo"));
const UtmOneVsBlInk = React.lazy(() => import("@/pages/compare/UtmOneVsBlInk"));
const UtmOneVsRewardful = React.lazy(() => import("@/pages/compare/UtmOneVsRewardful"));
const UtmOneVsPartnerstack = React.lazy(() => import("@/pages/compare/UtmOneVsPartnerstack"));
const UtmOneVsFirstpromoter = React.lazy(() => import("@/pages/compare/UtmOneVsFirstpromoter"));
const UtmOneVsTolt = React.lazy(() => import("@/pages/compare/UtmOneVsTolt"));

// Use Cases
const UseCasesIndex = React.lazy(() => import("@/pages/use-cases/UseCasesIndex"));
const EcommerceTracking = React.lazy(() => import("@/pages/use-cases/EcommerceTracking"));
const SaasAttribution = React.lazy(() => import("@/pages/use-cases/SaasAttribution"));
const EventMarketing = React.lazy(() => import("@/pages/use-cases/EventMarketing"));
const AgencyClientReporting = React.lazy(() => import("@/pages/use-cases/AgencyClientReporting"));
const InfluencerCampaigns = React.lazy(() => import("@/pages/use-cases/InfluencerCampaigns"));

// Other Marketing Pages
const About = React.lazy(() => import("@/pages/AboutNew"));
const Blog = React.lazy(() => import("@/pages/Blog"));
const FAQ = React.lazy(() => import("@/pages/FAQ"));
const Changelog = React.lazy(() => import("@/pages/Changelog"));
const Support = React.lazy(() => import("@/pages/Support"));
const TrustPage = React.lazy(() => import("@/pages/Trust"));
const StatusPage = React.lazy(() => import("@/pages/Status"));
const PublicRoadmap = React.lazy(() => import("@/pages/PublicRoadmap"));
const PublicBugTracker = React.lazy(() => import("@/pages/PublicBugTracker"));
const Accessibility = React.lazy(() => import("@/pages/Accessibility"));
const Permanence = React.lazy(() => import("@/pages/Permanence"));
const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy"));
const Product = React.lazy(() => import("@/pages/Product"));
const Products = React.lazy(() => import("@/pages/Products"));
const LinkExpired = React.lazy(() => import("@/pages/LinkExpired"));
const ComingSoonPage = React.lazy(() => import("@/pages/ComingSoon"));
const Surprise = React.lazy(() => import("@/pages/Surprise"));
const LifetimeDeal = React.lazy(() => import("@/pages/LifetimeDeal"));
const AcceptInvite = React.lazy(() => import("@/pages/AcceptInvite"));
const EarlyAccess = React.lazy(() => import("@/pages/EarlyAccess"));
const Invite = React.lazy(() => import("@/pages/Invite"));
const ClaimAccess = React.lazy(() => import("@/pages/ClaimAccess"));
const BookDemo = React.lazy(() => import("@/pages/BookDemo"));
const Partners = React.lazy(() => import("@/pages/Partners"));
const PartnerApply = React.lazy(() => import("@/pages/Partners/Apply"));
const PartnerTerms = React.lazy(() => import("@/pages/Partners/Terms"));
const ZapierIntegration = React.lazy(() => import("@/pages/integrations/Zapier"));
const SlackIntegration = React.lazy(() => import("@/pages/integrations/Slack"));
const AnalyticsShare = React.lazy(() => import("@/pages/AnalyticsShare"));
const ScanPage = React.lazy(() => import("@/pages/Scan"));
const PasswordProtected = React.lazy(() => import("@/pages/PasswordProtected"));
const LoaderDemo = React.lazy(() => import("@/pages/LoaderDemo"));

// Product pages
const LinkOrchestration = React.lazy(() => import("@/pages/products/LinkOrchestration"));
const JourneyIntelligence = React.lazy(() => import("@/pages/products/JourneyIntelligence"));
const QRStudio = React.lazy(() => import("@/pages/products/QRStudio"));
const DataPipeline = React.lazy(() => import("@/pages/products/DataPipeline"));

// Helper for lazy routes
const M = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<MarketingSkeleton />}>{children}</Suspense>
);

const MarketingRoutes = () => {
  return (
    <Routes>
      {/* Features */}
      <Route path="/features" element={<M><Features /></M>} />
      <Route path="/how-it-works" element={<M><HowItWorks /></M>} />
      <Route path="/features/short-links" element={<M><ShortLinks /></M>} />
      <Route path="/features/utm-builder" element={<M><UTMBuilder /></M>} />
      <Route path="/features/qr-generator" element={<M><QRGenerator /></M>} />
      <Route path="/features/customer-journey" element={<M><CustomerJourney /></M>} />
      <Route path="/features/identity-resolution" element={<M><IdentityResolution /></M>} />
      <Route path="/features/bayesian-attribution" element={<M><BayesianAttribution /></M>} />
      <Route path="/features/journey-valuation" element={<M><JourneyValuation /></M>} />
      <Route path="/features/analytics" element={<M><AnalyticsFeature /></M>} />
      <Route path="/features/enterprise-control" element={<M><EnterpriseControl /></M>} />
      <Route path="/features/clean-track" element={<M><CleanTrack /></M>} />
      <Route path="/features/partner-program" element={<M><PartnerProgram /></M>} />
      <Route path="/features/integrations" element={<M><Integrations /></M>} />
      <Route path="/features/predictive-analytics" element={<M><PredictiveAnalytics /></M>} />
      <Route path="/features/attribution-graph" element={<M><AttributionGraph /></M>} />
      <Route path="/features/smart-routing" element={<M><SmartRouting /></M>} />
      <Route path="/features/link-immunity" element={<M><LinkImmunity /></M>} />
      <Route path="/features/workspaces" element={<M><Workspaces /></M>} />
      <Route path="/features/reporting" element={<M><Reporting /></M>} />
      <Route path="/features/custom-domains" element={<M><CustomDomains /></M>} />
      <Route path="/features/automation" element={<M><Automation /></M>} />
      <Route path="/features/accessibility" element={<M><AccessibilityFeature /></M>} />
      <Route path="/features/event-halo" element={<M><EventHalo /></M>} />
      <Route path="/features/ai-intelligence" element={<M><AIIntelligence /></M>} />
      <Route path="/features/sentinel" element={<M><Sentinel /></M>} />
      <Route path="/features/brick-builder" element={<M><BrickBuilderFeature /></M>} />
      <Route path="/features/link-pages" element={<M><LinkPagesFeature /></M>} />

      {/* Solutions */}
      <Route path="/solutions" element={<M><SolutionsHub /></M>} />
      <Route path="/solutions/enterprise" element={<M><EnterpriseSolution /></M>} />
      <Route path="/solutions/agencies" element={<M><AgenciesSolution /></M>} />
      <Route path="/solutions/developers" element={<M><Developers /></M>} />
      <Route path="/solutions/startups" element={<M><Startups /></M>} />
      <Route path="/solutions/reporting-team" element={<M><ReportingTeam /></M>} />
      <Route path="/solutions/revops" element={<M><RevOps /></M>} />
      <Route path="/solutions/marketers" element={<M><Marketers /></M>} />
      <Route path="/solutions/sales" element={<M><Sales /></M>} />
      <Route path="/solutions/marketing-ops" element={<M><MarketingOps /></M>} />
      <Route path="/solutions/partner-managers" element={<M><PartnerManagers /></M>} />
      <Route path="/solutions/field-marketing" element={<M><FieldMarketing /></M>} />

      {/* Resources - SPECIFIC ROUTES FIRST, then list pages */}
      
      {/* Guides - Specific (7) */}
      <Route path="/resources/guides/utm-guide" element={<M><UTMGuide /></M>} />
      <Route path="/resources/guides/clean-track-framework" element={<M><CleanTrackFramework /></M>} />
      <Route path="/resources/guides/tracking-architecture" element={<M><TrackingArchitecture /></M>} />
      <Route path="/resources/guides/simple-analytics" element={<M><SimpleAnalytics /></M>} />
      <Route path="/resources/guides/growth-analytics" element={<M><GrowthAnalytics /></M>} />
      <Route path="/resources/guides/llm-seo" element={<M><LLMSeo /></M>} />
      <Route path="/resources/guides/bayesian-testing" element={<M><BayesianTesting /></M>} />
      
      {/* Playbooks - Specific (9) */}
      <Route path="/resources/playbooks/llm-ranking" element={<M><LLMRanking /></M>} />
      <Route path="/resources/playbooks/utm-governance" element={<M><UTMGovernancePlaybook /></M>} />
      <Route path="/resources/playbooks/ai-marketing" element={<M><AIMarketingPlaybook /></M>} />
      <Route path="/resources/playbooks/b2b-architects" element={<M><B2BArchitectsPlaybook /></M>} />
      <Route path="/resources/playbooks/event-led-growth" element={<M><EventLedGrowthPlaybook /></M>} />
      <Route path="/resources/playbooks/hr-katalyst-referral" element={<M><HRKatalystReferralPlaybook /></M>} />
      <Route path="/resources/playbooks/naming-convention" element={<M><NamingConventionPlaybook /></M>} />
      <Route path="/resources/playbooks/sales-marketing-alignment" element={<M><SalesMarketingAlignmentPlaybook /></M>} />
      <Route path="/resources/playbooks/startup-analytics" element={<M><StartupAnalyticsPlaybook /></M>} />
      
      {/* Templates - Specific (4) */}
      <Route path="/resources/templates/utm-template" element={<M><UTMTemplate /></M>} />
      <Route path="/resources/templates/campaign-brief" element={<M><CampaignBriefTemplate /></M>} />
      <Route path="/resources/templates/naming-taxonomy" element={<M><NamingTaxonomyTemplate /></M>} />
      <Route path="/resources/templates/audit-checklist" element={<M><AuditChecklistTemplate /></M>} />
      
      {/* Checklists - Specific (3) */}
      <Route path="/resources/checklists/utm-audit" element={<M><UTMAudit /></M>} />
      <Route path="/resources/checklists/campaign-launch" element={<M><CampaignLaunch /></M>} />
      <Route path="/resources/checklists/analytics-health" element={<M><AnalyticsHealth /></M>} />
      
      {/* Examples - Specific (3) */}
      <Route path="/resources/examples/utm-examples" element={<M><UTMExamples /></M>} />
      <Route path="/resources/examples/naming-examples" element={<M><NamingExamples /></M>} />
      <Route path="/resources/examples/dashboard-examples" element={<M><DashboardExamples /></M>} />
      
      {/* Frameworks - Specific (4) */}
      <Route path="/resources/frameworks/b2b-attribution" element={<M><B2BAttributionFramework /></M>} />
      <Route path="/resources/frameworks/clean-track-model" element={<M><CleanTrackModel /></M>} />
      <Route path="/resources/frameworks/minimal-analytics-stack" element={<M><MinimalAnalyticsStack /></M>} />
      <Route path="/resources/frameworks/attribution-clarity-model" element={<M><AttributionClarityModel /></M>} />
      
      {/* Reports - Specific (1) */}
      <Route path="/resources/reports/gtm-insights-2026" element={<M><GTMInsights2026 /></M>} />
      
      {/* Resource Tools - Specific (8) */}
      <Route path="/resources/tools/salary-negotiation-coach" element={<M><SalaryNegotiationCoach /></M>} />
      <Route path="/resources/tools/market-value-calculator" element={<M><MarketValueCalculator /></M>} />
      <Route path="/resources/tools/career-path-optimizer" element={<M><CareerPathOptimizer /></M>} />
      <Route path="/resources/tools/job-offer-analyzer" element={<M><JobOfferAnalyzer /></M>} />
      <Route path="/resources/tools/team-budget-optimizer" element={<M><TeamBudgetOptimizer /></M>} />
      <Route path="/resources/tools/ai-vs-human-roi" element={<M><AIvsHumanROI /></M>} />
      <Route path="/resources/tools/compensation-transparency" element={<M><CompensationTransparency /></M>} />
      <Route path="/resources/tools/linkedin-reality-check" element={<M><LinkedInRealityCheck /></M>} />
      
      {/* Glossary - Specific (70 terms) */}
      <Route path="/resources/glossary/activation" element={<M><GlossaryActivation /></M>} />
      <Route path="/resources/glossary/adoption-milestones" element={<M><GlossaryAdoptionMilestones /></M>} />
      <Route path="/resources/glossary/arr" element={<M><GlossaryArr /></M>} />
      <Route path="/resources/glossary/bid-strategy" element={<M><GlossaryBidStrategy /></M>} />
      <Route path="/resources/glossary/booth-engagement-rate" element={<M><GlossaryBoothEngagementRate /></M>} />
      <Route path="/resources/glossary/cac-payback-period" element={<M><GlossaryCacPaybackPeriod /></M>} />
      <Route path="/resources/glossary/cac" element={<M><GlossaryCac /></M>} />
      <Route path="/resources/glossary/campaign" element={<M><GlossaryCampaign /></M>} />
      <Route path="/resources/glossary/churn" element={<M><GlossaryChurn /></M>} />
      <Route path="/resources/glossary/cohort" element={<M><GlossaryCohort /></M>} />
      <Route path="/resources/glossary/commit-forecast" element={<M><GlossaryCommitForecast /></M>} />
      <Route path="/resources/glossary/content" element={<M><GlossaryContent /></M>} />
      <Route path="/resources/glossary/conversion-rate" element={<M><GlossaryConversionRate /></M>} />
      <Route path="/resources/glossary/conversion-waterfall" element={<M><GlossaryConversionWaterfall /></M>} />
      <Route path="/resources/glossary/creative-fatigue" element={<M><GlossaryCreativeFatigue /></M>} />
      <Route path="/resources/glossary/custom-domain" element={<M><GlossaryCustomDomain /></M>} />
      <Route path="/resources/glossary/direct" element={<M><GlossaryDirect /></M>} />
      <Route path="/resources/glossary/display" element={<M><GlossaryDisplay /></M>} />
      <Route path="/resources/glossary/early-churn-signals" element={<M><GlossaryEarlyChurnSignals /></M>} />
      <Route path="/resources/glossary/email" element={<M><GlossaryEmail /></M>} />
      <Route path="/resources/glossary/event-roi-model" element={<M><GlossaryEventRoiModel /></M>} />
      <Route path="/resources/glossary/first-touch" element={<M><GlossaryFirstTouch /></M>} />
      <Route path="/resources/glossary/funnel-math" element={<M><GlossaryFunnelMath /></M>} />
      <Route path="/resources/glossary/gross-margin" element={<M><GlossaryGrossMargin /></M>} />
      <Route path="/resources/glossary/health-score" element={<M><GlossaryHealthScore /></M>} />
      <Route path="/resources/glossary/implementation-plan" element={<M><GlossaryImplementationPlan /></M>} />
      <Route path="/resources/glossary/last-touch" element={<M><GlossaryLastTouch /></M>} />
      <Route path="/resources/glossary/lead-scoring" element={<M><GlossaryLeadScoring /></M>} />
      <Route path="/resources/glossary/lead-velocity-rate" element={<M><GlossaryLeadVelocityRate /></M>} />
      <Route path="/resources/glossary/linear" element={<M><GlossaryLinear /></M>} />
      <Route path="/resources/glossary/link-expiration" element={<M><GlossaryLinkExpiration /></M>} />
      <Route path="/resources/glossary/link-shortener" element={<M><GlossaryLinkShortener /></M>} />
      <Route path="/resources/glossary/ltv" element={<M><GlossaryLtv /></M>} />
      <Route path="/resources/glossary/medium" element={<M><GlossaryMedium /></M>} />
      <Route path="/resources/glossary/mql" element={<M><GlossaryMql /></M>} />
      <Route path="/resources/glossary/mrr" element={<M><GlossaryMrr /></M>} />
      <Route path="/resources/glossary/multi-touch" element={<M><GlossaryMultiTouch /></M>} />
      <Route path="/resources/glossary/naming-convention" element={<M><GlossaryNamingConvention /></M>} />
      <Route path="/resources/glossary/organic-social" element={<M><GlossaryOrganicSocial /></M>} />
      <Route path="/resources/glossary/paid-search" element={<M><GlossaryPaidSearch /></M>} />
      <Route path="/resources/glossary/paid-social" element={<M><GlossaryPaidSocial /></M>} />
      <Route path="/resources/glossary/pilot-success-criteria" element={<M><GlossaryPilotSuccessCriteria /></M>} />
      <Route path="/resources/glossary/pipeline-coverage-ratio" element={<M><GlossaryPipelineCoverageRatio /></M>} />
      <Route path="/resources/glossary/pipeline-influence" element={<M><GlossaryPipelineInfluence /></M>} />
      <Route path="/resources/glossary/pipeline" element={<M><GlossaryPipeline /></M>} />
      <Route path="/resources/glossary/pql" element={<M><GlossaryPql /></M>} />
      <Route path="/resources/glossary/qbr" element={<M><GlossaryQbr /></M>} />
      <Route path="/resources/glossary/qr-code" element={<M><GlossaryQrCode /></M>} />
      <Route path="/resources/glossary/quality-score" element={<M><GlossaryQualityScore /></M>} />
      <Route path="/resources/glossary/reactivation-campaign" element={<M><GlossaryReactivationCampaign /></M>} />
      <Route path="/resources/glossary/redirect" element={<M><GlossaryRedirect /></M>} />
      <Route path="/resources/glossary/referral" element={<M><GlossaryReferral /></M>} />
      <Route path="/resources/glossary/renewal-motion" element={<M><GlossaryRenewalMotion /></M>} />
      <Route path="/resources/glossary/revenue-recognition" element={<M><GlossaryRevenueRecognition /></M>} />
      <Route path="/resources/glossary/run-rate" element={<M><GlossaryRunRate /></M>} />
      <Route path="/resources/glossary/sal" element={<M><GlossarySal /></M>} />
      <Route path="/resources/glossary/self-serve-conversion" element={<M><GlossarySelfServeConversion /></M>} />
      <Route path="/resources/glossary/seo" element={<M><GlossarySeo /></M>} />
      <Route path="/resources/glossary/solution-mapping" element={<M><GlossarySolutionMapping /></M>} />
      <Route path="/resources/glossary/source" element={<M><GlossarySource /></M>} />
      <Route path="/resources/glossary/sql" element={<M><GlossarySql /></M>} />
      <Route path="/resources/glossary/taxonomy" element={<M><GlossaryTaxonomy /></M>} />
      <Route path="/resources/glossary/technical-validation" element={<M><GlossaryTechnicalValidation /></M>} />
      <Route path="/resources/glossary/term" element={<M><GlossaryTerm /></M>} />
      <Route path="/resources/glossary/time-decay" element={<M><GlossaryTimeDecay /></M>} />
      <Route path="/resources/glossary/time-to-value" element={<M><GlossaryTimeToValue /></M>} />
      <Route path="/resources/glossary/tracking-architecture" element={<M><GlossaryTrackingArchitecture /></M>} />
      <Route path="/resources/glossary/usage-threshold" element={<M><GlossaryUsageThreshold /></M>} />
      <Route path="/resources/glossary/utm" element={<M><GlossaryUtm /></M>} />
      <Route path="/resources/glossary/value-moments" element={<M><GlossaryValueMoments /></M>} />

      {/* Resources - List pages (AFTER specific routes) */}
      <Route path="/resources" element={<M><Resources /></M>} />
      <Route path="/resources/guides" element={<M><Guides /></M>} />
      <Route path="/resources/playbooks" element={<M><Playbooks /></M>} />
      <Route path="/resources/templates" element={<M><Templates /></M>} />
      <Route path="/resources/checklists" element={<M><Checklists /></M>} />
      <Route path="/resources/frameworks" element={<M><Frameworks /></M>} />
      <Route path="/resources/examples" element={<M><Examples /></M>} />
      <Route path="/resources/glossary" element={<M><Glossary /></M>} />
      <Route path="/resources/academy" element={<M><Academy /></M>} />
      <Route path="/resources/reports" element={<M><Reports /></M>} />
      <Route path="/resources/tools" element={<M><ResourceTools /></M>} />

      {/* Help */}
      <Route path="/help" element={<M><HelpIndex /></M>} />
      <Route path="/help/getting-started" element={<M><HelpGettingStarted /></M>} />
      <Route path="/help/links" element={<M><HelpLinks /></M>} />
      <Route path="/help/utm" element={<M><HelpUTM /></M>} />
      <Route path="/help/qr-codes" element={<M><HelpQRCodes /></M>} />
      <Route path="/help/analytics" element={<M><HelpAnalytics /></M>} />
      <Route path="/help/attribution" element={<M><HelpAttribution /></M>} />
      <Route path="/help/events" element={<M><HelpEvents /></M>} />
      <Route path="/help/advanced" element={<M><HelpAdvanced /></M>} />
      <Route path="/help/team" element={<M><HelpTeam /></M>} />
      <Route path="/help/integrations" element={<M><HelpIntegrations /></M>} />
      <Route path="/help/domains" element={<M><HelpDomains /></M>} />
      <Route path="/help/billing" element={<M><HelpBilling /></M>} />
      <Route path="/help/security" element={<M><HelpSecurity /></M>} />
      <Route path="/help/sentinel" element={<M><HelpSentinel /></M>} />
      <Route path="/help/*" element={<M><HelpIndex /></M>} />

      {/* Docs */}
      <Route path="/docs" element={<M><Docs /></M>} />
      <Route path="/docs/api" element={<M><APIDocumentation /></M>} />
      <Route path="/docs/api/playground" element={<M><APIPlayground /></M>} />
      <Route path="/docs/sdks" element={<M><SDKs /></M>} />
      <Route path="/docs/pixel" element={<M><PixelInstallation /></M>} />
      <Route path="/docs/revenue-attribution" element={<M><RevenueAttribution /></M>} />
      <Route path="/docs/crm-integrations" element={<M><CRMIntegrations /></M>} />
      <Route path="/docs/chrome-extension" element={<M><ChromeExtensionDocs /></M>} />
      <Route path="/docs/geo-targeting" element={<M><GeoTargetingDocs /></M>} />
      <Route path="/docs/identity-graph" element={<M><IdentityGraphDocs /></M>} />
      <Route path="/docs/smart-insights" element={<M><SmartInsightsDocs /></M>} />
      <Route path="/docs/troubleshooting" element={<M><TroubleshootingDocs /></M>} />

      {/* Tools */}
      <Route path="/tools" element={<M><ToolsHub /></M>} />
      <Route path="/tools/qr" element={<M><PublicQRGenerator /></M>} />
      <Route path="/tools/qr-generator" element={<M><PublicQRGenerator /></M>} />
      <Route path="/tools/shorten" element={<M><PublicURLShortener /></M>} />
      <Route path="/tools/url-shortener" element={<M><PublicURLShortener /></M>} />
      <Route path="/tools/utm-builder" element={<M><PublicUTMBuilder /></M>} />
      <Route path="/tools/utm-builder/linkedin" element={<M><UTMBuilderLinkedIn /></M>} />
      <Route path="/tools/utm-builder/facebook" element={<M><UTMBuilderFacebook /></M>} />
      <Route path="/tools/utm-builder/google-ads" element={<M><UTMBuilderGoogleAds /></M>} />
      <Route path="/tools/utm-builder/tiktok" element={<M><UTMBuilderTikTok /></M>} />
      <Route path="/tools/utm-builder/email" element={<M><UTMBuilderEmail /></M>} />
      <Route path="/tools/utm-builder-linkedin" element={<M><UTMBuilderLinkedIn /></M>} />
      <Route path="/tools/utm-builder-facebook" element={<M><UTMBuilderFacebook /></M>} />
      <Route path="/tools/utm-builder-google-ads" element={<M><UTMBuilderGoogleAds /></M>} />
      <Route path="/tools/utm-builder-tiktok" element={<M><UTMBuilderTikTok /></M>} />
      <Route path="/tools/utm-builder-email" element={<M><UTMBuilderEmail /></M>} />
      <Route path="/tools/link-health-checker" element={<M><PublicLinkHealthChecker /></M>} />
      <Route path="/tools/decision-frameworks" element={<M><DecisionFrameworks /></M>} />
      <Route path="/tools/scanner" element={<M><Scanner /></M>} />
      <Route path="/tools/casino" element={<M><Casino /></M>} />
      <Route path="/tools/galaxy" element={<M><Galaxy /></M>} />
      <Route path="/tools/qr-test" element={<M><QRTest /></M>} />

      {/* Legal */}
      <Route path="/legal/privacy" element={<M><PrivacyLegal /></M>} />
      <Route path="/legal/terms" element={<M><TermsLegal /></M>} />
      <Route path="/legal/permanence-terms" element={<M><PermanenceTerms /></M>} />
      <Route path="/legal/data-security" element={<M><DataSecurity /></M>} />
      <Route path="/legal/cookies" element={<M><CookiePolicy /></M>} />
      <Route path="/legal/acceptable-use" element={<M><AcceptableUse /></M>} />
      <Route path="/legal/subprocessors" element={<M><Subprocessors /></M>} />
      <Route path="/legal/dpa" element={<M><DPA /></M>} />
      <Route path="/legal/support" element={<M><SupportPolicy /></M>} />

      {/* Compare */}
      <Route path="/compare" element={<M><CompareHub /></M>} />
      <Route path="/compare/bitly" element={<M><UtmOneVsBitly /></M>} />
      <Route path="/compare/rebrandly" element={<M><UtmOneVsRebrandly /></M>} />
      <Route path="/compare/short-io" element={<M><UtmOneVsShortIo /></M>} />
      <Route path="/compare/bl-ink" element={<M><UtmOneVsBlInk /></M>} />
      <Route path="/compare/rewardful" element={<M><UtmOneVsRewardful /></M>} />
      <Route path="/compare/partnerstack" element={<M><UtmOneVsPartnerstack /></M>} />
      <Route path="/compare/firstpromoter" element={<M><UtmOneVsFirstpromoter /></M>} />
      <Route path="/compare/tolt" element={<M><UtmOneVsTolt /></M>} />

      {/* Use Cases */}
      <Route path="/use-cases" element={<M><UseCasesIndex /></M>} />
      <Route path="/use-cases/ecommerce" element={<M><EcommerceTracking /></M>} />
      <Route path="/use-cases/saas" element={<M><SaasAttribution /></M>} />
      <Route path="/use-cases/events" element={<M><EventMarketing /></M>} />
      <Route path="/use-cases/agencies" element={<M><AgencyClientReporting /></M>} />
      <Route path="/use-cases/influencer" element={<M><InfluencerCampaigns /></M>} />

      {/* Products */}
      <Route path="/products" element={<M><Products /></M>} />
      <Route path="/product" element={<M><Product /></M>} />
      <Route path="/products/link-orchestration" element={<M><LinkOrchestration /></M>} />
      <Route path="/products/journey-intelligence" element={<M><JourneyIntelligence /></M>} />
      <Route path="/products/qr-studio" element={<M><QRStudio /></M>} />
      <Route path="/products/data-pipeline" element={<M><DataPipeline /></M>} />

      {/* Other Pages */}
      <Route path="/about" element={<M><About /></M>} />
      <Route path="/blog" element={<M><Blog /></M>} />
      <Route path="/faq" element={<M><FAQ /></M>} />
      <Route path="/changelog" element={<M><Changelog /></M>} />
      <Route path="/support" element={<M><Support /></M>} />
      <Route path="/trust" element={<M><TrustPage /></M>} />
      <Route path="/status" element={<M><StatusPage /></M>} />
      <Route path="/roadmap" element={<M><PublicRoadmap /></M>} />
      <Route path="/feedback" element={<M><PublicBugTracker /></M>} />
      <Route path="/accessibility" element={<M><Accessibility /></M>} />
      <Route path="/permanence" element={<M><Permanence /></M>} />
      <Route path="/privacy-policy" element={<M><PrivacyPolicy /></M>} />
      <Route path="/link-expired" element={<M><LinkExpired /></M>} />
      <Route path="/coming-soon" element={<M><ComingSoonPage title="Coming Soon" description="This feature is currently under development. Check back soon!" /></M>} />
      <Route path="/surprise" element={<M><Surprise /></M>} />
      <Route path="/lifetime" element={<M><LifetimeDeal /></M>} />
      <Route path="/accept-invite" element={<M><AcceptInvite /></M>} />
      <Route path="/early-access" element={<M><EarlyAccess /></M>} />
      <Route path="/invite/:code" element={<M><Invite /></M>} />
      <Route path="/claim-access" element={<M><ClaimAccess /></M>} />
      <Route path="/book-demo" element={<M><BookDemo /></M>} />
      <Route path="/contact" element={<M><BookDemo /></M>} />
      <Route path="/partners" element={<M><Partners /></M>} />
      <Route path="/partners/apply" element={<M><PartnerApply /></M>} />
      <Route path="/partners/terms" element={<M><PartnerTerms /></M>} />
      <Route path="/integrations/zapier" element={<M><ZapierIntegration /></M>} />
      <Route path="/integrations/slack" element={<M><SlackIntegration /></M>} />
      <Route path="/analytics/share/:token" element={<M><AnalyticsShare /></M>} />
      <Route path="/scan" element={<M><ScanPage /></M>} />
      <Route path="/p/:slug" element={<M><PasswordProtected /></M>} />
      <Route path="/loader-demo" element={<M><LoaderDemo /></M>} />
    </Routes>
  );
};

export default MarketingRoutes;
