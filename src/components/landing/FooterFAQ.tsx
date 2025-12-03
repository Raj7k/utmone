import { ReactNode, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EarlyAccessInlineCTA } from "./EarlyAccessInlineCTA";
import { formatText } from "@/utils/textFormatter";
import { Sparkles, TrendingUp, Shield } from "lucide-react";
import { useRef } from "react";

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
        <p>utm.one is a tracking and link governance layer for modern growth teams. It turns every URL into a clean, trusted, machine-readable link using the Clean-Track framework.</p>
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
        <p>Clean-Track is our intelligence framework — built on mathematical models developed by MIT and Harvard scientists. It has four layers:</p>
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
        <p className="mt-3">With Clean-Track, your links don't just work — they make sense.</p>
      </>
    ),
  },
  {
    question: "how does the AI intelligence work?",
    answer: (
      <>
        <p>Clean-Track Intelligence uses mathematical models developed by MIT and Harvard scientists to:</p>
        <ul className="mt-3 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Predict performance</strong> — know which campaigns will work before you launch</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Detect anomalies</strong> — catch traffic drops and bot attacks automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Attribute revenue</strong> — see which touchpoints actually drive conversions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-foreground">Answer questions</strong> — ask anything about your data in plain English</span>
          </li>
        </ul>
        <p className="mt-3">No data science degree required. Just ask, and get answers.</p>
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
        <p className="mt-3">All plans include UTM builder, QR generator, and Clean-Track governance.</p>
        <a href="/pricing" className="inline-flex items-center mt-4 text-blazeOrange hover:underline text-sm lowercase">
          see full pricing →
        </a>
      </>
    ),
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

// Scroll-reveal FAQ item with progressive text visibility and blur
const ScrollRevealFAQItem = ({ faq, index, isLast }: { faq: FAQItem; index: number; isLast: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [4, 1, 0]);

  return (
    <div ref={ref} className="flex gap-6">
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div 
          className="w-3 h-3 rounded-full bg-blazeOrange"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring" }}
        />
        {!isLast && (
          <motion.div 
            className="w-0.5 flex-1 bg-gradient-to-b from-blazeOrange to-blazeOrange/20 mt-2"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>
      <motion.div 
        className="pb-8 flex-1"
        style={{ 
          opacity, 
          y,
          filter: `blur(${blur.get()}px)`
        }}
      >
        <h2 className="text-xl md:text-2xl font-display font-semibold mb-4 lowercase text-foreground">
          {formatText(faq.question)}
        </h2>
        <div className="text-muted-foreground space-y-3 leading-relaxed">
          {faq.answer}
        </div>
      </motion.div>
    </div>
  );
};

export const FooterFAQ = () => {
  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 md:px-8 overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-muted/20 pointer-events-none" />
      
      <div className="max-w-[980px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase">
            {formatText("ok, here's what we do. plain talk.")}
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
            Scroll down to learn more. Text becomes clearer as you read.
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollRevealFAQItem 
              key={index} 
              faq={faq} 
              index={index}
              isLast={index === faqs.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
