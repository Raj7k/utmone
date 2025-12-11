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
  // 🏗️ THE GROWTH ENGINES
  {
    id: 'tim-soulo',
    name: 'Tim Soulo',
    company: 'Ahrefs',
    role: 'CMO',
    category: 'growth',
    superpower: 'Contrarian SEO',
    linkedIn: 'https://linkedin.com/in/timsoulo',
    originalPhoto: '/architects/original/tim-soulo.jpeg',
    description: 'The master of "don\'t listen to marketing advice" marketing.',
  },
  {
    id: 'elena-verna',
    name: 'Elena Verna',
    company: 'Lovable',
    role: 'Growth Advisor',
    category: 'growth',
    superpower: 'PLG Loops',
    linkedIn: 'https://linkedin.com/in/elenaverna',
    originalPhoto: '/architects/original/elena-verna.jpeg',
    description: 'The queen of Product-Led Growth loops.',
  },
  {
    id: 'emir-atli',
    name: 'Emir Atli',
    company: 'HockeyStack',
    role: 'CRO',
    category: 'growth',
    superpower: 'B2B Attribution',
    linkedIn: 'https://linkedin.com/in/emiratli',
    originalPhoto: '/architects/original/emir-atli.jpeg',
    description: 'Proving attribution isn\'t dead, it\'s just hard.',
  },
  {
    id: 'steffen-hedebrandt',
    name: 'Steffen Hedebrandt',
    company: 'Dreamdata',
    role: 'Co-Founder',
    category: 'growth',
    superpower: 'Revenue Attribution',
    linkedIn: 'https://linkedin.com/in/steffenhedebrandt',
    originalPhoto: '/architects/original/steffen-hedebrandt.jpeg',
    description: 'Bridging the gap between marketing spend and revenue.',
  },
  {
    id: 'josh-grant',
    name: 'Josh Grant',
    company: 'Webflow',
    role: 'VP Marketing',
    category: 'growth',
    superpower: 'No-Code Growth',
    linkedIn: 'https://linkedin.com/in/joshgrant',
    originalPhoto: '/architects/original/josh-grant.jpeg',
    description: 'Democratizing web creation for growth teams.',
  },

  // 🤖 THE FUTURISTS
  {
    id: 'ashley-kramer',
    name: 'Ashley Kramer',
    company: 'OpenAI',
    role: 'CMO',
    category: 'futurists',
    superpower: 'AI Evangelism',
    linkedIn: 'https://linkedin.com/in/ashleykramer',
    originalPhoto: '/architects/original/ashley-kramer.jpeg',
    description: 'Literally sitting at the source of the revolution.',
  },
  {
    id: 'kieran-flanagan',
    name: 'Kieran Flanagan',
    company: 'HubSpot',
    role: 'SVP Marketing',
    category: 'futurists',
    superpower: 'AI + Human Scale',
    linkedIn: 'https://linkedin.com/in/kieranflanagan',
    originalPhoto: '/architects/original/kieran-flanagan.jpeg',
    description: 'Bridging the gap between human creativity and AI scale.',
  },
  {
    id: 'philip-lakin',
    name: 'Philip Lakin',
    company: 'Zapier',
    role: 'CMO',
    category: 'futurists',
    superpower: 'Automation Mastery',
    linkedIn: 'https://linkedin.com/in/philipwlakin',
    originalPhoto: '/architects/original/philip-lakin.jpeg',
    description: 'Making automation accessible to every marketer.',
  },
  {
    id: 'trinity-nguyen',
    name: 'Trinity Nguyen',
    company: 'UserGems',
    role: 'VP Marketing',
    category: 'futurists',
    superpower: 'Signal-Based Selling',
    linkedIn: 'https://linkedin.com/in/trinitynguyen',
    originalPhoto: '/architects/original/trinity-nguyen.jpeg',
    description: 'Pioneering the future of intent-driven outreach.',
  },

  // 🎨 BRAND STORYTELLERS
  {
    id: 'udi-ledergor',
    name: 'Udi Ledergor',
    company: 'Gong',
    role: 'Chief Evangelist',
    category: 'storytellers',
    superpower: 'B2B Entertainment',
    linkedIn: 'https://linkedin.com/in/udiledergor',
    originalPhoto: '/architects/original/udi-ledergor.jpeg',
    description: 'The pioneer who proved B2B doesn\'t have to be boring.',
  },
  {
    id: 'kyle-lacy',
    name: 'Kyle Lacy',
    company: 'Docebo',
    role: 'CMO',
    category: 'storytellers',
    superpower: 'High-Production Value',
    linkedIn: 'https://linkedin.com/in/kylelacy',
    originalPhoto: '/architects/original/kyle-lacy.jpeg',
    description: 'High-production value meets hard ROI.',
  },
  {
    id: 'lara-hood-balazs',
    name: 'Lara Hood Balazs',
    company: 'Adobe',
    role: 'EVP Marketing',
    category: 'storytellers',
    superpower: 'Enterprise Storytelling',
    linkedIn: 'https://linkedin.com/in/larahoodbalazs',
    originalPhoto: '/architects/original/lara-hood-balazs.jpeg',
    description: 'Crafting narratives that move enterprise buyers.',
  },
  {
    id: 'julien-sauvage',
    name: 'Julien Sauvage',
    company: 'Cordial',
    role: 'CMO',
    category: 'storytellers',
    superpower: 'Brand Architecture',
    linkedIn: 'https://linkedin.com/in/juliensauvage',
    originalPhoto: '/architects/original/julien-sauvage.jpeg',
    description: 'Building brands that customers actually remember.',
  },

  // ♟️ STRATEGIC VISIONARIES
  {
    id: 'scott-holden',
    name: 'Scott Holden',
    company: 'Vanta',
    role: 'CMO',
    category: 'visionaries',
    superpower: 'Trust Marketing',
    linkedIn: 'https://linkedin.com/in/scottholden',
    originalPhoto: '/architects/original/scott-holden.png',
    description: 'Turning security compliance into a growth lever.',
  },
  {
    id: 'bryan-law',
    name: 'Bryan Law',
    company: 'SentinelOne',
    role: 'CMO',
    category: 'visionaries',
    superpower: 'Cybersecurity GTM',
    linkedIn: 'https://linkedin.com/in/bryanlaw',
    originalPhoto: '/architects/original/bryan-law.png',
    description: 'Leading GTM in the most competitive security market.',
  },
  {
    id: 'chris-cunningham',
    name: 'Chris Cunningham',
    company: 'ClickUp',
    role: 'CMO',
    category: 'visionaries',
    superpower: 'Category Creation',
    linkedIn: 'https://linkedin.com/in/chriscunningham',
    originalPhoto: '/architects/original/chris-cunningham.jpeg',
    description: 'Building a productivity empire through bold moves.',
  },
  {
    id: 'kacie-jenkins',
    name: 'Kacie Jenkins',
    company: 'Fastly',
    role: 'CMO',
    category: 'visionaries',
    superpower: 'Technical GTM',
    linkedIn: 'https://linkedin.com/in/kaciejenkins',
    originalPhoto: '/architects/original/kacie-jenkins.jpeg',
    description: 'Making complex infrastructure products feel simple.',
  },

  // ⭐ RISING STARS
  {
    id: 'lauren-nemeth',
    name: 'Lauren Nemeth',
    company: 'Lucid',
    role: 'CEO',
    category: 'rising',
    superpower: 'Visual Collaboration',
    linkedIn: 'https://linkedin.com/in/laurennemeth',
    originalPhoto: '/architects/original/lauren-nemeth.jpeg',
    description: 'Transforming how teams think and collaborate visually.',
  },
  {
    id: 'madhav-bhandari',
    name: 'Madhav Bhandari',
    company: 'Storylane',
    role: 'Head of Marketing',
    category: 'rising',
    superpower: 'Interactive Demos',
    linkedIn: 'https://linkedin.com/in/madhavbhandari',
    originalPhoto: '/architects/original/madhav-bhandari.jpeg',
    description: 'Pioneering the interactive product demo revolution.',
  },
  {
    id: 'nicole-baer',
    name: 'Nicole Baer',
    company: 'UserEvidence',
    role: 'CMO',
    category: 'rising',
    superpower: 'Social Proof',
    linkedIn: 'https://linkedin.com/in/nicolebaer',
    originalPhoto: '/architects/original/nicole-baer.jpeg',
    description: 'Revolutionizing how B2B companies capture proof.',
  },
  {
    id: 'roxana-irimia',
    name: 'Roxana Irimia',
    company: 'Planable',
    role: 'Head of Marketing',
    category: 'rising',
    superpower: 'Content Operations',
    linkedIn: 'https://linkedin.com/in/roxanairimia',
    originalPhoto: '/architects/original/roxana-irimia.jpeg',
    description: 'Streamlining content workflows for modern teams.',
  },
  {
    id: 'jordan-crawford',
    name: 'Jordan Crawford',
    company: 'Blueprint',
    role: 'Founder',
    category: 'rising',
    superpower: 'GTM Engineering',
    linkedIn: 'https://linkedin.com/in/jordancrawford',
    originalPhoto: '/architects/original/jordan-crawford.jpeg',
    description: 'Engineering precision into go-to-market motions.',
  },
  {
    id: 'kevin-white',
    name: 'Kevin White',
    company: 'Common Room',
    role: 'Head of Marketing',
    category: 'rising',
    superpower: 'Community Signals',
    linkedIn: 'https://linkedin.com/in/kevinwhite',
    originalPhoto: '/architects/original/kevin-white.jpeg',
    description: 'Turning community engagement into pipeline.',
  },
  {
    id: 'angela-ferrante',
    name: 'Angela Ferrante',
    company: 'Veracode',
    role: 'CMO',
    category: 'rising',
    superpower: 'Security Marketing',
    linkedIn: 'https://linkedin.com/in/angelaferrante',
    originalPhoto: '/architects/original/angela-ferrante.png',
    description: 'Making application security a boardroom priority.',
  },
];

export function getArchitectsByCategory(category: ArchitectCategory): Architect[] {
  return architects.filter(a => a.category === category);
}

export function getArchitectById(id: string): Architect | undefined {
  return architects.find(a => a.id === id);
}
