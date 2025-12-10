import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface TourStep {
  id: string;
  target: string; // CSS selector or element ID
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  spotlightPadding?: number;
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
    title: "quick link creation",
    description: "create short links instantly from here. just paste a URL and we'll handle the rest.",
    position: "bottom",
    spotlightPadding: 8,
  },
  {
    id: "sidebar-links",
    target: "[data-tour='nav-links']",
    title: "manage your links",
    description: "view and manage all your shortened links, edit destinations, and track performance.",
    position: "right",
    spotlightPadding: 4,
  },
  {
    id: "sidebar-analytics",
    target: "[data-tour='nav-intelligence']",
    title: "analytics dashboard",
    description: "dive deep into click data, geographic insights, device breakdowns, and attribution.",
    position: "right",
    spotlightPadding: 4,
  },
  {
    id: "sidebar-qr",
    target: "[data-tour='nav-qr-codes']",
    title: "qr code generator",
    description: "generate branded QR codes for any link. customize colors and download in multiple formats.",
    position: "right",
    spotlightPadding: 4,
  },
  {
    id: "sidebar-events",
    target: "[data-tour='nav-events']",
    title: "event tracking",
    description: "track field marketing events and measure their impact with geo-temporal attribution.",
    position: "right",
    spotlightPadding: 4,
  },
  {
    id: "workspace-switcher",
    target: "[data-tour='workspace-switcher']",
    title: "workspace switcher",
    description: "switch between workspaces or create new ones for different teams or projects.",
    position: "right",
    spotlightPadding: 8,
  },
];

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps] = useState<TourStep[]>(DASHBOARD_TOUR_STEPS);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(async (completed = true) => {
    setIsActive(false);
    setCurrentStep(0);

    if (user && completed) {
      // Mark tour as completed in database
      await supabase
        .from("profiles")
        .update({ has_completed_tour: true })
        .eq("id", user.id);
    }
  }, [user]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour(true);
    }
  }, [currentStep, steps.length, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    endTour(true);
  }, [endTour]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  }, [steps.length]);

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
