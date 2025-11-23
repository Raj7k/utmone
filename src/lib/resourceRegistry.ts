// Central registry of all resources for dynamic counting and NEW badge management

interface Resource {
  slug: string;
  title: string;
  badge?: 'NEW' | 'FEATURED' | 'UPDATED';
}

export const resourceRegistry = {
  guides: [
    { slug: 'utm-guide', title: 'UTM Parameters Guide' },
    { slug: 'clean-track-framework', title: 'Clean-Track Framework' },
    { slug: 'tracking-architecture', title: 'Tracking Architecture' },
    { slug: 'simple-analytics', title: 'Simple Analytics Guide' },
    { slug: 'growth-analytics', title: 'Growth Analytics' },
    { slug: 'llm-seo', title: 'LLM-First SEO' }
  ],
  playbooks: [
    { slug: 'utm-governance-playbook', title: 'UTM Governance' },
    { slug: 'startup-analytics-playbook', title: 'Startup Analytics' },
    { slug: 'event-led-growth-playbook', title: 'Event-Led Growth' },
    { slug: 'naming-convention-playbook', title: 'Naming Convention' },
    { slug: 'sales-marketing-alignment', title: 'Sales & Marketing Alignment' },
    { slug: 'ai-marketing', title: 'AI Marketing', badge: 'NEW' as const }
  ],
  templates: [
    { slug: 'utm-template', title: 'UTM Template' },
    { slug: 'audit-checklist-template', title: 'Audit Checklist' },
    { slug: 'campaign-brief-template', title: 'Campaign Brief' },
    { slug: 'naming-taxonomy-template', title: 'Naming Taxonomy' }
  ],
  checklists: [
    { slug: 'analytics-health', title: 'Analytics Health' },
    { slug: 'campaign-launch', title: 'Campaign Launch' },
    { slug: 'utm-audit', title: 'UTM Audit' }
  ],
  frameworks: [
    { slug: 'clean-track-model', title: 'Clean Track Model' },
    { slug: 'minimal-analytics-stack', title: 'Minimal Analytics Stack' },
    { slug: 'attribution-clarity-model', title: 'Attribution Clarity Model' },
    { slug: 'b2b-attribution', title: 'B2B Attribution Framework', badge: 'NEW' as const }
  ],
  examples: [
    { slug: 'utm-examples', title: 'UTM Examples' },
    { slug: 'naming-examples', title: 'Naming Examples' },
    { slug: 'dashboard-examples', title: 'Dashboard Examples' }
  ],
  tools: [
    { slug: 'salary-negotiation-coach', title: 'AI Salary Negotiation Coach', badge: 'NEW' as const },
    { slug: 'market-value-calculator', title: 'Market Value Calculator', badge: 'NEW' as const },
    { slug: 'career-path-optimizer', title: 'Career Path Optimizer', badge: 'NEW' as const },
    { slug: 'job-offer-analyzer', title: 'Job Offer Analyzer', badge: 'NEW' as const },
    { slug: 'team-budget-optimizer', title: 'Team Budget Optimizer', badge: 'NEW' as const },
    { slug: 'ai-vs-human-roi', title: 'AI vs. Human ROI Calculator', badge: 'NEW' as const },
    { slug: 'compensation-transparency', title: 'Compensation Transparency', badge: 'NEW' as const },
    { slug: 'linkedin-reality-check', title: 'LinkedIn Reality Check', badge: 'NEW' as const }
  ],
  glossary: [] as Resource[], // Dynamically counted from glossary page
  reports: [
    { slug: 'salary-benchmark-2025', title: '2025 Global Salary Benchmark Report', badge: 'FEATURED' as const }
  ]
};

export function getResourceCount(category: keyof typeof resourceRegistry): string {
  const count = resourceRegistry[category].length;
  
  // Special handling for glossary (70+ terms)
  if (category === 'glossary') {
    return '70+ terms';
  }
  
  return `${count} ${category}`;
}

export function getNewResources() {
  const allResources = Object.entries(resourceRegistry).flatMap(([category, items]) => 
    items
      .filter(item => item.badge === 'NEW')
      .map(item => ({ 
        ...item, 
        category: category as keyof typeof resourceRegistry 
      }))
  );
  return allResources;
}

export function hasNewContent(): boolean {
  return getNewResources().length > 0;
}

export function getResourcesByCategory(category: keyof typeof resourceRegistry) {
  return resourceRegistry[category];
}
