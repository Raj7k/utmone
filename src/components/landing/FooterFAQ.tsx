import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { EarlyAccessInlineCTA } from "./EarlyAccessInlineCTA";
import { RetroGradientMesh } from "./RetroGradientMesh";
import { formatText } from "@/utils/textFormatter";
import { Sparkles, TrendingUp, Shield } from "lucide-react";

interface FAQItem {
  question: string;
  answer: ReactNode | string;
  isFlippable?: boolean;
  visualExample?: ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "what is utm.one?",
    answer: (
      <>
        <p>utm.one is a tracking and link governance layer for modern growth teams. It turns every URL into a clean, trusted, machine-readable link using the clean-track framework.</p>
        <p className="mt-3">Instead of just shortening URLs, we give every link structure, meaning, and governance — so your dashboards stay clean and your data stays reliable.</p>
      </>
    ),
  },
  {
    question: "what are the main use cases?",
    answer: (
      <>
        <p>utm.one helps teams with:</p>
        <ul className="mt-3 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span>Paid campaigns — consistent UTMs across Google, Meta, LinkedIn</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span>Lifecycle email — track every nurture, onboarding, and re-engagement flow</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span>Webinars & events — QR codes and registration links that show real ROI</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span>Partner programs — clean attribution for affiliates and channel partners</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span>Sales outreach — track which content actually converts prospects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span>Content distribution — know which channels and formats drive engagement</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "what is clean-track?",
    answer: (
      <>
        <p>Clean-track is our framework for link governance. It has four layers:</p>
        <ul className="mt-3 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Syntax layer</strong> — standardized UTM structure across all links</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Naming rules layer</strong> — consistent campaign naming so data doesn't fragment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Governance layer</strong> — templates, approvals, and team rules</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Reporting layer</strong> — clean data that actually rolls up correctly</span>
          </li>
        </ul>
        <p className="mt-3">With clean-track, your links don't just work — they make sense.</p>
      </>
    ),
  },
  {
    question: "who is it for?",
    answer: (
      <>
        <p>utm.one is built for GTM teams who are tired of broken tracking:</p>
        <ul className="mt-3 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Marketers</strong> — launch campaigns without worrying about UTM chaos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Sales teams</strong> — track which content moves deals forward</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Marketing Ops</strong> — enforce clean data without slowing down teams</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Developers</strong> — self-host, API access, full control</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Partner managers</strong> — clear attribution for every affiliate and partner</span>
          </li>
        </ul>
        <a href="/solutions/marketers" className="inline-flex items-center mt-4 text-blazeOrange hover:underline text-sm lowercase">
          learn more about your role →
        </a>
      </>
    ),
  },
  {
    question: "how does pricing work?",
    answer: (
      <>
        <p>We have four tiers:</p>
        <ul className="mt-3 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Free</strong> — 100 links, basic analytics, community support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Pro ($20/mo)</strong> — 1,000 links, 1 custom domain, advanced analytics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Business ($99/mo)</strong> — 10,000 links, 5 custom domains, priority support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Enterprise ($300/mo)</strong> — unlimited links, unlimited domains, dedicated SLA</span>
          </li>
        </ul>
        <p className="mt-3">All plans include UTM builder, QR generator, and clean-track governance.</p>
        <a href="/pricing" className="inline-flex items-center mt-4 text-blazeOrange hover:underline text-sm lowercase">
          see full pricing →
        </a>
      </>
    ),
  },
  {
    question: "pricing that respects you",
    answer: (
      <>
        <p>We believe in transparent, fair pricing:</p>
        <ul className="mt-3 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Generous Free Plan</strong> — start without a credit card</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Flat Team Pricing</strong> — unlimited users on paid plans</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">No Per-Seat Surprises</strong> — your cost stays predictable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Simple Upgrades</strong> — move up when you're ready</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Fair Limits</strong> — designed for real usage patterns</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Transparent Communication</strong> — no hidden fees, no gotchas</span>
          </li>
        </ul>
        <p className="mt-4 text-lg font-semibold text-blazeOrange">The internet is tired of predatory pricing. We chose a different path.</p>
      </>
    ),
  },
  {
    question: "how does smart autocomplete work?",
    answer: "Our autocomplete learns from your team's historical performance to show predicted CTR for each UTM parameter.",
    isFlippable: true,
    visualExample: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <div className="font-medium text-foreground">google</div>
            <div className="text-xs text-primary">🔥 3.2% avg CTR — High impact</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="w-5 h-5" />
          <div className="flex-1">
            <div className="font-medium text-foreground">facebook</div>
            <div className="text-xs text-muted-foreground">1.8% avg CTR</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="w-5 h-5" />
          <div className="flex-1">
            <div className="font-medium text-foreground">linkedin</div>
            <div className="text-xs text-muted-foreground">2.1% avg CTR</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">High-impact sources get gold glow to guide your strategy.</p>
      </div>
    )
  },
  {
    question: "what happens when my link destination goes down?",
    answer: "Link Immunity system probes your top 100 links hourly and automatically routes traffic to fallback URLs if the destination returns 404 or 500 errors.",
    isFlippable: true,
    visualExample: (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive font-bold">404</div>
          <div className="flex-1">
            <div className="font-medium text-foreground">Primary URL Down</div>
            <div className="text-sm text-muted-foreground">utm.one detected the issue</div>
          </div>
        </div>
        <div className="border-l-2 border-primary pl-4 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Auto-failover activated</span>
          </div>
          <div className="text-sm text-foreground">Traffic redirected to fallback URL</div>
          <div className="text-xs text-muted-foreground">Your campaign keeps running, zero downtime</div>
        </div>
        <p className="text-xs text-primary mt-3">All clicks preserved. Campaign saved.</p>
      </div>
    )
  },
  {
    question: "can i see where my traffic comes from?",
    answer: "Real-time analytics heatmap shows clicks by country, device, and hour of day with interactive charts.",
    isFlippable: true,
    visualExample: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-primary/30 h-12 rounded flex items-center justify-center">
            <div className="text-xs font-medium">US<br/>342</div>
          </div>
          <div className="bg-primary/20 h-12 rounded flex items-center justify-center">
            <div className="text-xs font-medium">UK<br/>128</div>
          </div>
          <div className="bg-primary/10 h-12 rounded flex items-center justify-center">
            <div className="text-xs font-medium">CA<br/>54</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">Peak Traffic: 2-4 PM EST</div>
            <div className="text-xs text-muted-foreground">Mobile: 68% • Desktop: 32%</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Live heatmap updates every 5 minutes.</p>
      </div>
    )
  },
  {
    question: "how do i get started?",
    answer: (
      <>
        <p>Sign up in under 30 seconds:</p>
        <ol className="mt-3 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="text-blazeOrange font-semibold">1.</span>
            <span>Create your free account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blazeOrange font-semibold">2.</span>
            <span>Create your first link with clean UTMs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blazeOrange font-semibold">3.</span>
            <span>Generate a branded QR code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blazeOrange font-semibold">4.</span>
            <span>Watch your clean data roll in</span>
          </li>
        </ol>
        <p className="mt-3">No credit card required. No setup hassle. Just clean links that work.</p>
        <EarlyAccessInlineCTA />
      </>
    ),
  },
];

const FlippableFAQCard = ({ faq, index }: { faq: FAQItem; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!faq.isFlippable) {
    return (
      <div className="flex gap-6">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-blazeOrange" />
          {index < 9 && <div className="w-0.5 flex-1 bg-blazeOrange/40 mt-2" />}
        </div>
        <div className="pb-4 flex-1">
          <h3 className="text-xl font-display font-semibold mb-3 lowercase text-foreground">
            {formatText(faq.question)}
          </h3>
          <div className="text-muted-foreground space-y-3">
            {faq.answer}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-blazeOrange" />
        {index < 9 && <div className="w-0.5 flex-1 bg-blazeOrange/40 mt-2" />}
      </div>
      
      <motion.div
        className="pb-4 flex-1 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <div 
          className="relative transition-all duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)"
          }}
        >
          {/* Front */}
          <div style={{ backfaceVisibility: "hidden" }}>
            <h3 className="text-xl font-display font-semibold mb-3 lowercase text-foreground">
              {formatText(faq.question)}
            </h3>
            <p className="text-muted-foreground">{faq.answer as string}</p>
            <p className="text-sm text-primary mt-3 lowercase">tap to see example →</p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-secondary-grouped-background border border-separator rounded-xl p-6"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)"
            }}
          >
            {faq.visualExample}
            <p className="text-sm text-primary mt-4 lowercase">tap to go back ←</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const FooterFAQ = () => {
  return (
    <section className="relative py-24 md:py-32 px-8 overflow-hidden bg-white">
      <RetroGradientMesh />
      <div className="max-w-[980px] mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 lowercase text-foreground">
          {formatText("ok, here's what we do. plain talk.")}
        </h2>
        
        <div className="space-y-12">
          {faqs.map((faq, index) => (
            <FlippableFAQCard key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
