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

// Resources
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
const Tools = React.lazy(() => import("@/pages/resources/Tools"));

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

// Tools
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

      {/* Resources */}
      <Route path="/resources" element={<M><Resources /></M>} />
      <Route path="/resources/guides" element={<M><Guides /></M>} />
      <Route path="/resources/guides/*" element={<M><Guides /></M>} />
      <Route path="/resources/playbooks" element={<M><Playbooks /></M>} />
      <Route path="/resources/playbooks/*" element={<M><Playbooks /></M>} />
      <Route path="/resources/templates" element={<M><Templates /></M>} />
      <Route path="/resources/templates/*" element={<M><Templates /></M>} />
      <Route path="/resources/checklists" element={<M><Checklists /></M>} />
      <Route path="/resources/checklists/*" element={<M><Checklists /></M>} />
      <Route path="/resources/frameworks" element={<M><Frameworks /></M>} />
      <Route path="/resources/frameworks/*" element={<M><Frameworks /></M>} />
      <Route path="/resources/examples" element={<M><Examples /></M>} />
      <Route path="/resources/examples/*" element={<M><Examples /></M>} />
      <Route path="/resources/glossary" element={<M><Glossary /></M>} />
      <Route path="/resources/glossary/*" element={<M><Glossary /></M>} />
      <Route path="/resources/academy" element={<M><Academy /></M>} />
      <Route path="/resources/reports" element={<M><Reports /></M>} />
      <Route path="/resources/reports/*" element={<M><Reports /></M>} />
      <Route path="/resources/tools" element={<M><Tools /></M>} />
      <Route path="/resources/tools/*" element={<M><Tools /></M>} />

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
      <Route path="/tools/shorten" element={<M><PublicURLShortener /></M>} />
      <Route path="/tools/utm-builder" element={<M><PublicUTMBuilder /></M>} />
      <Route path="/tools/utm-builder-linkedin" element={<M><UTMBuilderLinkedIn /></M>} />
      <Route path="/tools/utm-builder-facebook" element={<M><UTMBuilderFacebook /></M>} />
      <Route path="/tools/utm-builder-google-ads" element={<M><UTMBuilderGoogleAds /></M>} />
      <Route path="/tools/utm-builder-tiktok" element={<M><UTMBuilderTikTok /></M>} />
      <Route path="/tools/utm-builder-email" element={<M><UTMBuilderEmail /></M>} />
      <Route path="/tools/link-health-checker" element={<M><PublicLinkHealthChecker /></M>} />
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
      <Route path="/coming-soon" element={<M><ComingSoonPage /></M>} />
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
