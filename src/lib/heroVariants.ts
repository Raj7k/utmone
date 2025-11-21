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
    headline: "Clean Links Change Everything.",
    subheadline: "utm.one makes every short link, utm, and qr code simple, consistent, and reliable — automatically.",
    cta: "get early access",
    microcopy: "your links. your data. finally in order."
  },
  {
    id: 1,
    headline: "Clean Links. Clear Decisions.",
    subheadline: "utm.one brings discipline, consistency, and elegance to every link your team creates.",
    cta: "get early access",
    microcopy: "your links. your data. finally in order."
  },
  {
    id: 2,
    headline: "Every Campaign Starts With A Single Link.",
    subheadline: "utm.one makes that link flawless — every time.",
    cta: "start now",
    microcopy: "your links. your data. finally in order."
  },
  {
    id: 3,
    headline: "What If Every Link... Just Worked?",
    subheadline: "with utm.one, every short link, utm, and qr is clean, consistent, and beautifully simple.",
    cta: "experience utm.one",
    microcopy: "your links. your data. finally in order."
  }
];
