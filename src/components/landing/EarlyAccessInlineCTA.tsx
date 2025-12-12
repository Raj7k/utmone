import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { useModal } from "@/contexts/ModalContext";
import { captureEmailLead } from "@/lib/captureEmailLead";

const emailSchema = z.string().email();

export const EarlyAccessInlineCTA = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { openEarlyAccessModal } = useModal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError("please enter a valid email");
      return;
    }

    // Capture email immediately (fire-and-forget)
    captureEmailLead({
      email,
      source: 'early_access_inline_cta',
      referralCode: new URLSearchParams(window.location.search).get('ref'),
    });

    // Open modal with prefilled email
    openEarlyAccessModal(email);
  };

  return (
    <div className="flex justify-start mt-6">
      <form 
        onSubmit={handleSubmit}
        className="inline-flex items-center bg-muted/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-border dark:border-white/10 rounded-full p-2 gap-2 max-w-md w-full hover:border-border/80 dark:hover:border-white/20 transition-all duration-300"
      >
        <Input
          type="email"
          placeholder="enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-10 bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
          required
        />
        <Button
          type="submit"
          variant="marketing"
          size="sm"
          className="h-10 px-6 bg-blazeOrange hover:bg-blazeOrange/90 text-white font-medium rounded-full whitespace-nowrap flex-shrink-0"
        >
          get early access
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {error && (
          <p className="text-sm text-destructive absolute -bottom-6 left-0 right-0 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};
