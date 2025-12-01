export interface GlossaryTerm {
  slug: string;
  title: string;
  definition: string;
  relatedTerms: string[];
  category: 'tracking' | 'attribution' | 'technical' | 'marketing';
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'utm',
    title: 'UTM Parameters',
    definition: 'Urchin Tracking Module (UTM) parameters are tags added to URLs to track campaign performance. The five core parameters are: utm_source (where traffic comes from), utm_medium (how it arrives), utm_campaign (campaign name), utm_term (keywords), and utm_content (variant identifier).',
    relatedTerms: ['campaign', 'source', 'medium', 'attribution'],
    category: 'tracking'
  },
  {
    slug: 'attribution',
    title: 'Attribution',
    definition: 'The process of identifying which marketing touchpoints led to a conversion. Attribution models determine how credit is assigned across the customer journey.',
    relatedTerms: ['first-touch', 'last-touch', 'multi-touch', 'conversion-rate'],
    category: 'attribution'
  },
  {
    slug: 'link-rot',
    title: 'Link Rot',
    definition: 'The gradual process where hyperlinks become unavailable due to website changes, domain expiration, or content removal. Link rot degrades campaign performance and breaks user experiences.',
    relatedTerms: ['redirect', 'fallback-url', 'link-immunity'],
    category: 'technical'
  },
  {
    slug: 'first-touch',
    title: 'First-Touch Attribution',
    definition: 'An attribution model that assigns 100% of conversion credit to the first marketing touchpoint a customer interacts with.',
    relatedTerms: ['attribution', 'last-touch', 'multi-touch'],
    category: 'attribution'
  },
  {
    slug: 'last-touch',
    title: 'Last-Touch Attribution',
    definition: 'An attribution model that assigns 100% of conversion credit to the last marketing touchpoint before conversion.',
    relatedTerms: ['attribution', 'first-touch', 'multi-touch'],
    category: 'attribution'
  },
  {
    slug: 'multi-touch',
    title: 'Multi-Touch Attribution',
    definition: 'An attribution model that distributes conversion credit across multiple touchpoints in the customer journey, reflecting the reality that most conversions involve several interactions.',
    relatedTerms: ['attribution', 'first-touch', 'last-touch', 'bayesian-attribution'],
    category: 'attribution'
  },
  {
    slug: 'campaign',
    title: 'Campaign',
    definition: 'A coordinated marketing effort with specific goals, audience, and timeline. In utm.one, campaigns group related links using utm_campaign parameter for unified tracking.',
    relatedTerms: ['utm', 'source', 'medium', 'taxonomy'],
    category: 'marketing'
  },
  {
    slug: 'source',
    title: 'Source (utm_source)',
    definition: 'The specific origin of traffic (e.g., "google", "linkedin", "newsletter"). The utm_source parameter identifies where visitors come from.',
    relatedTerms: ['utm', 'medium', 'campaign'],
    category: 'tracking'
  },
  {
    slug: 'medium',
    title: 'Medium (utm_medium)',
    definition: 'The marketing channel or method (e.g., "cpc", "email", "social"). The utm_medium parameter categorizes how traffic arrives.',
    relatedTerms: ['utm', 'source', 'campaign'],
    category: 'tracking'
  },
  {
    slug: 'content',
    title: 'Content (utm_content)',
    definition: 'A variant identifier for A/B testing or differentiating similar links (e.g., "banner-blue", "cta-top"). The utm_content parameter tracks which creative or placement performed better.',
    relatedTerms: ['utm', 'term', 'ab-testing'],
    category: 'tracking'
  },
  {
    slug: 'term',
    title: 'Term (utm_term)',
    definition: 'Keywords or search terms for paid campaigns (e.g., "enterprise software", "link management"). The utm_term parameter identifies which keywords drove traffic.',
    relatedTerms: ['utm', 'content', 'campaign'],
    category: 'tracking'
  },
  {
    slug: 'taxonomy',
    title: 'Taxonomy',
    definition: 'A standardized naming system for UTM parameters that ensures consistency across teams and campaigns. utm.one enforces taxonomy through templates and validation rules.',
    relatedTerms: ['utm', 'campaign', 'governance'],
    category: 'marketing'
  },
  {
    slug: 'redirect',
    title: 'Redirect',
    definition: 'The server-side process of routing a short link to its destination URL. utm.one uses 301 (permanent) or 302 (temporary) redirects with sub-100ms latency.',
    relatedTerms: ['link-rot', 'fallback-url', 'custom-domain'],
    category: 'technical'
  },
  {
    slug: 'qr-code',
    title: 'QR Code',
    definition: 'Quick Response codes: 2D barcodes that encode URLs for smartphone scanning. utm.one generates branded QR codes with custom colors, logos, and frame text.',
    relatedTerms: ['short-link', 'redirect', 'scan-tracking'],
    category: 'technical'
  },
  {
    slug: 'custom-domain',
    title: 'Custom Domain',
    definition: 'A branded domain for short links (e.g., go.company.com) instead of generic shorteners. Custom domains increase trust and click-through rates by 34%.',
    relatedTerms: ['redirect', 'dns', 'ssl'],
    category: 'technical'
  },
  {
    slug: 'conversion-rate',
    title: 'Conversion Rate',
    definition: 'The percentage of clicks that result in a desired action (purchase, signup, download). Calculated as (Conversions / Clicks) × 100.',
    relatedTerms: ['attribution', 'funnel', 'mql'],
    category: 'marketing'
  },
  {
    slug: 'mql',
    title: 'MQL (Marketing Qualified Lead)',
    definition: 'A lead that has shown interest through marketing activities and meets criteria for sales follow-up. utm.one tracks which campaigns generate the most MQLs.',
    relatedTerms: ['sql', 'conversion-rate', 'pipeline'],
    category: 'marketing'
  },
  {
    slug: 'sql',
    title: 'SQL (Sales Qualified Lead)',
    definition: 'A lead that sales has vetted and deemed ready for direct outreach. SQLs are further along the funnel than MQLs.',
    relatedTerms: ['mql', 'pipeline', 'conversion-rate'],
    category: 'marketing'
  },
  {
    slug: 'pipeline',
    title: 'Pipeline',
    definition: 'The total value of potential deals in various stages of the sales process. utm.one attribution shows which campaigns contribute to pipeline generation.',
    relatedTerms: ['mql', 'sql', 'conversion-rate'],
    category: 'marketing'
  },
  {
    slug: 'cohort',
    title: 'Cohort',
    definition: 'A group of users who share a common characteristic or experience within a defined time period. Cohort analysis reveals how different user groups behave over time.',
    relatedTerms: ['conversion-rate', 'attribution', 'funnel'],
    category: 'marketing'
  }
];
