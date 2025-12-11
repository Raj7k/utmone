import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Architect, categories } from '@/data/b2bArchitects';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { shareToLinkedIn } from '@/utils/linkedinShare';

interface ShareableArchitectCardProps {
  architect: Architect;
  stampUrl?: string | null;
}

export function ShareableArchitectCard({ architect, stampUrl }: ShareableArchitectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const category = categories[architect.category];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1200,
        height: 1200,
        pixelRatio: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${architect.id}-shareable-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  const handleShare = () => {
    const shareText = `🎯 Meet ${architect.name}, ${architect.role} @ ${architect.company}

"${architect.nugget}"

One of the 25 B2B Marketing Architects defining 2026 👇

#B2BMarketing #MarketingLeaders`;
    shareToLinkedIn(shareText);
  };

  return (
    <div className="space-y-4">
      {/* Shareable Card - 1200x1200 optimized for LinkedIn */}
      <div 
        ref={cardRef}
        className="w-full max-w-[600px] aspect-square bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 rounded-2xl"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <div className="h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm font-medium tracking-wide uppercase">
              utm.one presents
            </span>
            <span className="text-2xl">{category.icon}</span>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            {/* Stamp/Photo */}
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-zinc-700 shadow-2xl mb-6">
              <img 
                src={stampUrl || architect.originalPhoto} 
                alt={architect.name}
                className="w-full h-full object-cover"
              />
              {/* Perforated overlay for stamp effect */}
              {stampUrl && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 top-0 h-2 flex justify-around">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-2 flex justify-around">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Name & Title */}
            <h2 className="text-white text-2xl font-bold text-center mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              {architect.name}
            </h2>
            <p className="text-zinc-400 text-base text-center mb-6">
              {architect.role} @ {architect.company}
            </p>

            {/* Quote */}
            <div className="max-w-sm">
              <p className="text-zinc-300 text-center text-lg italic leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
                "{architect.nugget}"
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-700 pt-4">
            <div>
              <p className="text-zinc-500 text-xs">From</p>
              <p className="text-white text-sm font-medium">25 B2B Architects of 2026</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-xs">
                {category.label}
              </p>
              <p className="text-white font-bold text-lg tracking-tight">utm.one</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleDownload} variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download PNG
        </Button>
        <Button onClick={handleShare} className="flex-1">
          <Share2 className="h-4 w-4 mr-2" />
          Share on LinkedIn
        </Button>
      </div>
    </div>
  );
}
