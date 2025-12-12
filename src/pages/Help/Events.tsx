import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import {
  CalendarDays,
  Waves,
  Scan,
  Upload,
  Calculator,
  MapPin,
  Target,
  Users,
  Sparkles,
  GitMerge,
} from "lucide-react";

const Events = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Events & Field Marketing" }]} />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100">Events & Field Marketing</h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">new</span>
        </div>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Track offline events, measure trade show ROI, and prove the impact of field marketing with Event Halo technology.
        </p>
      </div>

      {/* Event Halo Hero */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Waves className="h-6 w-6" />
            <span className="text-sm font-medium text-zinc-300">Event Halo</span>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Track the invisible 90%</h2>
          <p className="text-zinc-300 mb-6 max-w-xl">
            You scanned 200 badges at the trade show. But how many people saw your booth, grabbed a brochure, and visited your website later without scanning? Event Halo measures that invisible traffic lift.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div className="text-center">
              <div className="text-2xl font-bold">200</div>
              <div className="text-xs text-zinc-400">badges scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">+1,400</div>
              <div className="text-xs text-zinc-400">halo visitors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">+450%</div>
              <div className="text-xs text-zinc-400">lift detected</div>
            </div>
          </div>
        </div>
      </div>

      <ProTip>
        Create your event in utm.one before the show starts. This gives us baseline data to measure against, making your lift analysis more accurate.
      </ProTip>

      {/* Event Halo */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Event Halo</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Event Halo overview"
            description="Track the invisible 90% of trade show impact with geo-temporal analysis."
            icon={Waves}
            isNew
          >
            <h3>What is Event Halo?</h3>
            <p>Event Halo measures the total impact of your event presence by detecting traffic lifts from the event city compared to baseline. This captures visitors who saw your booth but never scanned a badge.</p>
            <h3>How it works</h3>
            <ol>
              <li>Create an event with location and dates</li>
              <li>We establish baseline traffic from that city</li>
              <li>During the event, we measure the lift</li>
              <li>Compare against a control city for validation</li>
            </ol>
            <h3>Metrics provided</h3>
            <ul>
              <li><strong>Halo visitors</strong> — Anonymous visitors from the event city</li>
              <li><strong>Lift percentage</strong> — Increase vs baseline</li>
              <li><strong>Confidence interval</strong> — Statistical reliability of the measurement</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Creating events"
            description="Set up event tracking with name, location, dates, and booth link."
            icon={CalendarDays}
          >
            <h3>Event setup</h3>
            <ol>
              <li>Go to Events → Create Event</li>
              <li>Enter event name and description</li>
              <li>Select the city (we use this for geo-targeting)</li>
              <li>Set start and end dates</li>
              <li>Optionally add a control city for comparison</li>
              <li>Create a booth QR code link</li>
            </ol>
            <h3>Control city</h3>
            <p>A control city is a similar city where you're NOT attending an event. This helps prove the lift is from the event, not general market trends.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Event ROI calculator"
            description="Input costs, leads, and halo visitors to get attributed pipeline value."
            icon={Calculator}
          >
            <h3>Inputs needed</h3>
            <ul>
              <li>Event costs (booth, travel, materials)</li>
              <li>Badge scans collected</li>
              <li>Average deal value (or we infer from historical data)</li>
              <li>Expected conversion rate</li>
            </ul>
            <h3>Outputs</h3>
            <ul>
              <li><strong>Attributed pipeline</strong> — Potential revenue from event leads</li>
              <li><strong>Cost per lead</strong> — Event cost divided by total leads</li>
              <li><strong>ROI projection</strong> — Expected return on event investment</li>
            </ul>
          </ExpandableArticle>
        </div>
      </div>

      {/* One-Tap Scanner */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">One-Tap Scanner</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="One-Tap Universal Scanner"
            description="Scan badges, QR codes, barcodes, and business cards with one app."
            icon={Scan}
            isNew
          >
            <h3>Supported formats</h3>
            <ul>
              <li>Event badges (QR and barcodes)</li>
              <li>Business cards (with AI text extraction)</li>
              <li>Any QR code</li>
              <li>Standard barcodes</li>
            </ul>
            <h3>Workflow</h3>
            <ol>
              <li>Open the scanner in your browser</li>
              <li>Point camera at badge/card</li>
              <li>Tap to tag lead temperature (Hot/Warm/Cold)</li>
              <li>Optionally add a voice note</li>
              <li>Data syncs automatically when connected</li>
            </ol>
            <h3>Offline mode</h3>
            <p>Scanner works offline and syncs when you're back online.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Badge scan import"
            description="Import badge scan CSVs from event organizers."
            icon={Upload}
          >
            <h3>How to import</h3>
            <ol>
              <li>Get the badge scan export from the event organizer</li>
              <li>Go to Events → Import Badges</li>
              <li>Upload the CSV file</li>
              <li>Map columns to fields (name, email, company, etc.)</li>
              <li>Review and confirm import</li>
            </ol>
            <p>We automatically deduplicate and match against existing contacts.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Lead enrichment setup"
            description="Connect Apollo, Clay, or ZoomInfo to auto-enrich badge scans."
            icon={Sparkles}
            isNew
          >
            <h3>Supported providers</h3>
            <ul>
              <li><strong>Apollo.io</strong> — Email and company data</li>
              <li><strong>Clay</strong> — Comprehensive enrichment</li>
              <li><strong>ZoomInfo</strong> — Enterprise contact data</li>
            </ul>
            <h3>What gets enriched</h3>
            <ul>
              <li>Missing email addresses</li>
              <li>Phone numbers</li>
              <li>LinkedIn profiles</li>
              <li>Company information</li>
              <li>Job title and department</li>
            </ul>
          </ExpandableArticle>
        </div>
      </div>

      {/* Event Bridge */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100">Event Bridge</h2>
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">business</span>
        </div>
        <div className="space-y-3">
          <ExpandableArticle
            title="Event Bridge overview"
            description="Sync event registrations from Luma, Airmeet, Goldcast, and Eventbrite to your CRM."
            icon={GitMerge}
            isNew
          >
            <h3>What is Event Bridge?</h3>
            <p>Event Bridge automatically syncs event registrations and attendees from your event platforms directly to your CRM, with optional enrichment along the way.</p>
            <h3>Supported platforms</h3>
            <ul>
              <li>Luma</li>
              <li>Airmeet</li>
              <li>Goldcast</li>
              <li>Eventbrite</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Setting up Event Bridge"
            description="Step-by-step guide to create an Event Bridge flow."
            icon={Target}
          >
            <h3>Setup steps</h3>
            <ol>
              <li>Go to Integrations → Event Bridge</li>
              <li>Click "Create Flow"</li>
              <li>Select your event platform source</li>
              <li>Connect your CRM destination</li>
              <li>Configure field mappings</li>
              <li>Enable the flow</li>
            </ol>
          </ExpandableArticle>

          <ExpandableArticle
            title="Routing rules configuration"
            description="Create conditional routing rules based on enrichment data."
            icon={MapPin}
          >
            <h3>Available conditions</h3>
            <ul>
              <li>Company size</li>
              <li>Industry</li>
              <li>Geographic location</li>
              <li>Job title/seniority</li>
              <li>Lead score thresholds</li>
            </ul>
            <p>Route high-value leads to your enterprise sales team while others go to nurture campaigns.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="CRM integration setup"
            description="Connect HubSpot, Salesforce, Zoho, Pipedrive, or Kylas."
            icon={Users}
          >
            <h3>Supported CRMs</h3>
            <ul>
              <li>HubSpot</li>
              <li>Salesforce</li>
              <li>Zoho CRM</li>
              <li>Pipedrive</li>
              <li>Kylas</li>
            </ul>
            <h3>Field mapping</h3>
            <p>Map event registration fields to your CRM contact fields. We support custom field mapping for each CRM.</p>
          </ExpandableArticle>
        </div>
      </div>

      <FeatureAvailability
        feature="Event Halo"
        availability={{ free: false, starter: false, growth: true, business: true, enterprise: true }}
      />
    </HelpLayout>
  );
};

export default Events;
