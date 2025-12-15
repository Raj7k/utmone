import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lightweight skeleton for marketing pages - just header placeholder
const MarketingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-16 border-b border-border/50 animate-pulse bg-muted/10" />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-muted/20 rounded animate-pulse mb-4" />
      <div className="h-4 w-96 bg-muted/10 rounded animate-pulse" />
    </div>
  </div>
);

// Critical marketing pages - static imports for instant load
import Index from "@/public/routes/Index";
import Auth from "@/pages/Auth";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";

// Feature pages - lazy loaded
const Features = lazy(() => import("@/public/routes/Features"));
const ShortLinks = lazy(() => import("@/pages/features/ShortLinks"));
const UTMBuilder = lazy(() => import("@/pages/features/UTMBuilder"));
const QRGenerator = lazy(() => import("@/pages/features/QRGenerator"));
const AnalyticsFeature = lazy(() => import("@/pages/features/Analytics"));
const EnterpriseControl = lazy(() => import("@/pages/features/EnterpriseControl"));
const CleanTrack = lazy(() => import("@/pages/features/CleanTrack"));
const EventHalo = lazy(() => import("@/pages/features/EventHalo"));
const AIIntelligence = lazy(() => import("@/pages/features/AIIntelligence"));
const Sentinel = lazy(() => import("@/pages/features/Sentinel"));
const BrickBuilderFeature = lazy(() => import("@/pages/features/BrickBuilder"));
const PredictiveAnalytics = lazy(() => import("@/pages/features/PredictiveAnalytics"));
const AttributionGraph = lazy(() => import("@/pages/features/AttributionGraph"));
const SmartRouting = lazy(() => import("@/pages/features/SmartRouting"));
const PartnerProgram = lazy(() => import("@/pages/features/PartnerProgram"));
const Integrations = lazy(() => import("@/pages/features/Integrations"));
const CustomDomains = lazy(() => import("@/pages/features/CustomDomains"));
const Workspaces = lazy(() => import("@/pages/features/Workspaces"));
const Reporting = lazy(() => import("@/pages/features/Reporting"));

// Solution pages
const SolutionsHub = lazy(() => import("@/pages/Solutions"));
const Marketers = lazy(() => import("@/pages/solutions/Marketers"));
const Sales = lazy(() => import("@/pages/solutions/Sales"));
const MarketingOps = lazy(() => import("@/pages/solutions/MarketingOps"));
const Developers = lazy(() => import("@/pages/solutions/Developers"));
const PartnerManagers = lazy(() => import("@/pages/solutions/PartnerManagers"));
const FieldMarketing = lazy(() => import("@/pages/solutions/FieldMarketing"));
const EnterpriseSolution = lazy(() => import("@/pages/solutions/Enterprise"));
const AgenciesSolution = lazy(() => import("@/pages/solutions/Agencies"));
const Startups = lazy(() => import("@/pages/solutions/Startups"));

// Product pages
const Product = lazy(() => import("@/pages/Product"));
const Products = lazy(() => import("@/pages/Products"));

// Other marketing pages
const Pricing = lazy(() => import("@/public/routes/Pricing"));
const About = lazy(() => import("@/pages/AboutNew"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Changelog = lazy(() => import("@/pages/Changelog"));
const Support = lazy(() => import("@/pages/Support"));
const TrustPage = lazy(() => import("@/pages/Trust"));
const StatusPage = lazy(() => import("@/pages/Status"));
const HowItWorks = lazy(() => import("@/pages/HowItWorksNew"));
const Blog = lazy(() => import("@/pages/Blog"));

// Compare pages
const CompareHub = lazy(() => import("@/pages/Compare"));
const UtmOneVsBitly = lazy(() => import("@/pages/compare/UtmOneVsBitly"));
const UtmOneVsRebrandly = lazy(() => import("@/pages/compare/UtmOneVsRebrandly"));

// Resources - lazy loaded on demand
const Resources = lazy(() => import("@/pages/Resources"));
const Guides = lazy(() => import("@/pages/resources/Guides"));
const Playbooks = lazy(() => import("@/pages/resources/Playbooks"));
const Templates = lazy(() => import("@/pages/resources/Templates"));
const Glossary = lazy(() => import("@/pages/resources/Glossary"));
const Academy = lazy(() => import("@/pages/resources/Academy"));

// Tools
const ToolsHub = lazy(() => import("@/pages/tools/ToolsHub"));
const PublicQRGenerator = lazy(() => import("@/pages/tools/QRGenerator"));
const PublicURLShortener = lazy(() => import("@/pages/tools/URLShortener"));
const PublicUTMBuilder = lazy(() => import("@/pages/tools/UTMBuilder"));

// Help
const HelpIndex = lazy(() => import("@/pages/Help/index"));

// Legal
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));

// Early Access
const EarlyAccess = lazy(() => import("@/pages/EarlyAccess"));

const wrap = (Component: React.ComponentType) => (
  <Suspense fallback={<MarketingSkeleton />}>
    <Component />
  </Suspense>
);

export function MarketingRoutes() {
  return (
    <Routes>
      {/* Critical - static imports */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Features */}
      <Route path="/features" element={wrap(Features)} />
      <Route path="/features/short-links" element={wrap(ShortLinks)} />
      <Route path="/features/utm-builder" element={wrap(UTMBuilder)} />
      <Route path="/features/qr-generator" element={wrap(QRGenerator)} />
      <Route path="/features/analytics" element={wrap(AnalyticsFeature)} />
      <Route path="/features/enterprise-control" element={wrap(EnterpriseControl)} />
      <Route path="/features/clean-track" element={wrap(CleanTrack)} />
      <Route path="/features/event-halo" element={wrap(EventHalo)} />
      <Route path="/features/ai-intelligence" element={wrap(AIIntelligence)} />
      <Route path="/features/sentinel" element={wrap(Sentinel)} />
      <Route path="/features/brick-builder" element={wrap(BrickBuilderFeature)} />
      <Route path="/features/predictive-analytics" element={wrap(PredictiveAnalytics)} />
      <Route path="/features/attribution-graph" element={wrap(AttributionGraph)} />
      <Route path="/features/smart-routing" element={wrap(SmartRouting)} />
      <Route path="/features/partner-program" element={wrap(PartnerProgram)} />
      <Route path="/features/integrations" element={wrap(Integrations)} />
      <Route path="/features/custom-domains" element={wrap(CustomDomains)} />
      <Route path="/features/workspaces" element={wrap(Workspaces)} />
      <Route path="/features/reporting" element={wrap(Reporting)} />

      {/* Solutions */}
      <Route path="/solutions" element={wrap(SolutionsHub)} />
      <Route path="/solutions/marketers" element={wrap(Marketers)} />
      <Route path="/solutions/sales" element={wrap(Sales)} />
      <Route path="/solutions/marketing-ops" element={wrap(MarketingOps)} />
      <Route path="/solutions/developers" element={wrap(Developers)} />
      <Route path="/solutions/partner-managers" element={wrap(PartnerManagers)} />
      <Route path="/solutions/field-marketing" element={wrap(FieldMarketing)} />
      <Route path="/solutions/enterprise" element={wrap(EnterpriseSolution)} />
      <Route path="/solutions/agencies" element={wrap(AgenciesSolution)} />
      <Route path="/solutions/startups" element={wrap(Startups)} />

      {/* Product */}
      <Route path="/product" element={wrap(Product)} />
      <Route path="/products" element={wrap(Products)} />

      {/* Marketing */}
      <Route path="/pricing" element={wrap(Pricing)} />
      <Route path="/about" element={wrap(About)} />
      <Route path="/faq" element={wrap(FAQ)} />
      <Route path="/changelog" element={wrap(Changelog)} />
      <Route path="/support" element={wrap(Support)} />
      <Route path="/trust" element={wrap(TrustPage)} />
      <Route path="/status" element={wrap(StatusPage)} />
      <Route path="/how-it-works" element={wrap(HowItWorks)} />
      <Route path="/blog" element={wrap(Blog)} />
      <Route path="/early-access" element={wrap(EarlyAccess)} />
      <Route path="/privacy-policy" element={wrap(PrivacyPolicy)} />

      {/* Compare */}
      <Route path="/compare" element={wrap(CompareHub)} />
      <Route path="/compare/bitly" element={wrap(UtmOneVsBitly)} />
      <Route path="/compare/rebrandly" element={wrap(UtmOneVsRebrandly)} />

      {/* Resources */}
      <Route path="/resources" element={wrap(Resources)} />
      <Route path="/resources/guides" element={wrap(Guides)} />
      <Route path="/resources/playbooks" element={wrap(Playbooks)} />
      <Route path="/resources/templates" element={wrap(Templates)} />
      <Route path="/resources/glossary" element={wrap(Glossary)} />
      <Route path="/resources/academy" element={wrap(Academy)} />

      {/* Tools */}
      <Route path="/tools" element={wrap(ToolsHub)} />
      <Route path="/tools/qr-generator" element={wrap(PublicQRGenerator)} />
      <Route path="/tools/url-shortener" element={wrap(PublicURLShortener)} />
      <Route path="/tools/utm-builder" element={wrap(PublicUTMBuilder)} />

      {/* Help */}
      <Route path="/help" element={wrap(HelpIndex)} />
      <Route path="/help/*" element={wrap(HelpIndex)} />
    </Routes>
  );
}

