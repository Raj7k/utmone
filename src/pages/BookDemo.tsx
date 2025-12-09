import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ArrowUpRight, ArrowLeft, Loader2, Target, Link2, BarChart3, QrCode, Sparkles, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { phoneCountryCodes } from "@/lib/phoneCountryCodes";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const MARQUEE_ITEMS = [
  "marketing teams", "sales ops", "events", "partner programs", "enterprise"
];

const WHAT_BRINGS_YOU = [
  { 
    value: "attribution", 
    icon: Target,
    label: "Campaign Attribution", 
    description: "I can't prove which campaigns drive revenue" 
  },
  { 
    value: "governance", 
    icon: Link2,
    label: "Link Governance", 
    description: "Our UTMs are inconsistent across teams" 
  },
  { 
    value: "analytics", 
    icon: BarChart3,
    label: "Analytics & Reporting", 
    description: "We're blind to what's actually working" 
  },
  { 
    value: "qr-offline", 
    icon: QrCode,
    label: "QR & Offline Tracking", 
    description: "Can't connect offline to online conversions" 
  },
  { 
    value: "ai-automation", 
    icon: Sparkles,
    label: "AI & Automation", 
    description: "We spend too much time on manual work" 
  },
  { 
    value: "enterprise", 
    icon: Building2,
    label: "Enterprise Control", 
    description: "Need governance for multiple teams" 
  },
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
  challenge: z.string().min(1, "please select what brings you here"),
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
    challenge: "",
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
          company: formData.company || null,
          team_size: formData.team_size || null,
          country_code: formData.country_code,
          phone: formData.phone || null,
          challenge: formData.challenge,
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
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight text-foreground">
              every link<br />tells a story.<br />let's write yours.
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
            <form onSubmit={handleSubmit} className="space-y-5">
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
                
                {/* Company & Team Size */}
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

                {/* Phone (optional) */}
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

              {/* What Brings You Here - Single Question with 6 Cards */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  what brings you here?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WHAT_BRINGS_YOU.map((item) => {
                    const Icon = item.icon;
                    const isSelected = formData.challenge === item.value;
                    return (
                      <Card
                        key={item.value}
                        className={`p-3 cursor-pointer transition-all border ${
                          isSelected
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, challenge: item.value }))}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 rounded-md ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-sm ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                              {item.label}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {errors.challenge && <p className="text-xs text-destructive">{errors.challenge}</p>}
              </div>

              {/* CTA Button */}
              <div className="space-y-3 pt-2">
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
                  no credit card required • 30-min personalized walkthrough
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
