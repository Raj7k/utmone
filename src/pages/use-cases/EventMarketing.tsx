import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Scan, Radio, BarChart3 } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RelatedResources, PeopleAlsoRead } from "@/components/seo/RelatedResources";
import { Button } from "@/components/ui/button";

const EventMarketing = () => {
  const features = [
    {
      icon: MapPin,
      title: "Event Halo Detection",
      description: "Track the 'invisible 90%'—visitors who saw your booth but didn't scan a QR code—using geo-temporal analysis."
    },
    {
      icon: Scan,
      title: "One-Tap Badge Scanning",
      description: "Capture leads instantly with our mobile scanner. AI-powered OCR extracts contact info in under a second."
    },
    {
      icon: Radio,
      title: "Real-Time Event Dashboard",
      description: "Monitor live traffic during events with minute-by-minute analytics and anomaly alerts."
    },
    {
      icon: Users,
      title: "Lead Temperature Tagging",
      description: "Tag leads as Hot, Warm, or Cold immediately after scanning for faster sales follow-up."
    },
    {
      icon: Calendar,
      title: "Pre/Post Event Tracking",
      description: "Track promotional links before the event and follow-up campaigns after with unified attribution."
    },
    {
      icon: BarChart3,
      title: "Event ROI Calculator",
      description: "Measure true event ROI by connecting booth visits to pipeline and closed revenue."
    }
  ];

  const useCases = [
    {
      title: "Trade Shows & Conferences",
      description: "Track booth visitors, speaking session attendees, and sponsored event impact with unique tracked links and QR codes."
    },
    {
      title: "Field Marketing Events",
      description: "Measure the halo effect of local events—see how many website visitors came from the event city during and after."
    },
    {
      title: "Webinars & Virtual Events",
      description: "Track registration sources, attendance, and post-webinar engagement with consistent UTM parameters."
    },
    {
      title: "Roadshows & Multi-City Tours",
      description: "Compare performance across cities with standardized tracking and control group analysis."
    }
  ];

  const faqs = [
    {
      question: "What is Event Halo detection?",
      answer: "Event Halo uses geo-temporal analysis to detect traffic spikes from your event city during the event dates. It compares this to a control city to prove the traffic increase was caused by your event, not general market trends."
    },
    {
      question: "How does One-Tap Badge Scanning work?",
      answer: "Point your phone camera at a badge, and our AI-powered OCR extracts name, email, company, and title in under a second. Tag lead temperature immediately and sync to your CRM."
    },
    {
      question: "Can I track virtual events and webinars?",
      answer: "Yes! Use tracked registration links, embed UTMs in email reminders, and measure post-webinar engagement—all with the same attribution system used for in-person events."
    },
    {
      question: "How do I prove event ROI to executives?",
      answer: "utm.one connects event touches to pipeline and revenue. Show the CFO that a $50,000 trade show generated $500,000 in pipeline, not just '200 badge scans.'"
    },
    {
      question: "What if attendees don't scan our QR codes?",
      answer: "Event Halo tracks the 'invisible 90%' who visited your booth but didn't scan. It detects traffic from the event city and attributes it to your event presence."
    },
    {
      question: "Can I compare performance across multiple events?",
      answer: "Yes. Standardized UTM conventions let you compare trade shows, webinars, and field events side-by-side with consistent metrics."
    },
    {
      question: "How do I track pre-event and post-event campaigns?",
      answer: "Use consistent UTM parameters across all event touchpoints—pre-event promotions, day-of QR codes, and follow-up emails—for complete attribution."
    },
    {
      question: "Does utm.one integrate with event platforms?",
      answer: "utm.one works with any event platform. Generate tracked registration links for Eventbrite, Splash, or your custom registration system."
    }
  ];

  return (
    <>
      <SEO 
        title="Event Marketing Tracking & Attribution | utm.one"
        description="Track trade shows, conferences, and field events from booth visit to closed deal. utm.one provides event marketers with halo detection, badge scanning, and event ROI measurement."
        canonical="https://utm.one/use-cases/event-marketing"
        keywords={["event marketing tracking", "trade show ROI", "conference attribution", "badge scanning", "event analytics"]}
      />
      <ArticleSchema
        headline="Event Marketing Tracking & Attribution"
        description="Complete guide to tracking event marketing ROI with utm.one."
        author="utm.one"
        datePublished="2025-01-15"
        dateModified="2025-01-15"
        url="https://utm.one/use-cases/event-marketing"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Use Cases', url: 'https://utm.one/use-cases' },
          { name: 'Event Marketing', url: 'https://utm.one/use-cases/event-marketing' }
        ]}
      />
      <ResourcesLayout>
        {/* Hero */}
        <section className="py-20 border-b border-zinc-200">
          <div className="max-w-[980px] mx-auto px-8">
            <Link
              to="/use-cases"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Use Cases
            </Link>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Events
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
                Track the Invisible 90% from Every Event
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
                Stop counting badge scans. Start measuring actual event impact with 
                geo-temporal attribution and real-time analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg">
                  <Link to="/early-access">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/features/event-halo">See Event Halo Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 bg-zinc-50">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              The Event Attribution Gap
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-200">
                <h3 className="font-semibold text-zinc-900 mb-2">❌ Without utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "We scanned 200 badges but only 10 became leads"</li>
                  <li>• Can't prove trade show ROI to executives</li>
                  <li>• Missing the visitors who didn't scan QR codes</li>
                  <li>• No way to compare event performance</li>
                  <li>• Manual badge data entry after events</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-purple-200 border-2">
                <h3 className="font-semibold text-purple-700 mb-2">✓ With utm.one</h3>
                <ul className="space-y-2 text-zinc-600 text-sm">
                  <li>• "Trade show drove 1,400 website visits + 200 scans"</li>
                  <li>• Connect event spend to pipeline and revenue</li>
                  <li>• Track halo effect with geo-temporal analysis</li>
                  <li>• Compare events with consistent metrics</li>
                  <li>• One-tap scanning with instant CRM sync</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              Event-Specific Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
                  <feature.icon className="w-8 h-8 text-zinc-900 mb-4" />
                  <h3 className="font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 bg-zinc-50">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              How Event Teams Use utm.one
            </h2>
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-zinc-200">
                  <h3 className="font-semibold text-zinc-900 mb-2">{useCase.title}</h3>
                  <p className="text-zinc-600">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <h2 className="text-3xl font-display font-bold text-zinc-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-zinc-200">
                  <h3 className="font-semibold text-zinc-900 mb-2">{faq.question}</h3>
                  <p className="text-zinc-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-zinc-900 text-white">
          <div className="max-w-[980px] mx-auto px-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Prove Event ROI?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join event marketers who use utm.one to track every touchpoint 
              from booth visit to closed deal.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/early-access">Start Free Trial</Link>
            </Button>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16">
          <div className="max-w-[980px] mx-auto px-8">
            <RelatedResources 
              currentPath="/use-cases/event-marketing"
              category="use-case"
            />
            <div className="mt-12">
              <PeopleAlsoRead 
                items={[
                  { title: "Agency Client Reporting", url: "/use-cases/agency-client-reporting" },
                  { title: "Event Halo Feature", url: "/features/event-halo" },
                  { title: "Field Marketing Solution", url: "/solutions/field-marketing" }
                ]}
              />
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

export default EventMarketing;
