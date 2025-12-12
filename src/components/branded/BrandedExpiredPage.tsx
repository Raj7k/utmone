import { AlertTriangle } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface BrandedExpiredPageProps {
  companyName?: string;
  primaryColor?: string;
  logoUrl?: string;
  customMessage?: string;
  hideUtmBranding?: boolean;
}

export const BrandedExpiredPage = ({
  companyName = "utm.one",
  primaryColor = "#217BF4",
  logoUrl,
  customMessage,
  hideUtmBranding = false,
}: BrandedExpiredPageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center space-y-6">
        {logoUrl && (
          <OptimizedImage src={logoUrl} alt={companyName} height={48} className="h-12 w-auto object-contain mx-auto mb-8" priority />
        )}
        
        <div className="rounded-full bg-muted p-6 w-24 h-24 mx-auto flex items-center justify-center">
          <AlertTriangle className="h-12 w-12" style={{ color: primaryColor }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Link Expired</h1>
          <p className="text-muted-foreground">
            {customMessage || "This link has expired and is no longer available."}
          </p>
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
