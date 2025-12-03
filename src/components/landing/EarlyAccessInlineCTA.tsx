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
    <div className="flex justify-start mt-6">
      <form 
        onSubmit={handleSubmit}
        className="inline-flex items-center bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-full p-2 gap-2 max-w-md w-full hover:border-white/20 transition-all duration-300"
      >
        <Input
          type="email"
          placeholder="enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
          required
        />
        <Button
          type="submit"
          variant="marketing"
          size="sm"
          className="h-10 px-6 bg-blazeOrange hover:bg-blazeOrange/90 text-white font-medium rounded-full lowercase whitespace-nowrap flex-shrink-0"
        >
          get early access
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {error && (
          <p className="text-sm text-red-500 absolute -bottom-6 left-0 right-0 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};
