import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ArrowUpRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { phoneCountryCodes } from "@/lib/phoneCountryCodes";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "US",
    phone: "",
    interests: [] as string[],
    challenge: "",
    message: ""
  });

  // Auto-detect country from IP in background (non-blocking)
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const { data } = await supabase.functions.invoke('detect-location');
        if (data?.country_code) {
          setFormData(prev => ({ ...prev, country_code: data.country_code }));
        }
      } catch (error) {
        console.error('Failed to detect location:', error);
        // Silently fail - form already shows with US default
      }
    };
    
    // Run async without blocking render
    detectLocation();
  }, []);

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

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-label hover:text-primary transition-colors">
            <span className="text-xl font-display font-bold lowercase">utm.one</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-secondary-label hover:text-label"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            back
          </Button>
        </div>
      </div>

      <div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden pt-16">
        {/* Left Panel - Brand Experience */}
        <div className="relative bg-gradient-to-br from-blazeOrange/5 via-primary/5 to-white p-8 lg:p-12 flex flex-col justify-between h-full overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Gradient Orbs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-blazeOrange/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-32 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-blazeOrange text-blazeOrange" />
              ))}
            </div>
            <p className="text-label/70 text-sm">trusted by growth teams at 50+ companies</p>
          </div>

          {/* Center - Headline */}
          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-4">
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight">
              <span className="hero-gradient">
                every link<br />tells a story.<br />let's write yours.
              </span>
            </h1>
            <p className="text-secondary-label text-base lg:text-lg max-w-md">
              schedule a demo to see how utm.one brings clarity to your campaigns
            </p>
            <p className="text-tertiary-label text-sm italic">
              clarity creates confidence
            </p>
          </div>

          {/* Bottom - Category Marquee */}
          <div className="relative z-10 overflow-hidden">
            <div className="logo-marquee">
              <div className="logo-marquee-content">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <div key={i} className="logo-item">
                    <span className="text-label/50 text-sm font-medium whitespace-nowrap">
                      {item}
                    </span>
                    {i < MARQUEE_ITEMS.length * 2 - 1 && (
                      <span className="text-label/30 mx-4">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Interactive Form */}
        <div className="bg-[#FDFCF8] h-full overflow-y-auto p-8 lg:p-12 flex flex-col justify-start pt-8 lg:pt-12 border-l-4 border-blazeOrange/20">
          <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-11 bg-white border-border/20"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="work email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11 bg-white border-border/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <Select
                    value={formData.country_code}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, country_code: value }))}
                  >
                    <SelectTrigger className="h-11 bg-white border-border/20">
                      <SelectValue>
                        {phoneCountryCodes.find(c => c.code === formData.country_code)?.flag}{' '}
                        {phoneCountryCodes.find(c => c.code === formData.country_code)?.dialCode}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {phoneCountryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span className="text-xs">{country.dialCode}</span>
                            <span className="text-xs text-muted-foreground">{country.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-11 bg-white border-border/20"
                  />
                </div>
              </div>

              {/* Interest Pills */}
              <div className="space-y-2">
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
                      className="rounded-full px-3 py-1.5 text-sm border border-border/20 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary"
                    >
                      {interest.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">
                  what's your biggest challenge?
                </label>
                <div className="grid gap-2">
                  {CHALLENGES.map((challenge) => (
                    <Card
                      key={challenge.value}
                      className={`p-3 cursor-pointer transition-all border-2 ${
                        formData.challenge === challenge.value
                          ? 'border-primary bg-primary text-white'
                          : 'border-border/20 bg-white hover:border-primary/30'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, challenge: challenge.value }))}
                    >
                      <h4 className="font-medium mb-0.5 text-sm">{challenge.label}</h4>
                      <p className={`text-xs ${
                        formData.challenge === challenge.value ? 'text-white/70' : 'text-secondary-label'
                      }`}>
                        {challenge.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">
                  what are you trying to solve?
                </label>
                <Textarea
                  placeholder="tell us more about your team's needs..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[60px] bg-white border-border/20"
                />
              </div>

              {/* CTA Button */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-blazeOrange text-white hover:bg-blazeOrange/90 text-base font-medium rounded-xl group"
                >
                  {isSubmitting ? "submitting..." : "book a demo"}
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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