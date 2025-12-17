import { ReactNode, useState, useRef, useEffect } from "react";
import { EarlyAccessInlineCTA } from "./EarlyAccessInlineCTA";
import { formatText } from "@/utils/textFormatter";
import { GoogleIcon, MetaIcon, LinkedInIcon } from "@/components/icons/SocialIcons";

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
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span className="inline-flex items-center gap-1 flex-wrap">
              Paid campaigns — consistent UTMs across 
              <GoogleIcon className="w-4 h-4 inline" style={{ color: "#4285F4" }} />
              <MetaIcon className="w-4 h-4 inline" style={{ color: "#0668E1" }} />
              <LinkedInIcon className="w-4 h-4 inline" style={{ color: "#0A66C2" }} />
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span>Lifecycle email — track every nurture, onboarding, and re-engagement flow</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span>Webinars & events — QR codes and registration links that show real ROI</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span>Partner programs — clean attribution for affiliates and channel partners</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span>Sales outreach — track which content actually converts prospects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
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
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Syntax layer</strong> — standardized UTM structure across all links</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Naming rules layer</strong> — consistent campaign naming so data doesn't fragment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Governance layer</strong> — templates, approvals, and team rules</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Reporting layer</strong> — clean data that actually rolls up correctly</span>
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
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Predict performance</strong> — know which campaigns will work before you launch</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Detect anomalies</strong> — catch traffic drops and bot attacks automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Attribute revenue</strong> — see which touchpoints actually drive conversions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Answer questions</strong> — ask anything about your data in plain English</span>
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
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Marketers</strong> — launch campaigns without worrying about UTM chaos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Sales teams</strong> — track which content moves deals forward</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Marketing Ops</strong> — enforce clean data without slowing down teams</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Developers</strong> — self-host, API access, full control</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Partner managers</strong> — clear attribution for every affiliate and partner</span>
          </li>
        </ul>
        <a href="/solutions/marketers" className="inline-flex items-center mt-4 text-sm text-white-70">
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
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Free</strong> — 100 links, basic analytics, community support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Pro ($20/mo)</strong> — 1,000 links, 1 custom domain, advanced analytics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Business ($99/mo)</strong> — 10,000 links, 5 custom domains, priority support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-white/60" />
            <span><strong className="text-white-90">Enterprise ($300/mo)</strong> — unlimited links, unlimited domains, dedicated SLA</span>
          </li>
        </ul>
        <p className="mt-3">All plans include UTM builder, QR generator, and Clean-Track governance.</p>
        <a href="/pricing" className="inline-flex items-center mt-4 text-sm text-white-70">
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
            <span className="font-semibold text-white-80">1.</span>
            <span>Create your free account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-white-80">2.</span>
            <span>Create your first link with clean UTMs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-white-80">3.</span>
            <span>Generate a branded QR code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-white-80">4.</span>
            <span>Watch your clean data roll in</span>
          </li>
        </ol>
        <p className="mt-3">No credit card required. No setup hassle. Just clean links that work.</p>
        <EarlyAccessInlineCTA />
      </>
    ),
  },
];

// Scroll-reveal FAQ item with progressive text visibility
const ScrollRevealFAQItem = ({ faq, index, isLast }: { faq: FAQItem; index: number; isLast: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0.3);
  const [translateY, setTranslateY] = useState(20);
  const [dotVisible, setDotVisible] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress from when element enters viewport to when it reaches center
      const startY = windowHeight;
      const endY = windowHeight / 2;
      const currentY = rect.top;
      
      let progress = 0;
      if (currentY <= startY && currentY >= endY) {
        progress = (startY - currentY) / (startY - endY);
      } else if (currentY < endY) {
        progress = 1;
      }
      
      // Map progress to opacity (0.3 -> 0.7 -> 1)
      const newOpacity = 0.3 + (progress * 0.35) + (Math.max(0, progress - 0.5) * 0.7);
      setOpacity(Math.min(1, Math.max(0.3, newOpacity)));
      
      // Map progress to translateY (20 -> 0)
      setTranslateY(20 - (progress * 20));
      
      // Show dot and line when visible
      if (progress > 0.2 && !dotVisible) {
        setDotVisible(true);
        setTimeout(() => setLineVisible(true), 100);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dotVisible]);

  return (
    <div ref={ref} className="flex gap-6">
      <div className="flex flex-col items-center flex-shrink-0">
        <div 
          className={`w-3 h-3 rounded-full bg-white/60 transition-transform duration-500 ease-out ${
            dotVisible ? 'scale-100' : 'scale-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        />
        {!isLast && (
          <div 
            className={`w-0.5 flex-1 mt-2 bg-gradient-to-b from-white/40 to-white/10 transition-transform duration-500 ease-out origin-top ${
              lineVisible ? 'scale-y-100' : 'scale-y-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          />
        )}
      </div>
      <div 
        className="pb-8 flex-1 transition-all duration-100 ease-out"
        style={{ 
          opacity,
          transform: `translateY(${translateY}px)`
        }}
      >
        <h2 className="text-xl md:text-2xl font-display font-semibold mb-4 text-white-90">
          {formatText(faq.question)}
        </h2>
        <div className="space-y-3 leading-relaxed text-white-50">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

export const FooterFAQ = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 md:px-8 overflow-hidden bg-obsidian">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-zinc-900/30 via-transparent to-zinc-900/20" />
      
      <div className="max-w-[980px] mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`mb-16 transition-all duration-600 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold obsidian-platinum-text">
            {formatText("ok, here's what we do. plain talk.")}
          </h1>
          <p className="text-lg mt-4 max-w-2xl text-white-50">
            Scroll down to learn more. Text becomes clearer as you read.
          </p>
        </div>
        
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
