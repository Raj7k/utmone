import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatText } from "@/utils/textFormatter";
import { X } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FAQItem[] = [
  {
    question: "what is utm.one?",
    answer: "utm.one is a tracking and link governance layer for modern growth teams. It turns every URL into a clean, trusted, machine-readable link using the clean-track framework.",
    category: "basics"
  },
  {
    question: "who is it for?",
    answer: "GTM teams tired of broken tracking: Marketers, Sales, Marketing Ops, Developers, and Partner Managers who need clean links that scale.",
    category: "basics"
  },
  {
    question: "what is clean-track?",
    answer: "Clean-track is our framework with four layers: Syntax (standardized UTMs), Naming rules (consistent campaigns), Governance (templates & approvals), and Reporting (clean rollups).",
    category: "product"
  },
  {
    question: "how does pricing work?",
    answer: "Four tiers: Free (100 links), Pro $20/mo (1,000 links, 1 domain), Business $99/mo (10,000 links, 5 domains), Enterprise $300/mo (unlimited). All include UTM builder and QR generator.",
    category: "pricing"
  },
  {
    question: "what makes utm.one different?",
    answer: "We're not just a link shortener. We provide governance, validation, and intelligence so every link follows rules. Think of it as infrastructure, not just a tool.",
    category: "product"
  },
  {
    question: "can I use custom domains?",
    answer: "Yes! Pro gets 1 custom domain, Business gets 5, Enterprise unlimited. All with automatic SSL and DNS verification built in.",
    category: "features"
  },
  {
    question: "how does A/B testing work?",
    answer: "Create variants for any link, split traffic automatically, and our Bayesian engine detects winners with statistical confidence — no manual analysis needed.",
    category: "features"
  },
  {
    question: "is there an API?",
    answer: "Yes, REST + GraphQL APIs with 600 req/min free tier. Create, update, and track links programmatically. Webhooks for real-time events.",
    category: "technical"
  },
  {
    question: "what about data security?",
    answer: "AES-256 field-level encryption, SOC 2 Type II compliance, GDPR ready, and role-based access. Enterprise gets SSO/SAML support.",
    category: "security"
  },
  {
    question: "how do I get started?",
    answer: "Sign up free in 30 seconds. Create your first link with clean UTMs. Generate a branded QR code. Watch your clean data roll in.",
    category: "basics"
  }
];

export const BlurRevealFAQ = () => {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set([0]));
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setRevealedCards(prev => new Set([...prev, index]));
      setExpandedCard(index);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase">
            {formatText("ok, here's what we do. plain talk.")}
          </h1>
          <p className="mt-3 text-white/50">Click any card to reveal the answer</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faqs.map((faq, index) => {
            const isRevealed = revealedCards.has(index);
            const isExpanded = expandedCard === index;
            
            return (
              <motion.div
                key={index}
                layout
                className={`
                  relative cursor-pointer rounded-xl transition-all overflow-hidden
                  ${isExpanded ? "shadow-lg sm:col-span-2 lg:col-span-1 bg-primary text-white" : "hover:scale-[1.02] bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08]"}
                `}
                onClick={() => toggleCard(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="p-5">
                  {/* Question */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 
                      className={`font-semibold lowercase text-sm ${isExpanded ? 'text-white' : 'text-white/90'}`}
                    >
                      {faq.question}
                    </h3>
                    {isExpanded && (
                      <X className="w-4 h-4 shrink-0 text-white" />
                    )}
                  </div>
                  
                  {/* Answer Preview / Full */}
                  <AnimatePresence mode="wait">
                    {isExpanded ? (
                      <motion.p
                        key="full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm leading-relaxed text-white/90"
                      >
                        {faq.answer}
                      </motion.p>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                      >
                        <p 
                          className={`text-xs line-clamp-2 text-white/50 ${!isRevealed ? "blur-sm select-none" : ""}`}
                        >
                          {faq.answer}
                        </p>
                        {!isRevealed && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">tap to reveal</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Category Tag */}
                  {faq.category && !isExpanded && (
                    <div className="mt-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
