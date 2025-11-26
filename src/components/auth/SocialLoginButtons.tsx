import { Button } from "@/components/ui/button";
import { GoogleIcon, MicrosoftIcon } from "@/components/icons/SocialIcons";
import { Loader2 } from "lucide-react";

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
  return (
    <div className="space-y-3">
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
    </div>
  );
}
