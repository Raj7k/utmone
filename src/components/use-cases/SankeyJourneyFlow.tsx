import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface JourneyStep {
  id: string;
  label: string;
  description?: string;
  weight?: number; // 1-100, affects path thickness
}

interface SankeyJourneyFlowProps {
  title: string;
  subtitle?: string;
  steps: JourneyStep[];
  destination?: {
    label: string;
    value: string;
  };
}

export const SankeyJourneyFlow = ({
  title,
  subtitle,
  steps,
  destination = { label: "Revenue", value: "$48,000" },
}: SankeyJourneyFlowProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [particles, setParticles] = useState<{ id: number; pathIndex: number; delay: number }[]>([]);

  useEffect(() => {
    if (isInView) {
      // Generate particles for each path
      const newParticles = steps.flatMap((_, pathIndex) =>
        Array.from({ length: 3 }, (__, i) => ({
          id: pathIndex * 3 + i,
          pathIndex,
          delay: i * 1.2 + pathIndex * 0.3,
        }))
      );
      setParticles(newParticles);
    }
  }, [isInView, steps.length]);

  // Calculate positions for source nodes
  const svgWidth = 600;
  const svgHeight = 200;
  const sourceX = 120;
  const destX = 520;
  const destY = svgHeight / 2;

  const getSourceY = (index: number) => {
    const totalSteps = steps.length;
    const spacing = (svgHeight - 60) / (totalSteps - 1 || 1);
    return 30 + index * spacing;
  };

  // Generate bezier path for each source to destination
  const getPath = (index: number) => {
    const sourceY = getSourceY(index);
    const cp1x = sourceX + (destX - sourceX) * 0.4;
    const cp2x = sourceX + (destX - sourceX) * 0.6;
    return `M ${sourceX} ${sourceY} C ${cp1x} ${sourceY}, ${cp2x} ${destY}, ${destX} ${destY}`;
  };

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="max-w-[980px] mx-auto px-6 md:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          className="bg-card border border-border rounded-3xl p-8 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradient for paths */}
              <linearGradient id="sankeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              </linearGradient>

              {/* Glow filter for particles */}
              <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Glow filter for destination */}
              <filter id="destGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Flow paths */}
            {steps.map((step, index) => {
              const weight = step.weight || 20;
              const strokeWidth = Math.max(1, weight / 25);
              
              return (
                <motion.path
                  key={`path-${step.id}`}
                  d={getPath(index)}
                  fill="none"
                  stroke="url(#sankeyGradient)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                />
              );
            })}

            {/* Animated particles */}
            {particles.map((particle) => {
              const path = getPath(particle.pathIndex);
              return (
                <motion.circle
                  key={`particle-${particle.id}`}
                  r="4"
                  fill="hsl(var(--primary))"
                  filter="url(#particleGlow)"
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={isInView ? {
                    offsetDistance: ["0%", "100%"],
                    opacity: [0, 1, 1, 0],
                  } : {}}
                  transition={{
                    duration: 2.5,
                    delay: particle.delay,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "linear",
                  }}
                  style={{
                    offsetPath: `path("${path}")`,
                  }}
                />
              );
            })}

            {/* Source nodes */}
            {steps.map((step, index) => {
              const y = getSourceY(index);
              const weight = step.weight || 20;
              const barWidth = Math.max(40, weight * 0.8);
              
              return (
                <g key={`source-${step.id}`}>
                  {/* Source bar */}
                  <motion.rect
                    x={sourceX - barWidth - 10}
                    y={y - 12}
                    width={barWidth}
                    height={24}
                    rx={4}
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  />
                  
                  {/* Source label */}
                  <motion.text
                    x={sourceX - barWidth - 20}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs font-medium fill-foreground"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    {step.label}
                  </motion.text>

                  {/* Description below label */}
                  {step.description && (
                    <motion.text
                      x={sourceX - barWidth - 20}
                      y={y + 16}
                      textAnchor="end"
                      className="text-[9px] fill-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 0.7 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                      {step.description}
                    </motion.text>
                  )}

                  {/* Connection dot */}
                  <motion.circle
                    cx={sourceX}
                    cy={y}
                    r={5}
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1, type: "spring" }}
                  />
                </g>
              );
            })}

            {/* Destination node */}
            <g>
              {/* Outer glow ring */}
              <motion.circle
                cx={destX}
                cy={destY}
                r={35}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={1}
                filter="url(#destGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { 
                  scale: [1, 1.2, 1], 
                  opacity: [0.3, 0.1, 0.3] 
                } : {}}
                transition={{ 
                  duration: 2, 
                  delay: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main destination circle */}
              <motion.circle
                cx={destX}
                cy={destY}
                r={28}
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
              />

              {/* Destination value */}
              <motion.text
                x={destX}
                y={destY - 2}
                textAnchor="middle"
                className="text-sm font-bold fill-primary"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                {destination.value}
              </motion.text>

              {/* Destination label */}
              <motion.text
                x={destX}
                y={destY + 12}
                textAnchor="middle"
                className="text-[10px] fill-muted-foreground"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                {destination.label}
              </motion.text>
            </g>
          </svg>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{step.label}</span>
              {step.weight && (
                <span className="text-xs text-muted-foreground/60">({step.weight}%)</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
