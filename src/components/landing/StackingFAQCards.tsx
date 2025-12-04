import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { StackingFAQCard } from "./StackingFAQCard";

const faqCards = [
  {
    title: "What is utm.one?",
    bgColor: "bg-zinc-900/40",
    questions: [
      {
        q: "What is utm.one?",
        a: "utm.one is a tracking and link governance layer for modern growth teams. Every URL gets: a clean short link, structured UTM tags, safety scanning, analytics, and governance rules — all in one place."
      },
      {
        q: "What are the main use cases?",
        a: "Paid campaigns, lifecycle emails, webinars/events, partner/affiliate programs, sales outreach, and content distribution. Any time you share a link and need clean data back."
      }
    ]
  },
  {
    title: "The Clean-Track Framework",
    bgColor: "bg-muted/30",
    questions: [
      {
        q: "What is Clean-Track?",
        a: "Clean-Track is utm.one's framework for link governance: syntax rules (all UTMs lowercase, consistent naming), templates (pre-filled UTM structures), validation (prevents messy data at creation), and reporting (dashboards that never break)."
      },
      {
        q: "Who is utm.one for?",
        a: "Marketing teams tired of broken GA4 reports. Ops teams enforcing UTM consistency. Sales teams sharing trackable links. Partner managers measuring affiliate performance. Anyone who needs links that tell the truth."
      }
    ]
  },
  {
    title: "Pricing & Features",
    bgColor: "bg-white/5",
    questions: [
      {
        q: "How much does utm.one cost?",
        a: "Free: 100 links, 10K clicks/month. Pro ($20): 1,000 links, 100K clicks, 1 custom domain. Business ($99): 10K links, unlimited clicks, 5 domains. Enterprise ($300): unlimited everything."
      },
      {
        q: "What makes utm.one different?",
        a: "Most link tools focus on shortening. utm.one focuses on trust, governance, and clean data. You get: link previews, safety badges, semantic slugs, WCAG AAA accessibility, permanence guarantees, and AI-powered optimization."
      },
      {
        q: "What are the smart features?",
        a: "Smart UTM Autocomplete (predicts best-performing tags), Traffic Forecasting (7-day predictions), Efficient Frontier (finds optimal campaigns), Smart Link Rotator (A/B testing), and Link Immunity (auto-detects broken links)."
      }
    ]
  },
  {
    title: "How It Works",
    bgColor: "bg-muted/30",
    questions: [
      {
        q: "What is Link Immunity?",
        a: "Hourly health probes of your top links. If a destination goes 404, utm.one auto-flags it and routes traffic to a fallback URL. No more wasted ad spend on broken links."
      },
      {
        q: "What analytics do I get?",
        a: "Clicks, unique visitors, devices/browsers/OS, country/city geo, referrer domains, UTM breakdowns, conversion funnels, and rare event probability estimates. All exportable to CSV/XLSX."
      },
      {
        q: "What is Smart UTM Autocomplete?",
        a: "As you type utm_source or utm_medium, utm.one shows historical CTR predictions. High-impact tags get a 🔥 badge and gold glow. New combinations show 'new' badges. Helps you pick winners before launching."
      }
    ]
  },
  {
    title: "Get Started",
    bgColor: "bg-blazeOrange/10",
    isCTA: true
  }
];

export const StackingFAQCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative min-h-[400vh] py-20">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-8">
          {faqCards.map((card, index) => (
            <StackingFAQCard 
              key={index}
              card={card}
              index={index}
              totalCards={faqCards.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
