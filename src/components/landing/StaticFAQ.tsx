import { UseCaseType } from "./ControlDeckHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";

interface StaticFAQProps {
  selectedUseCase: UseCaseType;
}

const FAQ_CONTENT: Record<UseCaseType, { question: string; answer: string }[]> = {
  attribution: [
    {
      question: "how is this different from google analytics attribution?",
      answer: "google analytics uses last-click by default and limits attribution windows to 90 days. clean-track uses bayesian probability across 30+ day windows, giving credit proportional to actual influence — not just who happened to be last.",
    },
    {
      question: "what attribution models do you support?",
      answer: "we support first-touch, last-touch, linear, time-decay, position-based, and our proprietary clean-track model. but we recommend clean-track because it uses statistical analysis to calculate true influence rather than arbitrary rules.",
    },
    {
      question: "how do you measure 'lift' for a channel?",
      answer: "lift analysis compares conversion rates of users exposed to a channel versus a holdout group. this isolates the incremental impact of each channel, showing you what would have happened without it.",
    },
    {
      question: "can i import data from existing tools?",
      answer: "yes. we support imports from google analytics, mixpanel, amplitude, segment, and any tool that exports CSV. historical data is processed through our attribution engine within 24 hours.",
    },
    {
      question: "how accurate is the attribution?",
      answer: "clean-track attribution includes confidence intervals. a 92% confidence means we're 92% sure the channel contributed at least that much. we never claim 100% accuracy — that would be dishonest.",
    },
  ],
  journey: [
    {
      question: "how do you track users across devices?",
      answer: "we use probabilistic identity matching based on behavioral signals — IP patterns, browser fingerprints, login events, and temporal proximity. when a mobile visitor logs in on desktop, we stitch those sessions together.",
    },
    {
      question: "what's the visitor memory window?",
      answer: "18 months. we remember anonymous visitors for 18 months, so when they finally convert, we can trace their complete journey back to the first touchpoint.",
    },
    {
      question: "does this work without cookies?",
      answer: "yes. our identity graph uses first-party data and behavioral fingerprinting that doesn't rely on third-party cookies. we're built for a cookieless future.",
    },
    {
      question: "can i see individual customer journeys?",
      answer: "yes. every converted customer has a complete journey timeline showing every touchpoint, device, and time between interactions. you can filter by conversion type, value, or any UTM parameter.",
    },
    {
      question: "how do you handle B2B with multiple stakeholders?",
      answer: "we track account-level journeys by linking multiple visitors to the same company using domain matching and custom identifiers. see every touchpoint across your entire buying committee.",
    },
  ],
  links: [
    {
      question: "what makes utm.one links 'smart'?",
      answer: "every link has 5 layers: short URL, UTM parameters, branded QR code, validation rules, and rich metadata. they're not just redirects — they're data pipelines that ensure clean analytics.",
    },
    {
      question: "can i enforce UTM naming conventions?",
      answer: "yes. create templates with required fields, allowed values, and naming patterns. team members select from pre-approved options instead of typing freeform — eliminating typos and inconsistencies.",
    },
    {
      question: "what about existing links?",
      answer: "bulk import your existing short links from bitly, rebrandly, or any other tool. we'll analyze them for UTM issues and suggest corrections. your redirect history is preserved.",
    },
    {
      question: "do you support custom domains?",
      answer: "yes. use your own domain (links.company.com) for all short links. branded links increase click-through rates by 34% compared to generic shorteners.",
    },
    {
      question: "what's LLM-ready metadata?",
      answer: "every link stores structured data (title, description, tags, context) that AI tools can query. ask questions like 'which campaigns drove enterprise deals in Q4' and get accurate answers.",
    },
  ],
  intelligence: [
    {
      question: "how does anomaly detection work?",
      answer: "we use Z-score statistical analysis to detect traffic patterns that deviate significantly from historical norms. a 3-sigma spike or drop triggers an alert within minutes — not days.",
    },
    {
      question: "what kind of predictions can you make?",
      answer: "we forecast traffic, conversions, and revenue using bayesian time-series models. predictions include confidence intervals so you know how reliable the forecast is.",
    },
    {
      question: "how are alerts delivered?",
      answer: "email and slack, with customizable sensitivity and quiet hours. you choose which anomalies matter (spikes only, drops only, new referrer sources) and who gets notified.",
    },
    {
      question: "is this actual AI or just rules?",
      answer: "actual statistical AI. we use probabilistic models that learn from your data — not arbitrary threshold rules. the system gets smarter as it sees more of your traffic patterns.",
    },
    {
      question: "can i trust the recommendations?",
      answer: "every recommendation includes the data behind it and a confidence score. we show you why we think something is important so you can decide if it makes sense for your context.",
    },
  ],
  governance: [
    {
      question: "what roles and permissions exist?",
      answer: "owner (full access), admin (manage team and settings), editor (create and edit links), viewer (read-only analytics). you can also create custom roles with granular permissions.",
    },
    {
      question: "how do approval workflows work?",
      answer: "mark certain link types (high-value campaigns, external partnerships) as requiring approval. designated approvers get notified and can approve/reject with one click.",
    },
    {
      question: "what's in the audit log?",
      answer: "every action: link created, UTM changed, template modified, user invited, permission changed. who did it, when, from what IP. exportable and retained indefinitely.",
    },
    {
      question: "do you support SSO/SAML?",
      answer: "yes. integrate with okta, azure AD, google workspace, or any SAML 2.0 provider. enforce login through your identity provider with automatic user provisioning.",
    },
    {
      question: "is there WebAuthn support?",
      answer: "yes. hardware security keys (YubiKey) and biometric authentication are supported for admin accounts. the most secure authentication available.",
    },
  ],
  linkpages: [
    {
      question: "how is this different from linktree?",
      answer: "full UTM tracking on every click, verified badges, analytics dashboard, and integration with your attribution system. linktree is a black hole — we show you exactly who clicked what and whether they converted.",
    },
    {
      question: "can i customize the design?",
      answer: "yes. 11 premium themes, custom colors, avatar upload, and verified badge. your link page matches your brand, not ours.",
    },
    {
      question: "do clicks count toward my analytics?",
      answer: "absolutely. every click is tracked with full attribution data. see which link page visitors later converted, and attribute revenue back to your bio link.",
    },
    {
      question: "can i schedule when my page goes live?",
      answer: "yes. scheduled publishing lets you prepare pages in advance and auto-publish at a specific time. perfect for launches and campaigns.",
    },
    {
      question: "how do verified badges work?",
      answer: "submit verification request with phone, email, and KYC documentation. our team reviews within 48 hours. approved accounts display the blue checkmark.",
    },
  ],
  eventhalo: [
    {
      question: "how does event halo detect walk-bys?",
      answer: "geo-temporal correlation. we analyze traffic patterns from the event city during event hours compared to a control group (non-event cities). the delta represents halo visitors who saw your booth but didn't scan.",
    },
    {
      question: "is this just guessing?",
      answer: "no. we use scientific methodology with control groups and confidence intervals. you see the exact lift percentage and statistical confidence level. we only report what we can prove.",
    },
    {
      question: "what data do i need?",
      answer: "just your utm.one tracking pixel on your website. no CRM integration required. we use your existing click and conversion data to detect the halo effect.",
    },
    {
      question: "can i use this for trade shows?",
      answer: "yes. trade shows, conferences, roadshows, pop-up events — any physical presence where you want to measure the full impact beyond badge scans.",
    },
    {
      question: "how do i calculate ROI?",
      answer: "our ROI calculator lets you input your deal value and conversion rate. we multiply by detected halo visitors to show estimated revenue impact. customize the assumptions to match your business.",
    },
  ],
};

const USE_CASE_LABELS: Record<UseCaseType, string> = {
  attribution: 'attribution',
  journey: 'journey analytics',
  links: 'link management',
  intelligence: 'AI intelligence',
  governance: 'enterprise control',
  linkpages: 'link pages',
  eventhalo: 'event halo',
};

export const StaticFAQ = ({ selectedUseCase }: StaticFAQProps) => {
  const faqs = FAQ_CONTENT[selectedUseCase] || FAQ_CONTENT.attribution;
  const [isVisible, setIsVisible] = useState(false);
  const [currentUseCase, setCurrentUseCase] = useState(selectedUseCase);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle use case changes
  useEffect(() => {
    if (selectedUseCase !== currentUseCase) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentUseCase(selectedUseCase);
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedUseCase, currentUseCase]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displayFaqs = FAQ_CONTENT[currentUseCase] || FAQ_CONTENT.attribution;
  const displayLabel = USE_CASE_LABELS[currentUseCase] || 'attribution';

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white/[0.01]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className={`space-y-8 transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-white/40">
              frequently asked
            </p>
            <h2 
              className="text-2xl md:text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              questions about {displayLabel}
            </h2>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {displayFaqs.map((faq, i) => (
              <div
                key={faq.question}
                className={`transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{ transitionDelay: `${100 + i * 50}ms` }}
              >
                <AccordionItem 
                  value={`item-${i}`}
                  className="rounded-xl bg-white/[0.02] border border-white/10 px-4 overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-white/80 hover:text-white py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-white/50 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

// Export with the same name for backward compatibility
export const DynamicFAQ = StaticFAQ;
