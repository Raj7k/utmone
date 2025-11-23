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
