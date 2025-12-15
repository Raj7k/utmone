import type { LinkPageBlockType } from "@/lib/linkPages";

export interface TemplateBlock {
  type: LinkPageBlockType;
  data: Record<string, unknown>;
}

export interface LinkPageTemplate {
  id: string;
  name: string;
  description: string;
  theme: string;
  blocks: TemplateBlock[];
  previewGradient: string;
}

export const LINK_PAGE_TEMPLATES: LinkPageTemplate[] = [
  {
    id: "creator",
    name: "Creator",
    description: "Perfect for influencers & content creators",
    theme: "gradient",
    previewGradient: "from-purple-500 to-pink-500",
    blocks: [
      { type: "header", data: { text: "Welcome to my page!", size: "h2" } },
      { type: "social", data: { platforms: [
        { platform: "instagram", url: "https://instagram.com" },
        { platform: "youtube", url: "https://youtube.com" },
        { platform: "twitter", url: "https://twitter.com" },
      ]}},
      { type: "link", data: { title: "Watch my latest video", url: "https://youtube.com" } },
      { type: "link", data: { title: "Shop my merch", url: "#" } },
      { type: "link", data: { title: "Join my community", url: "#" } },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Professional look for companies & freelancers",
    theme: "minimal",
    previewGradient: "from-slate-600 to-slate-800",
    blocks: [
      { type: "header", data: { text: "Let's work together", size: "h2" } },
      { type: "text", data: { content: "We help businesses grow with modern solutions." } },
      { type: "link", data: { title: "Visit our website", url: "#" } },
      { type: "link", data: { title: "Book a consultation", url: "#" } },
      { type: "social", data: { platforms: [
        { platform: "linkedin", url: "https://linkedin.com" },
        { platform: "email", url: "mailto:hello@example.com" },
      ]}},
    ],
  },
  {
    id: "personal",
    name: "Personal",
    description: "Simple & clean for personal use",
    theme: "default",
    previewGradient: "from-blue-400 to-cyan-400",
    blocks: [
      { type: "header", data: { text: "Hey there! 👋", size: "h2" } },
      { type: "link", data: { title: "My blog", url: "#" } },
      { type: "link", data: { title: "My portfolio", url: "#" } },
      { type: "link", data: { title: "Contact me", url: "#" } },
      { type: "divider", data: { style: "solid" } },
      { type: "social", data: { platforms: [
        { platform: "twitter", url: "https://twitter.com" },
        { platform: "github", url: "https://github.com" },
      ]}},
    ],
  },
  {
    id: "event",
    name: "Event",
    description: "Promote conferences, webinars & meetups",
    theme: "dark",
    previewGradient: "from-amber-500 to-orange-600",
    blocks: [
      { type: "header", data: { text: "🎉 Join us!", size: "h1" } },
      { type: "text", data: { content: "Don't miss our upcoming event. Register now to secure your spot!" } },
      { type: "link", data: { title: "Register Now", url: "#" } },
      { type: "link", data: { title: "View Schedule", url: "#" } },
      { type: "link", data: { title: "Speaker Lineup", url: "#" } },
      { type: "divider", data: { style: "space" } },
      { type: "text", data: { content: "📅 March 15, 2025 • 🌐 Online" } },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your best work",
    theme: "dark",
    previewGradient: "from-emerald-500 to-teal-600",
    blocks: [
      { type: "header", data: { text: "My Work", size: "h1" } },
      { type: "text", data: { content: "Designer & Developer crafting digital experiences" } },
      { type: "link", data: { title: "Project: Brand Identity", url: "#" } },
      { type: "link", data: { title: "Project: Web App", url: "#" } },
      { type: "link", data: { title: "Project: Mobile Design", url: "#" } },
      { type: "social", data: { platforms: [
        { platform: "github", url: "https://github.com" },
        { platform: "linkedin", url: "https://linkedin.com" },
      ]}},
    ],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Just the essentials, nothing more",
    theme: "minimal",
    previewGradient: "from-zinc-300 to-zinc-500",
    blocks: [
      { type: "link", data: { title: "Link one", url: "#" } },
      { type: "link", data: { title: "Link two", url: "#" } },
    ],
  },
];

export function getTemplateById(id: string): LinkPageTemplate | undefined {
  return LINK_PAGE_TEMPLATES.find((t) => t.id === id);
}
