import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export const ForecastingPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-8 shadow-xl"
      style={{
        background: 'rgba(24,24,27,0.4)',
        border: '2px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground lowercase mb-1">
            summer sale 2024 forecast
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>7-day prediction with confidence band</p>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <TrendingUp className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>85% confidence</span>
        </div>
      </div>

      {/* Visual Chart Mockup */}
      <div className="relative h-64 rounded-xl p-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>

        {/* Chart Line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          {/* Confidence Band */}
          <path
            d="M 0 120 Q 100 110 150 100 T 300 90 L 400 85 L 400 160 Q 300 170 150 180 Q 100 185 0 190 Z"
            fill="rgba(255,255,255,0.1)"
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          
          {/* Main Line */}
          <path
            d="M 0 150 Q 100 140 150 120 T 300 110 L 400 100"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Data Point */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full shadow-lg"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        />
      </div>

      {/* Prediction Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="text-2xl font-bold text-foreground">~1,200</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>predicted clicks</div>
        </div>
        <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>±150</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>confidence range</div>
        </div>
        <div className="text-center p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="text-2xl font-bold text-foreground">Tue 10AM</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>peak time</div>
        </div>
      </div>
    </motion.div>
  );
};