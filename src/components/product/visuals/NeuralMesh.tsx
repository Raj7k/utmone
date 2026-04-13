import { useMemo } from "react";

/**
 * NeuralMesh - Pure SVG/CSS animated neural network visualization
 * No JS animation loops - uses SVG <animate> and CSS animations for GPU-accelerated performance
 */
export const NeuralMesh = () => {
  // Generate static node positions with deterministic pseudo-random distribution
  const nodes = useMemo(() => {
    const nodeList = [];
    for (let i = 0; i < 20; i++) {
      // Use deterministic positions based on index for consistent render
      const angle = (i / 20) * Math.PI * 2;
      const radius = 30 + (i % 3) * 25;
      nodeList.push({
        x: 150 + Math.cos(angle + i * 0.5) * radius,
        y: 100 + Math.sin(angle + i * 0.3) * radius * 0.7,
        size: 1.5 + (i % 3) * 0.5,
        opacity: 0.4 + (i % 4) * 0.15,
        delay: i * 0.1,
      });
    }
    return nodeList;
  }, []);

  // Generate connections between nearby nodes
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number; delay: number }[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 70) {
          lines.push({
            x1: nodes[i].x,
            y1: nodes[i].y,
            x2: nodes[j].x,
            y2: nodes[j].y,
            opacity: (1 - dist / 70) * 0.25,
            delay: (i + j) * 0.05,
          });
        }
      }
    }
    return lines;
  }, [nodes]);

  return (
    <div className="relative w-[300px] h-[200px]">
      <svg className="w-full h-full" viewBox="0 0 300 200">
        <defs>
          {/* Central glow gradient */}
          <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
          </radialGradient>
          
          {/* Node glow filter */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated connections */}
        {connections.map((line, i) => (
          <line
            key={`conn-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="stroke-foreground"
            strokeOpacity={line.opacity}
            strokeWidth="0.5"
          >
            {/* Pulse animation on connection opacity */}
            <animate
              attributeName="stroke-opacity"
              values={`${line.opacity};${line.opacity * 1.5};${line.opacity}`}
              dur={`${3 + (i % 3)}s`}
              begin={`${line.delay}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}

        {/* Animated nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              className="fill-foreground"
              fillOpacity={node.opacity}
              filter={i % 4 === 0 ? "url(#nodeGlow)" : undefined}
            >
              {/* Breathing animation for node size */}
              <animate
                attributeName="r"
                values={`${node.size};${node.size * 1.3};${node.size}`}
                dur={`${2 + (i % 2)}s`}
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
              {/* Subtle position drift */}
              <animate
                attributeName="cx"
                values={`${node.x};${node.x + 3};${node.x - 2};${node.x}`}
                dur={`${4 + (i % 3)}s`}
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${node.y};${node.y - 2};${node.y + 3};${node.y}`}
                dur={`${5 + (i % 2)}s`}
                begin={`${node.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Central glow */}
        <circle
          cx="150"
          cy="100"
          r="40"
          fill="url(#meshGlow)"
          style={{ mixBlendMode: 'screen' }}
        >
          <animate
            attributeName="r"
            values="40;45;40"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Label - CSS animation */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          neural processing
        </div>
      </div>
    </div>
  );
};
