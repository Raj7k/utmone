import { motion } from 'framer-motion';
import { categories, ArchitectCategory } from '@/data/b2bArchitects';

const categoryDeepDives: Record<ArchitectCategory, { intro: string; whyMatters: string; whatToLearn: string }> = {
  growth: {
    intro: 'Growth Engines are the architects who\'ve cracked the code on sustainable, scalable acquisition. They don\'t chase vanity metrics—they build systems that compound.',
    whyMatters: 'In 2026, CAC is through the roof. The winners will be those who build organic engines that reduce dependency on paid channels while maintaining velocity.',
    whatToLearn: 'Study their content flywheels, their approach to SEO as a moat, and how they turn customers into acquisition channels.'
  },
  futurists: {
    intro: 'The Futurists aren\'t just using AI—they\'re reshaping what marketing even means in an AI-first world. They\'re building the playbooks everyone else will copy.',
    whyMatters: 'AI will disrupt every marketing function. Those who master it first will have compounding advantages for years.',
    whatToLearn: 'Watch how they balance automation with authenticity, and how they use AI to amplify human creativity rather than replace it.'
  },
  storytellers: {
    intro: 'Brand Storytellers prove that B2B doesn\'t have to be boring. They\'ve built emotional connections in categories where competitors rely on feature lists.',
    whyMatters: 'In an AI-commoditized world, brand becomes the only defensible moat. The companies that make people feel something will win.',
    whatToLearn: 'Study their narrative arcs, their willingness to take creative risks, and how they measure brand impact beyond MQLs.'
  },
  visionaries: {
    intro: 'Strategic Visionaries treat go-to-market like an engineering discipline. They bring rigor, measurement, and systems thinking to what many treat as guesswork.',
    whyMatters: 'The gap between good and great companies is execution. GTM visionaries close that gap through process excellence.',
    whatToLearn: 'Pay attention to their frameworks, their RevOps integration, and how they align sales and marketing into a single motion.'
  },
  rising: {
    intro: 'Rising Stars are the enterprise leaders who\'ve proven their PLG and growth expertise at scale. They\'re the next generation defining how large organizations win.',
    whyMatters: 'Enterprise is adopting startup motions. Understanding how to layer growth tactics onto enterprise foundations is the superpower of 2026.',
    whatToLearn: 'Focus on their activation sequences, expansion triggers, and how they balance self-serve with sales-assist at scale.'
  }
};

interface CategoryDeepDiveProps {
  category: ArchitectCategory;
}

export function CategoryDeepDive({ category }: CategoryDeepDiveProps) {
  const categoryInfo = categories[category];
  const deepDive = categoryDeepDives[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{categoryInfo.icon}</span>
        <div>
          <h3 className="font-serif text-xl font-bold text-gray-900">{categoryInfo.label}</h3>
          <p className="font-sans text-sm text-gray-500">{categoryInfo.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="font-sans text-gray-700 leading-relaxed">
          {deepDive.intro}
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-sans font-semibold text-gray-900 text-sm mb-2">
            Why This Matters in 2026
          </h4>
          <p className="font-sans text-gray-600 text-sm">
            {deepDive.whyMatters}
          </p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h4 className="font-sans font-semibold text-amber-900 text-sm mb-2">
            What to Learn From This Group
          </h4>
          <p className="font-sans text-amber-800 text-sm">
            {deepDive.whatToLearn}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
