import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface SwipeableTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const SwipeableTabs = ({ tabs, defaultTab }: SwipeableTabsProps) => {
  const [activeIndex, setActiveIndex] = useState(
    tabs.findIndex((tab) => tab.id === defaultTab) || 0
  );
  const [direction, setDirection] = useState(0);

  const handleSwipe = (newDirection: number) => {
    const newIndex = activeIndex + newDirection;
    if (newIndex >= 0 && newIndex < tabs.length) {
      setDirection(newDirection);
      setActiveIndex(newIndex);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="md:hidden">
      {/* Tab indicators */}
      <div className="flex items-center justify-center gap-2 mb-4 px-4">
        <button
          onClick={() => handleSwipe(-1)}
          disabled={activeIndex === 0}
          className="p-2 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2 overflow-x-auto flex-1 justify-center">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                index === activeIndex
                  ? "text-white"
                  : "bg-fill-tertiary text-secondary-label"
              }`}
              style={index === activeIndex ? { background: 'rgba(59,130,246,1)' } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleSwipe(1)}
          disabled={activeIndex === tabs.length - 1}
          className="p-2 disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                handleSwipe(1);
              } else if (swipe > 10000) {
                handleSwipe(-1);
              }
            }}
          >
            {tabs[activeIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {tabs.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-8" : "w-2 bg-fill-tertiary"
            }`}
            style={index === activeIndex ? { background: 'rgba(59,130,246,1)' } : undefined}
          />
        ))}
      </div>
    </div>
  );
};
