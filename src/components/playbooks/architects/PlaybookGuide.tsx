import { motion } from 'framer-motion';
import { Search, UserPlus, Eye, PenTool, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Pick Your Category',
    description: 'Start with the pillar most relevant to your role. If you\'re in demand gen, start with Growth Engines. Product marketing? PLG Pioneers.',
    tip: 'Don\'t try to follow everyone. Quality over quantity.'
  },
  {
    number: '02',
    icon: UserPlus,
    title: 'Follow 5 Leaders',
    description: 'Select five architects from your chosen category. Turn on notifications. Their content is your curriculum.',
    tip: 'LinkedIn notifications + weekly digest = perfect balance.'
  },
  {
    number: '03',
    icon: Eye,
    title: 'Study Their Patterns',
    description: 'Spend two weeks just observing. What\'s their posting cadence? How do they structure hooks? When do they post?',
    tip: 'Create a swipe file of posts that got high engagement.'
  },
  {
    number: '04',
    icon: PenTool,
    title: 'Start Creating',
    description: 'Now adapt their frameworks to your context. Don\'t copy—translate their principles to your industry and voice.',
    tip: 'Aim for 3 posts per week. Consistency beats virality.'
  }
];

export function PlaybookGuide() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            How to Use This Playbook
          </h2>
          <p className="font-sans text-gray-600 max-w-2xl mx-auto">
            This isn't a list to bookmark and forget. Here's how to turn these architects 
            into your personal marketing education.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex gap-6">
                  {/* Step Number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center">
                      <span className="font-mono text-lg font-bold">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="w-5 h-5 text-gray-700" />
                      <h3 className="font-sans font-semibold text-gray-900 text-lg">
                        {step.title}
                      </h3>
                    </div>
                    <p className="font-sans text-gray-600 mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-start gap-2 text-sm bg-gray-50 rounded-lg p-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-gray-600">
                        <strong className="text-gray-900">Pro tip:</strong> {step.tip}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
