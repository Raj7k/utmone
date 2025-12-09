import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, ExternalLink, QrCode, Link2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NetworkRipple } from "@/components/growth/NetworkRipple";

interface LinkSuccessCardProps {
  url: string;
  linkId?: string;
  variant: 'utm' | 'shortened';
  onShorten?: () => void;
  onGenerateQR?: () => void;
  className?: string;
}

export const LinkSuccessCard = ({
  url,
  linkId,
  variant,
  onShorten,
  onGenerateQR,
  className = "",
}: LinkSuccessCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  // Auto-scroll into view on mount
  useEffect(() => {
    if (successRef.current) {
      setTimeout(() => {
        successRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setShowRipple(true);
    toast({
      title: "copied",
      description: "url copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewDetails = () => {
    if (linkId) {
      navigate(`/dashboard/links/${linkId}`);
    }
  };

  const title = variant === 'utm' ? 'utm url ready' : 'link created';
  const subtitle = variant === 'utm' 
    ? 'your tracking parameters have been added' 
    : 'your short link is ready to share';

  return (
    <>
      <NetworkRipple 
        isActive={showRipple} 
        onComplete={() => setShowRipple(false)} 
      />
      
      <motion.div
        ref={successRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-6 bg-card border border-border rounded-lg ${className}`}
      >
        {/* Success Icon & Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* URL Display */}
        <div className="relative mb-4">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm font-mono text-foreground break-all">{url}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={copyToClipboard}
            variant="default"
            size="sm"
            className="flex-1 min-w-[140px]"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                copy url
              </>
            )}
          </Button>

          {linkId && (
            <Button
              onClick={handleViewDetails}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[140px]"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              view details
            </Button>
          )}

          {onShorten && variant === 'utm' && (
            <Button
              onClick={onShorten}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[140px]"
            >
              <Link2 className="h-4 w-4 mr-2" />
              shorten this url
            </Button>
          )}

          {onGenerateQR && variant === 'shortened' && (
            <Button
              onClick={onGenerateQR}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[140px]"
            >
              <QrCode className="h-4 w-4 mr-2" />
              generate qr
            </Button>
          )}
        </div>
      </motion.div>
    </>
  );
};
