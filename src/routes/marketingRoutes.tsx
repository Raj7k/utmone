import { lazy, Suspense } from "react";
import { Route, Navigate } from "react-router-dom";
import { MarketingSkeleton } from "@/components/SkeletonLoader";

// Feature Pages
const Features = lazy(() => import("@/public/routes/Features"));
const HowItWorks = lazy(() => import("@/pages/HowItWorksNew"));
const ShortLinks = lazy(() => import("@/pages/features/ShortLinks"));
const UTMBuilder = lazy(() => import("@/pages/features/UTMBuilder"));
const QRGenerator = lazy(() => import("@/pages/features/QRGenerator"));
const CustomerJourney = lazy(() => import("@/pages/features/CustomerJourney"));
const IdentityResolution = lazy(() => import("@/pages/features/IdentityResolution"));
const BayesianAttribution = lazy(() => import("@/pages/features/BayesianAttribution"));
const JourneyValuation = lazy(() => import("@/pages/features/JourneyValuation"));
const AnalyticsFeature = lazy(() => import("@/pages/features/Analytics"));
const EnterpriseControl = lazy(() => import("@/pages/features/EnterpriseControl"));
const CleanTrack = lazy(() => import("@/pages/features/CleanTrack"));
const PartnerProgram = lazy(() => import("@/pages/features/PartnerProgram"));
const Integrations = lazy(() => import("@/pages/features/Integrations"));
const PredictiveAnalytics = lazy(() => import("@/pages/features/PredictiveAnalytics"));
const AttributionGraph = lazy(() => import("@/pages/features/AttributionGraph"));
const SmartRouting = lazy(() => import("@/pages/features/SmartRouting"));
const LinkImmunity = lazy(() => import("@/pages/features/LinkImmunity"));
const Workspaces = lazy(() => import("@/pages/features/Workspaces"));
const Reporting = lazy(() => import("@/pages/features/Reporting"));
const CustomDomains = lazy(() => import("@/pages/features/CustomDomains"));
const Automation = lazy(() => import("@/pages/features/Automation"));
const AccessibilityFeature = lazy(() => import("@/pages/features/Accessibility"));
const EventHalo = lazy(() => import("@/pages/features/EventHalo"));
const AIIntelligence = lazy(() => import("@/pages/features/AIIntelligence"));
const Sentinel = lazy(() => import("@/pages/features/Sentinel"));
const BrickBuilderFeature = lazy(() => import("@/pages/features/BrickBuilder"));
const LinkPagesFeature = lazy(() => import("@/pages/features/LinkPages"));

// Product Pages
const Products = lazy(() => import("@/pages/Products"));
const Product = lazy(() => import("@/pages/Product"));
const LinkOrchestration = lazy(() => import("@/pages/products/LinkOrchestration"));
const JourneyIntelligence = lazy(() => import("@/pages/products/JourneyIntelligence"));
const QRStudio = lazy(() => import("@/pages/products/QRStudio"));
const DataPipeline = lazy(() => import("@/pages/products/DataPipeline"));

// Solution Pages
const SolutionsHub = lazy(() => import("@/pages/Solutions"));
const EnterpriseSolution = lazy(() => import("@/pages/solutions/Enterprise"));
const AgenciesSolution = lazy(() => import("@/pages/solutions/Agencies"));
const Startups = lazy(() => import("@/pages/solutions/Startups"));
const ReportingTeam = lazy(() => import("@/pages/solutions/ReportingTeam"));
const RevOps = lazy(() => import("@/pages/solutions/RevOps"));
const Marketers = lazy(() => import("@/pages/solutions/Marketers"));
const Sales = lazy(() => import("@/pages/solutions/Sales"));
const MarketingOps = lazy(() => import("@/pages/solutions/MarketingOps"));
const DevelopersSolution = lazy(() => import("@/pages/solutions/Developers"));
const PartnerManagers = lazy(() => import("@/pages/solutions/PartnerManagers"));
const FieldMarketing = lazy(() => import("@/pages/solutions/FieldMarketing"));

// Comparison Pages
const CompareHub = lazy(() => import("@/pages/Compare"));
const UtmOneVsBitly = lazy(() => import("@/pages/compare/UtmOneVsBitly"));
const UtmOneVsRebrandly = lazy(() => import("@/pages/compare/UtmOneVsRebrandly"));
const UtmOneVsShortIo = lazy(() => import("@/pages/compare/UtmOneVsShortIo"));
const UtmOneVsBlInk = lazy(() => import("@/pages/compare/UtmOneVsBlInk"));
const UtmOneVsRewardful = lazy(() => import("@/pages/compare/UtmOneVsRewardful"));
const UtmOneVsPartnerstack = lazy(() => import("@/pages/compare/UtmOneVsPartnerstack"));
const UtmOneVsFirstpromoter = lazy(() => import("@/pages/compare/UtmOneVsFirstpromoter"));
const UtmOneVsTolt = lazy(() => import("@/pages/compare/UtmOneVsTolt"));

// Use Case Pages
const UseCasesIndex = lazy(() => import("@/pages/use-cases/UseCasesIndex"));
const EcommerceTracking = lazy(() => import("@/pages/use-cases/EcommerceTracking"));
const SaasAttribution = lazy(() => import("@/pages/use-cases/SaasAttribution"));
const EventMarketing = lazy(() => import("@/pages/use-cases/EventMarketing"));
const AgencyClientReporting = lazy(() => import("@/pages/use-cases/AgencyClientReporting"));
const InfluencerCampaigns = lazy(() => import("@/pages/use-cases/InfluencerCampaigns"));

// Static Pages
const Pricing = lazy(() => import("@/public/routes/Pricing"));
const LifetimeDeal = lazy(() => import("@/pages/LifetimeDeal"));
const About = lazy(() => import("@/pages/AboutNew"));
const Docs = lazy(() => import("@/public/routes/Docs"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Changelog = lazy(() => import("@/pages/Changelog"));
const Support = lazy(() => import("@/pages/Support"));
const TrustPage = lazy(() => import("@/pages/Trust"));
const StatusPage = lazy(() => import("@/pages/Status"));
const PublicRoadmap = lazy(() => import("@/pages/PublicRoadmap"));
const PublicBugTracker = lazy(() => import("@/pages/PublicBugTracker"));
const Accessibility = lazy(() => import("@/pages/Accessibility"));
const Permanence = lazy(() => import("@/pages/Permanence"));

// Docs Pages
const APIDocumentation = lazy(() => import("@/pages/Docs/API"));
const APIPlayground = lazy(() => import("@/pages/Docs/APIPlayground"));
const SDKs = lazy(() => import("@/pages/Docs/SDKs"));
const PixelInstallation = lazy(() => import("@/pages/Docs/PixelInstallation"));
const RevenueAttribution = lazy(() => import("@/pages/Docs/RevenueAttribution"));
const CRMIntegrations = lazy(() => import("@/pages/Docs/CRMIntegrations"));
const ChromeExtensionDocs = lazy(() => import("@/pages/Docs/ChromeExtension"));
const GeoTargetingDocs = lazy(() => import("@/pages/Docs/GeoTargeting"));
const IdentityGraphDocs = lazy(() => import("@/pages/Docs/IdentityGraph"));
const SmartInsightsDocs = lazy(() => import("@/pages/Docs/SmartInsights"));
const TroubleshootingDocs = lazy(() => import("@/pages/Docs/Troubleshooting"));

// Partner & Integration Pages
const EarlyAccess = lazy(() => import("@/pages/EarlyAccess"));
const Invite = lazy(() => import("@/pages/Invite"));
const ClaimAccess = lazy(() => import("@/pages/ClaimAccess"));
const BookDemo = lazy(() => import("@/pages/BookDemo"));
const Partners = lazy(() => import("@/pages/Partners"));
const PartnerApply = lazy(() => import("@/pages/Partners/Apply"));
const PartnerDashboard = lazy(() => import("@/pages/Partners/Dashboard"));
const PartnerTerms = lazy(() => import("@/pages/Partners/Terms"));
const ZapierIntegration = lazy(() => import("@/pages/integrations/Zapier"));
const SlackIntegration = lazy(() => import("@/pages/integrations/Slack"));

// Legal Pages
const PrivacyLegal = lazy(() => import("@/pages/legal/PrivacyLegal"));
const TermsLegal = lazy(() => import("@/pages/legal/TermsLegal"));
const PermanenceTerms = lazy(() => import("@/pages/legal/PermanenceTerms"));
const DataSecurity = lazy(() => import("@/pages/legal/DataSecurity"));
const CookiePolicy = lazy(() => import("@/pages/legal/CookiePolicy"));
const AcceptableUse = lazy(() => import("@/pages/legal/AcceptableUse"));
const Subprocessors = lazy(() => import("@/pages/legal/Subprocessors"));
const DPA = lazy(() => import("@/pages/legal/DPA"));
const SupportPolicy = lazy(() => import("@/pages/legal/SupportPolicy"));

// PWA
const ScanPage = lazy(() => import("@/pages/Scan"));
const Blog = lazy(() => import("@/pages/Blog"));
const Surprise = lazy(() => import("@/pages/Surprise"));

const M = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<MarketingSkeleton />}>{children}</Suspense>
);

export const marketingRoutes = [
  // Feature Pages
  <Route key="features" path="/features" element={<M><Features /></M>} />,
  <Route key="how-it-works" path="/how-it-works" element={<M><HowItWorks /></M>} />,
  <Route key="short-links" path="/features/short-links" element={<M><ShortLinks /></M>} />,
  <Route key="utm-builder" path="/features/utm-builder" element={<M><UTMBuilder /></M>} />,
  <Route key="qr-generator" path="/features/qr-generator" element={<M><QRGenerator /></M>} />,
  <Route key="customer-journey" path="/features/customer-journey" element={<M><CustomerJourney /></M>} />,
  <Route key="identity-resolution" path="/features/identity-resolution" element={<M><IdentityResolution /></M>} />,
  <Route key="bayesian-attribution" path="/features/bayesian-attribution" element={<M><BayesianAttribution /></M>} />,
  <Route key="journey-valuation" path="/features/journey-valuation" element={<M><JourneyValuation /></M>} />,
  <Route key="analytics-feature" path="/features/analytics" element={<M><AnalyticsFeature /></M>} />,
  <Route key="governance" path="/features/governance" element={<M><EnterpriseControl /></M>} />,
  <Route key="integrations" path="/features/integrations" element={<M><Integrations /></M>} />,
  <Route key="clean-track" path="/features/clean-track" element={<M><CleanTrack /></M>} />,
  <Route key="accessibility-feature" path="/features/accessibility" element={<M><AccessibilityFeature /></M>} />,
  <Route key="partner-program" path="/features/partner-program" element={<M><PartnerProgram /></M>} />,
  <Route key="predictive-analytics" path="/features/predictive-analytics" element={<M><PredictiveAnalytics /></M>} />,
  <Route key="attribution-graph" path="/features/attribution-graph" element={<M><AttributionGraph /></M>} />,
  <Route key="smart-routing" path="/features/smart-routing" element={<M><SmartRouting /></M>} />,
  <Route key="link-immunity" path="/features/link-immunity" element={<M><LinkImmunity /></M>} />,
  <Route key="workspaces" path="/features/workspaces" element={<M><Workspaces /></M>} />,
  <Route key="reporting" path="/features/reporting" element={<M><Reporting /></M>} />,
  <Route key="custom-domains" path="/features/custom-domains" element={<M><CustomDomains /></M>} />,
  <Route key="automation" path="/features/automation" element={<M><Automation /></M>} />,
  <Route key="event-halo" path="/features/event-halo" element={<M><EventHalo /></M>} />,
  <Route key="one-tap" path="/features/one-tap" element={<Navigate to="/features/event-halo?tab=scanner" replace />} />,
  <Route key="intelligence" path="/intelligence" element={<M><AIIntelligence /></M>} />,
  <Route key="sentinel" path="/features/sentinel" element={<M><Sentinel /></M>} />,
  <Route key="brick-builder" path="/features/brick-builder" element={<M><BrickBuilderFeature /></M>} />,
  <Route key="link-pages" path="/features/link-pages" element={<M><LinkPagesFeature /></M>} />,
  
  // Product Pages
  <Route key="product" path="/product" element={<M><Product /></M>} />,
  <Route key="products" path="/products" element={<M><Products /></M>} />,
  <Route key="link-orchestration" path="/products/link-orchestration" element={<M><LinkOrchestration /></M>} />,
  <Route key="journey-intelligence" path="/products/journey-intelligence" element={<M><JourneyIntelligence /></M>} />,
  <Route key="qr-studio" path="/products/qr-studio" element={<M><QRStudio /></M>} />,
  <Route key="data-pipeline" path="/products/data-pipeline" element={<M><DataPipeline /></M>} />,
  
  // Solution Pages
  <Route key="solutions" path="/solutions" element={<M><SolutionsHub /></M>} />,
  <Route key="enterprise" path="/solutions/enterprise" element={<M><EnterpriseSolution /></M>} />,
  <Route key="agencies" path="/solutions/agencies" element={<M><AgenciesSolution /></M>} />,
  <Route key="startups" path="/solutions/startups" element={<M><Startups /></M>} />,
  <Route key="marketers" path="/solutions/marketers" element={<M><Marketers /></M>} />,
  <Route key="sales" path="/solutions/sales" element={<M><Sales /></M>} />,
  <Route key="marketing-ops" path="/solutions/marketing-ops" element={<M><MarketingOps /></M>} />,
  <Route key="developers-solution" path="/solutions/developers" element={<M><DevelopersSolution /></M>} />,
  <Route key="revops" path="/solutions/revops" element={<M><RevOps /></M>} />,
  <Route key="reporting-team" path="/solutions/reporting-team" element={<M><ReportingTeam /></M>} />,
  <Route key="partner-managers" path="/solutions/partner-managers" element={<M><PartnerManagers /></M>} />,
  <Route key="field-marketing" path="/solutions/field-marketing" element={<M><FieldMarketing /></M>} />,
  
  // Comparison Pages
  <Route key="compare" path="/compare" element={<M><CompareHub /></M>} />,
  <Route key="compare-bitly" path="/compare/bitly" element={<M><UtmOneVsBitly /></M>} />,
  <Route key="compare-rebrandly" path="/compare/rebrandly" element={<M><UtmOneVsRebrandly /></M>} />,
  <Route key="compare-short-io" path="/compare/short-io" element={<M><UtmOneVsShortIo /></M>} />,
  <Route key="compare-bl-ink" path="/compare/bl-ink" element={<M><UtmOneVsBlInk /></M>} />,
  <Route key="compare-rewardful" path="/compare/rewardful" element={<M><UtmOneVsRewardful /></M>} />,
  <Route key="compare-partnerstack" path="/compare/partnerstack" element={<M><UtmOneVsPartnerstack /></M>} />,
  <Route key="compare-firstpromoter" path="/compare/firstpromoter" element={<M><UtmOneVsFirstpromoter /></M>} />,
  <Route key="compare-tolt" path="/compare/tolt" element={<M><UtmOneVsTolt /></M>} />,
  
  // Use Case Pages
  <Route key="use-cases" path="/use-cases" element={<M><UseCasesIndex /></M>} />,
  <Route key="ecommerce" path="/use-cases/ecommerce-tracking" element={<M><EcommerceTracking /></M>} />,
  <Route key="saas" path="/use-cases/saas-attribution" element={<M><SaasAttribution /></M>} />,
  <Route key="event-marketing" path="/use-cases/event-marketing" element={<M><EventMarketing /></M>} />,
  <Route key="agency" path="/use-cases/agency-client-reporting" element={<M><AgencyClientReporting /></M>} />,
  <Route key="influencer" path="/use-cases/influencer-campaigns" element={<M><InfluencerCampaigns /></M>} />,
  
  // Static Pages
  <Route key="accessibility" path="/accessibility" element={<M><Accessibility /></M>} />,
  <Route key="permanence" path="/permanence" element={<M><Permanence /></M>} />,
  <Route key="pricing" path="/pricing" element={<M><Pricing /></M>} />,
  <Route key="lifetime-deal" path="/lifetime-deal" element={<M><LifetimeDeal /></M>} />,
  <Route key="about" path="/about" element={<M><About /></M>} />,
  <Route key="docs" path="/docs" element={<M><Docs /></M>} />,
  <Route key="faq" path="/faq" element={<M><FAQ /></M>} />,
  <Route key="changelog" path="/changelog" element={<M><Changelog /></M>} />,
  <Route key="support" path="/support" element={<M><Support /></M>} />,
  <Route key="trust" path="/trust" element={<M><TrustPage /></M>} />,
  <Route key="status" path="/status" element={<M><StatusPage /></M>} />,
  <Route key="roadmap" path="/roadmap" element={<M><PublicRoadmap /></M>} />,
  <Route key="bug-tracker" path="/bug-tracker" element={<M><PublicBugTracker /></M>} />,
  <Route key="blog" path="/blog" element={<Blog />} />,
  <Route key="surprise" path="/surprise" element={<Surprise />} />,
  <Route key="scan" path="/scan" element={<M><ScanPage /></M>} />,
  
  // Docs Pages
  <Route key="docs-api" path="/docs/api" element={<M><APIDocumentation /></M>} />,
  <Route key="docs-playground" path="/docs/playground" element={<M><APIPlayground /></M>} />,
  <Route key="docs-sdks" path="/docs/sdks" element={<M><SDKs /></M>} />,
  <Route key="docs-pixel" path="/docs/pixel-installation" element={<M><PixelInstallation /></M>} />,
  <Route key="docs-revenue" path="/docs/revenue-attribution" element={<M><RevenueAttribution /></M>} />,
  <Route key="docs-crm" path="/docs/crm-integrations" element={<M><CRMIntegrations /></M>} />,
  <Route key="docs-chrome" path="/docs/chrome-extension" element={<M><ChromeExtensionDocs /></M>} />,
  <Route key="docs-geo" path="/docs/geo-targeting" element={<M><GeoTargetingDocs /></M>} />,
  <Route key="docs-identity" path="/docs/identity-graph" element={<M><IdentityGraphDocs /></M>} />,
  <Route key="docs-insights" path="/docs/smart-insights" element={<M><SmartInsightsDocs /></M>} />,
  <Route key="docs-troubleshooting" path="/docs/troubleshooting" element={<M><TroubleshootingDocs /></M>} />,
  
  // Integration redirects
  <Route key="integration-redirect" path="/integration" element={<Navigate to="/features/integrations" replace />} />,
  <Route key="integrations-redirect" path="/integrations" element={<Navigate to="/features/integrations" replace />} />,
  
  // Partner Pages
  <Route key="early-access" path="/early-access" element={<M><EarlyAccess /></M>} />,
  <Route key="invite" path="/invite" element={<M><Invite /></M>} />,
  <Route key="claim-access" path="/claim-access" element={<M><ClaimAccess /></M>} />,
  <Route key="book-demo" path="/book-demo" element={<M><BookDemo /></M>} />,
  <Route key="partners" path="/partners" element={<M><Partners /></M>} />,
  <Route key="partner-apply" path="/partners/apply" element={<M><PartnerApply /></M>} />,
  <Route key="partner-dashboard" path="/partners/dashboard" element={<M><PartnerDashboard /></M>} />,
  <Route key="partner-terms" path="/partners/terms" element={<M><PartnerTerms /></M>} />,
  <Route key="zapier" path="/integrations/zapier" element={<M><ZapierIntegration /></M>} />,
  <Route key="slack" path="/integrations/slack" element={<M><SlackIntegration /></M>} />,
  
  // Legal Pages
  <Route key="legal-privacy" path="/legal/privacy" element={<M><PrivacyLegal /></M>} />,
  <Route key="legal-terms" path="/legal/terms" element={<M><TermsLegal /></M>} />,
  <Route key="legal-permanence" path="/legal/permanence-terms" element={<M><PermanenceTerms /></M>} />,
  <Route key="legal-security" path="/legal/data-security" element={<M><DataSecurity /></M>} />,
  <Route key="legal-cookies" path="/legal/cookie-policy" element={<M><CookiePolicy /></M>} />,
  <Route key="legal-aup" path="/legal/acceptable-use" element={<M><AcceptableUse /></M>} />,
  <Route key="legal-subprocessors" path="/legal/subprocessors" element={<M><Subprocessors /></M>} />,
  <Route key="legal-dpa" path="/legal/dpa" element={<M><DPA /></M>} />,
  <Route key="legal-support" path="/legal/support-policy" element={<M><SupportPolicy /></M>} />,
];
