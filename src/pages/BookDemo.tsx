import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ArrowUpRight, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { phoneCountryCodes } from "@/lib/phoneCountryCodes";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const MARQUEE_ITEMS = [
  "marketing teams", "sales ops", "events", "partner programs", "enterprise"
];

const INTERESTS = [
  { value: "utm-governance", label: "UTM Governance" },
  { value: "branded-qr", label: "Branded QR Codes" },
  { value: "campaign-analytics", label: "Campaign Analytics" },
  { value: "link-management", label: "Link Management" },
  { value: "revenue-attribution", label: "Revenue Attribution" },
  { value: "ai-intelligence", label: "AI Intelligence" },
  { value: "identity-graph", label: "Cross-Device Tracking" },
  { value: "enterprise-governance", label: "Enterprise Control" },
];

const CHALLENGES = [
  { value: "inconsistent-utms", label: "Inconsistent UTMs", description: "our dashboards break from messy naming" },
  { value: "no-visibility", label: "No link visibility", description: "can't track what's working across teams" },
  { value: "qr-attribution", label: "QR attribution gaps", description: "can't connect offline to online conversions" },
  { value: "cross-device", label: "Cross-device blindspots", description: "can't connect mobile to desktop journeys" },
  { value: "manual-work", label: "Too much manual work", description: "spending hours building links and UTMs" },
];

const TEAM_SIZES = [
  { value: "1-5", label: "1-5 people" },
  { value: "6-20", label: "6-20 people" },
  { value: "21-100", label: "21-100 people" },
  { value: "100+", label: "100+ people" },
];

// Zod validation schema
const formSchema = z.object({
  name: z.string().min(2, "name is required").max(100),
  email: z.string().email("valid work email required").max(255),
  company: z.string().max(100).optional(),
  team_size: z.string().optional(),
  country_code: z.string(),
  phone: z.string().max(20).optional(),
  interests: z.array(z.string()),
  challenge: z.string(),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function BookDemo() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    team_size: "",
    country_code: "US",
    phone: "",
    interests: [],
    challenge: "",
    message: ""
  });

  // Auto-detect country from IP in background
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const { data } = await supabase.functions.invoke('detect-location');
        if (data?.country_code) {
          setFormData(prev => ({ ...prev, country_code: data.country_code }));
        }
      } catch (error) {
        console.error('Failed to detect location:', error);
      } finally {
        setIsDetecting(false);
      }
    };
    
    detectLocation();
  }, []);

  const validateForm = (): boolean => {
    try {
      formSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as keyof FormData] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "please check the form",
        description: "some fields need your attention",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('demo_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          country_code: formData.country_code,
          phone: formData.phone || null,
          interests: formData.interests,
          challenge: formData.challenge,
          message: formData.message || null,
        }]);

      if (error) throw error;

      toast({
        title: "request submitted",
        description: "redirecting to calendar..."
      });

      setTimeout(() => {
        window.location.href = "https://cal.com/utm-one/demo";
      }, 1500);

    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast({
        title: "something went wrong",
        description: "please try again or email us directly",
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors">
            <span className="text-xl font-display font-bold lowercase">utm.one</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            back
          </Button>
        </div>
      </div>

      <div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden pt-16 bg-background">
        {/* Left Panel - Brand Experience */}
        <div className="relative p-8 lg:p-12 flex flex-col justify-between h-full overflow-hidden bg-card">
          {/* Noise Texture */}
          <div className="absolute inset-0 pointer-events-none obsidian-noise" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl animate-pulse bg-primary/5" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse bg-primary/5" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-muted-foreground/40 text-muted-foreground/40" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">trusted by growth teams worldwide</p>
          </div>

          {/* Center - Headline */}
          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-4">
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight">
              <span className="hero-gradient">
                every link<br />tells a story.<br />let's write yours.
              </span>
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg max-w-md">
              schedule a demo to see how utm.one brings clarity to your campaigns
            </p>
            <p className="text-muted-foreground/60 text-sm italic">
              clarity creates confidence
            </p>
          </div>

          {/* Bottom - Category Marquee */}
          <div className="relative z-10 overflow-hidden">
            <div className="logo-marquee">
              <div className="logo-marquee-content">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <div key={i} className="logo-item">
                    <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                      {item}
                    </span>
                    {i < MARQUEE_ITEMS.length * 2 - 1 && (
                      <span className="text-muted-foreground/30 mx-4">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Interactive Form */}
        <div className="bg-card/50 backdrop-blur-xl h-full overflow-y-auto p-8 lg:p-12 flex flex-col justify-start pt-8 lg:pt-12 border-l border-border">
          <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground ${errors.name ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="work email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground ${errors.email ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                
                {/* Company & Team Size - NEW */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="company name"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <Select
                    value={formData.team_size}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, team_size: value }))}
                  >
                    <SelectTrigger className="h-11 bg-muted/50 border-border text-foreground">
                      <SelectValue placeholder="team size" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value} className="text-foreground">
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <Select
                    value={formData.country_code}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, country_code: value }))}
                    disabled={isDetecting}
                  >
                    <SelectTrigger className="h-11 bg-muted/50 border-border text-foreground">
                      {isDetecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <SelectValue>
                          {phoneCountryCodes.find(c => c.code === formData.country_code)?.flag}{' '}
                          {phoneCountryCodes.find(c => c.code === formData.country_code)?.dialCode}
                        </SelectValue>
                      )}
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-popover border-border">
                      {phoneCountryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code} className="text-foreground">
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
                    placeholder="phone number (optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-11 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Interest Pills */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
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
                      className="rounded-full px-3 py-1.5 text-sm border border-border text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                    >
                      {interest.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  what's your biggest challenge?
                </label>
                <div className="grid gap-2">
                  {CHALLENGES.map((challenge) => (
                    <Card
                      key={challenge.value}
                      className={`p-3 cursor-pointer transition-all border-2 ${
                        formData.challenge === challenge.value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card hover:border-primary/50 text-foreground'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, challenge: challenge.value }))}
                    >
                      <h4 className="font-medium mb-0.5 text-sm">{challenge.label}</h4>
                      <p className={`text-xs ${
                        formData.challenge === challenge.value ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {challenge.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  what are you trying to solve? (optional)
                </label>
                <Textarea
                  placeholder="tell us more about your team's needs..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[60px] bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* CTA Button */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-medium rounded-xl group"
                  variant="marketing"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      submitting...
                    </>
                  ) : (
                    <>
                      book a demo
                      <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
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