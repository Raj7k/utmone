import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: ReactNode;
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
            <span><strong className="text-white">Syntax layer</strong> — standardized UTM structure across all links</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Naming rules layer</strong> — consistent campaign naming so data doesn't fragment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Governance layer</strong> — templates, approvals, and team rules</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Reporting layer</strong> — clean data that actually rolls up correctly</span>
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
            <span><strong className="text-white">Marketers</strong> — launch campaigns without worrying about UTM chaos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Sales teams</strong> — track which content moves deals forward</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Marketing Ops</strong> — enforce clean data without slowing down teams</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Developers</strong> — self-host, API access, full control</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Partner managers</strong> — clear attribution for every affiliate and partner</span>
          </li>
        </ul>
        <Link to="/solutions/marketers" className="inline-flex items-center mt-4 text-blazeOrange hover:underline text-sm lowercase">
          learn more about your role
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
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
            <span><strong className="text-white">Free</strong> — 100 links, basic analytics, community support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Pro ($20/mo)</strong> — 1,000 links, 1 custom domain, advanced analytics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Business ($99/mo)</strong> — 10,000 links, 5 custom domains, priority support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blazeOrange mt-2 flex-shrink-0" />
            <span><strong className="text-white">Enterprise ($300/mo)</strong> — unlimited links, unlimited domains, dedicated SLA</span>
          </li>
        </ul>
        <p className="mt-3">All plans include UTM builder, QR generator, and clean-track governance.</p>
        <Link to="/pricing" className="inline-flex items-center mt-4 text-blazeOrange hover:underline text-sm lowercase">
          see full pricing
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
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
        <Link to="/early-access#early-access-form">
          <Button variant="marketing" className="mt-6 rounded-full lowercase">
            get your link page
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </>
    ),
  },
];

export const FooterFAQ = () => {
  return (
    <section className="bg-mirage py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-display text-white text-center mb-16 lowercase">
          ok, here's what we do. plain talk.
        </h2>
        
        {/* FAQ Items */}
        <div className="space-y-12">
          {faqs.map((faq, index) => (
            <div key={index} className="flex gap-6">
              {/* Blaze Orange Bullet + Vertical Line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-blazeOrange" />
                {index < faqs.length - 1 && (
                  <div className="w-0.5 flex-1 bg-blazeOrange/30 mt-2" />
                )}
              </div>
              
              {/* Content */}
              <div className="pb-4 flex-1">
                <h3 className="text-xl font-semibold text-white mb-3 lowercase">
                  {faq.question}
                </h3>
                <div className="text-gray-400 space-y-3">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
