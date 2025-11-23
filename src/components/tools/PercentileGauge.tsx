interface PercentileGaugeProps {
  percentile: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PercentileGauge = ({ percentile, size = 'md' }: PercentileGaugeProps) => {
  const dimensions = {
    sm: { size: 120, stroke: 8, text: 'text-2xl' },
    md: { size: 180, stroke: 12, text: 'text-4xl' },
    lg: { size: 240, stroke: 16, text: 'text-6xl' }
  };

  const config = dimensions[size];
  const radius = (config.size - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentile / 100) * circumference;

  // Color based on percentile
  const getColor = () => {
    if (percentile < 25) return 'hsl(0 84% 60%)'; // red
    if (percentile < 50) return 'hsl(48 96% 53%)'; // yellow
    if (percentile < 75) return 'hsl(142 71% 45%)'; // green
    return 'hsl(221 83% 53%)'; // blue
  };

  const getLabel = () => {
    if (percentile < 25) return 'below market';
    if (percentile < 50) return 'market average';
    if (percentile < 75) return 'above market';
    return 'top tier';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative" style={{ width: config.size, height: config.size }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={config.size}
          height={config.size}
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={config.stroke}
            fill="none"
            opacity={0.3}
          />
          
          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={config.stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${config.text} font-display font-bold text-foreground`}>
            {Math.round(percentile)}
          </span>
          <span className="text-sm text-muted-foreground">percentile</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-medium text-foreground lowercase">
          {getLabel()}
        </p>
      </div>
    </div>
  );
};
