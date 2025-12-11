import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ArrowUpRight, Share2, Download } from 'lucide-react';
import { Architect, categories } from '@/data/b2bArchitects';
import { Button } from '@/components/ui/button';
import { shareToLinkedIn } from '@/utils/linkedinShare';

interface ArchitectCardProps {
  architect: Architect;
  index: number;
}

export function ArchitectCard({ architect, index }: ArchitectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const category = categories[architect.category];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `🎯 ${architect.name} (${architect.role} @ ${architect.company})\n\n"${architect.nugget}"\n\nFrom the 25 B2B Marketing Architects of 2026 👇\nutm.one/resources/playbooks/b2b-architects-2026`;
    shareToLinkedIn(shareText);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await fetch(architect.originalPhoto);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${architect.id}-card.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        className={`relative w-full aspect-[3/4] transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front - Retro Styled Photo */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {/* Retro Stamp Container with perforated edge effect */}
            <div className="relative h-[60%] bg-amber-50 p-3">
              {/* Vintage stamp frame */}
              <div className="relative w-full h-full">
                {/* Perforated border - top */}
                <div className="absolute inset-x-0 top-0 h-3 flex justify-around items-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`top-${i}`} className="w-2 h-2 rounded-full bg-amber-50" />
                  ))}
                </div>
                {/* Perforated border - bottom */}
                <div className="absolute inset-x-0 bottom-0 h-3 flex justify-around items-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`bottom-${i}`} className="w-2 h-2 rounded-full bg-amber-50" />
                  ))}
                </div>
                {/* Perforated border - left */}
                <div className="absolute inset-y-0 left-0 w-3 flex flex-col justify-around items-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`left-${i}`} className="w-2 h-2 rounded-full bg-amber-50" />
                  ))}
                </div>
                {/* Perforated border - right */}
                <div className="absolute inset-y-0 right-0 w-3 flex flex-col justify-around items-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`right-${i}`} className="w-2 h-2 rounded-full bg-amber-50" />
                  ))}
                </div>

                {/* Photo with retro filter */}
                <div 
                  className="absolute inset-3 rounded overflow-hidden"
                  style={{
                    backgroundImage: `url(${architect.originalPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'sepia(20%) saturate(1.3) contrast(1.1)',
                  }}
                >
                  {/* Vintage overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-800/20" />
                  {/* Noise texture */}
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
                    style={{ 
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 h-[40%] flex flex-col justify-between bg-card">
              <div>
                <h3 className="font-serif font-semibold text-foreground text-sm leading-tight">
                  {architect.name}
                </h3>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">
                  {architect.role} @ {architect.company}
                </p>
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
              className="h-[50%] bg-cover bg-center"
              style={{ backgroundImage: `url(${architect.originalPhoto})` }}
            />

            {/* Description & Quote */}
            <div className="p-4 h-[50%] flex flex-col justify-between bg-gradient-to-b from-card to-muted/30">
              <p className="font-serif text-sm text-foreground italic leading-relaxed line-clamp-4">
                "{architect.nugget}"
              </p>
              
              <div className="flex items-center justify-between gap-2">
                <a
                  href={architect.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin className="w-4 h-4" />
                  Follow
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={handleShare}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
