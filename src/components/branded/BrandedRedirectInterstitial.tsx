import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface BrandedRedirectInterstitialProps {
  destinationUrl: string;
  companyName?: string;
  primaryColor?: string;
  logoUrl?: string;
  hideUtmBranding?: boolean;
  countdown?: number;
}

export const BrandedRedirectInterstitial = ({
  destinationUrl,
  companyName = "utm.one",
  primaryColor = "#217BF4",
  logoUrl,
  hideUtmBranding = false,
  countdown = 3,
}: BrandedRedirectInterstitialProps) => {
  const [seconds, setSeconds] = useState(countdown);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = destinationUrl;
    }
  }, [seconds, destinationUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center space-y-6">
        {logoUrl && (
          <OptimizedImage src={logoUrl} alt={companyName} height={48} className="h-12 w-auto object-contain mx-auto mb-8" priority />
        )}
        
        <div className="rounded-full bg-muted p-6 w-24 h-24 mx-auto flex items-center justify-center">
          <ExternalLink className="h-12 w-12" style={{ color: primaryColor }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Redirecting...</h1>
          <p className="text-muted-foreground">
            Taking you to your destination in {seconds} second{seconds !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="text-sm text-muted-foreground break-all">
          <p className="font-mono">{destinationUrl}</p>
        </div>

        {!hideUtmBranding && (
          <div className="pt-8 text-sm text-muted-foreground">
            <p>
              Links powered by{" "}
              <a
                href="https://utm.one"
                className="font-medium hover:underline"
                style={{ color: primaryColor }}
              >
                utm.one
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
