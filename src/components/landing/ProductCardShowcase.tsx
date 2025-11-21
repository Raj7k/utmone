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
        className={`relative rounded-xl overflow-hidden border border-border shadow-2xl transition-all duration-700 hover:shadow-3xl hover:scale-[1.02] group ${animationClass}`}
        style={{ perspective: "1000px" }}
      >
        <div className={`w-full ${aspectRatioClass} bg-muted`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <p className="text-sm text-center text-muted-foreground lowercase tracking-wide">
        {caption}
      </p>
    </div>
  );
};
