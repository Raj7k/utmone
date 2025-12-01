import { ReactNode } from "react";
import { Route, Shield, Network, Zap, QrCode, CheckCircle, TrendingUp, BarChart3, Webhook, Database, Code2 } from "lucide-react";

export interface ProductFeature {
  icon: ReactNode;
  title: string;
  tagline: string;
  description: string;
  span?: string; // Grid span class
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductContent {
  title: string;
  subtitle: string;
  description: string;
  features: ProductFeature[];
  faqs: ProductFAQ[];
}

export const LINK_ORCHESTRATION: ProductContent = {
  title: "the first link manager with a self-healing immune system",
  subtitle: "control & reliability",
  description: "Stop losing revenue to broken links and generic routing. utm.one uses Contextual Bandit Algorithms to route every click to its optimal destination and automatically fixes 404s before your users see them.",
  features: [
    {
      icon: <Network className="h-12 w-12 text-primary" />,
      title: "contextual smart routing (LinUCB)",
      tagline: "The link that learns who you are.",
      description: "We don't just route randomly. Our Bandit Algorithms learn in real-time. If iOS users convert better on the App Store and Desktop users on the Web, we automatically split the traffic to maximize your revenue.",
      span: "md:col-span-8"
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "link immunity (robustness)",
      tagline: "Zero broken links. Guaranteed.",
      description: "Our Active Probe pings your destinations every hour. If a page goes down (404), we instantly reroute traffic to your Fallback URL so you never waste a click.",
      span: "md:col-span-4"
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "adaptive governance shield",
      tagline: "Security that adapts to your team.",
      description: "Forget static 'Admin' roles. Our Constraint-Based Permission Engine assigns the precise 'Least Privilege' access needed for each task. Plus, a forensic 'Time-Travel' Audit Log for SOC2 compliance.",
      span: "md:col-span-4"
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "50ms redirects",
      tagline: "Lightning fast.",
      description: "Edge-optimized routing ensures your users never wait. Sub-100ms server-side redirects with global CDN distribution.",
      span: "md:col-span-8"
    }
  ],
  faqs: [
    {
      question: "How does the 'Self-Healing' link work?",
      answer: "We use a 'Minimax' robust optimization approach. You define a primary URL and a 'Fallback' URL (like your homepage). Our edge nodes monitor the primary URL's health. If it fails (500/404), traffic is instantly shifted to the Fallback."
    },
    {
      question: "Can I use my own domain?",
      answer: "Yes. We support full custom domains (e.g., link.nike.com) with automatic SSL provisioning and HSTS enforcement."
    },
    {
      question: "What is LinUCB?",
      answer: "LinUCB is a Contextual Bandit algorithm that learns from user behavior patterns. It analyzes device type, location, and other signals to route each visitor to the destination where they're most likely to convert."
    }
  ]
};

export const JOURNEY_INTELLIGENCE: ProductContent = {
  title: "stop tracking clicks. start engineering journeys.",
  subtitle: "truth & revenue",
  description: "Most tools lie to you with 'Last Click' attribution. We use Bayesian Inference and Identity Stitching to reveal the true causal impact of every channel—from the first anonymous blog read to the final signed contract.",
  features: [
    {
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      title: "bayesian attribution graph",
      tagline: "See the invisible influence.",
      description: "We model your customer journey as a Probabilistic Graph. Discover that while Google Search gets the credit, your 'boring' whitepaper actually increased the probability of conversion by 300%.",
      span: "md:col-span-8"
    },
    {
      icon: <Network className="h-12 w-12 text-primary" />,
      title: "identity resolution (stitching)",
      tagline: "De-anonymize your traffic.",
      description: "Our Time-Travel Stitching engine remembers 'Anonymous Visitor 582' from 3 weeks ago. When they sign up today, we retroactively link their entire history to their real email.",
      span: "md:col-span-4"
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      title: "journey valuation (MDPs)",
      tagline: "Know the dollar value of every page.",
      description: "We calculate the Markov State Value ($V$) of every URL. Know instantly that your Pricing Page is worth $45.00 per visit, while your About Page is worth $0.50.",
      span: "md:col-span-4"
    },
    {
      icon: <Route className="h-12 w-12 text-primary" />,
      title: "golden path optimizer",
      tagline: "Find your most profitable route.",
      description: "Using Pareto Optimization, we analyze millions of paths to find the 'Efficient Frontier'—the specific sequence of touchpoints that yields the highest Lifetime Value in the shortest time.",
      span: "md:col-span-8"
    }
  ],
  faqs: [
    {
      question: "What attribution models do you use?",
      answer: "We move beyond simple 'Linear' or 'Time Decay' models. We use Causal Inference (Bayesian Networks) to calculate the 'Lift' or incremental value of each touchpoint."
    },
    {
      question: "Is Identity Resolution GDPR compliant?",
      answer: "Yes. We use first-party cookies only and stitch identities based on user-consented actions (like form fills). We never share identity graphs between customers."
    },
    {
      question: "How does cross-device tracking work?",
      answer: "We use a deterministic 'Identity Stitching' method. When a user identifies themselves (e.g., via a form fill or login) on a new device, we link that session's visitor_id to their global user_id, merging the journey graphs across mobile and desktop."
    }
  ]
};

export const QR_STUDIO: ProductContent = {
  title: "QR codes engineered for the real world",
  subtitle: "physical reliability",
  description: "Beautiful codes that actually scan. Our Reliability Architect mathematically guarantees scannability by optimizing contrast, density, and error correction in real-time.",
  features: [
    {
      icon: <QrCode className="h-12 w-12 text-primary" />,
      title: "the contrast solver",
      tagline: "Beautiful, yet readable.",
      description: "Don't guess if your brand colors will work. Our Constrained Optimization engine calculates the WCAG luminance ratio in real-time and auto-corrects your design to ensure it scans in low light.",
      span: "md:col-span-8"
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "dynamic retargeting",
      tagline: "Print once, update forever.",
      description: "You printed 10,000 flyers with the wrong link? No problem. Change the destination URL instantly from your dashboard without reprinting a single page.",
      span: "md:col-span-4"
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      title: "geo-fenced scan analytics",
      tagline: "Know exactly where your ads work.",
      description: "See a heatmap of every scan. Compare the performance of your 'New York Billboard' vs. your 'London Flyer' in real-time.",
      span: "md:col-span-4"
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "brand customization",
      tagline: "Your colors, your logo, your style.",
      description: "Customize colors, add your logo, choose module shapes, and add frame text. All while maintaining optimal scannability through our reliability checks.",
      span: "md:col-span-8"
    }
  ],
  faqs: [
    {
      question: "What happens if I print a complex logo in the middle?",
      answer: "Our 'Density Check' algorithm automatically raises the Error Correction Level (ECL) to 'High' (30% recovery), ensuring your code scans even if 30% of it is covered by your logo."
    },
    {
      question: "Can I change the destination after printing?",
      answer: "Yes! All QR codes are dynamic by default. Change the destination URL anytime from your dashboard without reprinting."
    },
    {
      question: "Do you support bulk QR generation?",
      answer: "Yes. Enterprise plans include bulk generation, templates, A/B testing, scan analytics, and white-label options."
    }
  ]
};

export const DATA_PIPELINE: ProductContent = {
  title: "your data, in your warehouse",
  subtitle: "freedom & scale",
  description: "Bypass the dashboard. Stream raw, granular click-stream data directly to your Snowflake, BigQuery, or S3 bucket. Built for teams that need to build their own models.",
  features: [
    {
      icon: <Webhook className="h-12 w-12 text-primary" />,
      title: "real-time webhooks",
      tagline: "Sub-second event streaming.",
      description: "Receive a JSON payload for every link.clicked, lead.identified, or qr.scanned event in < 200ms. Perfect for triggering instant sales alerts in Slack or HubSpot.",
      span: "md:col-span-8"
    },
    {
      icon: <Database className="h-12 w-12 text-primary" />,
      title: "warehouse sync (BYOD)",
      tagline: "Daily dumps to S3/Snowflake.",
      description: "We automatically batch and export your entire analytics_events table every night to your private S3 bucket in Apache Parquet or CSV format.",
      span: "md:col-span-4"
    },
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "adaptive rate limiting",
      tagline: "Scale without the crash.",
      description: "Our API gateway uses Adaptive Throttling based on system load. We guarantee 99.99% availability for enterprise keys even during traffic spikes.",
      span: "md:col-span-4"
    },
    {
      icon: <Code2 className="h-12 w-12 text-primary" />,
      title: "developer portal",
      tagline: "API keys, docs, SDKs.",
      description: "Complete REST API with SDKs for Python, Node.js, and Go. Interactive API explorer, comprehensive docs, and webhook simulators for testing.",
      span: "md:col-span-8"
    }
  ],
  faqs: [
    {
      question: "What is the data schema for the export?",
      answer: "We provide a flat JSON schema including visitor_id, timestamp, user_agent, geo_location, utm_parameters, and identity_id. Full schema documentation is available in the Developer Portal."
    },
    {
      question: "How fast are the webhooks?",
      answer: "We use an asynchronous queue (Edge Functions) to dispatch webhooks. 99% of events are delivered within 500ms of the user click."
    },
    {
      question: "Can I build custom dashboards?",
      answer: "Yes! Export your data to any BI tool (Tableau, Looker, Metabase) or build custom dashboards using our raw event stream."
    }
  ]
};
