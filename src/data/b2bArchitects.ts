// 25 B2B Marketing Architects of Influence - 2026

export type ArchitectCategory = 'growth' | 'futurists' | 'storytellers' | 'visionaries' | 'rising';

export interface Architect {
  id: string;
  name: string;
  company: string;
  role: string;
  category: ArchitectCategory;
  superpower: string;
  linkedIn: string;
  originalPhoto: string;
  stampArt?: string;
  description: string;
  nugget: string; // Shareable one-liner for LinkedIn
}

export const categories: Record<ArchitectCategory, { label: string; icon: string; description: string }> = {
  growth: { 
    label: 'The Growth Engines', 
    icon: '🏗️', 
    description: 'PLG, SEO, and Revenue Operations' 
  },
  futurists: { 
    label: 'The Futurists', 
    icon: '🤖', 
    description: 'AI & Innovation' 
  },
  storytellers: { 
    label: 'Brand Storytellers', 
    icon: '🎨', 
    description: 'Narrative, Creative & Voice' 
  },
  visionaries: { 
    label: 'Strategic Visionaries', 
    icon: '♟️', 
    description: 'GTM Strategy & Leadership' 
  },
  rising: { 
    label: 'Rising Stars', 
    icon: '⭐', 
    description: 'Enterprise Leaders to Watch' 
  },
};

export const architects: Architect[] = [
  // 🏗️ THE GROWTH ENGINES (5)
  {
    id: 'tim-soulo',
    name: 'Tim Soulo',
    company: 'Ahrefs',
    role: 'CMO',
    category: 'growth',
    superpower: 'Contrarian SEO',
    linkedIn: 'https://www.linkedin.com/in/timsoulo/',
    originalPhoto: '/architects/original/tim-soulo.jpeg',
    description: 'The master of "don\'t listen to marketing advice" marketing.',
    nugget: 'The master of "don\'t listen to marketing advice" marketing',
  },
  {
    id: 'elena-verna',
    name: 'Elena Verna',
    company: 'Lovable',
    role: 'Growth Advisor',
    category: 'growth',
    superpower: 'PLG Loops',
    linkedIn: 'https://www.linkedin.com/in/elenaverna/',
    originalPhoto: '/architects/original/elena-verna.jpeg',
    description: 'The queen of Product-Led Growth loops.',
    nugget: 'The queen of PLG—watch how she structures viral loops',
  },
  {
    id: 'emir-atli',
    name: 'Emir Atli',
    company: 'HockeyStack',
    role: 'CRO',
    category: 'growth',
    superpower: 'B2B Attribution',
    linkedIn: 'https://www.linkedin.com/in/emir-atli/',
    originalPhoto: '/architects/original/emir-atli.jpeg',
    description: 'Proving attribution isn\'t dead, it\'s just hard.',
    nugget: 'Proving attribution isn\'t dead, it\'s just hard',
  },
  {
    id: 'steffen-hedebrandt',
    name: 'Steffen Hedebrandt',
    company: 'Dreamdata',
    role: 'Co-Founder',
    category: 'growth',
    superpower: 'Revenue Attribution',
    linkedIn: 'https://www.linkedin.com/in/steffenhedebrandt/',
    originalPhoto: '/architects/original/steffen-hedebrandt.jpeg',
    description: 'Bridging the gap between marketing spend and revenue.',
    nugget: 'Bridging the gap between marketing spend and revenue',
  },
  {
    id: 'josh-grant',
    name: 'Josh Grant',
    company: 'Webflow',
    role: 'VP Marketing',
    category: 'growth',
    superpower: 'No-Code Growth',
    linkedIn: 'https://www.linkedin.com/in/joshbgrant/',
    originalPhoto: '/architects/original/josh-grant.jpeg',
    description: 'Democratizing web creation for growth teams.',
    nugget: 'Democratizing web creation for growth teams',
  },

  // 🤖 THE FUTURISTS (5)
  {
    id: 'ashley-kramer',
    name: 'Ashley Kramer',
    company: 'OpenAI',
    role: 'CMO',
    category: 'futurists',
    superpower: 'AI Evangelism',
    linkedIn: 'https://www.linkedin.com/in/ashleykramer/',
    originalPhoto: '/architects/original/ashley-kramer.jpeg',
    description: 'Literally sitting at the source of the revolution.',
    nugget: 'Literally sitting at the source of the AI revolution',
  },
  {
    id: 'kieran-flanagan',
    name: 'Kieran Flanagan',
    company: 'HubSpot',
    role: 'SVP Marketing',
    category: 'futurists',
    superpower: 'AI + Human Scale',
    linkedIn: 'https://www.linkedin.com/in/kieranflanagan/',
    originalPhoto: '/architects/original/kieran-flanagan.jpeg',
    description: 'Bridging the gap between human creativity and AI scale.',
    nugget: 'Bridging the gap between human creativity and AI scale',
  },
  {
    id: 'philip-lakin',
    name: 'Philip Lakin',
    company: 'Zapier',
    role: 'CMO',
    category: 'futurists',
    superpower: 'Automation Mastery',
    linkedIn: 'https://www.linkedin.com/in/philipwlakin/',
    originalPhoto: '/architects/original/philip-lakin.jpeg',
    description: 'Making automation accessible to every marketer.',
    nugget: 'Making automation accessible to every marketer',
  },
  {
    id: 'trinity-nguyen',
    name: 'Trinity Nguyen',
    company: 'UserGems',
    role: 'CMO & AI GTM',
    category: 'futurists',
    superpower: 'Signal-Based Selling',
    linkedIn: 'https://www.linkedin.com/in/trinitynguyen/',
    originalPhoto: '/architects/original/trinity-nguyen.jpeg',
    description: 'Pioneering the future of intent-driven outreach.',
    nugget: 'Pioneering the future of intent-driven outreach',
  },
  {
    id: 'kevin-white',
    name: 'Kevin White',
    company: 'Scrunch AI',
    role: 'Head of Marketing',
    category: 'futurists',
    superpower: 'AI Growth',
    linkedIn: 'https://www.linkedin.com/in/kevinwhitesays/',
    originalPhoto: '/architects/original/kevin-white.jpeg',
    description: 'Turning AI signals into growth opportunities.',
    nugget: 'Turning AI signals into growth opportunities',
  },

  // 🎨 BRAND STORYTELLERS (5)
  {
    id: 'udi-ledergor',
    name: 'Udi Ledergor',
    company: 'Gong',
    role: 'Chief Evangelist',
    category: 'storytellers',
    superpower: 'B2B Entertainment',
    linkedIn: 'https://www.linkedin.com/in/udiledergor/',
    originalPhoto: '/architects/original/udi-ledergor.jpeg',
    description: 'The pioneer who proved B2B doesn\'t have to be boring.',
    nugget: 'The pioneer who proved B2B doesn\'t have to be boring',
  },
  {
    id: 'kyle-lacy',
    name: 'Kyle Lacy',
    company: 'Docebo',
    role: 'CMO',
    category: 'storytellers',
    superpower: 'High-Production Value',
    linkedIn: 'https://www.linkedin.com/in/kylelacy/',
    originalPhoto: '/architects/original/kyle-lacy.jpeg',
    description: 'High-production value meets hard ROI.',
    nugget: 'High-production value meets hard ROI',
  },
  {
    id: 'lara-hood-balazs',
    name: 'Lara Hood Balazs',
    company: 'Adobe',
    role: 'EVP Marketing',
    category: 'storytellers',
    superpower: 'Enterprise Storytelling',
    linkedIn: 'https://www.linkedin.com/in/larahoodbalazs/',
    originalPhoto: '/architects/original/lara-hood-balazs.jpeg',
    description: 'Crafting narratives that move enterprise buyers.',
    nugget: 'Crafting narratives that move enterprise buyers',
  },
  {
    id: 'julien-sauvage',
    name: 'Julien Sauvage',
    company: 'Cordial',
    role: 'CMO',
    category: 'storytellers',
    superpower: 'Brand Architecture',
    linkedIn: 'https://www.linkedin.com/in/juliensauvage/',
    originalPhoto: '/architects/original/julien-sauvage.jpeg',
    description: 'Building brands that customers actually remember.',
    nugget: 'Building brands that customers actually remember',
  },
  {
    id: 'laura-jones',
    name: 'Laura Jones',
    company: 'Instacart',
    role: 'CMO',
    category: 'storytellers',
    superpower: 'Consumer Brand',
    linkedIn: 'https://www.linkedin.com/in/laura-jones-54a7792/',
    originalPhoto: '/architects/original/laura-jones.jpeg',
    description: 'Taking consumer marketing lessons to B2B scale.',
    nugget: 'Taking consumer marketing lessons to B2B scale',
  },

  // ♟️ STRATEGIC VISIONARIES (5)
  {
    id: 'scott-holden',
    name: 'Scott Holden',
    company: 'Vanta',
    role: 'CMO',
    category: 'visionaries',
    superpower: 'Trust Marketing',
    linkedIn: 'https://www.linkedin.com/in/scottdholden/',
    originalPhoto: '/architects/original/scott-holden.png',
    description: 'Turning security compliance into a growth lever.',
    nugget: 'Turning security compliance into a growth lever',
  },
  {
    id: 'bryan-law',
    name: 'Bryan Law',
    company: 'SentinelOne',
    role: 'CMO',
    category: 'visionaries',
    superpower: 'Cybersecurity GTM',
    linkedIn: 'https://www.linkedin.com/in/blaw/',
    originalPhoto: '/architects/original/bryan-law.png',
    description: 'Leading GTM in the most competitive security market.',
    nugget: 'Leading GTM in the most competitive security market',
  },
  {
    id: 'chris-cunningham',
    name: 'Chris Cunningham',
    company: 'ClickUp',
    role: 'CMO',
    category: 'visionaries',
    superpower: 'Category Creation',
    linkedIn: 'https://www.linkedin.com/in/chriscunninghamsf/',
    originalPhoto: '/architects/original/chris-cunningham.jpeg',
    description: 'Building a productivity empire through bold moves.',
    nugget: 'Building a productivity empire through bold moves',
  },
  {
    id: 'kacie-jenkins',
    name: 'Kacie Jenkins',
    company: 'Sendoso',
    role: 'ex SVP Marketing',
    category: 'visionaries',
    superpower: 'ABM Strategy',
    linkedIn: 'https://www.linkedin.com/in/kaciejenkins/',
    originalPhoto: '/architects/original/kacie-jenkins.jpeg',
    description: 'Making ABM actually work at scale.',
    nugget: 'Making ABM actually work at scale',
  },
  {
    id: 'jordan-crawford',
    name: 'Jordan Crawford',
    company: 'Blueprint',
    role: 'Founder',
    category: 'visionaries',
    superpower: 'GTM Engineering',
    linkedIn: 'https://www.linkedin.com/in/jordancrawford/',
    originalPhoto: '/architects/original/jordan-crawford.jpeg',
    description: 'Engineering precision into go-to-market motions.',
    nugget: 'Engineering precision into go-to-market motions',
  },

  // ⭐ RISING STARS (5)
  {
    id: 'lauren-nemeth',
    name: 'Lauren Nemeth',
    company: 'New Relic',
    role: 'CRO',
    category: 'rising',
    superpower: 'Revenue Leadership',
    linkedIn: 'https://www.linkedin.com/in/laurennemeth/',
    originalPhoto: '/architects/original/lauren-nemeth.jpeg',
    description: 'Transforming revenue operations at scale.',
    nugget: 'Transforming revenue operations at scale',
  },
  {
    id: 'madhav-bhandari',
    name: 'Madhav Bhandari',
    company: 'Storylane',
    role: 'Head of Marketing',
    category: 'rising',
    superpower: 'Interactive Demos',
    linkedIn: 'https://www.linkedin.com/in/madhavbhandari/',
    originalPhoto: '/architects/original/madhav-bhandari.jpeg',
    description: 'Pioneering the interactive product demo revolution.',
    nugget: 'Pioneering the interactive product demo revolution',
  },
  {
    id: 'nicole-baer',
    name: 'Nicole Baer',
    company: 'Carta',
    role: 'CMO',
    category: 'rising',
    superpower: 'Scale Marketing',
    linkedIn: 'https://www.linkedin.com/in/nicolembaer/',
    originalPhoto: '/architects/original/nicole-baer.jpeg',
    description: 'Scaling marketing for hypergrowth fintech.',
    nugget: 'Scaling marketing for hypergrowth fintech',
  },
  {
    id: 'roxana-irimia',
    name: 'Roxana Irimia',
    company: 'Chili Piper',
    role: 'VP of Marketing',
    category: 'rising',
    superpower: 'Demand Gen',
    linkedIn: 'https://www.linkedin.com/in/roxanairimia/',
    originalPhoto: '/architects/original/roxana-irimia.jpeg',
    description: 'Mastering the art of demand generation.',
    nugget: 'Mastering the art of demand generation',
  },
  {
    id: 'angela-ferrante',
    name: 'Angela Ferrante',
    company: 'Zapier',
    role: 'Head of Enterprise Marketing',
    category: 'rising',
    superpower: 'Enterprise Marketing',
    linkedIn: 'https://www.linkedin.com/in/angelaferrante/',
    originalPhoto: '/architects/original/angela-ferrante.png',
    description: 'Bridging the gap to enterprise customers.',
    nugget: 'Bridging the gap to enterprise customers',
  },
];

export function getArchitectsByCategory(category: ArchitectCategory): Architect[] {
  return architects.filter(a => a.category === category);
}

export function getArchitectById(id: string): Architect | undefined {
  return architects.find(a => a.id === id);
}
