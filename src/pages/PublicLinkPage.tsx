import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  fetchPublishedPageWithBlocks, 
  hashVisitorIdentifier, 
  sendLinkPageEvent,
  type LinkPageBlock,
  type PublicLinkPageWithBlocks
} from "@/lib/linkPages";
import { cn } from "@/lib/utils";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Facebook, 
  Github,
  Globe,
  ExternalLink,
  BadgeCheck,
  MapPin,
  Mail,
  AlertCircle,
  RefreshCw,
  FileX,
  Loader2,
  ArrowRight
} from "lucide-react";

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  github: Github,
  website: Globe,
};

const themeStyles: Record<string, { bg: string; card: string; text: string; accent: string }> = {
  // Solid themes
  default: {
    bg: "bg-background",
    card: "bg-card border-border",
    text: "text-foreground",
    accent: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  dark: {
    bg: "bg-zinc-950",
    card: "bg-zinc-900 border-zinc-800",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-zinc-200",
  },
  minimal: {
    bg: "bg-zinc-50",
    card: "bg-white border-zinc-200",
    text: "text-zinc-900",
    accent: "bg-zinc-900 text-white hover:bg-zinc-800",
  },
  
  // Legacy gradient (keep for backward compatibility)
  gradient: {
    bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  
  // Gradient themes
  "gradient-purple": {
    bg: "bg-gradient-to-br from-purple-600 to-pink-500",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-orange": {
    bg: "bg-gradient-to-br from-amber-500 to-orange-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-green": {
    bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-blue": {
    bg: "bg-gradient-to-br from-blue-400 to-cyan-400",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-sunset": {
    bg: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-ocean": {
    bg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-rose": {
    bg: "bg-gradient-to-br from-rose-400 to-pink-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-slate": {
    bg: "bg-gradient-to-br from-slate-600 to-slate-800",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
};

interface BlockRendererProps {
  block: LinkPageBlock;
  theme: string;
  onBlockClick: (blockId: string) => void;
}

// Safe block renderer with error boundary
function SafeBlockRenderer({ block, theme, onBlockClick }: BlockRendererProps) {
  try {
    return <BlockRenderer block={block} theme={theme} onBlockClick={onBlockClick} />;
  } catch (error) {
    console.error("Block render error:", error);
    return (
      <div className="p-4 rounded-xl border border-dashed border-destructive/30 text-center text-sm text-muted-foreground">
        This block couldn't be displayed
      </div>
    );
  }
}

function BlockRenderer({ block, theme, onBlockClick }: BlockRendererProps) {
  const styles = themeStyles[theme] || themeStyles.default;
  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case "link": {
      const url = data.url as string;
      const title = data.title as string;
      const description = data.description as string | undefined;
      
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onBlockClick(block.id)}
          className={cn(
            "block w-full p-4 rounded-xl border transition-all duration-200",
            "hover:scale-[1.02] hover:shadow-lg",
            styles.accent
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{title || "Untitled Link"}</p>
              {description && (
                <p className="text-sm opacity-80 truncate">{description}</p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 ml-3 flex-shrink-0 opacity-60" />
          </div>
        </a>
      );
    }

    case "header": {
      const text = data.text as string;
      return (
        <h2 className={cn("text-xl font-bold text-center py-2", styles.text)}>
          {text || "Header"}
        </h2>
      );
    }

    case "text": {
      const text = data.text as string;
      return (
        <p className={cn("text-center opacity-80 py-2", styles.text)}>
          {text || "Text block"}
        </p>
      );
    }

    case "image": {
      const src = data.src as string;
      const alt = data.alt as string | undefined;
      if (!src) return null;
      
      return (
        <div className="w-full rounded-xl overflow-hidden">
          <img 
            src={src} 
            alt={alt || "Image"} 
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      );
    }

    case "divider": {
      return <Separator className="my-2 opacity-30" />;
    }

    case "social": {
      const links = data.links as Array<{ platform: string; url: string }> | undefined;
      if (!links?.length) return null;

      return (
        <div className="flex items-center justify-center gap-4 py-2">
          {links.map((link, index) => {
            const Icon = socialIcons[link.platform.toLowerCase()] || Globe;
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onBlockClick(block.id)}
                className={cn(
                  "p-3 rounded-full transition-all duration-200",
                  "hover:scale-110",
                  styles.card
                )}
              >
                <Icon className={cn("w-5 h-5", styles.text)} />
              </a>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

// Enhanced loading skeleton with staggered animations
const PageSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <Card className="w-full max-w-md border-border">
      <CardContent className="p-8 space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div 
            className="h-20 w-20 rounded-full bg-muted animate-pulse" 
            style={{ animationDelay: "0ms" }} 
          />
          <div 
            className="h-5 w-32 bg-muted rounded animate-pulse" 
            style={{ animationDelay: "75ms" }} 
          />
          <div 
            className="h-4 w-48 bg-muted rounded animate-pulse" 
            style={{ animationDelay: "150ms" }} 
          />
        </div>
        <div className="space-y-3 pt-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="h-14 bg-muted rounded-xl animate-pulse" 
              style={{ animationDelay: `${225 + i * 75}ms` }} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Error state with retry button
interface PageErrorProps {
  error: Error;
  onRetry: () => void;
  isRetrying: boolean;
}

const PageError = ({ error, onRetry, isRetrying }: PageErrorProps) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-background">
    <Card className="max-w-md w-full border-border">
      <CardContent className="p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">something went wrong</p>
          <p className="text-sm text-muted-foreground mt-1">
            We couldn't load this page. Please try again.
          </p>
        </div>
        <Button 
          onClick={onRetry} 
          disabled={isRetrying}
          className="gap-2"
        >
          {isRetrying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Try Again
        </Button>
        {process.env.NODE_ENV === "development" && error?.message && (
          <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded mt-4 break-all">
            {error.message}
          </p>
        )}
      </CardContent>
    </Card>
  </div>
);

// 404 Not found state with CTA
const PageNotFound = () => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-background">
    <Card className="max-w-md w-full border-border">
      <CardContent className="p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <FileX className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">page not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            This link page doesn't exist or hasn't been published yet.
          </p>
        </div>
        <Separator className="my-4" />
        <a 
          href="https://utm.one/features/link-pages" 
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Create your own link page <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </CardContent>
    </Card>
  </div>
);

export default function PublicLinkPage() {
  const { slug } = useParams();
  
  const query = useQuery({
    queryKey: ["public-link-page", slug],
    queryFn: () => fetchPublishedPageWithBlocks(slug || ""),
    enabled: !!slug,
  });

  const page = query.data;

  // Fetch verification status from database
  const verificationQuery = useQuery({
    queryKey: ["public-verification-status", page?.workspace_id],
    queryFn: async () => {
      const { data } = await supabaseFrom('verification_requests')
        .select("status")
        .eq("workspace_id", page?.workspace_id)
        .eq("status", "approved")
        .limit(1)
        .maybeSingle();
      return data?.status === "approved";
    },
    enabled: !!page?.workspace_id,
  });
  const theme = page?.theme || "default";
  const styles = themeStyles[theme] || themeStyles.default;

  // Track page view on mount
  useEffect(() => {
    if (!page?.id) return;
    
    const sendView = async () => {
      const userAgent = navigator.userAgent;
      const userAgentHash = await hashVisitorIdentifier(userAgent);
      await sendLinkPageEvent({
        pageId: page.id,
        eventType: "page_view",
        userAgentHash,
        referrer: document.referrer || null,
      });
    };
    
    void sendView();
  }, [page?.id]);

  // Track block clicks
  const handleBlockClick = async (blockId: string) => {
    if (!page?.id) return;
    
    const userAgent = navigator.userAgent;
    const userAgentHash = await hashVisitorIdentifier(userAgent);
    await sendLinkPageEvent({
      pageId: page.id,
      blockId,
      eventType: "block_click",
      userAgentHash,
      referrer: document.referrer || null,
    });
  };

  // Handle loading state
  if (query.isLoading) return <PageSkeleton />;
  
  // Handle error state (network/server errors)
  if (query.isError) {
    return (
      <PageError 
        error={query.error as Error} 
        onRetry={() => query.refetch()} 
        isRetrying={query.isFetching} 
      />
    );
  }
  
  // Handle not found state (page doesn't exist or unpublished)
  if (!page) return <PageNotFound />;

  return (
    <div className={cn("min-h-screen py-12 px-4", styles.bg)}>
      <Helmet>
        <title>{page.title}</title>
        {page.bio && <meta name="description" content={page.bio} />}
        <meta property="og:title" content={page.title} />
        {page.bio && <meta property="og:description" content={page.bio} />}
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {(() => {
          const metadata = page.metadata as Record<string, unknown> | null;
          const avatarUrl = metadata?.avatar_url as string | undefined;
          const websiteUrl = metadata?.website_url as string | undefined;
          const location = metadata?.location as string | undefined;
          const email = metadata?.email as string | undefined;
          const ctaText = metadata?.cta_text as string | undefined;
          const ctaUrl = metadata?.cta_url as string | undefined;
          const showVerifiedBadge = metadata?.show_verified_badge as boolean | undefined;
          const isVerificationApproved = verificationQuery.data;
          const hideBranding = metadata?.hide_branding as boolean | undefined;

          return (
            <>
              {/* Profile Section */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={cn(
                  "h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden",
                  styles.card
                )}>
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={page.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    page.title?.charAt(0)?.toUpperCase() || "?"
                  )}
                </div>
                <div>
                  <h1 className={cn("text-xl font-bold flex items-center justify-center gap-1.5", styles.text)}>
                    {page.title}
                    {showVerifiedBadge && isVerificationApproved && <BadgeCheck className="w-5 h-5 text-blue-400" />}
                  </h1>
                  {page.bio && (
                    <p className={cn("text-sm mt-1 opacity-80", styles.text)}>
                      {page.bio}
                    </p>
                  )}
                </div>

                {/* Profile Details */}
                {(websiteUrl || location || email) && (
                  <div className={cn("flex flex-wrap items-center justify-center gap-3 text-sm opacity-80", styles.text)}>
                    {websiteUrl && (
                      <a 
                        href={websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:opacity-100 transition-opacity"
                      >
                        <Globe className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                    {location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {location}
                      </span>
                    )}
                    {email && (
                      <a 
                        href={`mailto:${email}`} 
                        className="flex items-center gap-1 hover:opacity-100 transition-opacity"
                      >
                        <Mail className="w-3.5 h-3.5" /> {email}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              {ctaText && ctaUrl && (
                <a 
                  href={ctaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "block w-full py-3 px-6 rounded-full text-center font-medium transition-all duration-200 hover:scale-[1.02]",
                    styles.accent
                  )}
                >
                  {ctaText}
                </a>
              )}

              {/* Blocks */}
              <div className="space-y-3">
                {page.blocks.length > 0 ? (
                  page.blocks.map((block) => (
                    <SafeBlockRenderer
                      key={block.id}
                      block={block}
                      theme={theme}
                      onBlockClick={handleBlockClick}
                    />
                  ))
                ) : (
                  <p className={cn("text-center text-sm opacity-60 py-8", styles.text)}>
                    No content yet
                  </p>
                )}
              </div>

              {/* Branding */}
              {!hideBranding && (
                <div className="text-center pt-8">
                  <a 
                    href="https://utm.one/features/link-pages" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn("text-xs opacity-40 hover:opacity-60 transition-opacity", styles.text)}
                  >
                    Powered by utm.one
                  </a>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
