import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import {
  CalendarDays,
  Waves,
  Scan,
  Upload,
  Thermometer,
  QrCode,
  Calculator,
  MapPin,
  Target,
  Users,
} from "lucide-react";

const articles = [
  {
    title: "Event Halo explained",
    description: "Track the invisible 90% of trade show impact. We measure traffic lifts in your event city vs baseline, proving offline ROI.",
    href: "/help/events#event-halo",
    icon: Waves,
    isNew: true,
  },
  {
    title: "Geo-temporal lift analysis",
    description: "Compare traffic from event city during event dates against historical baselines. See the true halo effect of your presence.",
    href: "/help/events#lift-analysis",
    icon: MapPin,
  },
  {
    title: "Control group methodology",
    description: "We compare your event city against similar non-event cities. This proves the spike was caused by the event, not coincidence.",
    href: "/help/events#control-group",
    icon: Target,
  },
  {
    title: "One-Tap Universal Scanner",
    description: "Scan badges, QR codes, barcodes, and business cards with one app. Works offline. Syncs when connected.",
    href: "/help/events#one-tap",
    icon: Scan,
    isNew: true,
  },
  {
    title: "Supported scan formats",
    description: "QR codes, barcodes (1D/2D), NFC tags, and AI-powered OCR for business cards. One scanner for everything.",
    href: "/help/events#formats",
    icon: QrCode,
  },
  {
    title: "Lead temperature tagging",
    description: "Instantly tag scanned leads as Hot, Warm, or Cold. Prioritize follow-ups without waiting for CRM sync.",
    href: "/help/events#temperature",
    icon: Thermometer,
  },
  {
    title: "Badge scan import",
    description: "Import badge scan CSVs from event organizers. We deduplicate, enrich, and attribute them to your event.",
    href: "/help/events#import",
    icon: Upload,
  },
  {
    title: "Event ROI calculator",
    description: "Input your event costs, scanned leads, and halo visitors. Get attributed pipeline value and ROI projection.",
    href: "/help/events#roi",
    icon: Calculator,
  },
  {
    title: "Creating events",
    description: "Set up event tracking with name, location, dates, and booth link. We start monitoring geo-traffic automatically.",
    href: "/help/events#create",
    icon: CalendarDays,
  },
  {
    title: "Team event collaboration",
    description: "Multiple team members can scan simultaneously at different booth stations. All data syncs to one event dashboard.",
    href: "/help/events#team",
    icon: Users,
  },
];

const Events = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Events & Field Marketing" }]} />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="font-serif text-3xl font-bold text-zinc-900">Events & Field Marketing</h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">new</span>
        </div>
        <p className="text-lg text-zinc-500">
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

      {/* Event Halo Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Event Halo</h2>
        <div className="space-y-4">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              icon={article.icon}
              isNew={article.isNew}
            />
          ))}
        </div>
      </div>

      {/* One-Tap Scanner */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">One-Tap Scanner</h2>
        <div className="space-y-4">
          {articles.slice(3, 7).map((article) => (
            <ArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              icon={article.icon}
              isNew={article.isNew}
            />
          ))}
        </div>
      </div>

      {/* Event Management */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Event management</h2>
        <div className="space-y-4">
          {articles.slice(7).map((article) => (
            <ArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              icon={article.icon}
            />
          ))}
        </div>
      </div>

      <FeatureAvailability
        feature="Event Halo"
        availability={{ free: false, starter: false, growth: true, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "QR code generation", href: "/help/qr" },
          { title: "Revenue attribution", href: "/help/attribution#revenue" },
          { title: "Geo-targeting", href: "/help/advanced#geo-targeting" },
        ]}
      />
    </HelpLayout>
  );
};

export default Events;
