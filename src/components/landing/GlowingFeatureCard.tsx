interface GlowingFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  glowColor: "teal" | "yellow-green" | "mint";
}

export const GlowingFeatureCard = ({ 
  icon, 
  title, 
  description, 
  glowColor
}: GlowingFeatureCardProps) => {
  const glowClasses = {
    teal: "shadow-[0_0_60px_hsl(163_87%_17%/0.3)] group-hover:shadow-[0_0_80px_hsl(163_87%_17%/0.5)]",
    "yellow-green": "shadow-[0_0_60px_hsl(66_86%_54%/0.3)] group-hover:shadow-[0_0_80px_hsl(66_86%_54%/0.5)]",
    mint: "shadow-[0_0_60px_hsl(96_76%_90%/0.3)] group-hover:shadow-[0_0_80px_hsl(96_76%_90%/0.5)]"
  };

  return (
    <div 
      className="bg-[#0C342C] rounded-2xl p-12 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
    >
      {/* Radial glow behind icon */}
      <div 
        className={`absolute top-8 left-8 w-32 h-32 rounded-full blur-3xl ${glowClasses[glowColor]} opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-glow-pulse`}
      />
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div 
          className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:rotate-[5deg] group-hover:scale-105 transition-transform duration-200"
        >
          {icon}
        </div>
        <h3 className="text-h3 text-white font-semibold">{title}</h3>
        <p className="text-body text-white/70">{description}</p>
      </div>
    </div>
  );
};
