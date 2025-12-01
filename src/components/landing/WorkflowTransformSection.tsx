import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductMockup } from "@/components/product/ProductMockup";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
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
    <section className="relative py-32 md:py-40 overflow-hidden bg-background flex flex-col justify-center">
      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-6 mb-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 brand-lowercase"
        >
          how it transforms your workflow
        </motion.h2>
      </div>

      {/* Three-Card Carousel Container */}
      <div className="relative max-w-[1600px] mx-auto w-full px-6">
        <div className="relative min-h-[800px] flex items-center justify-center">
          
          {/* Left Peek Card */}
          {activeIndex > 0 && (
            <motion.div
              key={`left-${activeIndex - 1}`}
              onClick={handlePrev}
              className="absolute left-4 w-[20%] cursor-pointer transition-all hover:opacity-70"
              style={{ 
                opacity: 0.5,
                transform: 'scale(0.85) translateX(-10%)',
                zIndex: 1
              }}
              initial={false}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/80 rounded-xl p-6">
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                    {steps[activeIndex - 1].number}
                  </span>
                  <h3 className="text-xl font-display font-semibold text-foreground/70 brand-lowercase">
                    {steps[activeIndex - 1].title}
                  </h3>
                </div>
              </div>
            </motion.div>
          )}

          {/* Center Active Card */}
          <div className="relative w-[70%] max-w-6xl z-20" {...bind()} style={{ touchAction: "pan-y" }}>
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
                <div className="bg-white rounded-2xl p-10 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center">
                    {/* Mockup */}
                    <div className="w-full md:w-[55%] flex-shrink-0">
                      <ProductMockup type={steps[activeIndex].mockupType} size="large" />
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-[45%] space-y-6">
                      {/* Step Counter */}
                      <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                        {steps[activeIndex].number}
                      </span>

                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-display font-semibold text-foreground brand-lowercase leading-snug tracking-tight">
                        {steps[activeIndex].title}
                      </h3>

                      {/* Description */}
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {steps[activeIndex].description}
                      </p>

                      {/* Metric */}
                      <span className="text-lg font-semibold text-primary">
                        {steps[activeIndex].metric}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Peek Card */}
          {activeIndex < steps.length - 1 && (
            <motion.div
              key={`right-${activeIndex + 1}`}
              onClick={handleNext}
              className="absolute right-4 w-[20%] cursor-pointer transition-all hover:opacity-70"
              style={{ 
                opacity: 0.5,
                transform: 'scale(0.85) translateX(10%)',
                zIndex: 1
              }}
              initial={false}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/80 rounded-xl p-6">
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
                    {steps[activeIndex + 1].number}
                  </span>
                  <h3 className="text-xl font-display font-semibold text-foreground/70 brand-lowercase">
                    {steps[activeIndex + 1].title}
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Minimal Navigation Controls */}
        <div className="flex items-center justify-center gap-8 mt-12">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={activeIndex === steps.length - 1}
            className="w-10 h-10 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next step"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
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
