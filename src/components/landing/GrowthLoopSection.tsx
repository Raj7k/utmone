import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { AnimatedSection } from "./StaticSection";
import { Calculator, ClipboardCheck } from "lucide-react";
import { preserveAcronyms as p } from "@/utils/textFormatter";

export const GrowthLoopSection = () => {
  const [activeTab, setActiveTab] = useState("quiz");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-transparent">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1
            className={`hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            how clean is your data?
          </h1>
          <p
            className={`text-base md:text-lg max-w-2xl mx-auto text-white-50 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            take our quick assessment or calculate your potential savings. share your results with your team.
          </p>
        </div>

        {/* Tabs */}
        <div
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                data quality quiz
              </TabsTrigger>
              <TabsTrigger value="roi" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {p("ROI calculator")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quiz" className="mt-0">
              <CleanTrackScoreQuiz />
            </TabsContent>
            
            <TabsContent value="roi" className="mt-0">
              <ROICalculator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AnimatedSection>
  );
};
