import type React from "react";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MarketingSkeleton, DashboardSkeleton } from "./components/SkeletonLoader";
import { SkipToContent } from "./components/SkipToContent";
import { NetworkStatus } from "./components/ui/network-status";
import { AppWithHelp } from "./components/AppWithHelp";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
// PHASE: AnimatedRoutes removed - causes LCP recalculation
import { lazyWithRetry } from "./utils/lazyWithRetry";
import { InstallPrompt } from "./components/pwa/InstallPrompt";
import { UpdateNotification } from "./components/pwa/UpdateNotification";
// PHASE 14: Use centralized queryClient - no duplicate QueryClient creation
import { queryClient as centralQueryClient } from "@/lib/queryConfig";
import { ModalProvider } from "./contexts/ModalContext";
const PrivateRoutes = lazy(() => import("./routes/PrivateRoutes"));

// PHASE 14: Deferred providers - only load when needed
const AdminSimulationProvider = lazy(() => import("./contexts/AdminSimulationContext").then(m => ({ default: m.AdminSimulationProvider })));
const GlobalEarlyAccessModal = lazy(() => import("./components/early-access/GlobalEarlyAccessModal").then(m => ({ default: m.GlobalEarlyAccessModal })));

// PHASE 17: Lazy load Index page for code splitting
const Index = lazy(() => import("./public/routes/Index"));

// Auth pages - lazy loaded with preload hints for likely navigation
const Auth = lazy(() => import("./pages/Auth"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const Signup = lazy(() => import("./pages/Signup"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Low-traffic pages - fully lazy loaded
const ComingSoonPage = lazy(() => import("./pages/ComingSoon"));
const LinkExpired = lazy(() => import("./pages/LinkExpired"));
const Blog = lazy(() => import("./pages/Blog"));
const Surprise = lazy(() => import("./pages/Surprise"));

// Auth callback gatekeeper and waitlist pages
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const WaitlistLocked = lazy(() => import("./pages/WaitlistLocked"));

const PasswordProtected = lazy(() => import("./pages/PasswordProtected"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Permanence = lazy(() => import("./pages/Permanence"));
const Pricing = lazy(() => import("./public/routes/Pricing"));
const LifetimeDeal = lazy(() => import("./pages/LifetimeDeal"));
const About = lazy(() => import("./pages/AboutNew"));
const Docs = lazy(() => import("./public/routes/Docs"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Support = lazy(() => import("./pages/Support"));
const APIDocumentation = lazy(() => import("./pages/Docs/API"));
const APIPlayground = lazy(() => import("./pages/Docs/APIPlayground"));
const SDKs = lazy(() => import("./pages/Docs/SDKs"));
const PixelInstallation = lazy(() => import("./pages/Docs/PixelInstallation"));
const RevenueAttribution = lazy(() => import("./pages/Docs/RevenueAttribution"));
const CRMIntegrations = lazy(() => import("./pages/Docs/CRMIntegrations"));
const ChromeExtensionDocs = lazy(() => import("./pages/Docs/ChromeExtension"));
const GeoTargetingDocs = lazy(() => import("./pages/Docs/GeoTargeting"));
const IdentityGraphDocs = lazy(() => import("./pages/Docs/IdentityGraph"));
const SmartInsightsDocs = lazy(() => import("./pages/Docs/SmartInsights"));
const TroubleshootingDocs = lazy(() => import("./pages/Docs/Troubleshooting"));
const PublicQRGenerator = lazy(() => import("./pages/tools/QRGenerator"));
const PublicURLShortener = lazy(() => import("./pages/tools/URLShortener"));
const PublicUTMBuilder = lazy(() => import("./pages/tools/UTMBuilder"));
const UTMBuilderLinkedIn = lazy(() => import("./pages/tools/UTMBuilderLinkedIn"));
const UTMBuilderFacebook = lazy(() => import("./pages/tools/UTMBuilderFacebook"));
const UTMBuilderGoogleAds = lazy(() => import("./pages/tools/UTMBuilderGoogleAds"));
const UTMBuilderTikTok = lazy(() => import("./pages/tools/UTMBuilderTikTok"));
const UTMBuilderEmail = lazy(() => import("./pages/tools/UTMBuilderEmail"));
const PublicLinkHealthChecker = lazy(() => import("./pages/tools/LinkHealthChecker"));
const TrustPage = lazy(() => import("./pages/Trust"));
const StatusPage = lazy(() => import("./pages/Status"));
const PublicRoadmap = lazy(() => import("./pages/PublicRoadmap"));
const PublicBugTracker = lazy(() => import("./pages/PublicBugTracker"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
// Feature Pages
const Features = lazy(() => import("./public/routes/Features"));
const HowItWorks = lazy(() => import("./pages/HowItWorksNew"));
const ShortLinks = lazy(() => import("./pages/features/ShortLinks"));
const UTMBuilder = lazy(() => import("./pages/features/UTMBuilder"));
const QRGenerator = lazy(() => import("./pages/features/QRGenerator"));
const CustomerJourney = lazy(() => import("./pages/features/CustomerJourney"));
const IdentityResolution = lazy(() => import("./pages/features/IdentityResolution"));
const BayesianAttribution = lazy(() => import("./pages/features/BayesianAttribution"));
const JourneyValuation = lazy(() => import("./pages/features/JourneyValuation"));
const AnalyticsFeature = lazy(() => import("./pages/features/Analytics"));
const EnterpriseControl = lazy(() => import("./pages/features/EnterpriseControl"));
const CleanTrack = lazy(() => import("./pages/features/CleanTrack"));
const PartnerProgram = lazy(() => import("./pages/features/PartnerProgram"));
const Integrations = lazy(() => import("./pages/features/Integrations"));
const PredictiveAnalytics = lazy(() => import("./pages/features/PredictiveAnalytics"));
const AttributionGraph = lazy(() => import("./pages/features/AttributionGraph"));
const SmartRouting = lazy(() => import("./pages/features/SmartRouting"));
const LinkImmunity = lazy(() => import("./pages/features/LinkImmunity"));
const Workspaces = lazy(() => import("./pages/features/Workspaces"));
const Reporting = lazy(() => import("./pages/features/Reporting"));
const CustomDomains = lazy(() => import("./pages/features/CustomDomains"));
const Automation = lazy(() => import("./pages/features/Automation"));
const AccessibilityFeature = lazy(() => import("./pages/features/Accessibility"));
const EventHalo = lazy(() => import("./pages/features/EventHalo"));
const AIIntelligence = lazy(() => import("./pages/features/AIIntelligence"));
const Sentinel = lazy(() => import("./pages/features/Sentinel"));
const BrickBuilderFeature = lazy(() => import("./pages/features/BrickBuilder"));

// Dev Tools
const PerformanceAudit = lazy(() => import("./pages/dev/PerformanceAudit"));



// PWA Standalone Pages
const ScanPage = lazy(() => import("./pages/Scan"));

// Product Pages
const Products = lazy(() => import("./pages/Products"));
const Product = lazy(() => import("./pages/Product"));
const LinkOrchestration = lazy(() => import("./pages/products/LinkOrchestration"));
const JourneyIntelligence = lazy(() => import("./pages/products/JourneyIntelligence"));
const QRStudio = lazy(() => import("./pages/products/QRStudio"));
const DataPipeline = lazy(() => import("./pages/products/DataPipeline"));

// Solution Pages
const SolutionsHub = lazy(() => import("./pages/Solutions"));
const EnterpriseSolution = lazy(() => import("./pages/solutions/Enterprise"));
const AgenciesSolution = lazy(() => import("./pages/solutions/Agencies"));
const DevelopersSolution = lazy(() => import("./pages/solutions/Developers"));
const Startups = lazy(() => import("./pages/solutions/Startups"));
const ReportingTeam = lazy(() => import("./pages/solutions/ReportingTeam"));
const RevOps = lazy(() => import("./pages/solutions/RevOps"));

// Solution Pages
const Marketers = lazy(() => import("./pages/solutions/Marketers"));
const Sales = lazy(() => import("./pages/solutions/Sales"));
const MarketingOps = lazy(() => import("./pages/solutions/MarketingOps"));
const Developers = lazy(() => import("./pages/solutions/Developers"));
const PartnerManagers = lazy(() => import("./pages/solutions/PartnerManagers"));
const FieldMarketing = lazy(() => import("./pages/solutions/FieldMarketing"));

// Comparison Pages
const CompareHub = lazy(() => import("./pages/Compare"));
const UtmOneVsBitly = lazy(() => import("./pages/compare/UtmOneVsBitly"));
const UtmOneVsRebrandly = lazy(() => import("./pages/compare/UtmOneVsRebrandly"));
const UtmOneVsShortIo = lazy(() => import("./pages/compare/UtmOneVsShortIo"));
const UtmOneVsBlInk = lazy(() => import("./pages/compare/UtmOneVsBlInk"));
const UtmOneVsRewardful = lazy(() => import("./pages/compare/UtmOneVsRewardful"));
const UtmOneVsPartnerstack = lazy(() => import("./pages/compare/UtmOneVsPartnerstack"));
const UtmOneVsFirstpromoter = lazy(() => import("./pages/compare/UtmOneVsFirstpromoter"));
const UtmOneVsTolt = lazy(() => import("./pages/compare/UtmOneVsTolt"));

// Use Case Pages
const UseCasesIndex = lazy(() => import("./pages/use-cases/UseCasesIndex"));
const EcommerceTracking = lazy(() => import("./pages/use-cases/EcommerceTracking"));
const SaasAttribution = lazy(() => import("./pages/use-cases/SaasAttribution"));
const EventMarketing = lazy(() => import("./pages/use-cases/EventMarketing"));
const AgencyClientReporting = lazy(() => import("./pages/use-cases/AgencyClientReporting"));
const InfluencerCampaigns = lazy(() => import("./pages/use-cases/InfluencerCampaigns"));

// Resource Pages
const Resources = lazy(() => import("./pages/Resources"));
const Guides = lazy(() => import("./pages/resources/Guides"));
const UTMGuide = lazy(() => import("./pages/resources/guides/UTMGuide"));
const CleanTrackFramework = lazy(() => import("./pages/resources/guides/CleanTrackFramework"));
const TrackingArchitecture = lazy(() => import("./pages/resources/guides/TrackingArchitecture"));
const SimpleAnalytics = lazy(() => import("./pages/resources/guides/SimpleAnalytics"));
const GrowthAnalytics = lazy(() => import("./pages/resources/guides/GrowthAnalytics"));
const LLMSeo = lazy(() => import("./pages/resources/guides/LLMSeo"));
const BayesianTesting = lazy(() => import("./pages/resources/guides/BayesianTesting"));

// Playbooks
const Playbooks = lazy(() => import("./pages/resources/Playbooks"));
const LLMRanking = lazy(() => import("./pages/resources/playbooks/LLMRanking"));
const UTMGovernancePlaybook = lazy(() => import("./pages/resources/playbooks/UTMGovernancePlaybook"));
const StartupAnalyticsPlaybook = lazy(() => import("./pages/resources/playbooks/StartupAnalyticsPlaybook"));
const EventLedGrowthPlaybook = lazy(() => import("./pages/resources/playbooks/EventLedGrowthPlaybook"));
const NamingConventionPlaybook = lazy(() => import("./pages/resources/playbooks/NamingConventionPlaybook"));
const SalesMarketingAlignmentPlaybook = lazy(() => import("./pages/resources/playbooks/SalesMarketingAlignmentPlaybook"));
const AIMarketingPlaybook = lazy(() => import("./pages/resources/playbooks/AIMarketingPlaybook"));
const B2BArchitectsPlaybook = lazy(() => import("./pages/resources/playbooks/B2BArchitectsPlaybook"));
const HRKatalystReferralPlaybook = lazy(() => import("./pages/resources/playbooks/HRKatalystReferralPlaybook"));

// Templates
const Templates = lazy(() => import("./pages/resources/Templates"));
const UTMTemplate = lazy(() => import("./pages/resources/templates/UTMTemplate"));
const AuditChecklistTemplate = lazy(() => import("./pages/resources/templates/AuditChecklistTemplate"));
const CampaignBriefTemplate = lazy(() => import("./pages/resources/templates/CampaignBriefTemplate"));
const NamingTaxonomyTemplate = lazy(() => import("./pages/resources/templates/NamingTaxonomyTemplate"));

// Tools
const Tools = lazy(() => import("./pages/resources/Tools"));
const DecisionFrameworks = lazy(() => import("./pages/tools/DecisionFrameworks"));
const ToolsHub = lazy(() => import("./pages/tools/ToolsHub"));
const Scanner = lazy(() => import("./pages/tools/Scanner"));
const Casino = lazy(() => import("./pages/tools/Casino"));
const Galaxy = lazy(() => import("./pages/tools/Galaxy"));
const LoaderDemo = lazy(() => import("./pages/LoaderDemo"));
const QRTest = lazy(() => import("./pages/tools/QRTest"));
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
const GTMInsights2026 = lazy(() => import("./pages/resources/reports/GTMInsights2026"));

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
const WaitlistPending = lazy(() => import("./pages/WaitlistPending"));
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
const BookDemo = lazy(() => import("./pages/BookDemo"));
const Partners = lazy(() => import("./pages/Partners"));
const PartnerApply = lazy(() => import("./pages/Partners/Apply"));
const PartnerDashboard = lazy(() => import("./pages/Partners/Dashboard"));
const PartnerTerms = lazy(() => import("./pages/Partners/Terms"));
const ZapierIntegration = lazy(() => import("./pages/integrations/Zapier"));
const SlackIntegration = lazy(() => import("./pages/integrations/Slack"));
const GTMSettings = lazy(() => import("./pages/integrations/GTMSettings"));
const IntegrationsSettings = lazy(() => import("./pages/Settings/Integrations"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ClientWorkspaces = lazy(() => import("./pages/ClientWorkspaces"));
const AnalyticsShare = lazy(() => import("./pages/AnalyticsShare"));

// Legal Pages
const PrivacyLegal = lazy(() => import("./pages/legal/PrivacyLegal"));
const TermsLegal = lazy(() => import("./pages/legal/TermsLegal"));
const PermanenceTerms = lazy(() => import("./pages/legal/PermanenceTerms"));
const DataSecurity = lazy(() => import("./pages/legal/DataSecurity"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const AcceptableUse = lazy(() => import("./pages/legal/AcceptableUse"));
const Subprocessors = lazy(() => import("./pages/legal/Subprocessors"));
const DPA = lazy(() => import("./pages/legal/DPA"));
const SupportPolicy = lazy(() => import("./pages/legal/SupportPolicy"));

// Help Documentation Pages
const HelpIndex = lazy(() => import("./pages/Help/index"));
const HelpGettingStarted = lazy(() => import("./pages/Help/GettingStarted"));
const HelpLinks = lazy(() => import("./pages/Help/Links"));
const HelpUTM = lazy(() => import("./pages/Help/UTM"));
const HelpQRCodes = lazy(() => import("./pages/Help/QRCodes"));
const HelpAnalytics = lazy(() => import("./pages/Help/Analytics"));
const HelpAttribution = lazy(() => import("./pages/Help/Attribution"));
const HelpEvents = lazy(() => import("./pages/Help/Events"));
const HelpAdvanced = lazy(() => import("./pages/Help/Advanced"));
const HelpTeam = lazy(() => import("./pages/Help/Team"));
const HelpIntegrations = lazy(() => import("./pages/Help/Integrations"));
const HelpDomains = lazy(() => import("./pages/Help/Domains"));
const HelpBilling = lazy(() => import("./pages/Help/Billing"));
const HelpSecurity = lazy(() => import("./pages/Help/Security"));
const HelpSentinel = lazy(() => import("./pages/Help/Sentinel"));

// Help Article Pages - Getting Started
const WhatIsUtmOne = lazy(() => import("./pages/Help/articles/WhatIsUtmOne"));
const CreateAccount = lazy(() => import("./pages/Help/articles/CreateAccount"));
const TrackingPixel = lazy(() => import("./pages/Help/articles/TrackingPixel"));
const CreatingAccount = lazy(() => import("./pages/Help/articles/CreatingAccount"));
const FirstLink = lazy(() => import("./pages/Help/articles/FirstLink"));
const DashboardOverview = lazy(() => import("./pages/Help/articles/DashboardOverview"));
const OnboardingChecklist = lazy(() => import("./pages/Help/articles/OnboardingChecklist"));
const AccountSettings = lazy(() => import("./pages/Help/articles/AccountSettings"));
const QuickWins = lazy(() => import("./pages/Help/articles/QuickWins"));

// Help Article Pages - Links
const CreateLink = lazy(() => import("./pages/Help/articles/CreateLink"));
const CreatingLinks = lazy(() => import("./pages/Help/articles/CreatingLinks"));
const CustomSlugs = lazy(() => import("./pages/Help/articles/CustomSlugs"));
const EditingLinks = lazy(() => import("./pages/Help/articles/EditingLinks"));
const LinkStatus = lazy(() => import("./pages/Help/articles/LinkStatus"));
const LinkExpiration = lazy(() => import("./pages/Help/articles/LinkExpiration"));
const ClickLimits = lazy(() => import("./pages/Help/articles/ClickLimits"));
const PasswordProtection = lazy(() => import("./pages/Help/articles/PasswordProtection"));
const BulkCreation = lazy(() => import("./pages/Help/articles/BulkCreation"));
const LinkHealthArticle = lazy(() => import("./pages/Help/articles/LinkHealth"));
const LinkImmunityArticle = lazy(() => import("./pages/Help/articles/LinkImmunity"));
const DuplicatingLinks = lazy(() => import("./pages/Help/articles/DuplicatingLinks"));
const LinkPreview = lazy(() => import("./pages/Help/articles/LinkPreview"));

// Help Article Pages - UTM
const WhatAreUTMs = lazy(() => import("./pages/Help/articles/WhatAreUTMs"));
const FiveFields = lazy(() => import("./pages/Help/articles/FiveFields"));
const NamingConventions = lazy(() => import("./pages/Help/articles/NamingConventions"));
const CommonMistakes = lazy(() => import("./pages/Help/articles/CommonMistakes"));
const UTMTemplates = lazy(() => import("./pages/Help/articles/UTMTemplates"));
const CleanTrackFrameworkArticle = lazy(() => import("./pages/Help/articles/CleanTrackFramework"));
const UTMValidation = lazy(() => import("./pages/Help/articles/UTMValidation"));
const UTMGovernance = lazy(() => import("./pages/Help/articles/UTMGovernance"));
const UTMAuditTools = lazy(() => import("./pages/Help/articles/UTMAuditTools"));
const AIUTMSuggestions = lazy(() => import("./pages/Help/articles/AIUTMSuggestions"));

// Help Article Pages - QR
const QRCodeBasics = lazy(() => import("./pages/Help/articles/QRCodeBasics"));
const QRCustomization = lazy(() => import("./pages/Help/articles/QRCustomization"));
const QRLogos = lazy(() => import("./pages/Help/articles/QRLogos"));
const QRExport = lazy(() => import("./pages/Help/articles/QRExport"));
const QRReliability = lazy(() => import("./pages/Help/articles/QRReliability"));
const AIStampStudio = lazy(() => import("./pages/Help/articles/AIStampStudio"));
const BulkQR = lazy(() => import("./pages/Help/articles/BulkQR"));
const QRPrintSpecs = lazy(() => import("./pages/Help/articles/QRPrintSpecs"));

// Help Article Pages - Analytics
const AnalyticsOverview = lazy(() => import("./pages/Help/articles/AnalyticsOverview"));
const ClickTracking = lazy(() => import("./pages/Help/articles/ClickTracking"));
const DeviceAnalytics = lazy(() => import("./pages/Help/articles/DeviceAnalytics"));
const GeographicData = lazy(() => import("./pages/Help/articles/GeographicData"));
const ReferrerTracking = lazy(() => import("./pages/Help/articles/ReferrerTracking"));
const RealTimeAnalytics = lazy(() => import("./pages/Help/articles/RealTimeAnalytics"));
const ExportingData = lazy(() => import("./pages/Help/articles/ExportingData"));
const AIInsights = lazy(() => import("./pages/Help/articles/AIInsights"));
const AnomalyDetection = lazy(() => import("./pages/Help/articles/AnomalyDetection"));

// Help Article Pages - Attribution
const AttributionModels = lazy(() => import("./pages/Help/articles/AttributionModels"));
const AttributionOverview = lazy(() => import("./pages/Help/articles/AttributionOverview"));
const TrackingPixelArticle = lazy(() => import("./pages/Help/articles/TrackingPixel"));
const ConversionTracking = lazy(() => import("./pages/Help/articles/ConversionTracking"));
const CustomerJourneys = lazy(() => import("./pages/Help/articles/CustomerJourneys"));
const IdentityGraph = lazy(() => import("./pages/Help/articles/IdentityGraph"));
const RevenueAttributionArticle = lazy(() => import("./pages/Help/articles/RevenueAttribution"));
const LiftAnalysis = lazy(() => import("./pages/Help/articles/LiftAnalysis"));

// Help Article Pages - Events
const EventHaloArticle = lazy(() => import("./pages/Help/articles/EventHalo"));
const EventHaloOverview = lazy(() => import("./pages/Help/articles/EventHaloOverview"));
const CreatingEvents = lazy(() => import("./pages/Help/articles/CreatingEvents"));
const OneTapScanner = lazy(() => import("./pages/Help/articles/OneTapScanner"));
const BadgeImport = lazy(() => import("./pages/Help/articles/BadgeImport"));
const EventROI = lazy(() => import("./pages/Help/articles/EventROI"));

// Help Article Pages - Event Bridge
const EventBridgeOverviewArticle = lazy(() => import("./pages/Help/articles/EventBridgeOverview"));
const EventBridgeSetupArticle = lazy(() => import("./pages/Help/articles/EventBridgeSetup"));
const EventBridgeRoutingArticle = lazy(() => import("./pages/Help/articles/EventBridgeRouting"));
const EventBridgeCRMArticle = lazy(() => import("./pages/Help/articles/EventBridgeCRM"));

// Help Article Pages - Advanced
const GeoTargetingArticle = lazy(() => import("./pages/Help/articles/GeoTargeting"));
const DeviceTargeting = lazy(() => import("./pages/Help/articles/DeviceTargeting"));
const LinkRotation = lazy(() => import("./pages/Help/articles/LinkRotation"));
const SmartRoutingArticle = lazy(() => import("./pages/Help/articles/SmartRouting"));

// Help Article Pages - Team
const TeamRoles = lazy(() => import("./pages/Help/articles/TeamRoles"));
const InvitingMembers = lazy(() => import("./pages/Help/articles/InvitingMembers"));
const RolesPermissions = lazy(() => import("./pages/Help/articles/RolesPermissions"));
const WorkspaceSettings = lazy(() => import("./pages/Help/articles/WorkspaceSettings"));

// Help Article Pages - Integrations
const ChromeExtension = lazy(() => import("./pages/Help/articles/ChromeExtension"));
const ApiAuthentication = lazy(() => import("./pages/Help/articles/ApiAuthentication"));
const ApiEndpoints = lazy(() => import("./pages/Help/articles/ApiEndpoints"));
const Webhooks = lazy(() => import("./pages/Help/articles/Webhooks"));
const GA4Integration = lazy(() => import("./pages/Help/articles/GA4Integration"));
const HubSpotIntegration = lazy(() => import("./pages/Help/articles/HubSpotIntegration"));
const SalesforceIntegration = lazy(() => import("./pages/Help/articles/SalesforceIntegration"));
const ZapierIntegrationArticle = lazy(() => import("./pages/Help/articles/ZapierIntegration"));
const SlackIntegrationArticle = lazy(() => import("./pages/Help/articles/SlackIntegration"));

// Help Article Pages - Domains
const CustomDomainSetup = lazy(() => import("./pages/Help/articles/CustomDomainSetup"));
const AddingDomains = lazy(() => import("./pages/Help/articles/AddingDomains"));
const DNSSetup = lazy(() => import("./pages/Help/articles/DNSSetup"));

// Help Article Pages - Billing
const ManagingSubscription = lazy(() => import("./pages/Help/articles/ManagingSubscription"));
const UsageLimits = lazy(() => import("./pages/Help/articles/UsageLimits"));

// Help Article Pages - Security
const TwoFactorAuth = lazy(() => import("./pages/Help/articles/TwoFactorAuth"));
const SecurityKeys = lazy(() => import("./pages/Help/articles/SecurityKeys"));
const AuditLogs = lazy(() => import("./pages/Help/articles/AuditLogs"));
const DataPrivacy = lazy(() => import("./pages/Help/articles/DataPrivacy"));

// Help Article Pages - Other
const LeadEnrichment = lazy(() => import("./pages/Help/articles/LeadEnrichment"));

const NotFound = lazy(() => import("./pages/NotFound"));

// PHASE 14: Use centralized queryClient from lib/queryConfig.ts
const queryClient = centralQueryClient;

const PublicLayout = () => (
  <Suspense fallback={<MarketingSkeleton />}>
    <Outlet />
  </Suspense>
);

const AppRoutes = () => {
  const routeTree = (
    // Deferred providers - only load when needed
    <ModalProvider>
      <Toaster />
      <SkipToContent />
      <ScrollToTop />
      <NetworkStatus />
      <AppWithHelp>
        <Routes>
          <Route element={<PublicLayout />}>
                {/* PHASE 17: Lazy load Index page */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/mc" element={<AdminAuth />} />
                <Route path="/auth/callback" element={<Suspense fallback={<DashboardSkeleton />}><AuthCallback /></Suspense>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/waitlist-pending" element={<Suspense fallback={<DashboardSkeleton />}><WaitlistPending /></Suspense>} />
                <Route path="/waitlist-locked" element={<Suspense fallback={<DashboardSkeleton />}><WaitlistLocked /></Suspense>} />
                <Route path="/link-expired" element={<LinkExpired />} />

                {/* Public Tools */}
                <Route path="/tools/qr" element={<PublicQRGenerator />} />
                <Route path="/tools/shorten" element={<PublicURLShortener />} />
                <Route path="/tools/utm-builder" element={<PublicUTMBuilder />} />
                <Route path="/tools/utm-builder-linkedin" element={<UTMBuilderLinkedIn />} />
                <Route path="/tools/utm-builder-facebook" element={<UTMBuilderFacebook />} />
                <Route path="/tools/utm-builder-google-ads" element={<UTMBuilderGoogleAds />} />
                <Route path="/tools/utm-builder-tiktok" element={<UTMBuilderTikTok />} />
                <Route path="/tools/utm-builder-email" element={<UTMBuilderEmail />} />
                <Route path="/tools/link-health-checker" element={<PublicLinkHealthChecker />} />

                {/* Viral Tools Hub */}
                <Route path="/tools" element={<ToolsHub />} />
                <Route path="/tools/scanner" element={<Scanner />} />
                <Route path="/tools/casino" element={<Casino />} />
                <Route path="/tools/galaxy" element={<Galaxy />} />
                <Route path="/tools/qr-test" element={<QRTest />} />
                <Route path="/loader-demo" element={<LoaderDemo />} />

                {/* Trust Cluster */}
                <Route path="/trust" element={<TrustPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/roadmap" element={<PublicRoadmap />} />
                <Route path="/feedback" element={<PublicBugTracker />} />

                {/* Invitation Acceptance */}
                <Route
                  path="/accept-invite"
                  element={(
                    <Suspense fallback={<DashboardSkeleton />}>
                      <AcceptInvite />
                    </Suspense>
                  )}
               />

                <Suspense fallback={<DashboardSkeleton />}>
                  <PrivateRoutes />
                </Suspense>

                <Route
                  path="/password-protected"
                  element={(
                    <Suspense fallback={<DashboardSkeleton />}>
                      <PasswordProtected />
                    </Suspense>
                  )}
               />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/permanence" element={<Permanence />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/lifetime-deal" element={<LifetimeDeal />} />
                <Route path="/about" element={<About />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/support" element={<Support />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/integration" element={<Navigate to="/features/integrations" replace />} />
                <Route path="/integrations" element={<Navigate to="/features/integrations" replace />} />
                <Route path="/docs/api" element={<APIDocumentation />} />
                <Route path="/docs/playground" element={<APIPlayground />} />
                <Route path="/docs/sdks" element={<SDKs />} />
                <Route path="/docs/pixel-installation" element={<PixelInstallation />} />
                <Route path="/docs/revenue-attribution" element={<RevenueAttribution />} />
                <Route path="/docs/crm-integrations" element={<CRMIntegrations />} />
                <Route path="/docs/chrome-extension" element={<ChromeExtensionDocs />} />
                <Route path="/docs/geo-targeting" element={<GeoTargetingDocs />} />
                <Route path="/docs/identity-graph" element={<IdentityGraphDocs />} />
                <Route path="/docs/smart-insights" element={<SmartInsightsDocs />} />
                <Route path="/docs/troubleshooting" element={<TroubleshootingDocs />} />
              
              {/* Feature Pages */}
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/features/short-links" element={<ShortLinks />} />
              <Route path="/features/utm-builder" element={<UTMBuilder />} />
              <Route path="/features/qr-generator" element={<QRGenerator />} />
              <Route path="/features/customer-journey" element={<CustomerJourney />} />
              <Route path="/features/identity-resolution" element={<IdentityResolution />} />
              <Route path="/features/bayesian-attribution" element={<BayesianAttribution />} />
              <Route path="/features/journey-valuation" element={<JourneyValuation />} />
              <Route path="/features/analytics" element={<AnalyticsFeature />} />
              <Route path="/features/governance" element={<EnterpriseControl />} />
              <Route path="/features/integrations" element={<Integrations />} />
              <Route path="/features/clean-track" element={<CleanTrack />} />
              <Route path="/features/accessibility" element={<AccessibilityFeature />} />
              <Route path="/features/partner-program" element={<PartnerProgram />} />
              <Route path="/features/predictive-analytics" element={<PredictiveAnalytics />} />
              <Route path="/features/attribution-graph" element={<AttributionGraph />} />
              <Route path="/features/smart-routing" element={<SmartRouting />} />
              <Route path="/features/link-immunity" element={<LinkImmunity />} />
              <Route path="/features/workspaces" element={<Workspaces />} />
              <Route path="/features/reporting" element={<Reporting />} />
              <Route path="/features/custom-domains" element={<CustomDomains />} />
              <Route path="/features/automation" element={<Automation />} />
              <Route path="/features/event-halo" element={<EventHalo />} />
              <Route path="/features/one-tap" element={<Navigate to="/features/event-halo?tab=scanner" replace />} />
              <Route path="/intelligence" element={<AIIntelligence />} />
              <Route path="/features/sentinel" element={<Sentinel />} />
              <Route path="/features/brick-builder" element={<BrickBuilderFeature />} />
              
{/* PWA Standalone Scanner */}
              <Route path="/scan" element={<ScanPage />} />
              
              {/* Easter Egg */}
              <Route path="/surprise" element={<Surprise />} />
              
              {/* Product Pages */}
              <Route path="/product" element={<Product />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/link-orchestration" element={<LinkOrchestration />} />
              <Route path="/products/journey-intelligence" element={<JourneyIntelligence />} />
              <Route path="/products/qr-studio" element={<QRStudio />} />
              <Route path="/products/data-pipeline" element={<DataPipeline />} />
              
              {/* Solution Pages */}
              <Route path="/solutions" element={<SolutionsHub />} />
              <Route path="/solutions/enterprise" element={<EnterpriseSolution />} />
              <Route path="/solutions/agencies" element={<AgenciesSolution />} />
              <Route path="/solutions/startups" element={<Startups />} />
              <Route path="/solutions/marketers" element={<Marketers />} />
              <Route path="/solutions/sales" element={<Sales />} />
              <Route path="/solutions/marketing-ops" element={<MarketingOps />} />
              <Route path="/solutions/developers" element={<DevelopersSolution />} />
              <Route path="/solutions/revops" element={<RevOps />} />
              <Route path="/solutions/reporting-team" element={<ReportingTeam />} />
              <Route path="/solutions/partner-managers" element={<PartnerManagers />} />
              <Route path="/solutions/field-marketing" element={<FieldMarketing />} />
              
              {/* Comparison Pages */}
              <Route path="/compare" element={<CompareHub />} />
              <Route path="/compare/bitly" element={<UtmOneVsBitly />} />
              <Route path="/compare/rebrandly" element={<UtmOneVsRebrandly />} />
              <Route path="/compare/short-io" element={<UtmOneVsShortIo />} />
              <Route path="/compare/bl-ink" element={<UtmOneVsBlInk />} />
              <Route path="/compare/rewardful" element={<UtmOneVsRewardful />} />
              <Route path="/compare/partnerstack" element={<UtmOneVsPartnerstack />} />
              <Route path="/compare/firstpromoter" element={<UtmOneVsFirstpromoter />} />
              <Route path="/compare/tolt" element={<UtmOneVsTolt />} />
              
              {/* Use Case Pages */}
              <Route path="/use-cases" element={<UseCasesIndex />} />
              <Route path="/use-cases/ecommerce-tracking" element={<EcommerceTracking />} />
              <Route path="/use-cases/saas-attribution" element={<SaasAttribution />} />
              <Route path="/use-cases/event-marketing" element={<EventMarketing />} />
              <Route path="/use-cases/agency-client-reporting" element={<AgencyClientReporting />} />
              <Route path="/use-cases/influencer-campaigns" element={<InfluencerCampaigns />} />
              
              {/* Help Documentation Pages */}
              <Route path="/help" element={<HelpIndex />} />
              <Route path="/help/getting-started" element={<HelpGettingStarted />} />
              <Route path="/help/links" element={<HelpLinks />} />
              <Route path="/help/utm" element={<HelpUTM />} />
              <Route path="/help/qr" element={<HelpQRCodes />} />
              <Route path="/help/analytics" element={<HelpAnalytics />} />
              <Route path="/help/attribution" element={<HelpAttribution />} />
              <Route path="/help/events" element={<HelpEvents />} />
              <Route path="/help/advanced" element={<HelpAdvanced />} />
              <Route path="/help/team" element={<HelpTeam />} />
              <Route path="/help/integrations" element={<HelpIntegrations />} />
              <Route path="/help/domains" element={<HelpDomains />} />
              <Route path="/help/billing" element={<HelpBilling />} />
              <Route path="/help/security" element={<HelpSecurity />} />
              <Route path="/help/sentinel" element={<HelpSentinel />} />
              
              {/* Help Article Pages - Getting Started */}
              <Route path="/help/articles/what-is-utm-one" element={<WhatIsUtmOne />} />
              <Route path="/help/articles/create-account" element={<CreateAccount />} />
              <Route path="/help/articles/creating-account" element={<CreatingAccount />} />
              <Route path="/help/articles/first-link" element={<FirstLink />} />
              <Route path="/help/articles/dashboard-overview" element={<DashboardOverview />} />
              <Route path="/help/articles/onboarding-checklist" element={<OnboardingChecklist />} />
              <Route path="/help/articles/account-settings" element={<AccountSettings />} />
              <Route path="/help/articles/quick-wins" element={<QuickWins />} />
              
              {/* Help Article Pages - Links */}
              <Route path="/help/articles/create-link" element={<CreateLink />} />
              <Route path="/help/articles/creating-links" element={<CreatingLinks />} />
              <Route path="/help/articles/custom-slugs" element={<CustomSlugs />} />
              <Route path="/help/articles/editing-links" element={<EditingLinks />} />
              <Route path="/help/articles/link-status" element={<LinkStatus />} />
              <Route path="/help/articles/link-expiration" element={<LinkExpiration />} />
              <Route path="/help/articles/click-limits" element={<ClickLimits />} />
              <Route path="/help/articles/password-protection" element={<PasswordProtection />} />
              <Route path="/help/articles/bulk-creation" element={<BulkCreation />} />
              <Route path="/help/articles/link-health" element={<LinkHealthArticle />} />
              <Route path="/help/articles/link-immunity" element={<LinkImmunityArticle />} />
              <Route path="/help/articles/duplicating-links" element={<DuplicatingLinks />} />
              <Route path="/help/articles/link-preview" element={<LinkPreview />} />
              
              {/* Help Article Pages - UTM */}
              <Route path="/help/articles/what-are-utms" element={<WhatAreUTMs />} />
              <Route path="/help/articles/five-fields" element={<FiveFields />} />
              <Route path="/help/articles/naming-conventions" element={<NamingConventions />} />
              <Route path="/help/articles/common-mistakes" element={<CommonMistakes />} />
              <Route path="/help/articles/utm-templates" element={<UTMTemplates />} />
              <Route path="/help/articles/clean-track-framework" element={<CleanTrackFrameworkArticle />} />
              <Route path="/help/articles/utm-validation" element={<UTMValidation />} />
              <Route path="/help/articles/utm-governance" element={<UTMGovernance />} />
              <Route path="/help/articles/utm-audit-tools" element={<UTMAuditTools />} />
              <Route path="/help/articles/ai-utm-suggestions" element={<AIUTMSuggestions />} />
              
              {/* Help Article Pages - QR */}
              <Route path="/help/articles/qr-basics" element={<QRCodeBasics />} />
              <Route path="/help/articles/qr-customization" element={<QRCustomization />} />
              <Route path="/help/articles/qr-logos" element={<QRLogos />} />
              <Route path="/help/articles/qr-export" element={<QRExport />} />
              <Route path="/help/articles/qr-reliability" element={<QRReliability />} />
              <Route path="/help/articles/ai-stamp-studio" element={<AIStampStudio />} />
              <Route path="/help/articles/bulk-qr" element={<BulkQR />} />
              <Route path="/help/articles/qr-print-specs" element={<QRPrintSpecs />} />
              
              {/* Help Article Pages - Analytics */}
              <Route path="/help/articles/analytics-overview" element={<AnalyticsOverview />} />
              <Route path="/help/articles/click-tracking" element={<ClickTracking />} />
              <Route path="/help/articles/device-analytics" element={<DeviceAnalytics />} />
              <Route path="/help/articles/geographic-data" element={<GeographicData />} />
              <Route path="/help/articles/referrer-tracking" element={<ReferrerTracking />} />
              <Route path="/help/articles/real-time-analytics" element={<RealTimeAnalytics />} />
              <Route path="/help/articles/exporting-data" element={<ExportingData />} />
              <Route path="/help/articles/ai-insights" element={<AIInsights />} />
              <Route path="/help/articles/anomaly-detection" element={<AnomalyDetection />} />
              
              {/* Help Article Pages - Attribution */}
              <Route path="/help/articles/attribution-overview" element={<AttributionOverview />} />
              <Route path="/help/articles/attribution-models" element={<AttributionModels />} />
              <Route path="/help/articles/tracking-pixel" element={<TrackingPixelArticle />} />
              <Route path="/help/articles/conversion-tracking" element={<ConversionTracking />} />
              <Route path="/help/articles/customer-journeys" element={<CustomerJourneys />} />
              <Route path="/help/articles/identity-graph" element={<IdentityGraph />} />
              <Route path="/help/articles/revenue-attribution" element={<RevenueAttributionArticle />} />
              <Route path="/help/articles/lift-analysis" element={<LiftAnalysis />} />
              
              {/* Help Article Pages - Events */}
              <Route path="/help/articles/event-halo" element={<EventHaloArticle />} />
              <Route path="/help/articles/event-halo-overview" element={<EventHaloOverview />} />
              <Route path="/help/articles/creating-events" element={<CreatingEvents />} />
              <Route path="/help/articles/one-tap-scanner" element={<OneTapScanner />} />
              <Route path="/help/articles/badge-import" element={<BadgeImport />} />
              <Route path="/help/articles/event-roi" element={<EventROI />} />
              
              {/* Help Article Pages - Event Bridge */}
              <Route path="/help/articles/event-bridge-overview" element={<EventBridgeOverviewArticle />} />
              <Route path="/help/articles/event-bridge-setup" element={<EventBridgeSetupArticle />} />
              <Route path="/help/articles/event-bridge-routing" element={<EventBridgeRoutingArticle />} />
              <Route path="/help/articles/event-bridge-crm" element={<EventBridgeCRMArticle />} />
              
              {/* Help Article Pages - Advanced */}
              <Route path="/help/articles/geo-targeting" element={<GeoTargetingArticle />} />
              <Route path="/help/articles/device-targeting" element={<DeviceTargeting />} />
              <Route path="/help/articles/link-rotation" element={<LinkRotation />} />
              <Route path="/help/articles/smart-routing" element={<SmartRoutingArticle />} />
              
              {/* Help Article Pages - Team */}
              <Route path="/help/articles/team-roles" element={<TeamRoles />} />
              <Route path="/help/articles/inviting-members" element={<InvitingMembers />} />
              <Route path="/help/articles/roles-permissions" element={<RolesPermissions />} />
              <Route path="/help/articles/workspace-settings" element={<WorkspaceSettings />} />
              
              {/* Help Article Pages - Integrations */}
              <Route path="/help/articles/chrome-extension" element={<ChromeExtension />} />
              <Route path="/help/articles/api-authentication" element={<ApiAuthentication />} />
              <Route path="/help/articles/api-endpoints" element={<ApiEndpoints />} />
              <Route path="/help/articles/webhooks" element={<Webhooks />} />
              <Route path="/help/articles/ga4-integration" element={<GA4Integration />} />
              <Route path="/help/articles/hubspot-integration" element={<HubSpotIntegration />} />
              <Route path="/help/articles/salesforce-integration" element={<SalesforceIntegration />} />
              <Route path="/help/articles/zapier-integration" element={<ZapierIntegrationArticle />} />
              <Route path="/help/articles/slack-integration" element={<SlackIntegrationArticle />} />
              
              {/* Help Article Pages - Domains */}
              <Route path="/help/articles/custom-domain-setup" element={<CustomDomainSetup />} />
              <Route path="/help/articles/adding-domains" element={<AddingDomains />} />
              <Route path="/help/articles/dns-setup" element={<DNSSetup />} />
              
              {/* Help Article Pages - Billing */}
              <Route path="/help/articles/managing-subscription" element={<ManagingSubscription />} />
              <Route path="/help/articles/usage-limits" element={<UsageLimits />} />
              
              {/* Help Article Pages - Security */}
              <Route path="/help/articles/two-factor-auth" element={<TwoFactorAuth />} />
              <Route path="/help/articles/security-keys" element={<SecurityKeys />} />
              <Route path="/help/articles/audit-logs" element={<AuditLogs />} />
              <Route path="/help/articles/data-privacy" element={<DataPrivacy />} />
              
              {/* Help Article Pages - Other */}
              <Route path="/help/articles/lead-enrichment" element={<LeadEnrichment />} />
              
              {/* Legacy help routes - redirects for backward compatibility */}
              <Route path="/help/getting-started/what-is-utm-one" element={<Navigate to="/help/articles/what-is-utm-one" replace />} />
              <Route path="/help/getting-started/create-account" element={<Navigate to="/help/articles/create-account" replace />} />
              <Route path="/help/getting-started/tracking-pixel" element={<Navigate to="/help/articles/tracking-pixel" replace />} />
              <Route path="/help/links/create-link" element={<Navigate to="/help/articles/create-link" replace />} />
              <Route path="/help/utm/what-are-utms" element={<Navigate to="/help/articles/what-are-utms" replace />} />
              <Route path="/help/qr/basics" element={<Navigate to="/help/articles/qr-basics" replace />} />
              <Route path="/help/attribution/models" element={<Navigate to="/help/articles/attribution-models" replace />} />
              <Route path="/help/events/event-halo" element={<Navigate to="/help/articles/event-halo" replace />} />
              <Route path="/help/team/roles" element={<Navigate to="/help/articles/team-roles" replace />} />
              <Route path="/help/domains/dns-setup" element={<Navigate to="/help/articles/dns-setup" replace />} />

              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/guides" element={<Guides />} />
              <Route path="/resources/guides/utm-guide" element={<UTMGuide />} />
              <Route path="/resources/guides/clean-track-framework" element={<CleanTrackFramework />} />
              <Route path="/resources/guides/tracking-architecture" element={<TrackingArchitecture />} />
              <Route path="/resources/guides/simple-analytics" element={<SimpleAnalytics />} />
              <Route path="/resources/guides/growth-analytics" element={<GrowthAnalytics />} />
              <Route path="/resources/guides/llm-seo" element={<LLMSeo />} />
              <Route path="/resources/guides/bayesian-testing" element={<BayesianTesting />} />
              
              {/* Playbook Routes */}
              <Route path="/resources/playbooks/llm-ranking" element={<LLMRanking />} />
              <Route path="/resources/playbooks/utm-governance-playbook" element={<UTMGovernancePlaybook />} />
              <Route path="/resources/playbooks/startup-analytics-playbook" element={<StartupAnalyticsPlaybook />} />
              <Route path="/resources/playbooks/event-led-growth-playbook" element={<EventLedGrowthPlaybook />} />
              <Route path="/resources/playbooks/naming-convention-playbook" element={<NamingConventionPlaybook />} />
              <Route path="/resources/playbooks/sales-marketing-alignment" element={<SalesMarketingAlignmentPlaybook />} />
              <Route path="/resources/playbooks/ai-marketing" element={<AIMarketingPlaybook />} />
              <Route path="/resources/playbooks/b2b-architects-2026" element={<B2BArchitectsPlaybook />} />
              <Route path="/resources/playbooks/hr-katalyst-referral" element={<HRKatalystReferralPlaybook />} />
              <Route path="/resources/playbooks" element={<Playbooks />} />
              
              {/* Template Routes */}
              <Route path="/resources/templates" element={<Templates />} />
              <Route path="/resources/templates/utm-template" element={<UTMTemplate />} />
              <Route path="/resources/templates/audit-checklist-template" element={<AuditChecklistTemplate />} />
              <Route path="/resources/templates/campaign-brief-template" element={<CampaignBriefTemplate />} />
              <Route path="/resources/templates/naming-taxonomy-template" element={<NamingTaxonomyTemplate />} />
              
              {/* Tools Routes */}
              <Route path="/tools/decision-frameworks" element={<DecisionFrameworks />} />
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
              <Route
                path="/resources/reports/gtm-insights-2026"
                element={
                  <ComingSoonPage
                    title="State of GTM Insights 2026"
                    description="We're putting the finishing touches on this comprehensive report covering 15+ countries, 50+ roles, and 10 interactive tools. Join the waitlist to be notified when it launches."
                 />
                }
             />
              <Route
                path="/resources/reports/salary-benchmark-2025"
                element={
                  <ComingSoonPage
                    title="2025 Global Salary Benchmark Report"
                    description="We're putting the finishing touches on this comprehensive report. Join the waitlist to be notified when it launches."
                 />
                }
             />
              
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
              <Route path="/solutions/partner-managers" element={<PartnerManagers />} />
              <Route path="/early-access" element={<EarlyAccess />} />
              <Route path="/waitlist-status" element={<WaitlistStatus />} />
              <Route path="/invite/:code" element={<Invite />} />
              <Route path="/claim-access" element={<ClaimAccess />} />
              <Route path="/book-demo" element={<BookDemo />} />
              <Route path="/contact" element={<BookDemo />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/partners/apply" element={<PartnerApply />} />
              <Route path="/partners/terms" element={<PartnerTerms />} />
              <Route path="/integrations/zapier" element={<ZapierIntegration />} />
              <Route path="/integrations/slack" element={<SlackIntegration />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              
              {/* Legal Pages */}
              <Route path="/legal/privacy" element={<PrivacyLegal />} />
              <Route path="/legal/terms" element={<TermsLegal />} />
              <Route path="/legal/permanence-terms" element={<PermanenceTerms />} />
              <Route path="/legal/data-security" element={<DataSecurity />} />
              <Route path="/legal/cookies" element={<CookiePolicy />} />
              <Route path="/legal/acceptable-use" element={<AcceptableUse />} />
              <Route path="/legal/subprocessors" element={<Subprocessors />} />
              <Route path="/legal/dpa" element={<DPA />} />
              <Route path="/legal/support" element={<SupportPolicy />} />
              <Route path="/analytics/share/:token" element={<AnalyticsShare />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppWithHelp>
          {/* PHASE 14: Lazy-loaded global modals */}
          <Suspense fallback={null}>
            <GlobalEarlyAccessModal />
          </Suspense>
          <InstallPrompt />
          <UpdateNotification />
        </ModalProvider>
  );

  return routeTree;
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <NotificationProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </QueryClientProvider>
        </TooltipProvider>
      </NotificationProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
