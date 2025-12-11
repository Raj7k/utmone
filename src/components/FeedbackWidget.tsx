import { useState, useRef } from "react";
import { MessageCircle, Send, Camera, Bug, Sparkles, Palette, Zap, HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toPng } from "html-to-image";

type Category = 'bug' | 'feature' | 'ui' | 'performance' | 'question' | 'other';
type Priority = 'low' | 'medium' | 'high' | 'critical';

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: 'bug', label: 'Bug', icon: <Bug className="h-4 w-4" /> },
  { value: 'feature', label: 'Feature Request', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'ui', label: 'UI Issue', icon: <Palette className="h-4 w-4" /> },
  { value: 'performance', label: 'Performance', icon: <Zap className="h-4 w-4" /> },
  { value: 'question', label: 'Question', icon: <HelpCircle className="h-4 w-4" /> },
  { value: 'other', label: 'Other', icon: <MessageSquare className="h-4 w-4" /> },
];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-muted text-muted-foreground' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'high', label: 'High', color: 'bg-amber-500/20 text-amber-400' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500/20 text-red-400' },
];

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = '';
  let osName = 'Unknown';

  // Detect browser
  if (ua.includes('Firefox/')) {
    browserName = 'Firefox';
    browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browserName = 'Chrome';
    browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browserName = 'Safari';
    browserVersion = ua.split('Version/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Edg/')) {
    browserName = 'Edge';
    browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || '';
  }

  // Detect OS
  if (ua.includes('Windows')) osName = 'Windows';
  else if (ua.includes('Mac OS')) osName = 'macOS';
  else if (ua.includes('Linux')) osName = 'Linux';
  else if (ua.includes('Android')) osName = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) osName = 'iOS';

  return {
    browser: browserName,
    browserVersion,
    os: osName,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: ua,
  };
};

export const FeedbackWidget = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<Category>("other");
  const [priority, setPriority] = useState<Priority>("medium");
  const [captureScreenshot, setCaptureScreenshot] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCaptureToggle = async (enabled: boolean) => {
    setCaptureScreenshot(enabled);
    if (enabled) {
      setIsCapturing(true);
      try {
        // Temporarily close popover for clean screenshot
        setIsOpen(false);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await toPng(document.body, {
          quality: 0.8,
          pixelRatio: 1,
          filter: (node) => {
            // Exclude the feedback widget itself from screenshot
            return !node.classList?.contains('feedback-widget-trigger');
          }
        });
        
        setScreenshotPreview(dataUrl);
        setIsOpen(true);
      } catch (error) {
        console.error('Screenshot capture failed:', error);
        toast({
          title: "screenshot failed",
          description: "couldn't capture the screen",
          variant: "destructive",
        });
        setCaptureScreenshot(false);
      } finally {
        setIsCapturing(false);
      }
    } else {
      setScreenshotPreview(null);
    }
  };

  const uploadScreenshot = async (dataUrl: string, userId: string): Promise<string | null> => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const fileName = `${userId}/${Date.now()}.png`;
      
      const { data, error } = await supabase.storage
        .from('feedback-screenshots')
        .upload(fileName, blob, { contentType: 'image/png' });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('feedback-screenshots')
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Screenshot upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "message required",
        description: "please tell us what's on your mind",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "authentication required",
          description: "please sign in to send feedback",
          variant: "destructive",
        });
        return;
      }

      let screenshotUrl: string | null = null;
      if (screenshotPreview) {
        screenshotUrl = await uploadScreenshot(screenshotPreview, user.id);
      }

      const browserInfo = getBrowserInfo();

      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        message: message.trim(),
        type: category === 'bug' ? 'bug' : 'other',
        category,
        priority,
        page_url: window.location.pathname,
        status: "new",
        screenshot_url: screenshotUrl,
        browser_info: browserInfo,
      });

      if (error) throw error;

      toast({
        title: "thanks! we're on it",
        description: `${category === 'bug' ? 'bug report' : 'feedback'} submitted successfully`,
      });

      // Reset form
      setMessage("");
      setCategory("other");
      setPriority("medium");
      setCaptureScreenshot(false);
      setScreenshotPreview(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "submission failed",
        description: "please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="feedback-widget-trigger fixed bottom-20 md:bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 bg-card hover:bg-muted border border-border"
          aria-label="Send feedback or report a bug"
        >
          <MessageCircle className="h-5 w-5 text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card border-border" align="end" side="top">
        <div className="space-y-4">
          <div>
            <h3 className="font-display font-semibold text-base mb-1 text-foreground">what's on your mind?</h3>
            <p className="text-sm text-muted-foreground">found a bug or have a suggestion?</p>
          </div>

          {/* Screenshot Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="screenshot-toggle" className="text-sm cursor-pointer text-foreground">
                capture screenshot
              </Label>
            </div>
            <Switch
              id="screenshot-toggle"
              checked={captureScreenshot}
              onCheckedChange={handleCaptureToggle}
              disabled={isSubmitting || isCapturing}
            />
          </div>

          {/* Screenshot Preview */}
          {screenshotPreview && (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img 
                src={screenshotPreview} 
                alt="Screenshot preview" 
                className="w-full h-24 object-cover object-top"
              />
              <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-background/80 rounded text-xs text-muted-foreground">
                screenshot attached
              </div>
            </div>
          )}

          {/* Category Select */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground">category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Selector */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground">priority</Label>
            <div className="flex gap-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                    priority === p.value 
                      ? p.color + ' ring-1 ring-primary/50' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="tell us what happened..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] resize-none bg-background border-border"
            disabled={isSubmitting}
          />

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim()}
            className="w-full"
            variant="halo"
          >
            {isSubmitting ? (
              "sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                send feedback
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
