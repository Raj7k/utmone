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
    <section className="relative min-h-screen py-16 bg-muted/20 overflow-hidden flex flex-col justify-center">
      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-6 mb-12 text-center">
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

      {/* Three-Card Carousel Container */}
      <div className="relative max-w-[1600px] mx-auto w-full px-6">
        <div className="relative min-h-[700px] flex items-center justify-center">
          
          {/* Left Peek Card */}
          {activeIndex > 0 && (
            <motion.div
              key={`left-${activeIndex - 1}`}
              onClick={handlePrev}
              className="absolute left-4 w-[25%] cursor-pointer transition-all hover:opacity-60 hover:scale-[0.78]"
              style={{ 
                opacity: 0.4,
                filter: 'blur(2px)',
                transform: 'scale(0.8) translateX(-10%)',
                zIndex: 1
              }}
              initial={false}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-card/70 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/30 flex items-center justify-center font-bold text-xl text-primary">
                    {steps[activeIndex - 1].number}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-label/70 brand-lowercase">
                    {steps[activeIndex - 1].title}
                  </h3>
                  <div className="w-16 h-1 bg-primary/20 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Center Active Card */}
          <div className="relative w-[60%] max-w-4xl z-20" {...bind()} style={{ touchAction: "pan-y" }}>
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
                <div className="bg-card backdrop-blur-xl border-2 border-border rounded-[32px] p-10 md:p-14 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)]">
                  <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center">
                    {/* Mockup */}
                    <div className="w-full md:w-1/2 flex-shrink-0">
                      <ProductMockup type={steps[activeIndex].mockupType} size="large" />
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2 space-y-8">
                      {/* Step Counter */}
                      <div className="inline-flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20">
                          {steps[activeIndex].number}
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Step {activeIndex + 1} of {steps.length}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-4xl md:text-5xl font-display font-bold text-label brand-lowercase leading-tight">
                        {steps[activeIndex].title}
                      </h3>

                      {/* Description */}
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {steps[activeIndex].description}
                      </p>

                      {/* Metric */}
                      <div className="inline-flex items-center px-8 py-4 bg-primary/10 rounded-full border border-primary/20">
                        <span className="text-lg font-bold text-primary">
                          {steps[activeIndex].metric}
                        </span>
                      </div>
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
              className="absolute right-4 w-[25%] cursor-pointer transition-all hover:opacity-60 hover:scale-[0.78]"
              style={{ 
                opacity: 0.4,
                filter: 'blur(2px)',
                transform: 'scale(0.8) translateX(10%)',
                zIndex: 1
              }}
              initial={false}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-card/70 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/30 flex items-center justify-center font-bold text-xl text-primary">
                    {steps[activeIndex + 1].number}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-label/70 brand-lowercase">
                    {steps[activeIndex + 1].title}
                  </h3>
                  <div className="w-16 h-1 bg-primary/20 rounded-full" />
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
            className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center transition-all hover:bg-muted hover:scale-105 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-primary/20 hover:bg-primary/40"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={activeIndex === steps.length - 1}
            className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center transition-all hover:bg-muted hover:scale-105 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Next step"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
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
