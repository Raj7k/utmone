import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Activity, Zap } from "lucide-react";
import { LivePulseResult } from "@/hooks/useFieldEvents";

interface EventLivePulseProps {
  pulse: LivePulseResult;
  eventCity: string;
  isLoading?: boolean;
}

export const EventLivePulse = ({ pulse, eventCity, isLoading }: EventLivePulseProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'excellent':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500',
          icon: Zap,
          message: 'excellent! traffic is surging.',
          advice: 'keep doing what you are doing.'
        };
      case 'good':
        return {
          color: 'text-primary',
          bgColor: 'bg-primary',
          icon: TrendingUp,
          message: 'good. above baseline.',
          advice: 'booth is performing well.'
        };
      case 'moderate':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500',
          icon: Activity,
          message: 'moderate. on pace.',
          advice: 'consider a giveaway or demo.'
        };
      default:
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive',
          icon: AlertTriangle,
          message: 'low halo alert!',
          advice: 'try running a giveaway or changing your digital signage.'
        };
    }
  };

  const config = getStatusConfig(pulse.pulse_status);
  const Icon = config.icon;

  // Calculate gauge angle (0 = left, 180 = right)
  const gaugeAngle = Math.min(180, Math.max(0, (pulse.pulse_percentage / 200) * 180));

  return (
    <Card className="p-6 text-center">
      <h3 className="font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
        <Activity className="w-4 h-4" />
        live pulse
      </h3>

      {/* Speedometer gauge */}
      <div className="relative w-48 h-24 mx-auto mb-6">
        {/* Gauge background */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Colored sections */}
          <path
            d="M 10 100 A 90 90 0 0 1 55 30"
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M 55 30 A 90 90 0 0 1 100 10"
            fill="none"
            stroke="hsl(var(--warning))"
            strokeWidth="12"
            opacity="0.3"
          />
          <path
            d="M 100 10 A 90 90 0 0 1 145 30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="12"
            opacity="0.3"
          />
          <path
            d="M 145 30 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="hsl(142 76% 36%)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          initial={{ rotate: -90 }}
          animate={{ rotate: gaugeAngle - 90 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          style={{ width: '4px', height: '70px', marginLeft: '-2px' }}
        >
          <div className={`w-full h-full ${config.bgColor} rounded-full`} />
        </motion.div>

        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-foreground" />
      </div>

      {/* Percentage display */}
      <div className="mb-4">
        <p className={`text-4xl font-bold ${config.color}`}>
          {isLoading ? '—' : `${pulse.pulse_percentage.toFixed(0)}%`}
        </p>
        <p className="text-sm text-muted-foreground">
          of expected hourly traffic
        </p>
      </div>

      {/* Status message */}
      <div className={`p-4 rounded-lg ${pulse.pulse_status === 'low' ? 'bg-destructive/10' : 'bg-muted'}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <span className={`font-semibold ${config.color}`}>{config.message}</span>
        </div>
        <p className="text-sm text-muted-foreground">{config.advice}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
        <div>
          <p className="text-lg font-bold text-foreground">
            {pulse.current_hour_visitors}
          </p>
          <p className="text-xs text-muted-foreground">this hour</p>
        </div>
        <div>
          <p className="text-lg font-bold text-muted-foreground">
            {pulse.expected_visitors.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground">expected</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        from {eventCity} • updates every minute
      </p>
    </Card>
  );
};
