import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Resources from "./pages/Resources";
import Guides from "./pages/resources/Guides";
import UTMGuide from "./pages/resources/guides/UTMGuide";
import CleanTrackFramework from "./pages/resources/guides/CleanTrackFramework";
import TrackingArchitecture from "./pages/resources/guides/TrackingArchitecture";
import SimpleAnalytics from "./pages/resources/guides/SimpleAnalytics";
import GrowthAnalytics from "./pages/resources/guides/GrowthAnalytics";
import LLMSeo from "./pages/resources/guides/LLMSeo";
import UTMGovernancePlaybook from "./pages/resources/playbooks/UTMGovernancePlaybook";
import StartupAnalyticsPlaybook from "./pages/resources/playbooks/StartupAnalyticsPlaybook";
import EventLedGrowthPlaybook from "./pages/resources/playbooks/EventLedGrowthPlaybook";
import NamingConventionPlaybook from "./pages/resources/playbooks/NamingConventionPlaybook";
import Playbooks from "./pages/resources/Playbooks";
import Templates from "./pages/resources/Templates";
import UTMTemplate from "./pages/resources/templates/UTMTemplate";
import AuditChecklistTemplate from "./pages/resources/templates/AuditChecklistTemplate";
import CampaignBriefTemplate from "./pages/resources/templates/CampaignBriefTemplate";
import NamingTaxonomyTemplate from "./pages/resources/templates/NamingTaxonomyTemplate";
import Checklists from "./pages/resources/Checklists";
import Frameworks from "./pages/resources/Frameworks";
import Examples from "./pages/resources/Examples";
import Glossary from "./pages/resources/Glossary";
import Academy from "./pages/resources/Academy";
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
import PasswordProtected from "./pages/PasswordProtected";
import APIDocumentation from "./pages/Docs/API";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/password-protected" element={<PasswordProtected />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/lifetime-deal" element={<LifetimeDeal />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/api" element={<APIDocumentation />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/guides" element={<Guides />} />
          <Route path="/resources/guides/utm-guide" element={<UTMGuide />} />
          <Route path="/resources/guides/clean-track-framework" element={<CleanTrackFramework />} />
          <Route path="/resources/guides/tracking-architecture" element={<TrackingArchitecture />} />
          <Route path="/resources/guides/simple-analytics" element={<SimpleAnalytics />} />
          <Route path="/resources/guides/growth-analytics" element={<GrowthAnalytics />} />
          <Route path="/resources/guides/llm-seo" element={<LLMSeo />} />
          
          {/* Playbook Routes */}
          <Route path="/resources/playbooks/utm-governance-playbook" element={<UTMGovernancePlaybook />} />
          <Route path="/resources/playbooks/startup-analytics-playbook" element={<StartupAnalyticsPlaybook />} />
          <Route path="/resources/playbooks/event-led-growth-playbook" element={<EventLedGrowthPlaybook />} />
          <Route path="/resources/playbooks/naming-convention-playbook" element={<NamingConventionPlaybook />} />
          <Route path="/resources/playbooks" element={<Playbooks />} />
          
          {/* Template Routes */}
          <Route path="/resources/templates/utm-template" element={<UTMTemplate />} />
          <Route path="/resources/templates/audit-checklist-template" element={<AuditChecklistTemplate />} />
          <Route path="/resources/templates/campaign-brief-template" element={<CampaignBriefTemplate />} />
          <Route path="/resources/templates/naming-taxonomy-template" element={<NamingTaxonomyTemplate />} />
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
