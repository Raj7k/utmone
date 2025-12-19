import { TrendingUp } from "lucide-react";
import { useIntersectionAnimation } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

export const ForecastingPreview = () => {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-8 shadow-xl bg-zinc-900/40 border-2 border-white-10 transition-all duration-600 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground mb-1">
            summer sale 2024 forecast
          </h3>
          <p className="text-sm text-white/50">7-day prediction with confidence band</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white-15">
          <TrendingUp className="w-4 h-4 text-white-80" />
          <span className="text-sm font-semibold text-white-80">85% confidence</span>
        </div>
      </div>

      {/* Visual Chart Mockup */}
      <div className="relative h-64 rounded-xl p-6 overflow-hidden bg-white/5">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px bg-white/10" />
          ))}
        </div>

        {/* Chart Line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          {/* Confidence Band */}
          <path
            d="M 0 120 Q 100 110 150 100 T 300 90 L 400 85 L 400 160 Q 300 170 150 180 Q 100 185 0 190 Z"
            className="fill-white/10 animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          
          {/* Main Line */}
          <path
            d="M 0 150 Q 100 140 150 120 T 300 110 L 400 100"
            fill="none"
            className="stroke-white-80"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Data Point */}
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full shadow-lg bg-white-90 animate-pulse-dot"
        />
      </div>

      {/* Prediction Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-foreground">~1,200</div>
          <div className="text-xs text-white/50">predicted clicks</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-white/10">
          <div className="text-2xl font-bold text-white-90">±150</div>
          <div className="text-xs text-white-80">confidence range</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-foreground">Tue 10AM</div>
          <div className="text-xs text-white/50">peak time</div>
        </div>
      </div>
    </div>
  );
};
