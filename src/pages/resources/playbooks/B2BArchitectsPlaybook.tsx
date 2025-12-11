import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Layers, Link2, Quote, Sparkles, Linkedin } from 'lucide-react';
import { ResourcesLayout } from '@/components/layout/ResourcesLayout';
import { CategoryFilter } from '@/components/playbooks/architects/CategoryFilter';
import { ArchitectsGrid } from '@/components/playbooks/architects/ArchitectsGrid';
import { SelectionCriteria } from '@/components/playbooks/architects/SelectionCriteria';
import { FeaturedSpotlight } from '@/components/playbooks/architects/FeaturedSpotlight';
import { PlaybookGuide } from '@/components/playbooks/architects/PlaybookGuide';
import { DownloadCenter } from '@/components/playbooks/architects/DownloadCenter';
import { CategoryDeepDive } from '@/components/playbooks/architects/CategoryDeepDive';
import { architects, ArchitectCategory, categories } from '@/data/b2bArchitects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { shareToLinkedIn } from '@/utils/linkedinShare';

export default function B2BArchitectsPlaybook() {
  const [selectedCategory, setSelectedCategory] = useState<ArchitectCategory | 'all'>('all');

  const handleSharePlaybook = () => {
    const shareText = `🎯 Just discovered the 25 B2B Marketing Architects defining 2026.

These aren't just "influencers"—they're the operators rewriting the rules of B2B engagement.

Featuring Elena Verna, Tim Soulo, Kieran Flanagan, and 22 more...

Your 2026 curriculum starts here 👇
utm.one/resources/playbooks/b2b-architects-2026

#B2BMarketing #MarketingLeaders #GTM`;
    shareToLinkedIn(shareText);
  };

  return (
    <ResourcesLayout>
      <Helmet>
        <title>25 B2B Marketing Architects Defining 2026 | utm.one</title>
        <meta 
          name="description" 
          content="The definitive guide to the 25 most influential B2B marketing leaders shaping the industry in 2026. Learn from the masters of PLG, AI, brand storytelling, and GTM strategy." 
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Link 
              to="/resources/playbooks" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Playbooks
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <Sparkles className="w-3 h-3 mr-1" />
                FEATURED
              </Badge>
              <span className="text-sm text-gray-500">12 min read</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Beyond the Algorithm: <br />
              <span className="text-gray-600">The 25 B2B Marketing Architects Defining 2026</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-sans text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl"
            >
              If you're waiting for the 2026 marketing playbook to be published, you're already behind. 
              The smartest CMOs aren't just consuming content—they're building media companies inside their brands.
              This is your curriculum for mastering the future.
            </motion.p>

            {/* Share Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <Button onClick={handleSharePlaybook} variant="outline" className="gap-2">
                <Linkedin className="h-4 w-4" />
                Share on LinkedIn
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-mono text-2xl font-bold text-gray-900">{architects.length}</p>
                  <p className="font-sans text-xs text-gray-500">Leaders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
                <Layers className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-mono text-2xl font-bold text-gray-900">{Object.keys(categories).length}</p>
                  <p className="font-sans text-xs text-gray-500">Categories</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
                <Link2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-mono text-2xl font-bold text-gray-900">Direct</p>
                  <p className="font-sans text-xs text-gray-500">LinkedIn Access</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Selection Criteria */}
        <SelectionCriteria />

        {/* Featured Spotlight */}
        <FeaturedSpotlight />

        {/* Category Filter + Grid */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Your Curriculum for 2026
              </h2>
              <p className="font-sans text-gray-600 max-w-2xl mx-auto mb-8">
                We analyzed the landscape to find the signal in the noise. These aren't just "influencers." 
                These are the operators, visionaries, and contrarians rewriting the rules of B2B engagement.
              </p>
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            {/* Category Deep Dive - shows when category is selected */}
            {selectedCategory !== 'all' && (
              <CategoryDeepDive category={selectedCategory} />
            )}

            <div className="mt-10">
              <ArchitectsGrid filter={selectedCategory} />
            </div>
          </div>
        </section>

        {/* How to Use This Playbook */}
        <PlaybookGuide />

        {/* The Common Thread Section */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
              <Quote className="w-10 h-10 text-gray-300 mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                The Common Thread
              </h2>
              <p className="font-sans text-lg text-gray-700 leading-relaxed mb-6">
                Notice something? <strong>None of these leaders hide behind a corporate logo.</strong> 
                They <em>are</em> the channel. Their personal brands have become more valuable than 
                company marketing budgets.
              </p>
              <p className="font-sans text-lg text-gray-700 leading-relaxed mb-6">
                In 2026, the companies winning aren't those with the biggest ad spend. They're the ones 
                who've empowered their people to become the voices that matter. The era of faceless 
                corporate marketing is over.
              </p>
              <p className="font-sans text-lg text-gray-700 leading-relaxed">
                If you're a Head of Marketing, your 2026 goal isn't just to post more—it's to build 
                an army of internal experts who can authentically connect with your audience. 
                These 25 architects show you exactly how it's done.
              </p>
            </div>
          </div>
        </section>

        {/* EGC Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Era of Employee Generated Content (EGC)
            </h2>
            <p className="font-sans text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              The playbook is right in front of you. Pick 5 leaders from this list who align with your style. 
              Study their cadence, their hooks, and their engagement. Then, start writing.
            </p>
            <p className="font-sans text-lg text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Every post you make is practice. Every comment is connection. Every share is distribution.
              The compound effect of consistent, quality content is the only marketing moat left in 2026.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resources/templates"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-sans font-medium hover:bg-gray-800 transition-colors"
              >
                Download Content Strategy Template
              </Link>
              <Link
                to="/early-access"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-sans font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Join Our Newsletter
              </Link>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
              The Five Pillars of B2B Influence
            </h2>
            <p className="font-sans text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Each category represents a distinct approach to B2B marketing mastery. 
              Click any pillar to filter the list above and dive deeper.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categories).map(([key, category], index) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedCategory(key as ArchitectCategory);
                    window.scrollTo({ top: 800, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl p-6 text-left shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
                >
                  <span className="text-3xl mb-3 block">{category.icon}</span>
                  <h3 className="font-sans font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                    {category.label}
                  </h3>
                  <p className="font-sans text-sm text-gray-500">{category.description}</p>
                  <p className="font-mono text-xs text-gray-400 mt-3">
                    {architects.filter(a => a.category === key).length} leaders
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Download Center */}
        <DownloadCenter />
      </div>
    </ResourcesLayout>
  );
}
