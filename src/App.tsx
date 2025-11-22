import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Links from "./pages/Links";
import LinkDetail from "./pages/LinkDetail";
import Analytics from "./pages/Analytics";
import OnboardingEnhanced from "./pages/OnboardingEnhanced";
import Settings from "./pages/Settings";
import LandingAnalytics from "./pages/LandingAnalytics";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Marketers from "./pages/solutions/Marketers";
import Sales from "./pages/solutions/Sales";
import MarketingOps from "./pages/solutions/MarketingOps";
import Developers from "./pages/solutions/Developers";
import EarlyAccess from "./pages/EarlyAccess";
import EarlyAccessAdmin from "./pages/admin/EarlyAccessAdmin";
import WaitlistAnalytics from "./pages/admin/WaitlistAnalytics";
import Invite from "./pages/Invite";
import ClaimAccess from "./pages/ClaimAccess";

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
          <Route path="/admin/landing-analytics" element={<LandingAnalytics />} />
          <Route path="/admin/early-access" element={<EarlyAccessAdmin />} />
          <Route path="/admin/waitlist-analytics" element={<WaitlistAnalytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/domains" element={<Settings />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solutions/marketers" element={<Marketers />} />
          <Route path="/solutions/sales" element={<Sales />} />
          <Route path="/solutions/marketing-ops" element={<MarketingOps />} />
          <Route path="/solutions/developers" element={<Developers />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/invite/:code" element={<Invite />} />
          <Route path="/claim-access" element={<ClaimAccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
