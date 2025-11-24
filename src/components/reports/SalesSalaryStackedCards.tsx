import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const salesRoles = [
  {
    title: 'SDR / BDR',
    badge: 'Entry Level',
    baseSalary: '$45K - $65K',
    ote: '$65K - $95K',
    description: 'Sales Development Representatives and Business Development Representatives focus on lead generation and qualification.',
    keyMetrics: ['10-15 qualified meetings/month', '20-30% conversion to SQL', '$50-75K quota'],
  },
  {
    title: 'Account Executive (Mid-Market)',
    badge: 'Individual Contributor',
    baseSalary: '$70K - $95K',
    ote: '$120K - $170K',
    description: 'AEs manage full sales cycles for mid-market accounts ($10K-$100K ACV).',
    keyMetrics: ['$500K-$1M annual quota', '25-40% win rate', '3-6 month sales cycle'],
  },
  {
    title: 'Enterprise AE',
    badge: 'Senior IC',
    baseSalary: '$100K - $140K',
    ote: '$200K - $300K',
    description: 'Enterprise Account Executives handle complex, high-value deals ($100K+ ACV) with multiple stakeholders.',
    keyMetrics: ['$1M-$3M annual quota', '20-30% win rate', '6-12 month sales cycle'],
  },
  {
    title: 'Sales Manager / Director',
    badge: 'Leadership',
    baseSalary: '$120K - $160K',
    ote: '$220K - $350K',
    description: 'Sales leaders manage teams of 5-10 AEs, set strategy, and drive revenue growth.',
    keyMetrics: ['Team quota $5M-$15M', '5-10 direct reports', '25-35% team win rate'],
  },
];

export const SalesSalaryStackedCards = () => {
  return (
    <div className="space-y-8">
      {salesRoles.map((role, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                  <Badge variant="secondary">{role.badge}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-label">Base Salary</p>
                  <p className="text-xl font-bold text-primary">{role.baseSalary}</p>
                  <p className="text-sm text-secondary-label mt-2">On-Target Earnings (OTE)</p>
                  <p className="text-2xl font-bold text-blazeOrange">{role.ote}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary-label">{role.description}</p>
              <div>
                <p className="text-sm font-semibold mb-2">Key Performance Metrics:</p>
                <ul className="space-y-1">
                  {role.keyMetrics.map((metric, i) => (
                    <li key={i} className="text-sm text-secondary-label flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
