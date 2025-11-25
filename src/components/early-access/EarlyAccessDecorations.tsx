export const DiagonalLines = () => (
  <svg 
    className="absolute top-0 right-0 w-64 h-64 text-primary opacity-[0.03] pointer-events-none" 
    aria-hidden="true"
  >
    <line x1="0" y1="0" x2="256" y2="256" stroke="currentColor" strokeWidth="1"/>
    <line x1="32" y1="0" x2="256" y2="224" stroke="currentColor" strokeWidth="1"/>
    <line x1="64" y1="0" x2="256" y2="192" stroke="currentColor" strokeWidth="1"/>
    <line x1="96" y1="0" x2="256" y2="160" stroke="currentColor" strokeWidth="1"/>
    <line x1="128" y1="0" x2="256" y2="128" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

export const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Large background orbs - brand colors */}
    <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blazeOrange/5 blur-2xl animate-pulse" />
    <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-deepSea/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-primary/5 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
    
    {/* Small geometric shapes with brand colors */}
    <div className="absolute top-40 right-1/4 w-16 h-16 rounded-lg bg-blazeOrange/10 blur-lg rotate-45 animate-pulse" style={{ animationDelay: '1.5s' }} />
    <div className="absolute bottom-40 left-1/4 w-12 h-12 rounded-full bg-deepSea/10 blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
    
    {/* Additional brand color accents */}
    <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-primary/5 blur-2xl animate-pulse" style={{ animationDelay: '2.5s' }} />
    <div className="absolute bottom-1/3 left-1/2 w-16 h-16 rounded-lg bg-blazeOrange/5 blur-xl rotate-12 animate-pulse" style={{ animationDelay: '3s' }} />
  </div>
);

export const GridOverlay = () => (
  <div 
    className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--primary)/0.03)_1px,_transparent_1px)] bg-[length:32px_32px] pointer-events-none" 
    aria-hidden="true"
  />
);

export const GradientDivider = () => (
  <div className="relative w-full h-px my-16 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
  </div>
);

export const CornerBrackets = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {/* Top left */}
    <svg className="absolute top-0 left-0 w-8 h-8 text-primary/20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 0 L0 0 L0 8" />
    </svg>
    {/* Top right */}
    <svg className="absolute top-0 right-0 w-8 h-8 text-primary/20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M0 0 L8 0 L8 8" />
    </svg>
    {/* Bottom left */}
    <svg className="absolute bottom-0 left-0 w-8 h-8 text-primary/20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 8 L0 8 L0 0" />
    </svg>
    {/* Bottom right */}
    <svg className="absolute bottom-0 right-0 w-8 h-8 text-primary/20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M0 8 L8 8 L8 0" />
    </svg>
  </div>
);

export const DotGrid = () => (
  <div 
    className="absolute inset-0 opacity-[0.15]"
    style={{
      backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}
    aria-hidden="true"
  />
);
