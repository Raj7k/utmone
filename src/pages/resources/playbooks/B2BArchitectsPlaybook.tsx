import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Layers, Link2, Quote, Sparkles } from 'lucide-react';
import { ResourcesLayout } from '@/components/layout/ResourcesLayout';
import { CategoryFilter } from '@/components/playbooks/architects/CategoryFilter';
import { ArchitectsGrid } from '@/components/playbooks/architects/ArchitectsGrid';
import { architects, ArchitectCategory, categories } from '@/data/b2bArchitects';
import { Badge } from '@/components/ui/badge';

export default function B2BArchitectsPlaybook() {
  const [selectedCategory, setSelectedCategory] = useState<ArchitectCategory | 'all'>('all');

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
              <span className="text-sm text-gray-500">8 min read</span>
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
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl"
            >
              If you're waiting for the 2026 marketing playbook to be published, you're already behind. 
              The smartest CMOs aren't just consuming content—they're building media companies inside their brands.
            </motion.p>

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
                  <p className="text-2xl font-bold text-gray-900">{architects.length}</p>
                  <p className="text-xs text-gray-500">Leaders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
                <Layers className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(categories).length}</p>
                  <p className="text-xs text-gray-500">Categories</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
                <Link2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">Direct</p>
                  <p className="text-xs text-gray-500">LinkedIn Access</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter + Grid */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Your Curriculum for 2026
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                We analyzed the landscape to find the signal in the noise. These aren't just "influencers." 
                These are the operators, visionaries, and contrarians rewriting the rules of B2B engagement.
              </p>
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            <div className="mt-10">
              <ArchitectsGrid filter={selectedCategory} />
            </div>
          </div>
        </section>

        {/* The Common Thread Section */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
              <Quote className="w-10 h-10 text-gray-300 mb-6" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6">
                The Common Thread
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Notice something? <strong>None of these leaders hide behind a corporate logo.</strong> 
                They <em>are</em> the channel.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                If you're a Head of Marketing, your 2026 goal isn't just to post more—it's to empower your 
                internal experts to become the voices listed above. The era of the faceless corporation is over.
              </p>
            </div>
          </div>
        </section>

        {/* EGC Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
              The Era of Employee Generated Content (EGC)
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              The playbook is right in front of you. Pick 5 leaders from this list who align with your style. 
              Study their cadence, their hooks, and their engagement. Then, start writing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resources/templates"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Download Content Strategy Template
              </Link>
              <Link
                to="/early-access"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Join Our Newsletter
              </Link>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              The Five Pillars of B2B Influence
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categories).map(([key, category], index) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedCategory(key as ArchitectCategory);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl p-6 text-left shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
                >
                  <span className="text-3xl mb-3 block">{category.icon}</span>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                    {category.label}
                  </h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {architects.filter(a => a.category === key).length} leaders
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ResourcesLayout>
  );
}
