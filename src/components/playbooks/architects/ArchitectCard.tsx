import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ArrowUpRight, Share2, Download, MapPin, Wand2, Loader2 } from 'lucide-react';
import { Architect, categories } from '@/data/b2bArchitects';
import { Button } from '@/components/ui/button';
import { shareToLinkedIn } from '@/utils/linkedinShare';
import { getLocationTheme } from './locationBackgrounds';
import { useArchitectStamp } from '@/hooks/useArchitectStamp';

interface ArchitectCardProps {
  architect: Architect;
  index: number;
}

export function ArchitectCard({ architect, index }: ArchitectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const category = categories[architect.category];
  const locationTheme = getLocationTheme(architect.location);
  
  const { stampUrl, isGenerating, error, generateStamp } = useArchitectStamp({
    architectId: architect.id,
    photoUrl: architect.originalPhoto,
    location: architect.location,
    name: architect.name
  });

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `🎯 ${architect.name} (${architect.role} @ ${architect.company})\n\n"${architect.nugget}"\n\nFrom the 25 B2B Marketing Architects of 2026 👇\nutm.one/resources/playbooks/b2b-architects-2026`;
    shareToLinkedIn(shareText);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageUrl = stampUrl || architect.originalPhoto;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${architect.id}-${stampUrl ? 'stamp' : 'card'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateStamp = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateStamp();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full aspect-[2/3] transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front - Retro Styled Photo with Location Background */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!stampUrl && !isGenerating && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 bg-card/80 backdrop-blur-sm"
                  onClick={handleGenerateStamp}
                  title="Generate AI Stamp"
                >
                  <Wand2 className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 bg-card/80 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 bg-card/80 backdrop-blur-sm"
                onClick={handleDownload}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>

            {/* Retro Stamp Container with location-themed background */}
            <div 
              className="relative h-[55%] p-3"
              style={{ background: locationTheme.gradient }}
            >
              {/* City silhouette overlay */}
              <svg 
                className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                <path 
                  d={locationTheme.silhouette} 
                  fill={locationTheme.accentColor}
                />
              </svg>
              
              {/* Loading overlay during generation */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                  <span className="text-xs text-white/80">Generating stamp...</span>
                </div>
              )}
              
              {/* Vintage stamp frame */}
              <div className="relative w-full h-full">
                {/* Perforated border - top */}
                <div className="absolute inset-x-0 top-0 h-3 flex justify-around items-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={`top-${i}`} 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: locationTheme.gradient.includes('87CEEB') ? '#87CEEB' : '#F5DEB3' }}
                    />
                  ))}
                </div>
                {/* Perforated border - bottom */}
                <div className="absolute inset-x-0 bottom-0 h-3 flex justify-around items-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={`bottom-${i}`} 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: locationTheme.gradient.includes('87CEEB') ? '#87CEEB' : '#F5DEB3' }}
                    />
                  ))}
                </div>
                {/* Perforated border - left */}
                <div className="absolute inset-y-0 left-0 w-3 flex flex-col justify-around items-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                      key={`left-${i}`} 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: locationTheme.gradient.includes('87CEEB') ? '#87CEEB' : '#F5DEB3' }}
                    />
                  ))}
                </div>
                {/* Perforated border - right */}
                <div className="absolute inset-y-0 right-0 w-3 flex flex-col justify-around items-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                      key={`right-${i}`} 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: locationTheme.gradient.includes('87CEEB') ? '#87CEEB' : '#F5DEB3' }}
                    />
                  ))}
                </div>

                {/* Photo or Generated Stamp */}
                <div 
                  className="absolute inset-3 rounded overflow-hidden"
                  style={{
                    backgroundImage: `url(${stampUrl || architect.originalPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: stampUrl ? 'none' : 'sepia(20%) saturate(1.3) contrast(1.1)',
                  }}
                >
                  {/* Only show vintage overlay if not using AI stamp */}
                  {!stampUrl && (
                    <>
                      {/* Vintage overlay matching location theme */}
                      <div 
                        className="absolute inset-0" 
                        style={{ 
                          background: `linear-gradient(135deg, ${locationTheme.accentColor}15 0%, transparent 50%, ${locationTheme.accentColor}20 100%)` 
                        }}
                      />
                      {/* Noise texture */}
                      <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
                        style={{ 
                          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                        }} 
                      />
                    </>
                  )}
                  
                  {/* Stamp badge indicator */}
                  {stampUrl && (
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Wand2 className="h-2 w-2" />
                      AI
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 h-[45%] flex flex-col justify-between bg-card">
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm leading-tight">
                  {architect.name}
                </h3>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">
                  {architect.role} @ {architect.company}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/70">
                  <MapPin className="w-3 h-3" />
                  <span>{architect.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  <span>{category.icon}</span>
                  {architect.superpower}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back - Original Photo + Quote */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full bg-card rounded-xl border border-border shadow-lg overflow-hidden">
            {/* Photo */}
            <div 
              className="h-[40%] bg-cover bg-center"
              style={{ backgroundImage: `url(${architect.originalPhoto})` }}
            />

            {/* Description & Quote */}
            <div className="p-4 h-[60%] flex flex-col justify-between bg-gradient-to-b from-card to-muted/30">
              <div className="flex-1 overflow-y-auto">
                <p className="font-display text-sm text-foreground italic leading-relaxed">
                  "{architect.nugget}"
                </p>
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <Button
                  asChild
                  size="sm"
                  className="h-8 text-xs bg-[#0A66C2] hover:bg-[#004182] text-white flex-1"
                >
                  <a
                    href={architect.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="w-3.5 h-3.5 mr-1.5" />
                    Connect
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={handleShare}
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
