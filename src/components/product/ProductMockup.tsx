import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Globe, Shield, TrendingUp, Zap, AlertCircle } from "lucide-react";

interface ProductMockupProps {
  type: "browser" | "utm" | "security" | "analytics" | "governance" | "dashboard" | "geo-map" | "qr-customizer" | "validation" | "identity-stitching" | "attribution-graph" | "state-value" | "golden-path";
  delay?: number;
  size?: "default" | "large";
}

export const ProductMockup = ({ type, delay = 0, size = "default" }: ProductMockupProps) => {
  const isLarge = size === "large";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      {type === "browser" && <BrowserMockup size={size} />}
      {type === "utm" && <UTMParameterCard size={size} />}
      {type === "security" && <SecurityBadgeCard size={size} />}
      {type === "analytics" && <AnalyticsMiniDash size={size} />}
      {type === "governance" && <GovernanceCard size={size} />}
      {type === "dashboard" && <DashboardMockup size={size} />}
      {type === "geo-map" && <GeoMapMockup size={size} />}
      {type === "qr-customizer" && <QRCustomizerMockup size={size} />}
      {type === "validation" && <ValidationMockup size={size} />}
      {type === "identity-stitching" && <IdentityStitchingMockup size={size} />}
      {type === "attribution-graph" && <AttributionGraphMockup size={size} />}
      {type === "state-value" && <StateValueMockup size={size} />}
      {type === "golden-path" && <GoldenPathMockup size={size} />}
    </motion.div>
  );
};

const BrowserMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card rounded-xl md:rounded-2xl border border-border shadow-lg overflow-hidden w-full max-w-sm md:max-w-md ${size === "large" ? "lg:max-w-lg" : ""}`}>
    {/* Browser Chrome */}
    <div className={`bg-muted/30 border-b border-border flex items-center gap-2 ${size === "large" ? "px-4 md:px-6 py-3 md:py-4" : "px-3 md:px-4 py-2.5 md:py-3"}`}>
    <div className="flex gap-1.5 md:gap-2">
        <div className={`rounded-full bg-red-500 ${size === "large" ? "w-3 h-3 md:w-4 md:h-4" : "w-2.5 h-2.5 md:w-3 md:h-3"}`} />
        <div className={`rounded-full bg-yellow-500 ${size === "large" ? "w-3 h-3 md:w-4 md:h-4" : "w-2.5 h-2.5 md:w-3 md:h-3"}`} />
        <div className={`rounded-full bg-green-500 ${size === "large" ? "w-3 h-3 md:w-4 md:h-4" : "w-2.5 h-2.5 md:w-3 md:h-3"}`} />
      </div>
      <div className={`flex-1 ml-2 md:ml-4 bg-card rounded-md px-2 md:px-4 text-secondary-label font-mono truncate ${size === "large" ? "py-1.5 md:py-2 text-xs md:text-base" : "py-1 md:py-1.5 text-xs md:text-sm"}`}>
        utm.one/webinar
      </div>
    </div>
    {/* Content */}
    <div className={`space-y-2 md:space-y-3 ${size === "large" ? "p-4 sm:p-6 md:p-8 lg:p-12" : "p-4 md:p-6 lg:p-8"}`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg flex items-center justify-center ${size === "large" ? "w-14 h-14" : "w-10 h-10"}`} style={{ background: 'rgba(59,130,246,0.1)' }}>
          <span className={`font-bold ${size === "large" ? "text-xl" : "text-base"}`} style={{ color: 'rgba(59,130,246,1)' }}>✓</span>
        </div>
        <div>
          <div className={`font-semibold text-label ${size === "large" ? "text-lg" : "text-sm"}`}>Clean, Readable URL</div>
          <div className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>utm.one/webinar</div>
        </div>
      </div>
      <div className={`text-secondary-label bg-muted/20 rounded-lg ${size === "large" ? "text-sm p-4" : "text-xs p-3"}`}>
        vs. bit.ly/3xK9pQ2m
      </div>
    </div>
  </div>
);

const UTMParameterCard = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card rounded-xl md:rounded-2xl border border-border shadow-lg space-y-2 md:space-y-3 w-full max-w-sm md:max-w-md ${size === "large" ? "p-4 sm:p-6 md:p-8 lg:p-10 lg:max-w-lg" : "p-4 md:p-6"}`}>
    <div className="flex items-center justify-between">
      <h3 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>UTM Parameters</h3>
      <div className={`text-primary bg-primary/5 px-2 py-1 rounded-full ${size === "large" ? "text-sm" : "text-xs"}`} style={{ color: 'rgba(59,130,246,1)', background: 'rgba(59,130,246,0.05)' }}>✓ Valid</div>
    </div>
    <div className="space-y-2">
      <div className={`flex items-center justify-between ${size === "large" ? "text-sm" : "text-xs"}`}>
        <span className="text-secondary-label">utm_source</span>
        <span className="text-label font-mono">linkedin</span>
      </div>
      <div className={`flex items-center justify-between ${size === "large" ? "text-sm" : "text-xs"}`}>
        <span className="text-secondary-label">utm_medium</span>
        <span className="text-label font-mono">paid</span>
      </div>
      <div className={`flex items-center justify-between ${size === "large" ? "text-sm" : "text-xs"}`}>
        <span className="text-secondary-label">utm_campaign</span>
        <span className="text-label font-mono">q1-webinar</span>
      </div>
      <div className={`flex items-center justify-between ${size === "large" ? "text-sm" : "text-xs"}`}>
        <span className="text-secondary-label">utm_content</span>
        <span className="text-label font-mono">hero-cta</span>
      </div>
    </div>
    <div className="pt-2 border-t border-border">
      <div className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Enforced naming rules ✓</div>
    </div>
  </div>
);

const SecurityBadgeCard = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card rounded-xl md:rounded-2xl border border-border shadow-lg space-y-3 md:space-y-4 w-full max-w-sm md:max-w-md ${size === "large" ? "p-4 sm:p-6 md:p-8 lg:p-10 lg:max-w-lg" : "p-4 md:p-6"}`}>
    <h3 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Security Status</h3>
    <div className="grid grid-cols-2 gap-3">
      <div className={`rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`} style={{ background: 'rgba(59,130,246,0.05)' }}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>🔒</div>
        <div className={`font-semibold ${size === "large" ? "text-sm" : "text-xs"}`} style={{ color: 'rgba(59,130,246,1)' }}>SSL Secured</div>
      </div>
      <div className={`rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`} style={{ background: 'rgba(59,130,246,0.05)' }}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>✓</div>
        <div className={`font-semibold ${size === "large" ? "text-sm" : "text-xs"}`} style={{ color: 'rgba(59,130,246,1)' }}>Scanned</div>
      </div>
      <div className={`rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`} style={{ background: 'rgba(59,130,246,0.05)' }}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>🛡️</div>
        <div className={`font-semibold ${size === "large" ? "text-sm" : "text-xs"}`} style={{ color: 'rgba(59,130,246,1)' }}>No Malware</div>
      </div>
      <div className={`rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`} style={{ background: 'rgba(59,130,246,0.05)' }}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>✅</div>
        <div className={`font-semibold ${size === "large" ? "text-sm" : "text-xs"}`} style={{ color: 'rgba(59,130,246,1)' }}>Verified</div>
      </div>
    </div>
    <div className={`text-secondary-label text-center pt-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
      Real-time security scanning
    </div>
  </div>
);

const AnalyticsMiniDash = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card rounded-xl md:rounded-2xl border border-border shadow-lg space-y-3 md:space-y-4 w-full max-w-sm md:max-w-md ${size === "large" ? "p-4 sm:p-6 md:p-8 lg:p-10 lg:max-w-lg" : "p-4 md:p-6"}`}>
    <h3 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Analytics</h3>
    <div className="grid grid-cols-3 gap-3">
      <div className="space-y-1">
        <div className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Clicks</div>
        <div className={`font-bold text-label ${size === "large" ? "text-3xl" : "text-2xl"}`}>1,247</div>
      </div>
      <div className="space-y-1">
        <div className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Devices</div>
        <div className={`font-bold text-label ${size === "large" ? "text-3xl" : "text-2xl"}`}>892</div>
      </div>
      <div className="space-y-1">
        <div className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Rate</div>
        <div className={`font-bold text-label ${size === "large" ? "text-3xl" : "text-2xl"}`}>71%</div>
      </div>
    </div>
    {/* Mini Chart */}
    <div className={`flex items-end gap-1 ${size === "large" ? "h-32" : "h-20"}`}>
      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{ height: `${height}%`, background: 'rgba(59,130,246,1)' }}
        />
      ))}
    </div>
    <div className={`text-secondary-label text-center ${size === "large" ? "text-sm" : "text-xs"}`}>Full funnel visibility</div>
  </div>
);

const GovernanceCard = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card rounded-xl md:rounded-2xl border border-border shadow-lg space-y-2 md:space-y-3 w-full max-w-sm md:max-w-md ${size === "large" ? "p-4 sm:p-6 md:p-8 lg:p-10 lg:max-w-lg" : "p-4 md:p-6"}`}>
    <h3 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Audit Log</h3>
    <div className="space-y-2">
      <div className={`flex items-center gap-3 pb-2 border-b border-border ${size === "large" ? "text-sm" : "text-xs"}`}>
        <div className={`rounded-full flex items-center justify-center ${size === "large" ? "w-10 h-10" : "w-8 h-8"}`} style={{ background: 'rgba(59,130,246,0.1)' }}>
          <span className={`font-bold ${size === "large" ? "text-sm" : "text-xs"}`} style={{ color: 'rgba(59,130,246,1)' }}>JD</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-label">Created link</div>
          <div className="text-secondary-label">utm.one/webinar</div>
        </div>
        <div className="text-secondary-label">2m ago</div>
      </div>
      <div className={`flex items-center gap-3 pb-2 border-b border-border ${size === "large" ? "text-sm" : "text-xs"}`}>
        <div className={`rounded-full flex items-center justify-center ${size === "large" ? "w-10 h-10" : "w-8 h-8"}`} style={{ background: 'rgba(59,130,246,0.1)' }}>
          <span className={`font-bold ${size === "large" ? "text-sm" : "text-xs"}`} style={{ color: 'rgba(59,130,246,1)' }}>SK</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-label">Updated UTMs</div>
          <div className="text-secondary-label">utm.one/demo</div>
        </div>
        <div className="text-secondary-label">5m ago</div>
      </div>
      <div className={`flex items-center gap-3 ${size === "large" ? "text-sm" : "text-xs"}`}>
        <div className={`rounded-full bg-primary/10 flex items-center justify-center ${size === "large" ? "w-10 h-10" : "w-8 h-8"}`}>
          <span className={`font-bold text-primary ${size === "large" ? "text-sm" : "text-xs"}`}>MH</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-label">Generated QR</div>
          <div className="text-secondary-label">utm.one/event</div>
        </div>
        <div className="text-secondary-label">12m ago</div>
      </div>
    </div>
    <div className={`text-secondary-label text-center pt-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
      Full traceability
    </div>
  </div>
);

// New mockup components
const DashboardMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-semibold text-label">Analytics Overview</h4>
      <BarChart3 className="w-4 h-4" style={{ color: 'rgba(59,130,246,1)' }} />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg p-4" style={{ background: 'rgba(59,130,246,0.05)' }}>
        <p className="text-xs text-secondary-label mb-1">Total Clicks</p>
        <p className="text-2xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>2,847</p>
        <div className="flex items-center gap-1 text-xs mt-1" style={{ color: 'rgba(59,130,246,1)' }}>
          <TrendingUp className="w-3 h-3" />
          <span>+18%</span>
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-xs text-secondary-label mb-1">Conversions</p>
        <p className="text-2xl font-bold text-label">127</p>
        <div className="flex items-center gap-1 text-xs mt-1" style={{ color: 'rgba(59,130,246,1)' }}>
          <TrendingUp className="w-3 h-3" />
          <span>+23%</span>
        </div>
      </div>
    </div>
    <div className="h-24 bg-muted/30 rounded-lg flex items-end gap-1 p-2">
      {[40, 65, 55, 80, 45, 90, 70].map((height, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${height}%`, background: 'rgba(59,130,246,0.3)' }} />
      ))}
    </div>
  </div>
);

const GeoMapMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Globe className="w-4 h-4" style={{ color: 'rgba(59,130,246,1)' }} />
      <h4 className="text-sm font-semibold text-label">Geo-Targeting Rules</h4>
    </div>
    <div className="space-y-3">
      <div className="rounded-lg p-3 flex items-center justify-between" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          <span className="text-sm font-semibold text-label">United States</span>
        </div>
        <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(59,130,246,1)' }} />
      </div>
      <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between opacity-60">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇬🇧</span>
          <span className="text-sm font-semibold text-label">United Kingdom</span>
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between opacity-60">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇩🇪</span>
          <span className="text-sm font-semibold text-label">Germany</span>
        </div>
      </div>
    </div>
  </div>
);

const QRCustomizerMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <h4 className="text-sm font-semibold text-label mb-4">QR Code Customization</h4>
    <div className="flex flex-col items-center gap-4">
      <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center" style={{ border: '2px solid rgba(59,130,246,0.2)' }}>
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? '' : 'bg-white'} rounded-sm`} style={Math.random() > 0.5 ? { background: 'rgba(59,130,246,1)' } : undefined} />
          ))}
        </div>
      </div>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary-label">Brand Colors</span>
          <CheckCircle2 className="w-3 h-3" style={{ color: 'rgba(59,130,246,1)' }} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary-label">Logo</span>
          <CheckCircle2 className="w-3 h-3" style={{ color: 'rgba(59,130,246,1)' }} />
        </div>
      </div>
    </div>
  </div>
);

const ValidationMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-3">
    <h4 className="text-sm font-semibold text-label mb-4">Real-Time Validation</h4>
    <div className="space-y-2">
      <div className="rounded-lg p-3 flex items-center gap-2" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(59,130,246,1)' }} />
        <div className="flex-1">
          <p className="text-xs font-semibold text-label">utm_source</p>
          <p className="text-xs font-mono" style={{ color: 'rgba(59,130,246,1)' }}>google</p>
        </div>
      </div>
      <div className="rounded-lg p-3 flex items-center gap-2" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(59,130,246,1)' }} />
        <div className="flex-1">
          <p className="text-xs font-semibold text-label">utm_medium</p>
          <p className="text-xs font-mono" style={{ color: 'rgba(59,130,246,1)' }}>cpc</p>
        </div>
      </div>
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-red-800 dark:text-red-200">utm_campaign</p>
          <p className="text-xs text-red-600 dark:text-red-400">Required field</p>
        </div>
      </div>
    </div>
  </div>
);

const IdentityStitchingMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card border border-border rounded-xl shadow-lg space-y-4 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
    <h4 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Identity Resolution</h4>
    <div className="space-y-3">
      <div className={`bg-muted/50 rounded-lg ${size === "large" ? "p-4" : "p-3"}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`rounded-full bg-muted ${size === "large" ? "w-10 h-10" : "w-8 h-8"} flex items-center justify-center`}>
            <span className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>?</span>
          </div>
          <div>
            <p className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Anonymous Visitor 582</p>
            <p className={`text-tertiary-label ${size === "large" ? "text-xs" : "text-[10px]"}`}>3 weeks ago • Blog visit</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className={`text-primary ${size === "large" ? "text-2xl" : "text-xl"}`}>↓</div>
      </div>
      <div className={`bg-primary/10 border border-primary/20 rounded-lg ${size === "large" ? "p-4" : "p-3"}`}>
        <div className="flex items-center gap-2">
          <div className={`rounded-full bg-primary/20 ${size === "large" ? "w-10 h-10" : "w-8 h-8"} flex items-center justify-center`}>
            <span className={`text-primary font-bold ${size === "large" ? "text-sm" : "text-xs"}`}>SJ</span>
          </div>
          <div>
            <p className={`font-semibold text-label ${size === "large" ? "text-sm" : "text-xs"}`}>Sarah Johnson</p>
            <p className={`text-secondary-label ${size === "large" ? "text-xs" : "text-[10px]"}`}>sarah@nike.com</p>
          </div>
        </div>
      </div>
    </div>
    <div className={`text-secondary-label text-center pt-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
      Time-travel stitching backfills history
    </div>
  </div>
);

const AttributionGraphMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card border border-border rounded-xl shadow-lg space-y-4 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
    <h4 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Bayesian Attribution</h4>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className={`bg-primary/10 rounded-lg ${size === "large" ? "p-3" : "p-2"} flex-1 mr-2`}>
          <p className={`font-semibold text-primary ${size === "large" ? "text-sm" : "text-xs"}`}>LinkedIn</p>
          <p className={`text-primary ${size === "large" ? "text-lg font-bold" : "text-sm font-semibold"}`}>42%</p>
        </div>
        <div className={`bg-blazeOrange/10 rounded-lg ${size === "large" ? "p-3" : "p-2"} flex-1 ml-2`}>
          <p className={`font-semibold text-blazeOrange ${size === "large" ? "text-sm" : "text-xs"}`}>Webinar</p>
          <p className={`text-blazeOrange ${size === "large" ? "text-lg font-bold" : "text-sm font-semibold"}`}>31%</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className={`bg-deep-sea/10 rounded-lg ${size === "large" ? "p-3" : "p-2"} flex-1 mr-2`}>
          <p className={`font-semibold text-deep-sea ${size === "large" ? "text-sm" : "text-xs"}`}>Blog</p>
          <p className={`text-deep-sea ${size === "large" ? "text-lg font-bold" : "text-sm font-semibold"}`}>18%</p>
        </div>
        <div className={`bg-muted/50 rounded-lg ${size === "large" ? "p-3" : "p-2"} flex-1 ml-2`}>
          <p className={`font-semibold text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Direct</p>
          <p className={`text-secondary-label ${size === "large" ? "text-lg font-bold" : "text-sm font-semibold"}`}>9%</p>
        </div>
      </div>
    </div>
    <div className={`text-secondary-label text-center pt-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
      True causal influence, not last-click
    </div>
  </div>
);

const StateValueMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card border border-border rounded-xl shadow-lg space-y-3 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
    <h4 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Page Value Heatmap</h4>
    <div className="space-y-2">
      <div className={`flex items-center justify-between bg-primary/10 rounded-lg ${size === "large" ? "p-3" : "p-2"}`}>
        <span className={`text-label font-medium ${size === "large" ? "text-sm" : "text-xs"}`}>/pricing</span>
        <span className={`text-primary font-bold ${size === "large" ? "text-base" : "text-sm"}`}>$45.00</span>
      </div>
      <div className={`flex items-center justify-between bg-blazeOrange/10 rounded-lg ${size === "large" ? "p-3" : "p-2"}`}>
        <span className={`text-label font-medium ${size === "large" ? "text-sm" : "text-xs"}`}>/features</span>
        <span className={`text-blazeOrange font-bold ${size === "large" ? "text-base" : "text-sm"}`}>$28.50</span>
      </div>
      <div className={`flex items-center justify-between bg-deep-sea/10 rounded-lg ${size === "large" ? "p-3" : "p-2"}`}>
        <span className={`text-label font-medium ${size === "large" ? "text-sm" : "text-xs"}`}>/blog</span>
        <span className={`text-deep-sea font-bold ${size === "large" ? "text-base" : "text-sm"}`}>$12.20</span>
      </div>
      <div className={`flex items-center justify-between bg-muted/50 rounded-lg ${size === "large" ? "p-3" : "p-2"}`}>
        <span className={`text-label font-medium ${size === "large" ? "text-sm" : "text-xs"}`}>/about</span>
        <span className={`text-secondary-label font-bold ${size === "large" ? "text-base" : "text-sm"}`}>$0.50</span>
      </div>
    </div>
    <div className={`text-secondary-label text-center pt-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
      MDP-calculated state values
    </div>
  </div>
);

const GoldenPathMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-card border border-border rounded-xl shadow-lg space-y-4 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
    <div className="flex items-center justify-between mb-2">
      <h4 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Top Conversion Paths</h4>
      <Zap className={`text-primary ${size === "large" ? "w-5 h-5" : "w-4 h-4"}`} />
    </div>
    <div className="space-y-3">
      <div className={`bg-primary/10 border-2 border-primary/30 rounded-lg ${size === "large" ? "p-4" : "p-3"} relative`}>
        <div className="absolute top-2 right-2">
          <span className={`bg-primary text-white px-2 py-0.5 rounded-full font-bold ${size === "large" ? "text-xs" : "text-[10px]"}`}>GOLDEN</span>
        </div>
        <div className={`text-secondary-label mb-2 ${size === "large" ? "text-sm" : "text-xs"}`}>Path 1</div>
        <div className={`flex items-center gap-2 mb-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
          <span className="text-label font-medium">Blog</span>
          <span className="text-secondary-label">→</span>
          <span className="text-label font-medium">Webinar</span>
          <span className="text-secondary-label">→</span>
          <span className="text-label font-medium">Demo</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Conv. Rate</span>
          <span className={`font-bold text-primary ${size === "large" ? "text-lg" : "text-base"}`}>68%</span>
        </div>
      </div>
      <div className={`bg-muted/50 rounded-lg ${size === "large" ? "p-4" : "p-3"}`}>
        <div className={`text-secondary-label mb-2 ${size === "large" ? "text-sm" : "text-xs"}`}>Path 2</div>
        <div className={`flex items-center gap-2 mb-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
          <span className="text-label font-medium">LinkedIn</span>
          <span className="text-secondary-label">→</span>
          <span className="text-label font-medium">Pricing</span>
          <span className="text-secondary-label">→</span>
          <span className="text-label font-medium">Trial</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Conv. Rate</span>
          <span className={`font-bold text-label ${size === "large" ? "text-lg" : "text-base"}`}>52%</span>
        </div>
      </div>
      <div className={`bg-muted/50 rounded-lg ${size === "large" ? "p-4" : "p-3"}`}>
        <div className={`text-secondary-label mb-2 ${size === "large" ? "text-sm" : "text-xs"}`}>Path 3</div>
        <div className={`flex items-center gap-2 mb-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
          <span className="text-label font-medium">Search</span>
          <span className="text-secondary-label">→</span>
          <span className="text-label font-medium">Blog</span>
          <span className="text-secondary-label">→</span>
          <span className="text-label font-medium">Demo</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-secondary-label ${size === "large" ? "text-sm" : "text-xs"}`}>Conv. Rate</span>
          <span className={`font-bold text-label ${size === "large" ? "text-lg" : "text-base"}`}>45%</span>
        </div>
      </div>
    </div>
    <div className={`text-secondary-label text-center pt-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
      Pareto-optimized paths
    </div>
  </div>
);
