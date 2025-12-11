import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ArrowUpRight } from 'lucide-react';
import { Architect, categories } from '@/data/b2bArchitects';

interface ArchitectCardProps {
  architect: Architect;
  index: number;
}

export function ArchitectCard({ architect, index }: ArchitectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const category = categories[architect.category];

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
        {/* Front - Stamp Art Placeholder */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
            {/* Stamp Container with perforated edge effect */}
            <div className="relative h-[60%] bg-gradient-to-br from-gray-50 to-gray-100 p-3">
              <div 
                className="w-full h-full rounded-lg overflow-hidden"
                style={{
                  background: `url(${architect.originalPhoto}) center/cover`,
                  filter: 'saturate(1.2) contrast(1.1)',
                }}
              >
                {/* Stamp overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              </div>
              {/* Perforated edge */}
              <div className="absolute inset-x-0 bottom-0 h-4 flex justify-around items-center">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white shadow-inner" />
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 h-[40%] flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {architect.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {architect.role} @ {architect.company}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  <span>{category.icon}</span>
                  {architect.superpower}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back - Original Photo + Description */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Photo */}
            <div 
              className="h-[55%] bg-cover bg-center"
              style={{ backgroundImage: `url(${architect.originalPhoto})` }}
            />

            {/* Description */}
            <div className="p-4 h-[45%] flex flex-col justify-between bg-gradient-to-b from-white to-gray-50">
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "{architect.description}"
              </p>
              
              <a
                href={architect.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="w-4 h-4" />
                Follow on LinkedIn
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
