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

const MARQUEE_ITEMS = [
  "marketing teams", "sales ops", "events", "partner programs", "enterprise"
];

const INTERESTS = [
  { value: "utm-governance", label: "UTM Governance" },
  { value: "branded-qr", label: "Branded QR Codes" },
  { value: "campaign-analytics", label: "Campaign Analytics" },
  { value: "link-management", label: "Link Management" }
];

const CHALLENGES = [
  { value: "inconsistent-utms", label: "Inconsistent UTMs", description: "our dashboards break from messy naming" },
  { value: "no-visibility", label: "No link visibility", description: "can't track what's working across teams" },
  { value: "qr-attribution", label: "QR attribution gaps", description: "can't connect offline to online conversions" }
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
        <div className="relative bg-gradient-to-br from-mirage to-black p-8 lg:p-16 flex flex-col justify-between min-h-[40vh] lg:min-h-screen overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Gradient Orbs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-blazeOrange/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-32 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-blazeOrange text-blazeOrange" />
              ))}
            </div>
            <p className="text-white/70 text-sm">trusted by growth teams at 50+ companies</p>
          </div>

          {/* Center - Headline */}
          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight">
              <span className="hero-gradient">
                every link<br />tells a story.<br />let's write yours.
              </span>
            </h1>
            <p className="text-white/60 text-lg lg:text-xl max-w-md">
              schedule a demo to see how utm.one brings clarity to your campaigns
            </p>
            <p className="text-white/40 text-sm italic">
              clarity creates confidence
            </p>
          </div>

          {/* Bottom - Category Marquee */}
          <div className="relative z-10 overflow-hidden">
            <div className="logo-marquee">
              <div className="logo-marquee-content">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <div key={i} className="logo-item">
                    <span className="text-white/50 text-sm font-medium whitespace-nowrap">
                      {item}
                    </span>
                    {i < MARQUEE_ITEMS.length * 2 - 1 && (
                      <span className="text-white/30 mx-4">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Interactive Form */}
        <div className="bg-[#FDFCF8] p-8 lg:p-16 flex items-center border-l-4 border-blazeOrange/20">
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
                    placeholder="work email"
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
                  what are you looking for?
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
                      className="rounded-full px-4 py-2 border border-border/20 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary"
                    >
                      {interest.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-label">
                  what's your biggest challenge?
                </label>
                <div className="grid gap-3">
                  {CHALLENGES.map((challenge) => (
                    <Card
                      key={challenge.value}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        formData.challenge === challenge.value
                          ? 'border-primary bg-primary text-white'
                          : 'border-border/20 bg-white hover:border-primary/30'
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
                  what are you trying to solve?
                </label>
                <Textarea
                  placeholder="tell us more about your team's needs..."
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
                  className="w-full h-14 bg-blazeOrange text-white hover:bg-blazeOrange/90 text-lg font-medium rounded-xl group"
                >
                  {isSubmitting ? "submitting..." : "book a demo"}
                  <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
                <p className="text-xs text-secondary-label text-center">
                  free 15-minute consultation • no commitment
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