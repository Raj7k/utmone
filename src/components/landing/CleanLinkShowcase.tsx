import { useEffect, useRef, useState } from "react";

interface CleanLinkShowcaseProps {
  linkUrl: string;
  caption: string;
}

export const CleanLinkShowcase = ({ linkUrl, caption }: CleanLinkShowcaseProps) => {
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

  return (
    <div
      ref={ref}
      className={`max-w-2xl mx-auto mt-12 mb-8 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="rounded-2xl p-8 transition-shadow group bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08]">
        <div className="text-center">
          <p className="text-3xl md:text-5xl font-bold mb-4 font-mono group-hover:scale-105 transition-transform text-white/90">
            {linkUrl}
          </p>
          <p className="text-sm tracking-wide text-white/50">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
};
