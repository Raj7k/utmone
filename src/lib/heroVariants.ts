export interface HeroVariant {
  id: number;
  headline: string;
  subheadline: string;
  cta: string;
  microcopy: string;
}

export const HERO_VARIANTS: HeroVariant[] = [
  {
    id: 0,
    headline: "A Cleaner, Safer Way to Share the Internet",
    subheadline: "utm.one gives every link, UTM, QR code, and partner touchpoint a meaning humans can trust and machines can understand — with transparency, accessibility, permanence, and clean-track governance built in.",
    cta: "Get Early Access",
    microcopy: "invite-only. clarity creates confidence."
  },
  {
    id: 1,
    headline: "Links That Make Sense at First Sight",
    subheadline: "utm.one builds short links, UTMs, QR codes, and clean-track rules that stay readable, accessible, transparent, and reliable—no matter how or where they're shared.",
    cta: "Get Early Access",
    microcopy: "invite-only. clarity creates confidence."
  },
  {
    id: 2,
    headline: "Clean Links. Clean Data. Clean Decisions.",
    subheadline: "utm.one brings structure to every link your team creates—so your tracking, analytics, partners, and reporting never fall apart again.",
    cta: "Get Early Access",
    microcopy: "no clutter. no guesswork. no broken attribution."
  },
  {
    id: 3,
    headline: "Links That Humans Trust and Machines Understand",
    subheadline: "utm.one adds structure, meaning, and metadata to every link—short links, UTMs, QR codes, partner links—making your content discoverable in LLMs and dependable everywhere else.",
    cta: "Get Early Access",
    microcopy: "built for the next era of search and sharing."
  },
  {
    id: 4,
    headline: "Make Every Link Last Forever",
    subheadline: "utm.one gives you transparent previews, clean UTMs, semantic slugs, QR codes, partner links, and a permanence guarantee—so your links stay clear, safe, and stable for years.",
    cta: "Get Early Access",
    microcopy: "trust begins with consistency."
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
