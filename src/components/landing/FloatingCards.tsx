import { useEffect, useRef, useState } from "react";

interface CardConfig {
  type: "link" | "utm" | "qr";
  title: string;
  preview: string;
}

interface FloatingCardsProps {
  cards: CardConfig[];
  caption: string;
}

export const FloatingCards = ({ cards, caption }: FloatingCardsProps) => {
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
      {/* Desktop: 3D Floating Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
        {cards.map((card, index) => (
          <div
            key={card.type}
            className={`transition-all duration-700 hover:scale-105 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: `${index * 150}ms`,
              transform: isVisible
                ? `rotateX(-5deg) rotateY(${(index - 1) * 5}deg) translateZ(${(index - 1) * 20}px)`
                : "none",
            }}
          >
            <div className="rounded-xl p-6 transition-shadow" style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <img
                  src={card.preview}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-display font-semibold text-center lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Vertical Stack */}
      <div className="md:hidden space-y-6 max-w-md mx-auto">
        {cards.map((card, index) => (
          <div
            key={card.type}
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="rounded-xl p-6" style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <img
                  src={card.preview}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-display font-semibold text-center lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Caption */}
      <p
        className={`text-xl md:text-2xl text-center lowercase tracking-wide transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {caption}
      </p>
    </div>
  );
};
