import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Star, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

const CLIENT_LOGOS = [
  "Client A", "Client B", "Client C", "Client D", "Client E",
  "Client F", "Client G", "Client H", "Client I", "Client J"
];

const INTERESTS = [
  { value: "ai-assessment", label: "AI Assessment" },
  { value: "workflow-automation", label: "Workflow Automation" },
  { value: "custom-ai-tools", label: "Custom AI Tools" }
];

const CHALLENGES = [
  { value: "manual-tasks", label: "Too many manual tasks", description: "Repetitive work taking up too much time" },
  { value: "unclear-start", label: "Unclear where to start", description: "Not sure how to begin with AI" },
  { value: "need-scale", label: "Need to scale", description: "Current processes can't keep up with growth" }
];

export default function BookDemo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: [] as string[],
    challenge: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('demo_requests')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Request submitted",
        description: "We'll be in touch soon. Redirecting to calendar..."
      });

      // Redirect to calendar booking page
      setTimeout(() => {
        window.location.href = "https://cal.com/utm-one/demo";
      }, 2000);

    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Book a Demo | utm.one</title>
        <meta name="description" content="Turn confusion into clarity. Book a demo to see how utm.one can transform your link management and analytics." />
      </Helmet>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel - Brand Experience */}
        <div className="relative bg-gradient-to-br from-[hsl(205,29%,13%)] to-black p-8 lg:p-16 flex flex-col justify-between min-h-[40vh] lg:min-h-screen">
          {/* Top - Rating */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[hsl(20,100%,51%)] text-[hsl(20,100%,51%)]" />
              ))}
            </div>
            <p className="text-white/70 text-sm">helped over 100+ businesses</p>
          </div>

          {/* Center - Headline */}
          <div className="flex-1 flex items-center">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-serif text-white leading-tight">
              turn confusion<br />into clarity,<br />today.
            </h1>
          </div>

          {/* Bottom - Logo Marquee */}
          <div className="overflow-hidden">
            <div className="logo-marquee">
              <div className="logo-marquee-content">
                {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
                  <div key={i} className="logo-item">
                    <span className="text-white/30 text-sm font-medium whitespace-nowrap">
                      {logo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Interactive Form */}
        <div className="bg-[#FDFCF8] p-8 lg:p-16 flex items-center">
          <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name & Email */}
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 bg-white border-border/20"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 bg-white border-border/20"
                    required
                  />
                </div>
              </div>

              {/* Interest Pills */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-label">
                  what services are you interested in?
                </label>
                <ToggleGroup
                  type="multiple"
                  value={formData.interests}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, interests: value }))}
                  className="flex flex-wrap gap-2"
                >
                  {INTERESTS.map((interest) => (
                    <ToggleGroupItem
                      key={interest.value}
                      value={interest.value}
                      className="rounded-full px-4 py-2 border border-border/20 data-[state=on]:bg-label data-[state=on]:text-white data-[state=on]:border-label"
                    >
                      {interest.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-label">
                  what is your biggest challenge?
                </label>
                <div className="grid gap-3">
                  {CHALLENGES.map((challenge) => (
                    <Card
                      key={challenge.value}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        formData.challenge === challenge.value
                          ? 'border-label bg-label text-white'
                          : 'border-border/20 bg-white hover:border-label/30'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, challenge: challenge.value }))}
                    >
                      <h4 className="font-medium mb-1">{challenge.label}</h4>
                      <p className={`text-sm ${
                        formData.challenge === challenge.value ? 'text-white/70' : 'text-secondary-label'
                      }`}>
                        {challenge.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-label">
                  tell us about your business...
                </label>
                <Textarea
                  placeholder="share more about what you're looking for"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[120px] bg-white border-border/20"
                />
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-label text-white hover:bg-label/90 text-lg font-medium rounded-xl group"
                >
                  {isSubmitting ? "submitting..." : "book a call"}
                  <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
                <p className="text-xs text-secondary-label text-center">
                  by submitting, you agree to our terms and privacy policy
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .logo-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }

        .logo-marquee-content {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }

        .logo-item {
          padding: 0 2rem;
          flex-shrink: 0;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}