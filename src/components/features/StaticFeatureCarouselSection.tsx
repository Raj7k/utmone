import { useCallback, useEffect, useState, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useElementReveal } from "@/hooks/useScrollReveal";

interface FeatureCarouselItem {
  icon: LucideIcon;
  title: string;
  description: string;
  visual?: ReactNode;
}

interface FeatureCarouselSectionProps {
  headline: string;
  subheadline?: string;
  items: FeatureCarouselItem[];
}

export const StaticFeatureCarouselSection = ({
  headline,
  subheadline,
  items,
}: FeatureCarouselSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    containScroll: false,
    align: "start",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const headerRef = useElementReveal();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const progressWidth = scrollSnaps.length > 0 
    ? ((selectedIndex + 1) / scrollSnaps.length) * 100 
    : 0;

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className="text-center mb-10 md:mb-14 space-y-3 opacity-0 translate-y-8 data-[revealed]:opacity-100 data-[revealed]:translate-y-0 transition-all duration-700 ease-out"
          data-reveal
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold hero-gradient">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground">
              {subheadline}
            </p>
          )}
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] opacity-0 translate-y-10 animate-slide-up-fade hover:scale-[1.02] transition-transform duration-300"
                    style={{ animationDelay: `${Math.min(index * 80, 400)}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="relative h-full p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden group">
                      {/* Visual area */}
                      <div className="h-24 mb-6 flex items-center justify-center bg-muted/30 rounded-xl overflow-hidden">
                        {item.visual || (
                          <Icon className="w-10 h-10 text-muted-foreground" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)_/_0.05)_0%,_transparent_70%)]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subtle Progress Bar + Counter */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="relative w-32 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-foreground/60 transition-[width] duration-300 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums font-mono">
            {selectedIndex + 1}/{scrollSnaps.length}
          </span>
        </div>
      </div>
    </section>
  );
};

// Re-export with original name for drop-in replacement
export { StaticFeatureCarouselSection as FeatureCarouselSection };
