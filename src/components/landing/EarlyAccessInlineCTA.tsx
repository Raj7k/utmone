import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email();

export const EarlyAccessInlineCTA = () => {
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
    <div className="relative mt-8">
      <div className="absolute inset-0 bg-gradient-radial from-blazeOrange/20 via-transparent to-transparent opacity-30 blur-2xl pointer-events-none" />
      
      <form 
        onSubmit={handleSubmit}
        className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30 transition-all"
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
          <p className="text-sm text-red-400 mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};
