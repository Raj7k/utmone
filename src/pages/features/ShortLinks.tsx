import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureControlDeck } from "@/components/features/FeatureControlDeck";
import { URLShortenerBasic } from "@/components/url-shortener/URLShortenerBasic";
import { 
  CustomDomainVisual, 
  SecurityShieldVisual, 
  AnalyticsChartVisual, 
  QRCodeVisual, 
  ExpirationClockVisual 
} from "@/components/features/visuals/FeatureVisuals";
import {
  AILinkOptimizerVisual,
  LinkHealthMonitorVisual,
  SmartRedirectVisual,
  ClickFraudShieldVisual,
  DeepLinkVisual,
  ABLinkTestVisual,
  QRScanAnalyticsVisual,
  DynamicQRRedirectVisual,
  QRBrandStudioVisual,
} from "@/components/features/visuals/EnhancedFeatureVisuals";
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
  ArrowRight,
  Sparkles,
  Activity,
  Route,
  Bot,
  Smartphone,
  FlaskConical,
  Brain,
  ShieldCheck,
  ScanLine,
  RefreshCw,
  Palette
} from "lucide-react";

const controlDeckTabs = [
  // Original 5 features
  {
    id: "domains",
    icon: Globe,
    label: "custom domains",
    headline: "your brand, your links.",
    subheadline: "use your own domain for every short link. acme.co/promo builds more trust than generic shorteners.",
    visual: <CustomDomainVisual />,
  },
  {
    id: "security",
    icon: Shield,
    label: "security badges",
    headline: "scanned & verified.",
    subheadline: "every link shows its security status—malware scanned, ssl verified, safe to click.",
    visual: <SecurityShieldVisual />,
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "real-time analytics",
    headline: "know what's working.",
    subheadline: "track clicks, devices, locations, and referrers in real-time. no waiting for data.",
    visual: <AnalyticsChartVisual />,
  },
  {
    id: "qr",
    icon: QrCode,
    label: "instant QR codes",
    headline: "every link gets a QR.",
    subheadline: "branded QR codes generated automatically. download, share, print—no extra steps.",
    visual: <QRCodeVisual />,
  },
  {
    id: "expiration",
    icon: Clock,
    label: "expiration control",
    headline: "time-limited campaigns.",
    subheadline: "set links to expire after a date or click count. perfect for flash sales and promos.",
    visual: <ExpirationClockVisual />,
  },
  // 6 New features
  {
    id: "ai-optimizer",
    icon: Sparkles,
    label: "AI link optimizer",
    headline: "smarter slugs, better clicks.",
    subheadline: "AI analyzes your destination and suggests slugs that match human intent. more clicks, less guesswork.",
    visual: <AILinkOptimizerVisual />,
  },
  {
    id: "health-monitor",
    icon: Activity,
    label: "link health monitor",
    headline: "know before they break.",
    subheadline: "real-time health scores for every link. catch 404s, SSL issues, and slowdowns before users do.",
    visual: <LinkHealthMonitorVisual />,
  },
  {
    id: "smart-redirect",
    icon: Route,
    label: "smart redirect engine",
    headline: "one link, infinite destinations.",
    subheadline: "route users by device, location, or time. iOS users go to App Store, Android to Play Store—automatically.",
    visual: <SmartRedirectVisual />,
  },
  {
    id: "fraud-shield",
    icon: ShieldCheck,
    label: "click fraud shield",
    headline: "bots filtered. humans counted.",
    subheadline: "machine learning identifies and filters fake clicks. your analytics show real engagement only.",
    visual: <ClickFraudShieldVisual />,
  },
  {
    id: "deep-link",
    icon: Smartphone,
    label: "deep link intelligence",
    headline: "into the app, not around it.",
    subheadline: "seamless app deep linking with web fallbacks. users land exactly where they should.",
    visual: <DeepLinkVisual />,
  },
  {
    id: "ab-testing",
    icon: FlaskConical,
    label: "A/B link testing",
    headline: "test before you commit.",
    subheadline: "split traffic between destinations. see which landing page converts better—with statistical confidence.",
    visual: <ABLinkTestVisual />,
  },
  // QR Code Features
  {
    id: "qr-analytics",
    icon: ScanLine,
    label: "QR scan analytics",
    headline: "every scan tells a story.",
    subheadline: "track who scanned, when, where, and what device they used. full attribution from physical to digital.",
    visual: <QRScanAnalyticsVisual />,
  },
  {
    id: "dynamic-qr",
    icon: RefreshCw,
    label: "dynamic QR redirect",
    headline: "print once. redirect forever.",
    subheadline: "change the destination without reprinting. update campaigns instantly.",
    visual: <DynamicQRRedirectVisual />,
  },
  {
    id: "qr-brand",
    icon: Palette,
    label: "QR brand studio",
    headline: "your logo. your colors. your QR.",
    subheadline: "full customization with colors, shapes, and embedded logos. scannable and beautiful.",
    visual: <QRBrandStudioVisual />,
  },
];

// Carousel visuals
const LinkPreviewVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="8" width="100" height="44" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
    <motion.rect x="18" y="16" width="40" height="6" rx="3" fill="rgba(255,255,255,0.3)"
      initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.2, duration: 0.4 }} />
    <motion.circle cx="100" cy="20" r="6" fill="rgba(74,222,128,0.3)" stroke="rgba(74,222,128,0.6)" strokeWidth="1"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} />
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
    <motion.circle cx="60" cy="32" r="8" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.5)" strokeWidth="1" />
  </svg>
);

const HealthScoreVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="15" y="15" width="90" height="30" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
    <motion.rect x="20" y="25" width="60" height="10" rx="5" fill="rgba(74,222,128,0.3)"
      initial={{ width: 0 }} animate={{ width: 60 }} transition={{ duration: 0.8 }} />
    <motion.circle cx="95" cy="30" r="8" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.5)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
  </svg>
);

const FraudFilterVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.path d="M20,30 L50,30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    <motion.rect x="50" y="20" width="20" height="20" rx="4" fill="rgba(255,255,255,0.1)" stroke="hsl(var(--primary))" />
    <motion.path d="M70,30 L100,30" stroke="rgba(74,222,128,0.5)" strokeWidth="2" />
    <motion.circle cx="15" cy="30" r="4" fill="rgba(248,113,113,0.5)"
      initial={{ x: 0 }} animate={{ x: 35, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} />
    <motion.circle cx="15" cy="30" r="4" fill="rgba(74,222,128,0.5)"
      initial={{ x: 0 }} animate={{ x: 85 }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
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
    description: "every link shows its security status—scanned & safe, SSL secured, or pending review.",
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
    visual: <LinkPreviewVisual />,
  },
  {
    icon: QrCode,
    title: "auto QR generation",
    description: "every short link gets a branded QR code automatically. no extra steps.",
    visual: <SecurityBadgeVisual />,
  },
  {
    icon: Clock,
    title: "expiration control",
    description: "set links to expire after a date or click count. perfect for limited-time campaigns.",
    visual: <LinkPreviewVisual />,
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
  // 4 New carousel items
  {
    icon: Activity,
    title: "link health scores",
    description: "proactive monitoring catches issues before your audience does. SSL, uptime, speed—all tracked.",
    visual: <HealthScoreVisual />,
  },
  {
    icon: ShieldCheck,
    title: "fraud protection",
    description: "ML-powered filtering removes bots from your analytics. see only real human engagement.",
    visual: <FraudFilterVisual />,
  },
  {
    icon: Route,
    title: "smart routing",
    description: "device-aware redirects send users to the right destination. iOS, Android, desktop—handled.",
    visual: <LinkPreviewVisual />,
  },
  {
    icon: FlaskConical,
    title: "A/B testing",
    description: "statistically significant split tests for landing pages. know which page wins with confidence.",
    visual: <SecurityBadgeVisual />,
  },
];

const stats = [
  { value: "99.99%", label: "uptime SLA" },
  { value: "<50ms", label: "redirect latency" },
  { value: "0", label: "broken links undetected" },
  { value: "98.7%", label: "bot detection accuracy" },
];

const beforeAfterItems = [
  { feature: "URL clarity", before: "bit.ly/3x7Kz9", after: "acme.co/summer-sale" },
  { feature: "User trust", before: "suspicious, hesitant", after: "confident clicking" },
  { feature: "Link intelligence", before: "static redirect", after: "AI-optimized routing" },
  { feature: "Health monitoring", before: "find out when users complain", after: "proactive alerts before issues" },
  { feature: "Click quality", before: "bots inflate numbers", after: "98.7% human-verified clicks" },
  { feature: "Testing", before: "guess which page wins", after: "statistical confidence" },
  { feature: "Deep links", before: "broken app experiences", after: "seamless app-to-web fallback" },
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
  // 2 New capability cards
  {
    id: "ai-intelligence",
    title: "AI Intelligence",
    icon: Brain,
    features: ["Smart slug suggestions", "Click prediction", "Optimal timing", "Performance forecasting"],
  },
  {
    id: "fraud-protection",
    title: "Fraud Protection",
    icon: ShieldCheck,
    features: ["Bot detection", "Click verification", "IP reputation", "Traffic quality scores"],
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
        headlineLine1="every click"
        headlineLine2="builds trust."
        subheadline="generic links feel suspicious. branded links feel intentional. utm.one makes every click feel safe—with security badges, destination previews, and invisible intelligence."
        toolComponent={<URLShortenerBasic />}
      />

      {/* Fold 2: Control Deck */}
      <FeatureControlDeck
        tabs={controlDeckTabs}
        badge={{ title: "Enterprise Ready", subtitle: "unlimited custom domains" }}
      />

      {/* Fold 3: Feature Carousel with Subtle Pagination */}
      <FeatureCarouselSection
        headline="12 ways to make every link count"
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
