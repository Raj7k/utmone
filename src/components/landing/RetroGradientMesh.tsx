export const RetroGradientMesh = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient layer - Obsidian dark */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-obsidian to-obsidian"
      />
      
      {/* Static gradient orbs - CSS only for performance */}
      {/* Top-left: Platinum orb */}
      <div
        className="absolute -top-[20%] -left-[15%] w-[800px] h-[800px] rounded-full blur-[120px] bg-[radial-gradient(circle,hsl(0_0%_30%/0.3)_0%,transparent_70%)] animate-[pulse_20s_ease-in-out_infinite]"
        style={{ willChange: 'transform' }}
      />
      
      {/* Bottom-right: Silver orb */}
      <div
        className="absolute -bottom-[10%] -right-[10%] w-[700px] h-[700px] rounded-full blur-[100px] bg-[radial-gradient(circle,hsl(0_0%_50%/0.15)_0%,transparent_70%)] animate-[pulse_25s_ease-in-out_infinite_reverse]"
        style={{ willChange: 'transform' }}
      />
      
      {/* Center-right: Platinum accent */}
      <div
        className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full blur-[80px] bg-[radial-gradient(circle,hsl(0_0%_90%/0.08)_0%,transparent_70%)] animate-[spin_30s_linear_infinite]"
        style={{ willChange: 'transform' }}
      />
      
      {/* Top-right: Subtle platinum blend */}
      <div
        className="absolute -top-[5%] right-[20%] w-[600px] h-[600px] rounded-full blur-[100px] bg-[radial-gradient(circle,hsl(0_0%_70%/0.08)_0%,transparent_70%)] animate-[pulse_22s_ease-in-out_infinite]"
        style={{ willChange: 'transform' }}
      />
      
      {/* Static wave paths SVG layer - CSS animations for performance */}
      <svg 
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Noise/grain filter */}
          <filter id="grain">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.8" 
              numOctaves="4" 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        
        {/* Wave path 1 - Platinum - Static for performance */}
        <path
          d="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100"
          stroke="hsl(0 0% 40% / 0.04)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 20"
          className="opacity-50"
        />
        
        {/* Wave path 2 - Silver - Static for performance */}
        <path
          d="M0,300 Q300,250 600,300 T1200,300 T1800,300"
          stroke="hsl(0 0% 60% / 0.025)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="15 25"
          className="opacity-50"
        />
        
        {/* Wave path 3 - Light platinum - Static for performance */}
        <path
          d="M0,500 Q200,450 400,500 T800,500 T1200,500 T1600,500"
          stroke="hsl(0 0% 80% / 0.02)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="20 30"
          className="opacity-50"
        />
        
        {/* Grain texture overlay */}
        <rect 
          width="100%" 
          height="100%" 
          filter="url(#grain)" 
          opacity="0.04"
          style={{ mixBlendMode: 'overlay' }}
        />
      </svg>
      
      {/* Subtle vignette for depth - dark Obsidian fade */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--obsidian-bg)/0.3)_100%)]"
      />
    </div>
  );
};
