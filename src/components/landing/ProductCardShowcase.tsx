import { useEffect, useRef, useState } from "react";

interface ProductCardShowcaseProps {
  imageUrl: string;
  title: string;
  caption: string;
  animationType?: "float" | "fade" | "scale";
  aspectRatio?: "16/9" | "4/3" | "1/1";
}

export const ProductCardShowcase = ({
  imageUrl,
  title,
  caption,
  animationType = "fade",
  aspectRatio = "16/9",
}: ProductCardShowcaseProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const aspectRatioClass = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
  }[aspectRatio];

  const animationClass = {
    float: isVisible ? "opacity-100 translate-y-0 animate-float" : "opacity-0 translate-y-10",
    fade: isVisible ? "opacity-100" : "opacity-0",
    scale: isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
  }[animationType];

  return (
    <div ref={ref} className="space-y-4">
      <div
        className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-3xl hover:scale-[1.02] group ${animationClass}`}
        style={{ perspective: "1000px", border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className={`w-full ${aspectRatioClass}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.8), transparent)' }} />
      </div>
      <p className="text-sm text-center lowercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {caption}
      </p>
    </div>
  );
};
