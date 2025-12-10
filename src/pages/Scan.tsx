import { useNavigate } from "react-router-dom";
import { OneTapScanner2 } from "@/components/events/scanner/OneTapScanner2";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

/**
 * One-Tap Scanner 2.0 Page
 * Full-screen camera-first experience optimized for speed
 */
const ScanPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <OneTapScanner2 
        eventId="quick-scan"
        eventName="Quick Scan"
        onViewLeads={() => navigate('/dashboard/events')}
      />
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </>
  );
};

export default ScanPage;
