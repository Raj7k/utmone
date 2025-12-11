import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface JourneyStep {
  id: string;
  label: string;
  description: string;
  time?: string;
  weight: number;
}

interface SankeyJourneyFlowProps {
  title: string;
  subtitle?: string;
  steps: JourneyStep[];
  destination: {
    label: string;
    value: string;
    subtext?: string;
  };
}

export const SankeyJourneyFlow = ({
  title,
  subtitle,
  steps,
  destination,
}: SankeyJourneyFlowProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const totalWeight = steps.reduce((sum, s) => sum + s.weight, 0);
  
  // Layout constants - responsive
  const viewWidth = 900;
  const viewHeight = Math.max(320, steps.length * 80 + 80);
  const timelineX = 40;
  const labelStartX = 60;
  const flowStartX = 300;
  const destX = viewWidth - 120;
  const destCenterY = viewHeight / 2;
  const stepSpacing = (viewHeight - 80) / (steps.length - 1 || 1);
  const startY = 40;

  // Generate smooth bezier path from step to destination
  const generatePath = (index: number) => {
    const y = startY + index * stepSpacing;
    const cp1x = flowStartX + (destX - flowStartX) * 0.35;
    const cp2x = flowStartX + (destX - flowStartX) * 0.65;
    return `M ${flowStartX} ${y} C ${cp1x} ${y}, ${cp2x} ${destCenterY}, ${destX - 70} ${destCenterY}`;
  };

  return (
    <section ref={ref} className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Flow Visualization */}
        <motion.div
          className="bg-card border border-border rounded-2xl md:rounded-3xl p-4 md:p-8 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '280px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradient for flow paths */}
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              </linearGradient>

              {/* Particle glow filter */}
              <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Destination glow */}
              <filter id="destGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Timeline vertical line */}
            <motion.line
              x1={timelineX}
              y1={startY}
              x2={timelineX}
              y2={startY + (steps.length - 1) * stepSpacing}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Flow paths with animations */}
            {steps.map((step, index) => {
              const pathD = generatePath(index);
              const weightRatio = step.weight / totalWeight;
              const strokeWidth = Math.max(4, weightRatio * 24);
              const opacity = 0.25 + weightRatio * 0.5;

              return (
                <g key={step.id}>
                  {/* Main flow path */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.5 + index * 0.15, ease: "easeOut" }}
                  />

                  {/* Animated particles */}
                  {[0, 1, 2].map((particleIdx) => (
                    <motion.circle
                      key={`particle-${step.id}-${particleIdx}`}
                      r="5"
                      fill="hsl(var(--primary))"
                      filter="url(#particleGlow)"
                      initial={{ offsetDistance: "0%", opacity: 0 }}
                      animate={isInView ? {
                        offsetDistance: ["0%", "100%"],
                        opacity: [0, 1, 1, 0],
                      } : {}}
                      transition={{
                        duration: 2.5,
                        delay: 1 + index * 0.2 + particleIdx * 0.8,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                        ease: "linear",
                      }}
                      style={{
                        offsetPath: `path("${pathD}")`,
                      }}
                    />
                  ))}
                </g>
              );
            })}

            {/* Step nodes and labels */}
            {steps.map((step, index) => {
              const y = startY + index * stepSpacing;
              const weightPercent = Math.round((step.weight / totalWeight) * 100);

              return (
                <g key={`label-${step.id}`}>
                  {/* Timeline node circle */}
                  <motion.circle
                    cx={timelineX}
                    cy={y}
                    r="14"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                  />

                  {/* Step number inside circle */}
                  <motion.text
                    x={timelineX}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-primary"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {index + 1}
                  </motion.text>

                  {/* Labels section */}
                  <motion.g
                    initial={{ opacity: 0, x: -15 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    {/* Step label */}
                    <text
                      x={labelStartX}
                      y={y - 10}
                      className="text-sm font-semibold fill-foreground"
                    >
                      {step.label}
                    </text>

                    {/* Description */}
                    <text
                      x={labelStartX}
                      y={y + 6}
                      className="text-xs fill-muted-foreground"
                    >
                      {step.description}
                    </text>

                    {/* Time badge */}
                    {step.time && (
                      <g>
                        <rect
                          x={labelStartX}
                          y={y + 14}
                          width={step.time.length * 7 + 16}
                          height="20"
                          rx="10"
                          fill="hsl(var(--muted))"
                        />
                        <text
                          x={labelStartX + 8}
                          y={y + 27}
                          className="text-[10px] font-medium fill-muted-foreground"
                        >
                          {step.time}
                        </text>
                      </g>
                    )}
                  </motion.g>

                  {/* Weight bar indicator */}
                  <motion.rect
                    x={flowStartX - 60}
                    y={y - 6}
                    width={weightPercent * 0.5}
                    height="12"
                    rx="6"
                    fill="hsl(var(--primary))"
                    fillOpacity="0.15"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: weightPercent * 0.5 } : {}}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  />

                  {/* Weight percentage label */}
                  <motion.text
                    x={flowStartX - 60 + weightPercent * 0.5 + 8}
                    y={y + 3}
                    className="text-[10px] font-semibold fill-primary"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {weightPercent}%
                  </motion.text>

                  {/* Connection line to flow */}
                  <motion.line
                    x1={flowStartX - 60 + weightPercent * 0.5 + 30}
                    y1={y}
                    x2={flowStartX}
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.5 } : {}}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  />
                </g>
              );
            })}

            {/* Destination card */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2, type: "spring", stiffness: 150 }}
            >
              {/* Outer glow ring */}
              <motion.rect
                x={destX - 60}
                y={destCenterY - 55}
                width="140"
                height="110"
                rx="16"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                filter="url(#destGlow)"
                animate={{
                  strokeOpacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Card background */}
              <rect
                x={destX - 60}
                y={destCenterY - 55}
                width="140"
                height="110"
                rx="16"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />

              {/* Destination label */}
              <text
                x={destX + 10}
                y={destCenterY - 28}
                textAnchor="middle"
                className="text-[10px] font-medium fill-muted-foreground uppercase tracking-wider"
              >
                {destination.label}
              </text>

              {/* Value - large */}
              <text
                x={destX + 10}
                y={destCenterY + 8}
                textAnchor="middle"
                className="text-xl font-bold fill-foreground"
              >
                {destination.value}
              </text>

              {/* Subtext */}
              {destination.subtext && (
                <text
                  x={destX + 10}
                  y={destCenterY + 32}
                  textAnchor="middle"
                  className="text-[9px] fill-muted-foreground"
                >
                  {destination.subtext}
                </text>
              )}

              {/* Arrow indicator pointing into card */}
              <motion.path
                d={`M ${destX - 75} ${destCenterY} L ${destX - 60} ${destCenterY}`}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{step.label}</span>
              <span className="text-xs text-muted-foreground/60">
                ({Math.round((step.weight / totalWeight) * 100)}%)
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
