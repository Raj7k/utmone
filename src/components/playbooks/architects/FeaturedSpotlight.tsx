import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Linkedin, ExternalLink } from 'lucide-react';
import { architects, categories } from '@/data/b2bArchitects';
import { Button } from '@/components/ui/button';

// Featured architects with extended content
const featuredArchitects = [
  {
    id: 'elena-verna',
    extendedBio: 'Elena Verna has literally written the playbook on Product-Led Growth. Her frameworks are used by Dropbox, Miro, MongoDB, and hundreds of other companies transitioning from sales-led to product-led motions. She doesn\'t just advise—she\'s been in the trenches as CMO and advisor to the most successful PLG companies of the decade.',
    keyInsight: 'The best PLG companies don\'t remove sales—they add it at the right moment in the customer journey.'
  },
  {
    id: 'tim-soulo',
    extendedBio: 'Tim Soulo built Ahrefs into a $100M+ ARR machine by breaking every marketing rule in the book. He tells marketers NOT to buy marketing advice, doesn\'t gate content, gives away tools for free, and barely does outbound. The irony? His contrarian approach has made him one of the most followed marketing voices in B2B.',
    keyInsight: 'The best marketing doesn\'t feel like marketing. It feels like genuine help.'
  },
  {
    id: 'kieran-flanagan',
    extendedBio: 'Kieran Flanagan saw the AI revolution coming before most marketers knew what GPT stood for. As SVP Marketing at HubSpot, he\'s leading one of B2B\'s most important AI transformations. His content breaks down complex AI concepts into actionable frameworks that any marketing team can implement.',
    keyInsight: 'AI won\'t replace marketers. Marketers who use AI will replace those who don\'t.'
  }
];

export function FeaturedSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentFeatured = featuredArchitects[currentIndex];
  const architect = architects.find(a => a.id === currentFeatured.id)!;
  const category = categories[architect.category];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredArchitects.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Featured Spotlight
          </h2>
          <p className="font-sans text-gray-600">
            A deeper look at three architects who exemplify the future of B2B marketing.
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeatured.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-5 gap-6 p-8"
            >
              {/* Photo */}
              <div className="md:col-span-2">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img 
                    src={architect.originalPhoto} 
                    alt={architect.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-sans text-sm text-gray-500">{category.label}</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {architect.name}
                </h3>
                <p className="font-sans text-gray-600 mb-4">
                  {architect.role} @ {architect.company}
                </p>

                <p className="font-sans text-gray-700 leading-relaxed mb-6">
                  {currentFeatured.extendedBio}
                </p>

                <blockquote className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-6">
                  <p className="font-serif text-amber-900 italic">
                    "{currentFeatured.keyInsight}"
                  </p>
                </blockquote>

                <div className="flex items-center gap-3">
                  <Button asChild variant="outline" size="sm">
                    <a href={architect.linkedIn} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      Follow on LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 pb-6">
            <button
              onClick={() => goTo((currentIndex - 1 + featuredArchitects.length) % featuredArchitects.length)}
              className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {featuredArchitects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((currentIndex + 1) % featuredArchitects.length)}
              className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
