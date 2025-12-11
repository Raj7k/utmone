import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, BarChart3 } from "lucide-react";

const EventHaloOverview = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/events" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Event Halo overview</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Measure the invisible impact of offline events through geo-temporal attribution.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">The field marketing problem</h2>
          <p className="text-zinc-600 mb-4">
            You attend a trade show, scan 200 badges, and call it a success. But what about the thousands 
            of attendees who walked by your booth, saw your brand, and visited your website later?
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">The hidden 90%</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">Badge scans (direct leads)</span>
                <span className="font-medium">200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Booth visitors (estimated)</span>
                <span className="font-medium">~2,000</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>Invisible impact</span>
                <span className="font-medium">90% unmeasured</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">How Event Halo works</h2>
          <p className="text-zinc-600 mb-4">
            Event Halo uses geo-temporal analysis to detect traffic spikes in your event city during event dates:
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <MapPin className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Geo detection</h4>
              <p className="text-sm text-zinc-600">Track visitors by city using IP geolocation</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <Calendar className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Temporal analysis</h4>
              <p className="text-sm text-zinc-600">Compare event period to baseline traffic</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <BarChart3 className="h-5 w-5 text-amber-600 mb-2" />
              <h4 className="font-medium text-zinc-900 mb-1">Lift calculation</h4>
              <p className="text-sm text-zinc-600">Measure incremental visitors from the event</p>
            </div>
          </div>

          <ProTip>
            Event Halo uses only your own pixel data—no external CRM or GA integration required.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up an event</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Events</strong> from the sidebar</li>
            <li>Click <strong>Create Event</strong></li>
            <li>Enter event name, city, and dates</li>
            <li>Optionally select a control city for comparison</li>
            <li>Create a booth QR code with event UTMs</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Understanding lift</h2>
          <p className="text-zinc-600 mb-4">
            Event Halo calculates lift by comparing:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <p className="text-sm text-zinc-600 mb-2">
              <strong>Formula:</strong> Lift = Event Traffic - (Baseline Daily Average × Event Days)
            </p>
            <div className="text-sm text-zinc-600 mt-4">
              <p><strong>Example (3-day conference in Las Vegas):</strong></p>
              <p>Baseline daily traffic from Las Vegas: 50 visits/day</p>
              <p>Traffic during event: 450 visits over 3 days</p>
              <p className="text-amber-600 font-medium mt-2">Lift = 450 - (50 × 3) = 300 incremental visitors</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Control city comparison</h2>
          <p className="text-zinc-600 mb-4">
            For scientific credibility, compare your event city to a similar control city:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Control city should have similar baseline traffic</li>
            <li>No events or campaigns running in control city</li>
            <li>Proves the spike was local to your event, not a general trend</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Next steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/creating-events" className="block p-4 bg-white border border-zinc-200 rounded-xl hover:border-amber-300 transition-colors">
              <h4 className="font-medium text-zinc-900 mb-1">Creating events</h4>
              <p className="text-sm text-zinc-500">Step-by-step event setup guide</p>
            </Link>
            <Link to="/help/articles/one-tap-scanner" className="block p-4 bg-white border border-zinc-200 rounded-xl hover:border-amber-300 transition-colors">
              <h4 className="font-medium text-zinc-900 mb-1">One-Tap Scanner</h4>
              <p className="text-sm text-zinc-500">Scan badges at your event</p>
            </Link>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default EventHaloOverview;
