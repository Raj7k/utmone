import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useAuthSession } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  spotlightPadding?: number;
  route?: string; // Optional route to navigate to for this step
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  endTour: (completed?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  goToStep: (index: number) => void;
}

const TourContext = createContext<TourContextType | null>(null);

const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='quick-create']",
    title: "create links instantly",
    description: "paste any URL here to create a tracked short link in seconds. this is your quick-start hub.",
    position: "bottom",
    spotlightPadding: 8,
    route: "/dashboard",
  },
  {
    id: "links",
    target: "[data-tour='nav-links']",
    title: "manage all your links",
    description: "view, edit, and organize all your shortened links. track performance and update destinations anytime.",
    position: "right",
    spotlightPadding: 4,
    route: "/dashboard",
  },
  {
    id: "intelligence",
    target: "[data-tour='nav-intelligence']",
    title: "analytics & intelligence",
    description: "dive deep into click data, geographic insights, device breakdowns, and multi-touch attribution.",
    position: "right",
    spotlightPadding: 4,
    route: "/dashboard",
  },
  {
    id: "events",
    target: "[data-tour='nav-events']",
    title: "track field events",
    description: "manage conferences, trade shows, and meetups. use Event Halo to measure offline event impact.",
    position: "right",
    spotlightPadding: 4,
    route: "/dashboard",
  },
  {
    id: "sales",
    target: "[data-tour='nav-sales']",
    title: "sales attribution",
    description: "connect clicks to revenue. see which links and campaigns drive actual sales.",
    position: "right",
    spotlightPadding: 4,
    route: "/dashboard",
  },
  {
    id: "qr-codes",
    target: "[data-tour='nav-qr-codes']",
    title: "QR code generator",
    description: "create branded QR codes for any link. customize colors and download in multiple formats.",
    position: "right",
    spotlightPadding: 4,
    route: "/dashboard",
  },
  {
    id: "qr-ai",
    target: "[data-tour='qr-create-tab']",
    title: "AI-powered QR codes",
    description: "use AI to generate beautiful, artistic QR codes that match your brand aesthetic.",
    position: "bottom",
    spotlightPadding: 4,
    route: "/dashboard/qr-codes",
  },
  {
    id: "brick-builder",
    target: "[data-tour='qr-brick-tab']",
    title: "brick builder",
    description: "create buildable LEGO-style QR codes. perfect for events, displays, and unique brand experiences.",
    position: "bottom",
    spotlightPadding: 4,
    route: "/dashboard/qr-codes",
  },
  {
    id: "feedback",
    target: "[data-tour='feedback-link']",
    title: "report bugs & feedback",
    description: "found something broken? have a suggestion? click here to let us know. we read every message.",
    position: "right",
    spotlightPadding: 4,
    route: "/dashboard",
  },
  {
    id: "complete",
    target: "[data-tour='quick-actions']",
    title: "you're all set!",
    description: "use these quick actions to jump to any feature. welcome to utm.one — let's create something great.",
    position: "bottom",
    spotlightPadding: 8,
    route: "/dashboard",
  },
];

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps] = useState<TourStep[]>(DASHBOARD_TOUR_STEPS);

  const navigateToStep = useCallback((stepIndex: number) => {
    const step = steps[stepIndex];
    if (step?.route) {
      navigate(step.route);
    }
  }, [steps, navigate]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
    navigateToStep(0);
  }, [navigateToStep]);

  const endTour = useCallback(async (completed = true) => {
    setIsActive(false);
    setCurrentStep(0);
    navigate("/dashboard");

    if (user && completed) {
      await supabaseFrom('profiles')
        .update({ has_completed_tour: true })
        .eq("id", user.id);
    }
  }, [user, navigate]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      navigateToStep(nextIndex);
    } else {
      endTour(true);
    }
  }, [currentStep, steps.length, endTour, navigateToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      navigateToStep(prevIndex);
    }
  }, [currentStep, navigateToStep]);

  const skipTour = useCallback(() => {
    endTour(true);
  }, [endTour]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
      navigateToStep(index);
    }
  }, [steps.length, navigateToStep]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
        goToStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
