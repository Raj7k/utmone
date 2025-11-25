import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { WhitespaceAdvantageCard } from "@/components/early-access/WhitespaceAdvantageCard";
import { OnboardingTimeline } from "@/components/early-access/OnboardingTimeline";
import { TrustNarrativeCard } from "@/components/early-access/TrustNarrativeCard";
import { DiagonalLines, FloatingShapes, GridOverlay, GradientDivider } from "@/components/early-access/EarlyAccessDecorations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Sparkles, Shield, Zap, Users, Code, Building2 } from "lucide-react";
import { useTrackPageView, useTrackFormStart, useTrackFormSubmit } from "@/hooks/useWaitlistEngagement";
import { getOrCreateEarlyAccessVariant } from "@/lib/heroVariants";

// Simplified form schema (4 fields only)
const formSchema = z.object({
  email: z.string()
    .email("please enter a valid email")
    .max(255, "email must be less than 255 characters"),
  company: z.string()
    .min(1, "please enter your company or project")
    .max(100, "company name must be less than 100 characters"),
  role: z.string()
    .min(1, "please select your role"),
  use_case: z.string()
    .max(500, "please keep it under 500 characters")
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const BenefitItem = ({ icon: Icon, title, description, delay = 0 }: { 
  icon: any; 
  title: string; 
  description: string; 
  delay?: number;
}) => (
  <AnimatedHeadline delay={delay}>
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-display font-semibold mb-1">{title}</h3>
        <p className="text-base text-secondary-label">{description}</p>
      </div>
    </div>
  </AnimatedHeadline>
);

const AudienceItem = ({ icon: Icon, label, delay = 0 }: { 
  icon: any; 
  label: string; 
  delay?: number;
}) => (
  <AnimatedHeadline delay={delay}>
    <div className="flex items-center gap-3 text-lg text-label">
      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
      <span>{label}</span>
    </div>
  </AnimatedHeadline>
);

export default function EarlyAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [heroVariant, setHeroVariant] = useState(getOrCreateEarlyAccessVariant());

  // Engagement tracking
  useTrackPageView('/early-access');
  const trackFormStart = useTrackFormStart();
  const trackFormSubmit = useTrackFormSubmit();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      company: "",
      role: "",
      use_case: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Track form submission
    trackFormSubmit({
      role: data.role,
      variant_id: heroVariant.id.toString(),
    });

    // Check rate limit
    try {
      const { data: rateLimitData } = await supabase.functions.invoke('check-early-access-rate-limit');
      
      if (rateLimitData && !rateLimitData.allowed) {
        toast.error("too many requests. please try again in an hour.");
        setIsSubmitting(false);
        return;
      }
    } catch (rateLimitError) {
      console.error('Rate limit check failed:', rateLimitError);
    }

    // Get referral code from URL if present
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get('ref');
    let referredBy: string | null = null;

    if (referralCode) {
      const { data: referrer } = await supabase
        .from('early_access_requests')
        .select('id')
        .eq('referral_code', referralCode)
        .single();
      
      referredBy = referrer?.id || null;
    }

    // Insert the request
    const { data: insertedData, error } = await supabase
      .from('early_access_requests')
      .insert({
        name: data.company, // Use company as name for simplified form
        email: data.email,
        team_size: "unknown", // Default since not collected
        role: data.role,
        reason_for_joining: "early_access", // Default
        reason_details: data.use_case || null,
        how_heard: "website", // Default
        company_domain: null,
        desired_domain: null,
        referred_by: referredBy,
      })
      .select()
      .single();

    if (error) {
      console.error('Early access request error:', error);
      toast.error("something went wrong. please try again.");
      setIsSubmitting(false);
      return;
    }

    // Send confirmation email
    try {
      await supabase.functions.invoke('send-applicant-confirmation', {
        body: {
          name: data.company,
          email: data.email,
          team_size: "unknown",
          referral_code: insertedData.referral_code,
          request_id: insertedData.id,
        }
      });
    } catch (error) {
      console.error('Confirmation email error:', error);
    }

    setIsSubmitted(true);
    toast.success("request submitted successfully!");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* FOLD 1 - Hero (A/B tested) */}
      <section className="relative bg-white py-32 md:py-40 px-6 overflow-hidden">
        <FloatingShapes />
        <DiagonalLines />
        <div className="hero-glow" />
        <div className="max-w-[900px] mx-auto text-center relative z-10">
          <AnimatedHeadline>
            <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl mb-8 tracking-tight bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
              {heroVariant.headline}
            </h1>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <p className="text-xl md:text-2xl text-secondary-label leading-relaxed mb-12">
              {heroVariant.subheadline}
            </p>
          </AnimatedHeadline>
          <AnimatedHeadline delay={300}>
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-base"
              onClick={() => {
                document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heroVariant.cta}
            </Button>
            <p className="text-sm text-tertiary-label mt-4">
              {heroVariant.microcopy}
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      <GradientDivider />

      {/* FOLD 2 - Why Early Access Exists */}
      <section className="bg-muted/20 py-32 md:py-40 px-6 relative overflow-hidden">
        <GridOverlay />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <AnimatedHeadline>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-16 text-center tracking-tight">
              we want the right people in first
            </h2>
          </AnimatedHeadline>
          
          <AnimatedHeadline delay={100}>
            <p className="text-xl md:text-2xl text-secondary-label text-center mb-12">
              utm.one is built for teams who
            </p>
          </AnimatedHeadline>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              "value clarity",
              "care about tracking hygiene",
              "want safer links",
              "need better attribution",
              "believe trust should be part of every click"
            ].map((value, index) => (
              <AnimatedHeadline key={index} delay={150 + index * 50}>
                <div className="text-center">
                  <p className="text-lg text-label">{value}</p>
                </div>
              </AnimatedHeadline>
            ))}
          </div>
          
          <AnimatedHeadline delay={500}>
            <p className="text-lg text-secondary-label text-center">
              the early access program helps us onboard these teams thoughtfully.
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      <GradientDivider />

      {/* FOLD 3 - What You Get (gray background with icons) */}
      <section className="bg-white py-32 md:py-40 px-6">
        <div className="max-w-[1000px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-16 text-center tracking-tight">
              you get more than a login
            </h2>
          </AnimatedHeadline>
          
          <div className="space-y-8">
            <BenefitItem
              icon={Sparkles}
              title="priority access"
              description="first to try new features"
              delay={0}
            />
            <BenefitItem
              icon={Shield}
              title="governed onboarding"
              description="we set your naming rules & clean-track foundations"
              delay={100}
            />
            <BenefitItem
              icon={Zap}
              title="private roadmap previews"
              description="see what's coming before anyone else"
              delay={200}
            />
            <BenefitItem
              icon={Users}
              title="direct product influence"
              description="your feedback shapes our priorities"
              delay={300}
            />
            <BenefitItem
              icon={CheckCircle2}
              title="founding member badge"
              description="visible on your workspace"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* FOLD 4 - Whitespace Advantage (split screen) */}
      <WhitespaceAdvantageCard />

      {/* FOLD 5 - Onboarding Flow (vertical timeline) */}
      <OnboardingTimeline />

      {/* FOLD 6 - Trust Narrative (soft gradient card) */}
      <TrustNarrativeCard />

      {/* FOLD 7 - Who This Is For (audience grid) */}
      <section className="bg-muted/20 py-32 md:py-40 px-6">
        <div className="max-w-[800px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center">
              who early access is perfect for
            </h2>
          </AnimatedHeadline>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <AudienceItem icon={Users} label="marketing teams" delay={0} />
            <AudienceItem icon={Users} label="sales teams" delay={50} />
            <AudienceItem icon={Shield} label="marketing ops" delay={100} />
            <AudienceItem icon={Code} label="developers" delay={150} />
            <AudienceItem icon={Building2} label="partner managers" delay={200} />
            <AudienceItem icon={Building2} label="agencies" delay={250} />
          </div>
          
          <AnimatedHeadline delay={350}>
            <p className="text-lg text-secondary-label text-center mb-4">
              anyone who is tired of cleaning data at the end
            </p>
            <p className="text-xl text-label text-center font-medium">
              if you care about clarity, you'll feel at home here.
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      {/* FOLD 8 - Final CTA with Simplified Form */}
      <section id="early-access-form" className="bg-white py-32 md:py-40 px-6">
        <div className="max-w-[600px] mx-auto">
          {!isSubmitted ? (
            <>
              <AnimatedHeadline>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">
                  be among the first to use utm.one
                </h2>
              </AnimatedHeadline>
              
              <AnimatedHeadline delay={200}>
                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-6"
                    onFocus={() => trackFormStart()}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Your email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@company.com"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Your company or project</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="company name"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Your role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="marketing">marketing</SelectItem>
                              <SelectItem value="sales">sales</SelectItem>
                              <SelectItem value="ops">marketing ops</SelectItem>
                              <SelectItem value="developer">developer</SelectItem>
                              <SelectItem value="partner">partner manager</SelectItem>
                              <SelectItem value="agency">agency</SelectItem>
                              <SelectItem value="other">other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="use_case"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">How do you plan to use utm.one?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="tell us about your use case (optional)"
                              className="min-h-[100px] rounded-lg resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-lg text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "submitting..." : "request early access"}
                    </Button>
                    
                    <p className="text-sm text-tertiary-label text-center">
                      we review every request manually. you'll hear from us soon.
                    </p>
                  </form>
                </Form>
              </AnimatedHeadline>
            </>
          ) : (
            <AnimatedHeadline>
              <div className="text-center space-y-6 py-12">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  thanks — we'll reach out soon.
                </h2>
                <p className="text-lg text-secondary-label">
                  your request has been received. we'll be in touch when a spot opens.
                </p>
              </div>
            </AnimatedHeadline>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
