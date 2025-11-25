import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandedNotFoundPageProps {
  companyName?: string;
  primaryColor?: string;
  logoUrl?: string;
  hideUtmBranding?: boolean;
}

export const BrandedNotFoundPage = ({
  companyName = "utm.one",
  primaryColor = "#217BF4",
  logoUrl,
  hideUtmBranding = false,
}: BrandedNotFoundPageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center space-y-6">
        {logoUrl && (
          <img src={logoUrl} alt={companyName} className="h-12 mx-auto mb-8" />
        )}
        
        <div className="rounded-full bg-muted p-6 w-24 h-24 mx-auto flex items-center justify-center">
          <Search className="h-12 w-12" style={{ color: primaryColor }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Link Not Found</h1>
          <p className="text-muted-foreground">
            We couldn't find the link you're looking for. It may have been removed or the URL is incorrect.
          </p>
        </div>

        <Button style={{ backgroundColor: primaryColor }}>
          Go to Homepage
        </Button>

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
