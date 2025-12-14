import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { MarketingSkeleton } from "@/components/SkeletonLoader";

// Public Tools
const PublicQRGenerator = lazy(() => import("@/pages/tools/QRGenerator"));
const PublicURLShortener = lazy(() => import("@/pages/tools/URLShortener"));
const PublicUTMBuilder = lazy(() => import("@/pages/tools/UTMBuilder"));
const UTMBuilderLinkedIn = lazy(() => import("@/pages/tools/UTMBuilderLinkedIn"));
const UTMBuilderFacebook = lazy(() => import("@/pages/tools/UTMBuilderFacebook"));
const UTMBuilderGoogleAds = lazy(() => import("@/pages/tools/UTMBuilderGoogleAds"));
const UTMBuilderTikTok = lazy(() => import("@/pages/tools/UTMBuilderTikTok"));
const UTMBuilderEmail = lazy(() => import("@/pages/tools/UTMBuilderEmail"));
const PublicLinkHealthChecker = lazy(() => import("@/pages/tools/LinkHealthChecker"));
const DecisionFrameworks = lazy(() => import("@/pages/tools/DecisionFrameworks"));
const ToolsHub = lazy(() => import("@/pages/tools/ToolsHub"));
const Scanner = lazy(() => import("@/pages/tools/Scanner"));
const Casino = lazy(() => import("@/pages/tools/Casino"));
const Galaxy = lazy(() => import("@/pages/tools/Galaxy"));
const QRTest = lazy(() => import("@/pages/tools/QRTest"));
const LoaderDemo = lazy(() => import("@/pages/LoaderDemo"));

// Resource Tools
const Tools = lazy(() => import("@/pages/resources/Tools"));
const SalaryNegotiationCoach = lazy(() => import("@/pages/resources/tools/SalaryNegotiationCoach"));
const MarketValueCalculator = lazy(() => import("@/pages/resources/tools/MarketValueCalculator"));
const CareerPathOptimizer = lazy(() => import("@/pages/resources/tools/CareerPathOptimizer"));
const JobOfferAnalyzer = lazy(() => import("@/pages/resources/tools/JobOfferAnalyzer"));
const TeamBudgetOptimizer = lazy(() => import("@/pages/resources/tools/TeamBudgetOptimizer"));
const AIvsHumanROI = lazy(() => import("@/pages/resources/tools/AIvsHumanROI"));
const CompensationTransparency = lazy(() => import("@/pages/resources/tools/CompensationTransparency"));
const LinkedInRealityCheck = lazy(() => import("@/pages/resources/tools/LinkedInRealityCheck"));

const M = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<MarketingSkeleton />}>{children}</Suspense>
);

export const toolsRoutes = [
  // Public Tools
  <Route key="tools-hub" path="/tools" element={<M><ToolsHub /></M>} />,
  <Route key="tools-qr" path="/tools/qr-generator" element={<M><PublicQRGenerator /></M>} />,
  <Route key="tools-url" path="/tools/url-shortener" element={<M><PublicURLShortener /></M>} />,
  <Route key="tools-utm" path="/tools/utm-builder" element={<M><PublicUTMBuilder /></M>} />,
  <Route key="tools-utm-linkedin" path="/tools/utm-builder/linkedin" element={<M><UTMBuilderLinkedIn /></M>} />,
  <Route key="tools-utm-facebook" path="/tools/utm-builder/facebook" element={<M><UTMBuilderFacebook /></M>} />,
  <Route key="tools-utm-google" path="/tools/utm-builder/google-ads" element={<M><UTMBuilderGoogleAds /></M>} />,
  <Route key="tools-utm-tiktok" path="/tools/utm-builder/tiktok" element={<M><UTMBuilderTikTok /></M>} />,
  <Route key="tools-utm-email" path="/tools/utm-builder/email" element={<M><UTMBuilderEmail /></M>} />,
  <Route key="tools-health" path="/tools/link-health-checker" element={<M><PublicLinkHealthChecker /></M>} />,
  <Route key="tools-frameworks" path="/tools/decision-frameworks" element={<M><DecisionFrameworks /></M>} />,
  <Route key="tools-scanner" path="/tools/scanner" element={<M><Scanner /></M>} />,
  <Route key="tools-casino" path="/tools/casino" element={<M><Casino /></M>} />,
  <Route key="tools-galaxy" path="/tools/galaxy" element={<M><Galaxy /></M>} />,
  <Route key="tools-qr-test" path="/tools/qr-test" element={<M><QRTest /></M>} />,
  <Route key="loader-demo" path="/loader-demo" element={<M><LoaderDemo /></M>} />,
  
  // Resource Tools
  <Route key="resource-tools" path="/resources/tools" element={<M><Tools /></M>} />,
  <Route key="salary-coach" path="/resources/tools/salary-negotiation-coach" element={<M><SalaryNegotiationCoach /></M>} />,
  <Route key="market-value" path="/resources/tools/market-value-calculator" element={<M><MarketValueCalculator /></M>} />,
  <Route key="career-path" path="/resources/tools/career-path-optimizer" element={<M><CareerPathOptimizer /></M>} />,
  <Route key="job-offer" path="/resources/tools/job-offer-analyzer" element={<M><JobOfferAnalyzer /></M>} />,
  <Route key="team-budget" path="/resources/tools/team-budget-optimizer" element={<M><TeamBudgetOptimizer /></M>} />,
  <Route key="ai-roi" path="/resources/tools/ai-vs-human-roi" element={<M><AIvsHumanROI /></M>} />,
  <Route key="compensation" path="/resources/tools/compensation-transparency" element={<M><CompensationTransparency /></M>} />,
  <Route key="linkedin-check" path="/resources/tools/linkedin-reality-check" element={<M><LinkedInRealityCheck /></M>} />,
];
