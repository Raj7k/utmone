import { useEffect, useRef, useState } from "react";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  caption: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterComparison = ({
  beforeImage,
  afterImage,
  caption,
  beforeLabel = "before",
  afterLabel = "after",
}: BeforeAfterComparisonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
    <div ref={ref} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Before Image */}
        <div
          className={`transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          <div className="relative rounded-xl overflow-hidden border border-destructive/20 shadow-lg">
            <div className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide z-10">
              {beforeLabel}
            </div>
            <img
              src={beforeImage}
              alt="Before: Messy workflow"
              className="w-full h-auto"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
          </div>
        </div>

        {/* After Image */}
        <div
          className={`transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <div className="relative rounded-xl overflow-hidden border border-primary/30 shadow-lg">
            <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide z-10">
              {afterLabel}
            </div>
            <img
              src={afterImage}
              alt="After: Clean utm.one interface"
              className="w-full h-auto"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Caption */}
      <p
        className={`text-xl md:text-2xl text-center text-muted-foreground lowercase tracking-wide transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {caption}
      </p>
    </div>
  );
};
