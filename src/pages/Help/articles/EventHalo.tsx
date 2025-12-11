import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const EventHalo = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Events & Field Marketing", href: "/help/events" },
          { label: "Event Halo Explained" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Event Halo Explained</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Event Halo measures the full impact of offline events by detecting website traffic spikes 
          in your event location. Track the invisible 90% of visitors who engage but never scan your QR code.
        </p>

        <FeatureAvailability tier="business" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">The Problem with Event ROI</h2>
        <p className="text-zinc-600 mb-4">
          Traditional event tracking only counts what you can directly measure:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>50 badge scans</li>
          <li>75 business cards collected</li>
          <li>120 QR code scans</li>
        </ul>
        <p className="text-zinc-600 mb-4">
          But what about everyone who:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Saw your booth and Googled you later?</li>
          <li>Grabbed your swag and visited your site at home?</li>
          <li>Heard your speaker session and looked you up?</li>
          <li>Told a colleague who then visited your site?</li>
        </ul>
        <p className="text-zinc-600 mb-6">
          <strong>Event Halo captures this invisible impact.</strong>
        </p>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">How It Works</h2>
        
        <div className="space-y-6 mb-8">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Baseline Measurement</h3>
              <p className="text-zinc-600">We analyze your typical website traffic from the event city over the past 30 days to establish a baseline.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Event Period Tracking</h3>
              <p className="text-zinc-600">During your event dates, we track all traffic from the event location (city-level geo-targeting).</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Lift Calculation</h3>
              <p className="text-zinc-600">We calculate the traffic lift: Event Traffic - (Baseline Daily Average × Event Days) = Halo Visitors</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Control Comparison</h3>
              <p className="text-zinc-600">We compare against a control city (similar demographics, no event) to prove the spike was event-driven.</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-zinc-900 mb-3">Example: SaaStr Conference in San Francisco</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500">SF Baseline (30-day avg)</p>
              <p className="text-2xl font-semibold text-zinc-900">45 visitors/day</p>
            </div>
            <div>
              <p className="text-zinc-500">SF During Event (3 days)</p>
              <p className="text-2xl font-semibold text-zinc-900">180 visitors/day</p>
            </div>
            <div>
              <p className="text-zinc-500">Expected (baseline × 3)</p>
              <p className="text-xl text-zinc-600">135 visitors</p>
            </div>
            <div>
              <p className="text-zinc-500">Actual</p>
              <p className="text-xl text-zinc-600">540 visitors</p>
            </div>
            <div className="col-span-2 border-t border-zinc-200 pt-4 mt-2">
              <p className="text-zinc-500">Halo Visitors</p>
              <p className="text-3xl font-bold text-green-600">+405 visitors (+300% lift)</p>
            </div>
          </div>
        </div>

        <ProTip>
          Choose a control city with similar demographics and business profile to your event city. 
          For San Francisco, good controls might be Seattle, Los Angeles, or Austin.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Setting Up an Event</h2>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Go to <strong>Events → Create Event</strong></li>
          <li>Enter event name, dates, and city</li>
          <li>Select a control city for comparison</li>
          <li>Create a booth link with UTM parameters</li>
          <li>Generate QR code for your booth materials</li>
          <li>Optionally set up badge scan import</li>
        </ol>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">ROI Calculation</h2>
        <p className="text-zinc-600 mb-4">
          Event Halo calculates pipeline and revenue impact using configurable metrics:
        </p>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6 font-mono text-sm">
          <div className="space-y-2 text-zinc-600">
            <p>Halo Visitors × Conversion Rate = Estimated Leads</p>
            <p>Estimated Leads × Average Deal Value = Pipeline Value</p>
            <p>Pipeline Value × Win Rate = Attributed Revenue</p>
          </div>
          <div className="border-t border-zinc-200 mt-4 pt-4">
            <p className="text-zinc-900">405 × 3% × $10,000 × 25% = <span className="text-green-600 font-semibold">$30,375 attributed revenue</span></p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Live Pulse Gauge</h2>
        <p className="text-zinc-600 mb-4">
          During your event, the Live Pulse shows real-time traffic compared to expected baseline:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><span className="text-green-600 font-semibold">Green:</span> Traffic above baseline (positive lift)</li>
          <li><span className="text-yellow-600 font-semibold">Yellow:</span> Traffic at baseline (no measurable impact)</li>
          <li><span className="text-red-600 font-semibold">Red:</span> Traffic below baseline (investigate)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Confidence Intervals</h2>
        <p className="text-zinc-600 mb-4">
          Event Halo provides confidence intervals, not precise numbers. This reflects statistical 
          reality and builds credibility with executives:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>"We estimate 350-450 halo visitors (95% confidence)"</li>
          <li>"Pipeline impact: $25,000-$35,000"</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Best Use Cases</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Trade Shows</h3>
            <p className="text-zinc-600 text-sm">Measure booth traffic impact beyond badge scans</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Conferences</h3>
            <p className="text-zinc-600 text-sm">Track attendee engagement after speaker sessions</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Roadshows</h3>
            <p className="text-zinc-600 text-sm">Compare city-to-city impact across tour stops</p>
          </div>
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Partner Events</h3>
            <p className="text-zinc-600 text-sm">Measure co-marketing ROI at partner locations</p>
          </div>
        </div>

        <RelatedArticles
          articles={[
            { title: "One-Tap Universal Scanner", href: "/help/events/one-tap-scanner" },
            { title: "Badge Scan Import", href: "/help/events/badge-import" },
            { title: "Event ROI Calculator", href: "/help/events/roi-calculator" },
            { title: "Mission Cards", href: "/help/events/mission-cards" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default EventHalo;
