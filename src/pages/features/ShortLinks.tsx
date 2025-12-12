import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { URLShortenerBasic } from "@/components/url-shortener/URLShortenerBasic";
import { motion } from "framer-motion";
import { 
  Link2, 
  Shield, 
  Eye, 
  Clock, 
  Edit3, 
  User, 
  Globe, 
  QrCode, 
  BarChart3, 
  Lock,
  CheckCircle2,
  Zap,
  ArrowRight
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated visual for carousel cards
const LinkPreviewVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="8" width="100" height="44" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
    <motion.rect x="18" y="16" width="40" height="6" rx="3" fill="rgba(255,255,255,0.3)"
      initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.2, duration: 0.4 }} />
    <motion.rect x="18" y="26" width="70" height="4" rx="2" fill="rgba(255,255,255,0.15)"
      initial={{ width: 0 }} animate={{ width: 70 }} transition={{ delay: 0.3, duration: 0.4 }} />
    <motion.rect x="18" y="34" width="55" height="4" rx="2" fill="rgba(255,255,255,0.15)"
      initial={{ width: 0 }} animate={{ width: 55 }} transition={{ delay: 0.4, duration: 0.4 }} />
    <motion.circle cx="100" cy="20" r="6" fill="rgba(74,222,128,0.3)" stroke="rgba(74,222,128,0.6)" strokeWidth="1"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} />
    <motion.path d="M97,20 L99,22 L103,18" stroke="rgba(74,222,128,0.9)" strokeWidth="1.5" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
  </svg>
);

const SecurityBadgeVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.path 
      d="M60,8 L90,18 L90,35 C90,45 75,52 60,55 C45,52 30,45 30,35 L30,18 Z" 
      fill="rgba(255,255,255,0.05)" 
      stroke="rgba(255,255,255,0.2)" 
      strokeWidth="1"
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
    />
    <motion.circle cx="60" cy="32" r="8" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.5)" strokeWidth="1"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path d="M56,32 L59,35 L65,29" stroke="rgba(74,222,128,0.9)" strokeWidth="2" fill="none" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.4 }} />
  </svg>
);

const CustomDomainVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="15" y="20" width="90" height="20" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
    <motion.text x="22" y="34" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="ui-monospace"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      acme.co/
    </motion.text>
    <motion.text x="58" y="34" fill="rgba(255,255,255,0.9)" fontSize="10" fontFamily="ui-monospace" fontWeight="bold"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      summer-sale
    </motion.text>
  </svg>
);

const AnalyticsVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.rect
        key={i}
        x={20 + i * 18}
        y={50 - (15 + i * 6)}
        width="12"
        height={15 + i * 6}
        rx="2"
        fill={`rgba(255,255,255,${0.15 + i * 0.12})`}
        initial={{ height: 0, y: 50 }}
        animate={{ height: 15 + i * 6, y: 50 - (15 + i * 6) }}
        transition={{ delay: 0.1 * i, duration: 0.5, ease: appleEase }}
      />
    ))}
    <motion.path 
      d="M20,42 Q40,35 55,28 T90,15" 
      fill="none" 
      stroke="rgba(255,255,255,0.4)" 
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }} 
      animate={{ pathLength: 1 }} 
      transition={{ delay: 0.5, duration: 0.8 }}
    />
  </svg>
);

const QRVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      {/* QR pattern */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={40 + col * 10}
            y={12 + row * 10}
            width="8"
            height="8"
            rx="1"
            fill={Math.random() > 0.3 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
          />
        ))
      )}
    </motion.g>
    <motion.circle 
      cx="60" cy="32" r="6" 
      fill="rgba(255,255,255,0.9)"
      initial={{ scale: 0 }} 
      animate={{ scale: 1 }} 
      transition={{ delay: 0.3, type: "spring" }}
    />
  </svg>
);

const ExpirationVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.circle cx="60" cy="30" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
    <motion.circle 
      cx="60" cy="30" r="22" 
      fill="none" 
      stroke="rgba(255,255,255,0.5)" 
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="138"
      initial={{ strokeDashoffset: 138 }}
      animate={{ strokeDashoffset: 45 }}
      transition={{ duration: 1.5, ease: appleEase }}
    />
    <motion.line x1="60" y1="30" x2="60" y2="18" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
    <motion.line x1="60" y1="30" x2="70" y2="35" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
  </svg>
);

const carouselItems = [
  {
    icon: Eye,
    title: "destination preview",
    description: "show users exactly where they're going before they click. builds trust instantly.",
    visual: <LinkPreviewVisual />,
  },
  {
    icon: Shield,
    title: "security scan badge",
    description: "every link shows its security status—scanned & safe, ssl secured, or pending review.",
    visual: <SecurityBadgeVisual />,
  },
  {
    icon: Globe,
    title: "custom domains",
    description: "use your own branded domains. acme.co/promo feels more trustworthy than bit.ly/x7k9z.",
    visual: <CustomDomainVisual />,
  },
  {
    icon: BarChart3,
    title: "real-time analytics",
    description: "track clicks, devices, locations, and referrers. know what's working in real time.",
    visual: <AnalyticsVisual />,
  },
  {
    icon: QrCode,
    title: "auto qr generation",
    description: "every short link gets a branded qr code automatically. no extra steps.",
    visual: <QRVisual />,
  },
  {
    icon: Clock,
    title: "expiration control",
    description: "set links to expire after a date or click count. perfect for limited-time campaigns.",
    visual: <ExpirationVisual />,
  },
  {
    icon: Edit3,
    title: "edit history",
    description: "full audit trail of every change. know who modified what and when.",
    visual: <LinkPreviewVisual />,
  },
  {
    icon: User,
    title: "link ownership",
    description: "assign links to team members. clear accountability and organized management.",
    visual: <SecurityBadgeVisual />,
  },
];

const stats = [
  { value: "99.99%", label: "uptime guarantee" },
  { value: "<50ms", label: "redirect latency" },
  { value: "2B+", label: "links shortened" },
  { value: "180+", label: "countries served" },
];

const beforeAfterItems = [
  { feature: "URL clarity", before: "bit.ly/3x7Kz9", after: "acme.co/summer-sale" },
  { feature: "User trust", before: "suspicious, hesitant", after: "confident clicking" },
  { feature: "Brand presence", before: "generic shortener", after: "your domain" },
  { feature: "Destination visibility", before: "unknown until click", after: "preview available" },
  { feature: "Security status", before: "no indication", after: "scanned & verified" },
];

const capabilities = [
  {
    id: "custom-domains",
    title: "Custom Domains",
    icon: Globe,
    features: ["Use your own branded domains", "Unlimited domain connections", "SSL auto-provisioning", "Domain health monitoring"],
    href: "/features/custom-domains",
  },
  {
    id: "semantic-slugs",
    title: "Semantic Slugs",
    icon: Edit3,
    features: ["Meaningful, readable paths", "Auto-slug suggestions", "Collision detection", "Reserved slug protection"],
  },
  {
    id: "link-preview",
    title: "Link Preview",
    icon: Eye,
    features: ["Destination preview cards", "Favicon extraction", "Page title display", "Open Graph data"],
  },
  {
    id: "security",
    title: "Security & Trust",
    icon: Shield,
    features: ["Malware scanning", "SSL verification", "Safe browsing check", "Verified owner badge"],
  },
  {
    id: "expiration",
    title: "Expiration Control",
    icon: Clock,
    features: ["Date-based expiry", "Click count limits", "Password protection", "Custom expired pages"],
  },
  {
    id: "analytics",
    title: "Full Analytics",
    icon: BarChart3,
    features: ["Real-time click tracking", "Geographic breakdown", "Device & browser stats", "Referrer analysis"],
    href: "/features/analytics",
  },
];

const ShortLinks = () => {
  return (
    <FeatureLayout
      title="Short Links That Work Everywhere - utm.one"
      description="Create clean, branded, permanent links that feel safe to click and simple to share. Custom domains, security badges, and full analytics included."
      canonical="https://utm.one/features/short-links"
      keywords={["short links", "url shortener", "branded links", "link management", "custom domains"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Short Links", url: "https://utm.one/features/short-links" },
      ]}
    >
      {/* Fold 1: Hero with Interactive Tool */}
      <FeatureHeroWithTool
        headlineLine1="links that work"
        headlineLine2="harder than you."
        subheadline="create short links with custom domains, security badges, and full analytics. every click tracked, every destination trusted."
        toolComponent={<URLShortenerBasic />}
      />

      {/* Fold 2: Feature Carousel with Subtle Pagination */}
      <FeatureCarouselSection
        headline="8 ways to make every link count"
        subheadline="each feature designed to increase trust and drive more clicks"
        items={carouselItems}
      />

      {/* Fold 3: Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Fold 4: Before/After Comparison */}
      <FeatureBeforeAfter
        headline="before vs. after utm.one"
        subheadline="transform how people perceive your links"
        items={beforeAfterItems}
      />

      {/* Fold 5: Animated Showcase */}
      <FeatureShowcase
        headline="see it in action"
        subheadline="hover over any short link to see the magic"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Before */}
          <motion.div 
            className="p-6 rounded-xl border border-destructive/30 bg-destructive/5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: appleEase }}
          >
            <div className="text-xs uppercase text-destructive font-medium tracking-wider mb-4">generic shortener</div>
            <div className="font-mono text-lg text-foreground mb-4">bit.ly/3x7Kz9</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><span className="text-destructive">✗</span> Where does this go?</p>
              <p className="flex items-center gap-2"><span className="text-destructive">✗</span> Is it safe to click?</p>
              <p className="flex items-center gap-2"><span className="text-destructive">✗</span> Who created it?</p>
              <p className="flex items-center gap-2"><span className="text-destructive">✗</span> No brand presence</p>
            </div>
          </motion.div>

          {/* After */}
          <motion.div 
            className="p-6 rounded-xl border border-primary/30 bg-primary/5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: appleEase }}
          >
            <div className="text-xs uppercase text-primary font-medium tracking-wider mb-4">utm.one short link</div>
            <div className="font-mono text-lg text-foreground mb-4">acme.co/summer-sale</div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-4 h-4 text-primary" /> Clear destination visible</p>
              <p className="flex items-center gap-2 text-foreground"><Shield className="w-4 h-4 text-primary" /> Scanned & verified safe</p>
              <p className="flex items-center gap-2 text-foreground"><User className="w-4 h-4 text-primary" /> Created by marketing team</p>
              <p className="flex items-center gap-2 text-foreground"><Zap className="w-4 h-4 text-primary" /> Full analytics tracking</p>
            </div>
          </motion.div>
        </div>
      </FeatureShowcase>

      {/* Fold 6: Capability Pillars */}
      <FeatureBentoGrid
        headline="everything you need, nothing you don't"
        subheadline="each capability designed for simplicity and power"
        capabilities={capabilities}
      />

      {/* Fold 7: Final CTA */}
      <FeatureFinalCTA
        headline="ready to create better links?"
        subheadline="join teams who build trust with every click."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "book a demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
};

export default ShortLinks;
