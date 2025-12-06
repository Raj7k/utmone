import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email();

export const HeroInlineCTA = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError("please enter a valid email");
      return;
    }

    navigate(`/early-access?email=${encodeURIComponent(email)}#early-access-form`);
  };

  return (
    <div className="relative max-w-[600px] mx-auto">
      <form 
        onSubmit={handleSubmit}
        className="bg-muted/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-border dark:border-white/10 rounded-2xl p-4 hover:border-border/80 dark:hover:border-white/20 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12 bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 transition-all"
            required
          />
          <Button
            type="submit"
            variant="marketing"
            size="lg"
            className="h-12 px-8 bg-blazeOrange hover:bg-blazeOrange/90 text-white font-medium rounded-full lowercase whitespace-nowrap"
          >
            get early access
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {error && (
          <p className="text-sm mt-2 text-destructive">{error}</p>
        )}
      </form>
    </div>
  );
};
