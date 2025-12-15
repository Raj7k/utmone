import {
  GoogleIcon,
  LinkedInIcon,
  FacebookIcon,
  TwitterIcon,
  MetaIcon,
  HubSpotIcon,
  SalesforceIcon,
  SlackIcon,
  ZoomIcon,
  YouTubeIcon,
  InstagramIcon,
  SpotifyIcon,
  TikTokIcon,
  PinterestIcon,
  WhatsAppIcon,
  TelegramIcon,
} from "@/components/icons/SocialIcons";
import { Mail, Users, Share2 } from "lucide-react";

export interface BrandConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  name: string;
}

export const BRAND_REGISTRY: Record<string, BrandConfig> = {
  linkedin: { icon: LinkedInIcon, color: "#0A66C2", name: "LinkedIn" },
  google: { icon: GoogleIcon, color: "#4285F4", name: "Google" },
  "google-ads": { icon: GoogleIcon, color: "#4285F4", name: "Google Ads" },
  meta: { icon: MetaIcon, color: "#0668E1", name: "Meta" },
  facebook: { icon: FacebookIcon, color: "#1877F2", name: "Facebook" },
  twitter: { icon: TwitterIcon, color: "#000000", name: "X" },
  x: { icon: TwitterIcon, color: "#000000", name: "X" },
  hubspot: { icon: HubSpotIcon, color: "#FF7A59", name: "HubSpot" },
  salesforce: { icon: SalesforceIcon, color: "#00A1E0", name: "Salesforce" },
  slack: { icon: SlackIcon, color: "#4A154B", name: "Slack" },
  zoom: { icon: ZoomIcon, color: "#2D8CFF", name: "Zoom" },
  youtube: { icon: YouTubeIcon, color: "#FF0000", name: "YouTube" },
  instagram: { icon: InstagramIcon, color: "#E4405F", name: "Instagram" },
  spotify: { icon: SpotifyIcon, color: "#1DB954", name: "Spotify" },
  tiktok: { icon: TikTokIcon, color: "#000000", name: "TikTok" },
  pinterest: { icon: PinterestIcon, color: "#BD081C", name: "Pinterest" },
  whatsapp: { icon: WhatsAppIcon, color: "#25D366", name: "WhatsApp" },
  telegram: { icon: TelegramIcon, color: "#0088CC", name: "Telegram" },
  // Generic channels
  email: { icon: Mail, color: "#6366F1", name: "Email" },
  referral: { icon: Users, color: "#8B5CF6", name: "Referral" },
  organic: { icon: Share2, color: "#10B981", name: "Organic" },
};

export const getBrandConfig = (brand: string): BrandConfig | undefined => {
  return BRAND_REGISTRY[brand.toLowerCase()];
};

export const getBrandIcon = (brand: string) => {
  return BRAND_REGISTRY[brand.toLowerCase()]?.icon;
};

export const getBrandColor = (brand: string): string => {
  return BRAND_REGISTRY[brand.toLowerCase()]?.color || "#888888";
};
