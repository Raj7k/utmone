import { Button } from "@/components/ui/button";
import { GoogleIcon, MicrosoftIcon } from "@/components/icons/SocialIcons";
import { Loader2 } from "lucide-react";
import { useUIFeatureFlags } from "@/hooks/useUIFeatureFlag";

interface SocialLoginButtonsProps {
  isLoading: boolean;
  onGoogleClick: () => void;
  onMicrosoftClick: () => void;
}

export function SocialLoginButtons({ 
  isLoading, 
  onGoogleClick, 
  onMicrosoftClick 
}: SocialLoginButtonsProps) {
  const { flags, isLoading: flagsLoading } = useUIFeatureFlags([
    'enable_google_auth',
    'enable_microsoft_auth'
  ]);

  const showGoogle = flags['enable_google_auth'];
  const showMicrosoft = flags['enable_microsoft_auth'];

  // Don't render anything if both are disabled
  if (!flagsLoading && !showGoogle && !showMicrosoft) {
    return null;
  }

  // Show skeleton while loading flags
  if (flagsLoading) {
    return null;
  }

  return (
    <div className="space-y-3">
      {showGoogle && (
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 gap-3 rounded-xl text-base font-medium border-2 hover:bg-muted/50 transition-all"
          onClick={onGoogleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon className="h-5 w-5" />
          )}
          Continue with Google
        </Button>
      )}
      
      {showMicrosoft && (
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 gap-3 rounded-xl text-base font-medium border-2 hover:bg-muted/50 transition-all"
          onClick={onMicrosoftClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MicrosoftIcon className="h-5 w-5" />
          )}
          Continue with Microsoft
        </Button>
      )}
    </div>
  );
}
