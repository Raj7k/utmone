import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Globe, Shield, TrendingUp, Zap, AlertCircle } from "lucide-react";

interface ProductMockupProps {
  type: "browser" | "utm" | "security" | "analytics" | "governance" | "dashboard" | "geo-map" | "qr-customizer" | "validation";
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
    </motion.div>
  );
};

const BrowserMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-white rounded-2xl border border-border shadow-lg overflow-hidden ${size === "large" ? "scale-125" : ""}`}>
    {/* Browser Chrome */}
    <div className={`bg-muted/30 border-b border-border flex items-center gap-2 ${size === "large" ? "px-6 py-4" : "px-4 py-3"}`}>
      <div className="flex gap-2">
        <div className={`rounded-full bg-red-500 ${size === "large" ? "w-4 h-4" : "w-3 h-3"}`} />
        <div className={`rounded-full bg-yellow-500 ${size === "large" ? "w-4 h-4" : "w-3 h-3"}`} />
        <div className={`rounded-full bg-green-500 ${size === "large" ? "w-4 h-4" : "w-3 h-3"}`} />
      </div>
      <div className={`flex-1 ml-4 bg-white rounded-md px-4 text-secondary-label font-mono ${size === "large" ? "py-2 text-base" : "py-1.5 text-sm"}`}>
        utm.one/webinar
      </div>
    </div>
    {/* Content */}
    <div className={`space-y-3 ${size === "large" ? "p-12" : "p-8"}`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-primary/10 flex items-center justify-center ${size === "large" ? "w-14 h-14" : "w-10 h-10"}`}>
          <span className={`text-primary font-bold ${size === "large" ? "text-xl" : "text-base"}`}>✓</span>
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
  <div className={`bg-white rounded-2xl border border-border shadow-lg space-y-3 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
    <div className="flex items-center justify-between">
      <h3 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>UTM Parameters</h3>
      <div className={`text-green-600 bg-green-50 px-2 py-1 rounded-full ${size === "large" ? "text-sm" : "text-xs"}`}>✓ Valid</div>
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
  <div className={`bg-white rounded-2xl border border-border shadow-lg space-y-4 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
    <h3 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Security Status</h3>
    <div className="grid grid-cols-2 gap-3">
      <div className={`bg-green-50 rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>🔒</div>
        <div className={`font-semibold text-green-700 ${size === "large" ? "text-sm" : "text-xs"}`}>SSL Secured</div>
      </div>
      <div className={`bg-green-50 rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>✓</div>
        <div className={`font-semibold text-green-700 ${size === "large" ? "text-sm" : "text-xs"}`}>Scanned</div>
      </div>
      <div className={`bg-green-50 rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>🛡️</div>
        <div className={`font-semibold text-green-700 ${size === "large" ? "text-sm" : "text-xs"}`}>No Malware</div>
      </div>
      <div className={`bg-green-50 rounded-lg text-center ${size === "large" ? "p-4" : "p-3"}`}>
        <div className={`mb-1 ${size === "large" ? "text-3xl" : "text-2xl"}`}>✅</div>
        <div className={`font-semibold text-green-700 ${size === "large" ? "text-sm" : "text-xs"}`}>Verified</div>
      </div>
    </div>
    <div className={`text-secondary-label text-center pt-2 ${size === "large" ? "text-sm" : "text-xs"}`}>
      Real-time security scanning
    </div>
  </div>
);

const AnalyticsMiniDash = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-white rounded-2xl border border-border shadow-lg space-y-4 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
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
          className="flex-1 bg-primary rounded-t"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
    <div className={`text-secondary-label text-center ${size === "large" ? "text-sm" : "text-xs"}`}>Full funnel visibility</div>
  </div>
);

const GovernanceCard = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className={`bg-white rounded-2xl border border-border shadow-lg space-y-3 ${size === "large" ? "p-10 scale-125" : "p-6"}`}>
    <h3 className={`font-semibold text-label ${size === "large" ? "text-base" : "text-sm"}`}>Audit Log</h3>
    <div className="space-y-2">
      <div className={`flex items-center gap-3 pb-2 border-b border-border ${size === "large" ? "text-sm" : "text-xs"}`}>
        <div className={`rounded-full bg-primary/10 flex items-center justify-center ${size === "large" ? "w-10 h-10" : "w-8 h-8"}`}>
          <span className={`font-bold text-primary ${size === "large" ? "text-sm" : "text-xs"}`}>JD</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-label">Created link</div>
          <div className="text-secondary-label">utm.one/webinar</div>
        </div>
        <div className="text-secondary-label">2m ago</div>
      </div>
      <div className={`flex items-center gap-3 pb-2 border-b border-border ${size === "large" ? "text-sm" : "text-xs"}`}>
        <div className={`rounded-full bg-primary/10 flex items-center justify-center ${size === "large" ? "w-10 h-10" : "w-8 h-8"}`}>
          <span className={`font-bold text-primary ${size === "large" ? "text-sm" : "text-xs"}`}>SK</span>
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
      <BarChart3 className="w-4 h-4 text-primary" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-primary/5 rounded-lg p-4">
        <p className="text-xs text-secondary-label mb-1">Total Clicks</p>
        <p className="text-2xl font-bold text-primary">2,847</p>
        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
          <TrendingUp className="w-3 h-3" />
          <span>+18%</span>
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-xs text-secondary-label mb-1">Conversions</p>
        <p className="text-2xl font-bold text-label">127</p>
        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
          <TrendingUp className="w-3 h-3" />
          <span>+23%</span>
        </div>
      </div>
    </div>
    <div className="h-24 bg-muted/30 rounded-lg flex items-end gap-1 p-2">
      {[40, 65, 55, 80, 45, 90, 70].map((height, i) => (
        <div key={i} className="flex-1 bg-primary/30 rounded-t" style={{ height: `${height}%` }} />
      ))}
    </div>
  </div>
);

const GeoMapMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Globe className="w-4 h-4 text-primary" />
      <h4 className="text-sm font-semibold text-label">Geo-Targeting Rules</h4>
    </div>
    <div className="space-y-3">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          <span className="text-sm font-semibold text-label">United States</span>
        </div>
        <CheckCircle2 className="w-4 h-4 text-primary" />
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
      <div className="w-40 h-40 bg-white rounded-lg border-2 border-primary/20 flex items-center justify-center">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-primary' : 'bg-white'} rounded-sm`} />
          ))}
        </div>
      </div>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary-label">Brand Colors</span>
          <CheckCircle2 className="w-3 h-3 text-green-600" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-secondary-label">Logo</span>
          <CheckCircle2 className="w-3 h-3 text-green-600" />
        </div>
      </div>
    </div>
  </div>
);

const ValidationMockup = ({ size = "default" }: { size?: "default" | "large" }) => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-3">
    <h4 className="text-sm font-semibold text-label mb-4">Real-Time Validation</h4>
    <div className="space-y-2">
      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-green-800 dark:text-green-200">utm_source</p>
          <p className="text-xs text-green-600 dark:text-green-400 font-mono">google</p>
        </div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-green-800 dark:text-green-200">utm_medium</p>
          <p className="text-xs text-green-600 dark:text-green-400 font-mono">cpc</p>
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
