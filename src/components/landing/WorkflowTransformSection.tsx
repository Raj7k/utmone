import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductMockup } from "@/components/product/ProductMockup";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const WorkflowTransformSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const steps = [
    {
      number: "01",
      title: "identity resolution",
      metric: "2.3x accuracy",
      mockupType: "identity-stitching" as const,
      description: "De-anonymize your traffic. Remember that visitor from 3 weeks ago? When they sign up, we backfill their entire history."
    },
    {
      number: "02",
      title: "bayesian attribution",
      metric: "true roi",
      mockupType: "attribution-graph" as const,
      description: "See which touchpoints actually drive conversions. Multi-touch attribution that shows the real ROI of every channel."
    },
    {
      number: "03",
      title: "journey valuation",
      metric: "$ per page",
      mockupType: "state-value" as const,
      description: "Calculate the dollar value of every page on your site. Know exactly which content drives revenue."
    },
    {
      number: "04",
      title: "golden path discovery",
      metric: "optimal routes",
      mockupType: "golden-path" as const,
      description: "Find the Pareto-optimal paths to conversion. Surface the hidden sequences that drive 80% of your results."
    },
  ];

  const handleNext = () => {
    if (activeIndex < steps.length - 1) {
      setDirection(1);
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex((prev) => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const { bind } = useSwipeGesture({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
    threshold: 50,
  });

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 1.0, 
        ease: [0.4, 0, 0.2, 1] as any
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: { 
        duration: 0.8, 
        ease: [0.4, 0, 0.2, 1] as any
      },
    }),
  };

  return (
    <section className="relative py-24 md:py-32 bg-muted/20 overflow-hidden">
      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold text-label mb-4 brand-lowercase"
        >
          how it transforms your workflow
        </motion.h2>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto px-6">
        <div {...bind()} className="relative overflow-hidden" style={{ touchAction: "pan-y" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {/* Large Card */}
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                  {/* Mockup */}
                  <div className="w-full md:w-1/2 flex-shrink-0">
                    <ProductMockup type={steps[activeIndex].mockupType} size="large" />
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 space-y-6">
                    {/* Step Counter */}
                    <div className="inline-flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {steps[activeIndex].number}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Step {activeIndex + 1} of {steps.length}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-label brand-lowercase">
                      {steps[activeIndex].title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {steps[activeIndex].description}
                    </p>

                    {/* Metric */}
                    <div className="inline-flex items-center px-6 py-3 bg-primary/10 rounded-full">
                      <span className="text-base font-semibold text-primary">
                        {steps[activeIndex].metric}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8 gap-4">
          {/* Previous Button */}
          <Button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Progress Dots */}
          <div className="flex items-center gap-3">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-12 bg-primary"
                    : "w-2.5 bg-primary/20 hover:bg-primary/40"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={activeIndex === steps.length - 1}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <span className="hidden sm:inline">Next Step</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-6 text-center md:hidden">
          <p className="text-sm text-muted-foreground">
            Swipe left or right to navigate
          </p>
        </div>
      </div>
    </section>
  );
};
