import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const FeedbackWidget = () => {
  const [message, setMessage] = useState("");
  const [isBug, setIsBug] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        message: message.trim(),
        type: isBug ? "bug" : "other",
        page_url: window.location.pathname,
        status: "new",
      });

      if (error) throw error;

      toast({
        title: "thanks! we're looking into it",
        description: "your feedback helps us improve utm.one",
      });

      // Reset form
      setMessage("");
      setIsBug(false);
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
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50"
          aria-label="Send feedback or report a bug"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" side="top">
        <div className="space-y-4">
          <div>
            <h3 className="font-display font-semibold text-base mb-1">what's on your mind?</h3>
            <p className="text-sm text-muted-foreground">found a bug or have a suggestion?</p>
          </div>

          <Textarea
            placeholder="tell us what happened..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="bug-toggle"
                checked={isBug}
                onCheckedChange={setIsBug}
                disabled={isSubmitting}
              />
              <Label htmlFor="bug-toggle" className="text-sm cursor-pointer">
                is this a bug?
              </Label>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim()}
            className="w-full bg-blazeOrange hover:bg-blazeOrange/90"
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
