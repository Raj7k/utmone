import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { AdminSimulationProvider } from "./contexts/AdminSimulationContext";
import { ModalProvider } from "./contexts/ModalContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DashboardSkeleton } from "./components/SkeletonLoader";
import { SkipToContent } from "./components/SkipToContent";
import { NetworkStatus } from "./components/ui/network-status";
import { AppWithHelp } from "./components/AppWithHelp";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AnimatedRoutes } from "@/components/transitions/AnimatedRoutes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PerformanceProvider } from "@/components/performance/PerformanceProvider";
import { LinkIdRedirect } from "./components/redirects/LinkIdRedirect";
import { lazyWithRetry } from "./utils/lazyWithRetry";

// Critical pages - not lazy loaded for fast initial load
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import ComingSoonPage from "./pages/ComingSoon";
import LinkExpired from "./pages/LinkExpired";
import Blog from "./pages/Blog";
import Surprise from "./pages/Surprise";

// Auth callback gatekeeper and waitlist pages
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const WaitlistLocked = lazy(() => import("./pages/WaitlistLocked"));

// Lazy-loaded pages for code splitting
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const DashboardLinks = lazy(() => import("./pages/dashboard/Links"));
const DashboardAnalytics = lazy(() => import("./pages/dashboard/Analytics"));
const DashboardQRCodes = lazy(() => import("./pages/dashboard/QRCodes"));
const Targeting = lazy(() => import("./pages/dashboard/Targeting"));
const BulkCreate = lazy(() => import("./pages/dashboard/BulkCreate"));
const CacheMonitoring = lazy(() => import("./pages/dashboard/CacheMonitoring"));
const AnalyticsPerformance = lazy(() => import("./pages/dashboard/AnalyticsPerformance"));
const LinkHealth = lazy(() => import("./pages/dashboard/LinkHealth"));
const Experiments = lazy(() => import("./pages/dashboard/Experiments"));
const Attribution = lazy(() => import("./pages/dashboard/Attribution"));
const RobustAttribution = lazy(() => import("./pages/RobustAttribution"));
const DashboardSales = lazy(() => import("./pages/dashboard/Sales"));
const DashboardEvents = lazy(() => import("./pages/dashboard/Events"));
const Intelligence = lazy(() => import("./pages/dashboard/Intelligence"));
// Critical layouts - static imports to prevent module loading failures
import { DashboardLayout } from "./components/layout/DashboardLayout";
const Links = lazy(() => import("./pages/Links"));
const LinkDetail = lazy(() => import("./pages/LinkDetail"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));

const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const Backup = lazy(() => import("./pages/Settings/Backup"));
const DeveloperSettings = lazy(() => import("./pages/DeveloperSettings"));
const ApprovalQueue = lazy(() => import("./pages/ApprovalQueue"));
const PasswordProtected = lazy(() => import("./pages/PasswordProtected"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Permanence = lazy(() => import("./pages/Permanence"));
const Pricing = lazy(() => import("./pages/Pricing"));
const LifetimeDeal = lazy(() => import("./pages/LifetimeDeal"));
const About = lazy(() => import("./pages/AboutNew"));
const Docs = lazy(() => import("./pages/Docs"));
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
const OneLinkValidator = lazy(() => import("./pages/dashboard/OneLinkValidator"));
const URLShortenerPro = lazy(() => import("./pages/dashboard/URLShortenerPro"));
const Campaigns = lazy(() => import("./pages/dashboard/Campaigns"));
const CampaignDetails = lazy(() => import("./pages/dashboard/CampaignDetails"));

// Admin pages - AdminLayout is static, pages use retry wrapper for resilience
import { AdminLayout } from "./components/admin/AdminLayout";
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/Dashboard"));
const WaitlistManagement = lazyWithRetry(() => import("./pages/admin/WaitlistManagement"));
const UserManagement = lazyWithRetry(() => import("./pages/admin/UserManagement"));
const LandingManagement = lazyWithRetry(() => import("./pages/admin/LandingManagement"));
const ProductAnalytics = lazyWithRetry(() => import("./pages/admin/ProductAnalytics"));
const SystemMonitoring = lazyWithRetry(() => import("./pages/admin/SystemMonitoring"));
const FeatureFlags = lazyWithRetry(() => import("./pages/admin/FeatureFlags"));
const FlagDetails = lazyWithRetry(() => import("./pages/admin/FlagDetails"));
const PartnersManagement = lazyWithRetry(() => import("./pages/admin/PartnersManagement"));
const SystemTests = lazyWithRetry(() => import("./pages/admin/SystemTests"));
const MFAVerify = lazyWithRetry(() => import("./pages/admin/MFAVerify"));
const AdminSecurity = lazyWithRetry(() => import("./pages/admin/AdminSecurity"));
const SubscriptionManagement = lazyWithRetry(() => import("./pages/admin/SubscriptionManagement"));
const FeedbackManagement = lazyWithRetry(() => import("./pages/admin/FeedbackManagement"));
const RoadmapManagement = lazyWithRetry(() => import("./pages/admin/RoadmapManagement"));
const TotpVerification = lazy(() => import("./pages/auth/TotpVerification"));

// Feature Pages
const Features = lazy(() => import("./pages/Features"));
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
    <ThemeProvider>
      <PerformanceProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
              <WorkspaceProvider>
                <AdminSimulationProvider>
                  <ModalProvider>
                    <SkipToContent />
                  <ScrollToTop />
                  <NetworkStatus />
                  <AppWithHelp>
                  <AnimatedRoutes>
                    <Routes>
              {/* Critical pages - not lazy loaded */}
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
               <Route path="/tools/qr" element={<Suspense fallback={<DashboardSkeleton />}><PublicQRGenerator /></Suspense>} />
               <Route path="/tools/shorten" element={<Suspense fallback={<DashboardSkeleton />}><PublicURLShortener /></Suspense>} />
               <Route path="/tools/utm-builder" element={<Suspense fallback={<DashboardSkeleton />}><PublicUTMBuilder /></Suspense>} />
               <Route path="/tools/utm-builder-linkedin" element={<Suspense fallback={<DashboardSkeleton />}><UTMBuilderLinkedIn /></Suspense>} />
               <Route path="/tools/utm-builder-facebook" element={<Suspense fallback={<DashboardSkeleton />}><UTMBuilderFacebook /></Suspense>} />
               <Route path="/tools/utm-builder-google-ads" element={<Suspense fallback={<DashboardSkeleton />}><UTMBuilderGoogleAds /></Suspense>} />
               <Route path="/tools/utm-builder-tiktok" element={<Suspense fallback={<DashboardSkeleton />}><UTMBuilderTikTok /></Suspense>} />
               <Route path="/tools/utm-builder-email" element={<Suspense fallback={<DashboardSkeleton />}><UTMBuilderEmail /></Suspense>} />
               <Route path="/tools/link-health-checker" element={<Suspense fallback={<DashboardSkeleton />}><PublicLinkHealthChecker /></Suspense>} />
               
               {/* Viral Tools Hub */}
               <Route path="/tools" element={<Suspense fallback={<DashboardSkeleton />}><ToolsHub /></Suspense>} />
               <Route path="/tools/scanner" element={<Suspense fallback={<DashboardSkeleton />}><Scanner /></Suspense>} />
               <Route path="/tools/casino" element={<Suspense fallback={<DashboardSkeleton />}><Casino /></Suspense>} />
                <Route path="/tools/galaxy" element={<Suspense fallback={<DashboardSkeleton />}><Galaxy /></Suspense>} />
                <Route path="/tools/qr-test" element={<Suspense fallback={<DashboardSkeleton />}><QRTest /></Suspense>} />
                <Route path="/loader-demo" element={<Suspense fallback={<DashboardSkeleton />}><LoaderDemo /></Suspense>} />
               
               {/* Trust Cluster */}
               <Route path="/trust" element={<Suspense fallback={<DashboardSkeleton />}><TrustPage /></Suspense>} />
               <Route path="/status" element={<Suspense fallback={<DashboardSkeleton />}><StatusPage /></Suspense>} />
               <Route path="/roadmap" element={<Suspense fallback={<DashboardSkeleton />}><PublicRoadmap /></Suspense>} />
               <Route path="/feedback" element={<Suspense fallback={<DashboardSkeleton />}><PublicBugTracker /></Suspense>} />
               
               {/* Invitation Acceptance */}
               <Route path="/accept-invite" element={<Suspense fallback={<DashboardSkeleton />}><AcceptInvite /></Suspense>} />
              
               {/* Dashboard Routes - Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardHome /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/links" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardLinks /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardAnalytics /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/qr-codes" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardQRCodes /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/targeting" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Targeting /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/targeting/:linkId" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Targeting /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/bulk-create" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><BulkCreate /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/onelink-validator" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><OneLinkValidator /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/campaigns" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Campaigns /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/campaigns/:id" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><CampaignDetails /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/cache-monitoring" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><CacheMonitoring /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/analytics-performance" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><AnalyticsPerformance /></DashboardLayout></Suspense></ProtectedRoute>} />
               <Route path="/dashboard/link-health" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><LinkHealth /></DashboardLayout></Suspense></ProtectedRoute>} />
               <Route path="/dashboard/experiments" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Experiments /></DashboardLayout></Suspense></ProtectedRoute>} />
               <Route path="/dashboard/attribution" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Attribution /></DashboardLayout></Suspense></ProtectedRoute>} />
               <Route path="/dashboard/robust-attribution" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><RobustAttribution /></DashboardLayout></Suspense></ProtectedRoute>} />
               <Route path="/dashboard/sales" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardSales /></DashboardLayout></Suspense></ProtectedRoute>} />
               <Route path="/dashboard/events" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><DashboardEvents /></DashboardLayout></Suspense></ProtectedRoute>} />
               <Route path="/dashboard/intelligence" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><Intelligence /></DashboardLayout></Suspense></ProtectedRoute>} />
               
              {/* Onboarding Routes - No ProtectedRoute to prevent redirect loops after signup */}
              <Route path="/onboarding" element={<Suspense fallback={<DashboardSkeleton />}><OnboardingWizard /></Suspense>} />
              
              <Route path="/links" element={<Navigate to="/dashboard/links" replace />} />
              <Route path="/links/:linkId" element={<LinkIdRedirect />} />
              <Route path="/dashboard/links/:linkId" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><LinkDetail /></DashboardLayout></Suspense></ProtectedRoute>} />
              <Route path="/analytics" element={<Navigate to="/dashboard/intelligence" replace />} />
              
              {/* 2FA Verification Route */}
              <Route path="/auth/verify-2fa" element={<Suspense fallback={<DashboardSkeleton />}><TotpVerification /></Suspense>} />
              
              {/* Admin Routes - Protected with MFA */}
              <Route path="/admin/mfa-verify" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><MFAVerify /></Suspense></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><AdminDashboard /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/waitlist" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><WaitlistManagement /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><UserManagement /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/landing" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><LandingManagement /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/product" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><ProductAnalytics /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/system" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><SystemMonitoring /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/feature-flags" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><FeatureFlags /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/flags/:flagKey" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><FlagDetails /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/security" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><AdminSecurity /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/partners" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><PartnersManagement /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/tests" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><SystemTests /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/subscriptions" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><SubscriptionManagement /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/feedback" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><FeedbackManagement /></AdminLayout></Suspense></ProtectedRoute>} />
              <Route path="/admin/roadmap" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><AdminLayout><RoadmapManagement /></AdminLayout></Suspense></ProtectedRoute>} />
              
              {/* Settings Routes - Protected */}
              <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense></ProtectedRoute>} />
              <Route path="/settings/workspace" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense></ProtectedRoute>} />
              <Route path="/settings/profile" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense></ProtectedRoute>} />
              <Route path="/settings/domains" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense></ProtectedRoute>} />
              <Route path="/settings/billing" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense></ProtectedRoute>} />
              <Route path="/settings/tracking" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense></ProtectedRoute>} />
              <Route path="/settings/backups" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Backup /></Suspense></ProtectedRoute>} />
              <Route path="/settings/backup" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><Backup /></Suspense></ProtectedRoute>} />
              <Route path="/settings/developer" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DeveloperSettings /></Suspense></ProtectedRoute>} />
              <Route path="/dashboard/approvals" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><DashboardLayout><ApprovalQueue /></DashboardLayout></Suspense></ProtectedRoute>} />
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
              <Route path="/blog" element={<Blog />} />
              <Route path="/integration" element={<Navigate to="/features/integrations" replace />} />
              <Route path="/integrations" element={<Navigate to="/features/integrations" replace />} />
              <Route path="/docs/api" element={<Suspense fallback={<DashboardSkeleton />}><APIDocumentation /></Suspense>} />
              <Route path="/docs/playground" element={<Suspense fallback={<DashboardSkeleton />}><APIPlayground /></Suspense>} />
              <Route path="/docs/sdks" element={<Suspense fallback={<DashboardSkeleton />}><SDKs /></Suspense>} />
              <Route path="/docs/pixel-installation" element={<Suspense fallback={<DashboardSkeleton />}><PixelInstallation /></Suspense>} />
              <Route path="/docs/revenue-attribution" element={<Suspense fallback={<DashboardSkeleton />}><RevenueAttribution /></Suspense>} />
              <Route path="/docs/crm-integrations" element={<Suspense fallback={<DashboardSkeleton />}><CRMIntegrations /></Suspense>} />
              <Route path="/docs/chrome-extension" element={<Suspense fallback={<DashboardSkeleton />}><ChromeExtensionDocs /></Suspense>} />
              <Route path="/docs/geo-targeting" element={<Suspense fallback={<DashboardSkeleton />}><GeoTargetingDocs /></Suspense>} />
              <Route path="/docs/identity-graph" element={<Suspense fallback={<DashboardSkeleton />}><IdentityGraphDocs /></Suspense>} />
              <Route path="/docs/smart-insights" element={<Suspense fallback={<DashboardSkeleton />}><SmartInsightsDocs /></Suspense>} />
              <Route path="/docs/troubleshooting" element={<Suspense fallback={<DashboardSkeleton />}><TroubleshootingDocs /></Suspense>} />
              
              {/* Feature Pages */}
              <Route path="/features" element={<Suspense fallback={<DashboardSkeleton />}><Features /></Suspense>} />
              <Route path="/how-it-works" element={<Suspense fallback={<DashboardSkeleton />}><HowItWorks /></Suspense>} />
              <Route path="/features/short-links" element={<Suspense fallback={<DashboardSkeleton />}><ShortLinks /></Suspense>} />
              <Route path="/features/utm-builder" element={<Suspense fallback={<DashboardSkeleton />}><UTMBuilder /></Suspense>} />
              <Route path="/features/qr-generator" element={<Suspense fallback={<DashboardSkeleton />}><QRGenerator /></Suspense>} />
              <Route path="/features/identity-resolution" element={<Suspense fallback={<DashboardSkeleton />}><IdentityResolution /></Suspense>} />
              <Route path="/features/bayesian-attribution" element={<Suspense fallback={<DashboardSkeleton />}><BayesianAttribution /></Suspense>} />
              <Route path="/features/journey-valuation" element={<Suspense fallback={<DashboardSkeleton />}><JourneyValuation /></Suspense>} />
              <Route path="/features/analytics" element={<Suspense fallback={<DashboardSkeleton />}><AnalyticsFeature /></Suspense>} />
              <Route path="/features/governance" element={<Suspense fallback={<DashboardSkeleton />}><EnterpriseControl /></Suspense>} />
              <Route path="/features/integrations" element={<Suspense fallback={<DashboardSkeleton />}><Integrations /></Suspense>} />
              <Route path="/features/clean-track" element={<Suspense fallback={<DashboardSkeleton />}><CleanTrack /></Suspense>} />
              <Route path="/features/accessibility" element={<Suspense fallback={<DashboardSkeleton />}><AccessibilityFeature /></Suspense>} />
              <Route path="/features/partner-program" element={<Suspense fallback={<DashboardSkeleton />}><PartnerProgram /></Suspense>} />
              <Route path="/features/predictive-analytics" element={<Suspense fallback={<DashboardSkeleton />}><PredictiveAnalytics /></Suspense>} />
              <Route path="/features/attribution-graph" element={<Suspense fallback={<DashboardSkeleton />}><AttributionGraph /></Suspense>} />
              <Route path="/features/smart-routing" element={<Suspense fallback={<DashboardSkeleton />}><SmartRouting /></Suspense>} />
              <Route path="/features/link-immunity" element={<Suspense fallback={<DashboardSkeleton />}><LinkImmunity /></Suspense>} />
              <Route path="/features/workspaces" element={<Suspense fallback={<DashboardSkeleton />}><Workspaces /></Suspense>} />
              <Route path="/features/reporting" element={<Suspense fallback={<DashboardSkeleton />}><Reporting /></Suspense>} />
              <Route path="/features/custom-domains" element={<Suspense fallback={<DashboardSkeleton />}><CustomDomains /></Suspense>} />
              <Route path="/features/automation" element={<Suspense fallback={<DashboardSkeleton />}><Automation /></Suspense>} />
              <Route path="/features/event-halo" element={<Suspense fallback={<DashboardSkeleton />}><EventHalo /></Suspense>} />
              <Route path="/features/one-tap" element={<Navigate to="/features/event-halo?tab=scanner" replace />} />
              <Route path="/intelligence" element={<Suspense fallback={<DashboardSkeleton />}><AIIntelligence /></Suspense>} />
              
{/* PWA Standalone Scanner */}
              <Route path="/scan" element={<Suspense fallback={<DashboardSkeleton />}><ScanPage /></Suspense>} />
              
              {/* Easter Egg */}
              <Route path="/surprise" element={<Surprise />} />
              
              {/* Product Pages */}
              <Route path="/product" element={<Suspense fallback={<DashboardSkeleton />}><Product /></Suspense>} />
              <Route path="/products" element={<Suspense fallback={<DashboardSkeleton />}><Products /></Suspense>} />
              <Route path="/products/link-orchestration" element={<Suspense fallback={<DashboardSkeleton />}><LinkOrchestration /></Suspense>} />
              <Route path="/products/journey-intelligence" element={<Suspense fallback={<DashboardSkeleton />}><JourneyIntelligence /></Suspense>} />
              <Route path="/products/qr-studio" element={<Suspense fallback={<DashboardSkeleton />}><QRStudio /></Suspense>} />
              <Route path="/products/data-pipeline" element={<Suspense fallback={<DashboardSkeleton />}><DataPipeline /></Suspense>} />
              
              {/* Solution Pages */}
              <Route path="/solutions" element={<Suspense fallback={<DashboardSkeleton />}><SolutionsHub /></Suspense>} />
              <Route path="/solutions/enterprise" element={<Suspense fallback={<DashboardSkeleton />}><EnterpriseSolution /></Suspense>} />
              <Route path="/solutions/agencies" element={<Suspense fallback={<DashboardSkeleton />}><AgenciesSolution /></Suspense>} />
              <Route path="/solutions/startups" element={<Suspense fallback={<DashboardSkeleton />}><Startups /></Suspense>} />
              <Route path="/solutions/marketers" element={<Suspense fallback={<DashboardSkeleton />}><Marketers /></Suspense>} />
              <Route path="/solutions/sales" element={<Suspense fallback={<DashboardSkeleton />}><Sales /></Suspense>} />
              <Route path="/solutions/marketing-ops" element={<Suspense fallback={<DashboardSkeleton />}><MarketingOps /></Suspense>} />
              <Route path="/solutions/developers" element={<Suspense fallback={<DashboardSkeleton />}><DevelopersSolution /></Suspense>} />
              <Route path="/solutions/revops" element={<Suspense fallback={<DashboardSkeleton />}><RevOps /></Suspense>} />
              <Route path="/solutions/reporting-team" element={<Suspense fallback={<DashboardSkeleton />}><ReportingTeam /></Suspense>} />
              <Route path="/solutions/partner-managers" element={<Suspense fallback={<DashboardSkeleton />}><PartnerManagers /></Suspense>} />
              <Route path="/solutions/field-marketing" element={<Suspense fallback={<DashboardSkeleton />}><FieldMarketing /></Suspense>} />
              
              {/* Comparison Pages */}
              <Route path="/compare" element={<Suspense fallback={<DashboardSkeleton />}><CompareHub /></Suspense>} />
              <Route path="/compare/bitly" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsBitly /></Suspense>} />
              <Route path="/compare/rebrandly" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsRebrandly /></Suspense>} />
              <Route path="/compare/short-io" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsShortIo /></Suspense>} />
              <Route path="/compare/bl-ink" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsBlInk /></Suspense>} />
              <Route path="/compare/rewardful" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsRewardful /></Suspense>} />
              <Route path="/compare/partnerstack" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsPartnerstack /></Suspense>} />
              <Route path="/compare/firstpromoter" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsFirstpromoter /></Suspense>} />
              <Route path="/compare/tolt" element={<Suspense fallback={<DashboardSkeleton />}><UtmOneVsTolt /></Suspense>} />
              
              {/* Use Case Pages */}
              <Route path="/use-cases" element={<Suspense fallback={<DashboardSkeleton />}><UseCasesIndex /></Suspense>} />
              <Route path="/use-cases/ecommerce-tracking" element={<Suspense fallback={<DashboardSkeleton />}><EcommerceTracking /></Suspense>} />
              <Route path="/use-cases/saas-attribution" element={<Suspense fallback={<DashboardSkeleton />}><SaasAttribution /></Suspense>} />
              <Route path="/use-cases/event-marketing" element={<Suspense fallback={<DashboardSkeleton />}><EventMarketing /></Suspense>} />
              <Route path="/use-cases/agency-client-reporting" element={<Suspense fallback={<DashboardSkeleton />}><AgencyClientReporting /></Suspense>} />
              <Route path="/use-cases/influencer-campaigns" element={<Suspense fallback={<DashboardSkeleton />}><InfluencerCampaigns /></Suspense>} />
              
              {/* Help Documentation Pages */}
              <Route path="/help" element={<Suspense fallback={<DashboardSkeleton />}><HelpIndex /></Suspense>} />
              <Route path="/help/getting-started" element={<Suspense fallback={<DashboardSkeleton />}><HelpGettingStarted /></Suspense>} />
              <Route path="/help/links" element={<Suspense fallback={<DashboardSkeleton />}><HelpLinks /></Suspense>} />
              <Route path="/help/utm" element={<Suspense fallback={<DashboardSkeleton />}><HelpUTM /></Suspense>} />
              <Route path="/help/qr" element={<Suspense fallback={<DashboardSkeleton />}><HelpQRCodes /></Suspense>} />
              <Route path="/help/analytics" element={<Suspense fallback={<DashboardSkeleton />}><HelpAnalytics /></Suspense>} />
              <Route path="/help/attribution" element={<Suspense fallback={<DashboardSkeleton />}><HelpAttribution /></Suspense>} />
              <Route path="/help/events" element={<Suspense fallback={<DashboardSkeleton />}><HelpEvents /></Suspense>} />
              <Route path="/help/advanced" element={<Suspense fallback={<DashboardSkeleton />}><HelpAdvanced /></Suspense>} />
              <Route path="/help/team" element={<Suspense fallback={<DashboardSkeleton />}><HelpTeam /></Suspense>} />
              <Route path="/help/integrations" element={<Suspense fallback={<DashboardSkeleton />}><HelpIntegrations /></Suspense>} />
              <Route path="/help/domains" element={<Suspense fallback={<DashboardSkeleton />}><HelpDomains /></Suspense>} />
              <Route path="/help/billing" element={<Suspense fallback={<DashboardSkeleton />}><HelpBilling /></Suspense>} />
              <Route path="/help/security" element={<Suspense fallback={<DashboardSkeleton />}><HelpSecurity /></Suspense>} />
              
              {/* Help Article Pages - Getting Started */}
              <Route path="/help/articles/what-is-utm-one" element={<Suspense fallback={<DashboardSkeleton />}><WhatIsUtmOne /></Suspense>} />
              <Route path="/help/articles/create-account" element={<Suspense fallback={<DashboardSkeleton />}><CreateAccount /></Suspense>} />
              <Route path="/help/articles/creating-account" element={<Suspense fallback={<DashboardSkeleton />}><CreatingAccount /></Suspense>} />
              <Route path="/help/articles/first-link" element={<Suspense fallback={<DashboardSkeleton />}><FirstLink /></Suspense>} />
              <Route path="/help/articles/dashboard-overview" element={<Suspense fallback={<DashboardSkeleton />}><DashboardOverview /></Suspense>} />
              <Route path="/help/articles/onboarding-checklist" element={<Suspense fallback={<DashboardSkeleton />}><OnboardingChecklist /></Suspense>} />
              <Route path="/help/articles/account-settings" element={<Suspense fallback={<DashboardSkeleton />}><AccountSettings /></Suspense>} />
              <Route path="/help/articles/quick-wins" element={<Suspense fallback={<DashboardSkeleton />}><QuickWins /></Suspense>} />
              
              {/* Help Article Pages - Links */}
              <Route path="/help/articles/create-link" element={<Suspense fallback={<DashboardSkeleton />}><CreateLink /></Suspense>} />
              <Route path="/help/articles/creating-links" element={<Suspense fallback={<DashboardSkeleton />}><CreatingLinks /></Suspense>} />
              <Route path="/help/articles/custom-slugs" element={<Suspense fallback={<DashboardSkeleton />}><CustomSlugs /></Suspense>} />
              <Route path="/help/articles/editing-links" element={<Suspense fallback={<DashboardSkeleton />}><EditingLinks /></Suspense>} />
              <Route path="/help/articles/link-status" element={<Suspense fallback={<DashboardSkeleton />}><LinkStatus /></Suspense>} />
              <Route path="/help/articles/link-expiration" element={<Suspense fallback={<DashboardSkeleton />}><LinkExpiration /></Suspense>} />
              <Route path="/help/articles/click-limits" element={<Suspense fallback={<DashboardSkeleton />}><ClickLimits /></Suspense>} />
              <Route path="/help/articles/password-protection" element={<Suspense fallback={<DashboardSkeleton />}><PasswordProtection /></Suspense>} />
              <Route path="/help/articles/bulk-creation" element={<Suspense fallback={<DashboardSkeleton />}><BulkCreation /></Suspense>} />
              <Route path="/help/articles/link-health" element={<Suspense fallback={<DashboardSkeleton />}><LinkHealthArticle /></Suspense>} />
              <Route path="/help/articles/link-immunity" element={<Suspense fallback={<DashboardSkeleton />}><LinkImmunityArticle /></Suspense>} />
              <Route path="/help/articles/duplicating-links" element={<Suspense fallback={<DashboardSkeleton />}><DuplicatingLinks /></Suspense>} />
              <Route path="/help/articles/link-preview" element={<Suspense fallback={<DashboardSkeleton />}><LinkPreview /></Suspense>} />
              
              {/* Help Article Pages - UTM */}
              <Route path="/help/articles/what-are-utms" element={<Suspense fallback={<DashboardSkeleton />}><WhatAreUTMs /></Suspense>} />
              <Route path="/help/articles/five-fields" element={<Suspense fallback={<DashboardSkeleton />}><FiveFields /></Suspense>} />
              <Route path="/help/articles/naming-conventions" element={<Suspense fallback={<DashboardSkeleton />}><NamingConventions /></Suspense>} />
              <Route path="/help/articles/common-mistakes" element={<Suspense fallback={<DashboardSkeleton />}><CommonMistakes /></Suspense>} />
              <Route path="/help/articles/utm-templates" element={<Suspense fallback={<DashboardSkeleton />}><UTMTemplates /></Suspense>} />
              <Route path="/help/articles/clean-track-framework" element={<Suspense fallback={<DashboardSkeleton />}><CleanTrackFrameworkArticle /></Suspense>} />
              <Route path="/help/articles/utm-validation" element={<Suspense fallback={<DashboardSkeleton />}><UTMValidation /></Suspense>} />
              <Route path="/help/articles/utm-governance" element={<Suspense fallback={<DashboardSkeleton />}><UTMGovernance /></Suspense>} />
              <Route path="/help/articles/utm-audit-tools" element={<Suspense fallback={<DashboardSkeleton />}><UTMAuditTools /></Suspense>} />
              <Route path="/help/articles/ai-utm-suggestions" element={<Suspense fallback={<DashboardSkeleton />}><AIUTMSuggestions /></Suspense>} />
              
              {/* Help Article Pages - QR */}
              <Route path="/help/articles/qr-basics" element={<Suspense fallback={<DashboardSkeleton />}><QRCodeBasics /></Suspense>} />
              <Route path="/help/articles/qr-customization" element={<Suspense fallback={<DashboardSkeleton />}><QRCustomization /></Suspense>} />
              <Route path="/help/articles/qr-logos" element={<Suspense fallback={<DashboardSkeleton />}><QRLogos /></Suspense>} />
              <Route path="/help/articles/qr-export" element={<Suspense fallback={<DashboardSkeleton />}><QRExport /></Suspense>} />
              <Route path="/help/articles/qr-reliability" element={<Suspense fallback={<DashboardSkeleton />}><QRReliability /></Suspense>} />
              <Route path="/help/articles/ai-stamp-studio" element={<Suspense fallback={<DashboardSkeleton />}><AIStampStudio /></Suspense>} />
              <Route path="/help/articles/bulk-qr" element={<Suspense fallback={<DashboardSkeleton />}><BulkQR /></Suspense>} />
              <Route path="/help/articles/qr-print-specs" element={<Suspense fallback={<DashboardSkeleton />}><QRPrintSpecs /></Suspense>} />
              
              {/* Help Article Pages - Analytics */}
              <Route path="/help/articles/analytics-overview" element={<Suspense fallback={<DashboardSkeleton />}><AnalyticsOverview /></Suspense>} />
              <Route path="/help/articles/click-tracking" element={<Suspense fallback={<DashboardSkeleton />}><ClickTracking /></Suspense>} />
              <Route path="/help/articles/device-analytics" element={<Suspense fallback={<DashboardSkeleton />}><DeviceAnalytics /></Suspense>} />
              <Route path="/help/articles/geographic-data" element={<Suspense fallback={<DashboardSkeleton />}><GeographicData /></Suspense>} />
              <Route path="/help/articles/referrer-tracking" element={<Suspense fallback={<DashboardSkeleton />}><ReferrerTracking /></Suspense>} />
              <Route path="/help/articles/real-time-analytics" element={<Suspense fallback={<DashboardSkeleton />}><RealTimeAnalytics /></Suspense>} />
              <Route path="/help/articles/exporting-data" element={<Suspense fallback={<DashboardSkeleton />}><ExportingData /></Suspense>} />
              <Route path="/help/articles/ai-insights" element={<Suspense fallback={<DashboardSkeleton />}><AIInsights /></Suspense>} />
              <Route path="/help/articles/anomaly-detection" element={<Suspense fallback={<DashboardSkeleton />}><AnomalyDetection /></Suspense>} />
              
              {/* Help Article Pages - Attribution */}
              <Route path="/help/articles/attribution-overview" element={<Suspense fallback={<DashboardSkeleton />}><AttributionOverview /></Suspense>} />
              <Route path="/help/articles/attribution-models" element={<Suspense fallback={<DashboardSkeleton />}><AttributionModels /></Suspense>} />
              <Route path="/help/articles/tracking-pixel" element={<Suspense fallback={<DashboardSkeleton />}><TrackingPixelArticle /></Suspense>} />
              <Route path="/help/articles/conversion-tracking" element={<Suspense fallback={<DashboardSkeleton />}><ConversionTracking /></Suspense>} />
              <Route path="/help/articles/customer-journeys" element={<Suspense fallback={<DashboardSkeleton />}><CustomerJourneys /></Suspense>} />
              <Route path="/help/articles/identity-graph" element={<Suspense fallback={<DashboardSkeleton />}><IdentityGraph /></Suspense>} />
              <Route path="/help/articles/revenue-attribution" element={<Suspense fallback={<DashboardSkeleton />}><RevenueAttributionArticle /></Suspense>} />
              <Route path="/help/articles/lift-analysis" element={<Suspense fallback={<DashboardSkeleton />}><LiftAnalysis /></Suspense>} />
              
              {/* Help Article Pages - Events */}
              <Route path="/help/articles/event-halo" element={<Suspense fallback={<DashboardSkeleton />}><EventHaloArticle /></Suspense>} />
              <Route path="/help/articles/event-halo-overview" element={<Suspense fallback={<DashboardSkeleton />}><EventHaloOverview /></Suspense>} />
              <Route path="/help/articles/creating-events" element={<Suspense fallback={<DashboardSkeleton />}><CreatingEvents /></Suspense>} />
              <Route path="/help/articles/one-tap-scanner" element={<Suspense fallback={<DashboardSkeleton />}><OneTapScanner /></Suspense>} />
              <Route path="/help/articles/badge-import" element={<Suspense fallback={<DashboardSkeleton />}><BadgeImport /></Suspense>} />
              <Route path="/help/articles/event-roi" element={<Suspense fallback={<DashboardSkeleton />}><EventROI /></Suspense>} />
              
              {/* Help Article Pages - Event Bridge */}
              <Route path="/help/articles/event-bridge-overview" element={<Suspense fallback={<DashboardSkeleton />}><EventBridgeOverviewArticle /></Suspense>} />
              <Route path="/help/articles/event-bridge-setup" element={<Suspense fallback={<DashboardSkeleton />}><EventBridgeSetupArticle /></Suspense>} />
              <Route path="/help/articles/event-bridge-routing" element={<Suspense fallback={<DashboardSkeleton />}><EventBridgeRoutingArticle /></Suspense>} />
              <Route path="/help/articles/event-bridge-crm" element={<Suspense fallback={<DashboardSkeleton />}><EventBridgeCRMArticle /></Suspense>} />
              
              {/* Help Article Pages - Advanced */}
              <Route path="/help/articles/geo-targeting" element={<Suspense fallback={<DashboardSkeleton />}><GeoTargetingArticle /></Suspense>} />
              <Route path="/help/articles/device-targeting" element={<Suspense fallback={<DashboardSkeleton />}><DeviceTargeting /></Suspense>} />
              <Route path="/help/articles/link-rotation" element={<Suspense fallback={<DashboardSkeleton />}><LinkRotation /></Suspense>} />
              <Route path="/help/articles/smart-routing" element={<Suspense fallback={<DashboardSkeleton />}><SmartRoutingArticle /></Suspense>} />
              
              {/* Help Article Pages - Team */}
              <Route path="/help/articles/team-roles" element={<Suspense fallback={<DashboardSkeleton />}><TeamRoles /></Suspense>} />
              <Route path="/help/articles/inviting-members" element={<Suspense fallback={<DashboardSkeleton />}><InvitingMembers /></Suspense>} />
              <Route path="/help/articles/roles-permissions" element={<Suspense fallback={<DashboardSkeleton />}><RolesPermissions /></Suspense>} />
              <Route path="/help/articles/workspace-settings" element={<Suspense fallback={<DashboardSkeleton />}><WorkspaceSettings /></Suspense>} />
              
              {/* Help Article Pages - Integrations */}
              <Route path="/help/articles/chrome-extension" element={<Suspense fallback={<DashboardSkeleton />}><ChromeExtension /></Suspense>} />
              <Route path="/help/articles/api-authentication" element={<Suspense fallback={<DashboardSkeleton />}><ApiAuthentication /></Suspense>} />
              <Route path="/help/articles/api-endpoints" element={<Suspense fallback={<DashboardSkeleton />}><ApiEndpoints /></Suspense>} />
              <Route path="/help/articles/webhooks" element={<Suspense fallback={<DashboardSkeleton />}><Webhooks /></Suspense>} />
              <Route path="/help/articles/ga4-integration" element={<Suspense fallback={<DashboardSkeleton />}><GA4Integration /></Suspense>} />
              <Route path="/help/articles/hubspot-integration" element={<Suspense fallback={<DashboardSkeleton />}><HubSpotIntegration /></Suspense>} />
              <Route path="/help/articles/salesforce-integration" element={<Suspense fallback={<DashboardSkeleton />}><SalesforceIntegration /></Suspense>} />
              <Route path="/help/articles/zapier-integration" element={<Suspense fallback={<DashboardSkeleton />}><ZapierIntegrationArticle /></Suspense>} />
              <Route path="/help/articles/slack-integration" element={<Suspense fallback={<DashboardSkeleton />}><SlackIntegrationArticle /></Suspense>} />
              
              {/* Help Article Pages - Domains */}
              <Route path="/help/articles/custom-domain-setup" element={<Suspense fallback={<DashboardSkeleton />}><CustomDomainSetup /></Suspense>} />
              <Route path="/help/articles/adding-domains" element={<Suspense fallback={<DashboardSkeleton />}><AddingDomains /></Suspense>} />
              <Route path="/help/articles/dns-setup" element={<Suspense fallback={<DashboardSkeleton />}><DNSSetup /></Suspense>} />
              
              {/* Help Article Pages - Billing */}
              <Route path="/help/articles/managing-subscription" element={<Suspense fallback={<DashboardSkeleton />}><ManagingSubscription /></Suspense>} />
              <Route path="/help/articles/usage-limits" element={<Suspense fallback={<DashboardSkeleton />}><UsageLimits /></Suspense>} />
              
              {/* Help Article Pages - Security */}
              <Route path="/help/articles/two-factor-auth" element={<Suspense fallback={<DashboardSkeleton />}><TwoFactorAuth /></Suspense>} />
              <Route path="/help/articles/security-keys" element={<Suspense fallback={<DashboardSkeleton />}><SecurityKeys /></Suspense>} />
              <Route path="/help/articles/audit-logs" element={<Suspense fallback={<DashboardSkeleton />}><AuditLogs /></Suspense>} />
              <Route path="/help/articles/data-privacy" element={<Suspense fallback={<DashboardSkeleton />}><DataPrivacy /></Suspense>} />
              
              {/* Help Article Pages - Other */}
              <Route path="/help/articles/lead-enrichment" element={<Suspense fallback={<DashboardSkeleton />}><LeadEnrichment /></Suspense>} />
              
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

              <Route path="/resources" element={<Suspense fallback={<DashboardSkeleton />}><Resources /></Suspense>} />
              <Route path="/resources/guides" element={<Suspense fallback={<DashboardSkeleton />}><Guides /></Suspense>} />
              <Route path="/resources/guides/utm-guide" element={<Suspense fallback={<DashboardSkeleton />}><UTMGuide /></Suspense>} />
              <Route path="/resources/guides/clean-track-framework" element={<Suspense fallback={<DashboardSkeleton />}><CleanTrackFramework /></Suspense>} />
              <Route path="/resources/guides/tracking-architecture" element={<Suspense fallback={<DashboardSkeleton />}><TrackingArchitecture /></Suspense>} />
              <Route path="/resources/guides/simple-analytics" element={<Suspense fallback={<DashboardSkeleton />}><SimpleAnalytics /></Suspense>} />
              <Route path="/resources/guides/growth-analytics" element={<Suspense fallback={<DashboardSkeleton />}><GrowthAnalytics /></Suspense>} />
              <Route path="/resources/guides/llm-seo" element={<Suspense fallback={<DashboardSkeleton />}><LLMSeo /></Suspense>} />
              <Route path="/resources/guides/bayesian-testing" element={<Suspense fallback={<DashboardSkeleton />}><BayesianTesting /></Suspense>} />
              
              {/* Playbook Routes */}
              <Route path="/resources/playbooks/llm-ranking" element={<Suspense fallback={<DashboardSkeleton />}><LLMRanking /></Suspense>} />
              <Route path="/resources/playbooks/utm-governance-playbook" element={<Suspense fallback={<DashboardSkeleton />}><UTMGovernancePlaybook /></Suspense>} />
              <Route path="/resources/playbooks/startup-analytics-playbook" element={<Suspense fallback={<DashboardSkeleton />}><StartupAnalyticsPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/event-led-growth-playbook" element={<Suspense fallback={<DashboardSkeleton />}><EventLedGrowthPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/naming-convention-playbook" element={<Suspense fallback={<DashboardSkeleton />}><NamingConventionPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/sales-marketing-alignment" element={<Suspense fallback={<DashboardSkeleton />}><SalesMarketingAlignmentPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/ai-marketing" element={<Suspense fallback={<DashboardSkeleton />}><AIMarketingPlaybook /></Suspense>} />
              <Route path="/resources/playbooks/b2b-architects-2026" element={<Suspense fallback={<DashboardSkeleton />}><B2BArchitectsPlaybook /></Suspense>} />
              <Route path="/resources/playbooks" element={<Suspense fallback={<DashboardSkeleton />}><Playbooks /></Suspense>} />
              
              {/* Template Routes */}
              <Route path="/resources/templates" element={<Suspense fallback={<DashboardSkeleton />}><Templates /></Suspense>} />
              <Route path="/resources/templates/utm-template" element={<Suspense fallback={<DashboardSkeleton />}><UTMTemplate /></Suspense>} />
              <Route path="/resources/templates/audit-checklist-template" element={<Suspense fallback={<DashboardSkeleton />}><AuditChecklistTemplate /></Suspense>} />
              <Route path="/resources/templates/campaign-brief-template" element={<Suspense fallback={<DashboardSkeleton />}><CampaignBriefTemplate /></Suspense>} />
              <Route path="/resources/templates/naming-taxonomy-template" element={<Suspense fallback={<DashboardSkeleton />}><NamingTaxonomyTemplate /></Suspense>} />
              
              {/* Tools Routes */}
              <Route path="/tools/decision-frameworks" element={<Suspense fallback={<DashboardSkeleton />}><DecisionFrameworks /></Suspense>} />
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
                path="/resources/reports/gtm-insights-2026" 
                element={
                  <Suspense fallback={<DashboardSkeleton />}>
                    <ComingSoonPage 
                      title="State of GTM Insights 2026"
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
              <Route path="/solutions/partner-managers" element={<Suspense fallback={<DashboardSkeleton />}><PartnerManagers /></Suspense>} />
              <Route path="/early-access" element={<Suspense fallback={<DashboardSkeleton />}><EarlyAccess /></Suspense>} />
              <Route path="/waitlist-status" element={<Suspense fallback={<DashboardSkeleton />}><WaitlistStatus /></Suspense>} />
              <Route path="/invite/:code" element={<Suspense fallback={<DashboardSkeleton />}><Invite /></Suspense>} />
              <Route path="/claim-access" element={<Suspense fallback={<DashboardSkeleton />}><ClaimAccess /></Suspense>} />
              <Route path="/book-demo" element={<Suspense fallback={<DashboardSkeleton />}><BookDemo /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<DashboardSkeleton />}><BookDemo /></Suspense>} />
              <Route path="/partners" element={<Suspense fallback={<DashboardSkeleton />}><Partners /></Suspense>} />
              <Route path="/partners/apply" element={<Suspense fallback={<DashboardSkeleton />}><PartnerApply /></Suspense>} />
              <Route path="/partners/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><PartnerDashboard /></Suspense>} />
              <Route path="/partners/terms" element={<Suspense fallback={<DashboardSkeleton />}><PartnerTerms /></Suspense>} />
              <Route path="/integrations/zapier" element={<Suspense fallback={<DashboardSkeleton />}><ZapierIntegration /></Suspense>} />
              <Route path="/integrations/slack" element={<Suspense fallback={<DashboardSkeleton />}><SlackIntegration /></Suspense>} />
              <Route path="/integrations/gtm" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><GTMSettings /></DashboardLayout></Suspense>} />
              <Route path="/settings/integrations" element={<Suspense fallback={<DashboardSkeleton />}><IntegrationsSettings /></Suspense>} />
              <Route path="/privacy-policy" element={<Suspense fallback={<DashboardSkeleton />}><PrivacyPolicy /></Suspense>} />
              
              {/* Legal Pages */}
              <Route path="/legal/privacy" element={<Suspense fallback={<DashboardSkeleton />}><PrivacyLegal /></Suspense>} />
              <Route path="/legal/terms" element={<Suspense fallback={<DashboardSkeleton />}><TermsLegal /></Suspense>} />
              <Route path="/legal/permanence-terms" element={<Suspense fallback={<DashboardSkeleton />}><PermanenceTerms /></Suspense>} />
              <Route path="/legal/data-security" element={<Suspense fallback={<DashboardSkeleton />}><DataSecurity /></Suspense>} />
              <Route path="/legal/cookies" element={<Suspense fallback={<DashboardSkeleton />}><CookiePolicy /></Suspense>} />
              <Route path="/legal/acceptable-use" element={<Suspense fallback={<DashboardSkeleton />}><AcceptableUse /></Suspense>} />
              <Route path="/legal/subprocessors" element={<Suspense fallback={<DashboardSkeleton />}><Subprocessors /></Suspense>} />
              <Route path="/legal/dpa" element={<Suspense fallback={<DashboardSkeleton />}><DPA /></Suspense>} />
              <Route path="/legal/support" element={<Suspense fallback={<DashboardSkeleton />}><SupportPolicy /></Suspense>} />
              <Route path="/client-workspaces" element={<Suspense fallback={<DashboardSkeleton />}><DashboardLayout><ClientWorkspaces /></DashboardLayout></Suspense>} />
              <Route path="/analytics/share/:token" element={<Suspense fallback={<DashboardSkeleton />}><AnalyticsShare /></Suspense>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<Suspense fallback={<DashboardSkeleton />}><NotFound /></Suspense>} />
            </Routes>
            </AnimatedRoutes>
            </AppWithHelp>
          </ModalProvider>
          </AdminSimulationProvider>
          </WorkspaceProvider>
        </BrowserRouter>
      </TooltipProvider>
    </NotificationProvider>
    </QueryClientProvider>
    </PerformanceProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
