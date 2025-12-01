import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductMockupProps {
  type: "browser" | "utm" | "security" | "analytics" | "governance";
  delay?: number;
}

export const ProductMockup = ({ type, delay = 0 }: ProductMockupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      {type === "browser" && <BrowserMockup />}
      {type === "utm" && <UTMParameterCard />}
      {type === "security" && <SecurityBadgeCard />}
      {type === "analytics" && <AnalyticsMiniDash />}
      {type === "governance" && <GovernanceCard />}
    </motion.div>
  );
};

const BrowserMockup = () => (
  <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
    {/* Browser Chrome */}
    <div className="bg-muted/30 border-b border-border px-4 py-3 flex items-center gap-2">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="flex-1 ml-4 bg-white rounded-md px-4 py-1.5 text-sm text-secondary-label font-mono">
        utm.one/webinar
      </div>
    </div>
    {/* Content */}
    <div className="p-8 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold">✓</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-label">Clean, Readable URL</div>
          <div className="text-xs text-secondary-label">utm.one/webinar</div>
        </div>
      </div>
      <div className="text-xs text-secondary-label bg-muted/20 rounded-lg p-3">
        vs. bit.ly/3xK9pQ2m
      </div>
    </div>
  </div>
);

const UTMParameterCard = () => (
  <div className="bg-white rounded-2xl border border-border shadow-lg p-6 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-label">UTM Parameters</h3>
      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ Valid</div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-secondary-label">utm_source</span>
        <span className="text-label font-mono">linkedin</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-secondary-label">utm_medium</span>
        <span className="text-label font-mono">paid</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-secondary-label">utm_campaign</span>
        <span className="text-label font-mono">q1-webinar</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-secondary-label">utm_content</span>
        <span className="text-label font-mono">hero-cta</span>
      </div>
    </div>
    <div className="pt-2 border-t border-border">
      <div className="text-xs text-secondary-label">Enforced naming rules ✓</div>
    </div>
  </div>
);

const SecurityBadgeCard = () => (
  <div className="bg-white rounded-2xl border border-border shadow-lg p-6 space-y-4">
    <h3 className="text-sm font-semibold text-label">Security Status</h3>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-green-50 rounded-lg p-3 text-center">
        <div className="text-2xl mb-1">🔒</div>
        <div className="text-xs font-semibold text-green-700">SSL Secured</div>
      </div>
      <div className="bg-green-50 rounded-lg p-3 text-center">
        <div className="text-2xl mb-1">✓</div>
        <div className="text-xs font-semibold text-green-700">Scanned</div>
      </div>
      <div className="bg-green-50 rounded-lg p-3 text-center">
        <div className="text-2xl mb-1">🛡️</div>
        <div className="text-xs font-semibold text-green-700">No Malware</div>
      </div>
      <div className="bg-green-50 rounded-lg p-3 text-center">
        <div className="text-2xl mb-1">✅</div>
        <div className="text-xs font-semibold text-green-700">Verified</div>
      </div>
    </div>
    <div className="text-xs text-secondary-label text-center pt-2">
      Real-time security scanning
    </div>
  </div>
);

const AnalyticsMiniDash = () => (
  <div className="bg-white rounded-2xl border border-border shadow-lg p-6 space-y-4">
    <h3 className="text-sm font-semibold text-label">Analytics</h3>
    <div className="grid grid-cols-3 gap-3">
      <div className="space-y-1">
        <div className="text-xs text-secondary-label">Clicks</div>
        <div className="text-2xl font-bold text-label">1,247</div>
      </div>
      <div className="space-y-1">
        <div className="text-xs text-secondary-label">Devices</div>
        <div className="text-2xl font-bold text-label">892</div>
      </div>
      <div className="space-y-1">
        <div className="text-xs text-secondary-label">Rate</div>
        <div className="text-2xl font-bold text-label">71%</div>
      </div>
    </div>
    {/* Mini Chart */}
    <div className="h-20 flex items-end gap-1">
      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-primary rounded-t"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
    <div className="text-xs text-secondary-label text-center">Full funnel visibility</div>
  </div>
);

const GovernanceCard = () => (
  <div className="bg-white rounded-2xl border border-border shadow-lg p-6 space-y-3">
    <h3 className="text-sm font-semibold text-label">Audit Log</h3>
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-xs pb-2 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">JD</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-label">Created link</div>
          <div className="text-secondary-label">utm.one/webinar</div>
        </div>
        <div className="text-secondary-label">2m ago</div>
      </div>
      <div className="flex items-center gap-3 text-xs pb-2 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">SK</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-label">Updated UTMs</div>
          <div className="text-secondary-label">utm.one/demo</div>
        </div>
        <div className="text-secondary-label">5m ago</div>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">MH</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-label">Generated QR</div>
          <div className="text-secondary-label">utm.one/event</div>
        </div>
        <div className="text-secondary-label">12m ago</div>
      </div>
    </div>
    <div className="text-xs text-secondary-label text-center pt-2">
      Full traceability
    </div>
  </div>
);
