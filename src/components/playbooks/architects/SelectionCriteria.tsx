import { motion } from 'framer-motion';
import { Target, Zap, Users, GraduationCap } from 'lucide-react';

const criteria = [
  {
    icon: Target,
    title: 'Originality',
    description: 'Creating new frameworks, not just remixing existing ideas. These leaders coined terms your team now uses daily.',
    example: 'Elena Verna literally wrote the PLG playbook everyone else copies.'
  },
  {
    icon: Zap,
    title: 'Execution',
    description: 'Proven results at scale, not just theories. Every person here has shipped campaigns that moved millions.',
    example: 'Kyle Lacy\'s Lessonly work became the template for video-first B2B.'
  },
  {
    icon: Users,
    title: 'Influence',
    description: 'Shaping how others think and work. When they speak, CMOs and founders listen—and change their strategies.',
    example: 'When Tim Soulo says "don\'t buy marketing advice," people ironically take that advice.'
  },
  {
    icon: GraduationCap,
    title: 'Teaching',
    description: 'Generously sharing knowledge, not gatekeeping. They make complex strategies accessible to everyone.',
    example: 'Kieran Flanagan\'s content has helped thousands transition into AI-first marketing.'
  }
];

export function SelectionCriteria() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why These 25?
          </h2>
          <p className="font-sans text-gray-600 max-w-2xl mx-auto">
            We didn't just pick popular names. Our selection criteria ensures every architect 
            on this list has demonstrated mastery in four key dimensions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {criteria.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <item.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>
                  <p className="font-sans text-xs text-gray-500 italic border-l-2 border-gray-200 pl-3">
                    {item.example}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
