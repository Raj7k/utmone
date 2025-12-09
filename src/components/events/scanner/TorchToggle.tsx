import { useState, useEffect, useCallback } from "react";
import { Flashlight, FlashlightOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface TorchToggleProps {
  videoElementSelector?: string;
}

export const TorchToggle = ({ videoElementSelector = '#qr-reader video' }: TorchToggleProps) => {
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(true);

  // Check torch support on mount
  useEffect(() => {
    const checkTorchSupport = async () => {
      try {
        const videoElement = document.querySelector(videoElementSelector) as HTMLVideoElement;
        if (!videoElement?.srcObject) {
          return;
        }

        const stream = videoElement.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        
        if (!track) {
          setIsTorchSupported(false);
          return;
        }

        const capabilities = track.getCapabilities() as any;
        setIsTorchSupported(capabilities?.torch === true);
      } catch (error) {
        setIsTorchSupported(false);
      }
    };

    // Check after a short delay to ensure video is initialized
    const timeout = setTimeout(checkTorchSupport, 2000);
    return () => clearTimeout(timeout);
  }, [videoElementSelector]);

  const toggleTorch = useCallback(async () => {
    try {
      const videoElement = document.querySelector(videoElementSelector) as HTMLVideoElement;
      if (!videoElement?.srcObject) {
        toast({
          title: 'camera not ready',
          description: 'please wait for camera to initialize',
          variant: 'destructive'
        });
        return;
      }

      const stream = videoElement.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];

      if (!track) {
        toast({
          title: 'no camera track',
          variant: 'destructive'
        });
        return;
      }

      const capabilities = track.getCapabilities() as any;
      
      if (!capabilities?.torch) {
        toast({
          title: 'torch not supported',
          description: 'your device does not support flashlight control'
        });
        setIsTorchSupported(false);
        return;
      }

      const newTorchState = !isTorchOn;
      
      await track.applyConstraints({
        advanced: [{ torch: newTorchState } as any]
      });

      setIsTorchOn(newTorchState);
    } catch (error) {
      console.error('Torch toggle error:', error);
      toast({
        title: 'flashlight error',
        description: 'could not toggle flashlight',
        variant: 'destructive'
      });
    }
  }, [isTorchOn, videoElementSelector]);

  if (!isTorchSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isTorchOn ? "default" : "outline"}
            size="icon"
            onClick={toggleTorch}
            className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm"
          >
            {isTorchOn ? (
              <Flashlight className="h-4 w-4" />
            ) : (
              <FlashlightOff className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isTorchOn ? 'turn off flashlight' : 'turn on flashlight'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
