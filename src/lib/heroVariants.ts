export interface HeroVariant {
  id: number;
  headlineLine1: string;
  headlineLine2: string;
  subheadline: string;
  cta: string;
  microcopy: string;
}

export const HERO_VARIANTS: HeroVariant[] = [
  {
    id: 0,
    headlineLine1: "a cleaner, safer way",
    headlineLine2: "to share the internet.",
    subheadline: "utm.one gives every link, UTM, QR code, and partner touchpoint a meaning humans can trust and machines can understand — with transparency, accessibility, permanence, and clean-track governance built in.",
    cta: "get early access",
    microcopy: "invite-only. clarity creates confidence."
  },
  {
    id: 1,
    headlineLine1: "links that make sense",
    headlineLine2: "at first sight.",
    subheadline: "utm.one builds short links, UTMs, QR codes, and clean-track rules that stay readable, accessible, transparent, and reliable—no matter how or where they're shared.",
    cta: "get early access",
    microcopy: "invite-only. clarity creates confidence."
  },
  {
    id: 2,
    headlineLine1: "clean links. clean data.",
    headlineLine2: "clean decisions.",
    subheadline: "utm.one brings structure to every link your team creates—so your tracking, analytics, partners, and reporting never fall apart again.",
    cta: "get early access",
    microcopy: "no clutter. no guesswork. no broken attribution."
  },
  {
    id: 3,
    headlineLine1: "links that humans trust",
    headlineLine2: "and machines understand.",
    subheadline: "utm.one adds structure, meaning, and metadata to every link—short links, UTMs, QR codes, partner links—making your content discoverable in LLMs and dependable everywhere else.",
    cta: "get early access",
    microcopy: "built for the next era of search and sharing."
  },
  {
    id: 4,
    headlineLine1: "make every link",
    headlineLine2: "last forever.",
    subheadline: "utm.one gives you transparent previews, clean UTMs, semantic slugs, QR codes, partner links, and a permanence guarantee—so your links stay clear, safe, and stable for years.",
    cta: "get early access",
    microcopy: "trust begins with consistency."
  },
  {
    id: 5,
    headlineLine1: "give every link",
    headlineLine2: "a purpose.",
    subheadline: "your links shouldn't be messy, duplicated, or confusing. utm.one turns every URL into a clean, trusted, machine-readable signal — so your data, dashboards, and decisions are always right.",
    cta: "get early access",
    microcopy: "clarity creates confidence."
  },
  {
    id: 6,
    headlineLine1: "clean links. clean data.",
    headlineLine2: "clear decisions.",
    subheadline: "stop letting broken UTMs and inconsistent naming ruin your reporting. utm.one applies Clean-Track governance from the moment a link is created — so everything stays structured, accurate, and audit-ready.",
    cta: "get early access",
    microcopy: "no more messy dashboards."
  },
  {
    id: 7,
    headlineLine1: "links you can trust.",
    headlineLine2: "data you can defend.",
    subheadline: "no more mystery traffic. no more 'who created this link?'. utm.one gives you traceability, ownership, and machine-readable metadata built into every short link you create.",
    cta: "get early access",
    microcopy: "transparency built in."
  },
  {
    id: 8,
    headlineLine1: "finally, a short link",
    headlineLine2: "your analytics can rely on.",
    subheadline: "every link you create follows the same rules, the same syntax, the same naming. utm.one eliminates duplicates, chaos, and guesswork — so your campaigns scale without breaking your data.",
    cta: "get early access",
    microcopy: "campaigns that scale."
  }
];

// Early Access specific hero variants for A/B testing
export interface EarlyAccessHeroVariant {
  id: number;
  headline: string;
  subheadline: string;
  cta: string;
  microcopy: string;
}

export const EARLY_ACCESS_HERO_VARIANTS: EarlyAccessHeroVariant[] = [
  {
    id: 0, // Default
    headline: "get early access",
    subheadline: "utm.one is opening access in small batches to teams who care about cleaner links, cleaner data, and a more trustworthy internet.",
    cta: "join the early access list",
    microcopy: "no spam. no pressure. no obligations."
  },
  {
    id: 1, // Trust-forward
    headline: "a safer way to share links",
    subheadline: "join early access and help us build a link system people can trust again.",
    cta: "join the early access list",
    microcopy: "no spam. no pressure. no obligations."
  },
  {
    id: 2, // Data-forward
    headline: "cleaner links start here",
    subheadline: "join early access and see how simple clean data can be.",
    cta: "join the early access list",
    microcopy: "no spam. no pressure. no obligations."
  },
  {
    id: 3, // Future-forward
    headline: "links for the next era of search",
    subheadline: "join early access and help shape the metadata-first future.",
    cta: "join the early access list",
    microcopy: "no spam. no pressure. no obligations."
  }
];

// Get or create A/B test variant for early access page
export const getOrCreateEarlyAccessVariant = (): EarlyAccessHeroVariant => {
  const STORAGE_KEY = 'early_access_hero_variant';
  
  // Check if variant already exists in localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const variantId = parseInt(stored, 10);
    const variant = EARLY_ACCESS_HERO_VARIANTS.find(v => v.id === variantId);
    if (variant) return variant;
  }
  
  // Generate random variant and store it
  const randomId = Math.floor(Math.random() * EARLY_ACCESS_HERO_VARIANTS.length);
  localStorage.setItem(STORAGE_KEY, randomId.toString());
  
  return EARLY_ACCESS_HERO_VARIANTS[randomId];
};
