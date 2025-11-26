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
import { SEO } from "@/components/seo/SEO";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { WhitespaceAdvantageCard } from "@/components/early-access/WhitespaceAdvantageCard";
import { OnboardingTimeline } from "@/components/early-access/OnboardingTimeline";
import { TrustNarrativeCard } from "@/components/early-access/TrustNarrativeCard";
import { PublicLeaderboard } from "@/components/early-access/PublicLeaderboard";
import { SocialProofStats } from "@/components/early-access/SocialProofStats";
import { DiagonalLines, FloatingShapes, GridOverlay, GradientDivider } from "@/components/early-access/EarlyAccessDecorations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Sparkles, Shield, Zap, Users, Code, Building2, BarChart3, Clock } from "lucide-react";
import { useTrackPageView, useTrackFormStart, useTrackFormSubmit } from "@/hooks/useWaitlistEngagement";
import { getOrCreateEarlyAccessVariant } from "@/lib/heroVariants";
import { useQuery } from "@tanstack/react-query";

// Comprehensive 9-field form schema
const formSchema = z.object({
  name: z.string()
    .min(1, "please enter your full name")
    .max(100, "name must be less than 100 characters"),
  email: z.string()
    .email("please enter a valid email")
    .max(255, "email must be less than 255 characters"),
  role: z.string()
    .min(1, "please select your role"),
  team_size: z.string()
    .min(1, "please select your team size"),
  reason_for_joining: z.string()
    .min(1, "please select why you want to join"),
  reason_details: z.string()
    .max(500, "please keep it under 500 characters")
    .optional(),
  how_heard: z.string()
    .min(1, "please select how you heard about us"),
  desired_domain: z.string()
    .max(100, "domain must be less than 100 characters")
    .optional(),
  company_domain: z.string()
    .max(100, "domain must be less than 100 characters")
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

const AudienceItem = ({ icon: Icon, label, delay = 0, color = "primary" }: { 
  icon: any; 
  label: string; 
  delay?: number;
  color?: string;
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary hover:border-primary/30",
    blazeOrange: "bg-blazeOrange/10 text-blazeOrange hover:border-blazeOrange/30",
    deepSea: "bg-deepSea/10 text-deepSea hover:border-deepSea/30",
  };

  const iconColorClasses = {
    primary: "text-primary",
    blazeOrange: "text-blazeOrange",
    deepSea: "text-deepSea",
  };

  return (
    <AnimatedHeadline delay={delay}>
      <div className={`flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 hover:shadow-md transition-all duration-300 group ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[color as keyof typeof iconColorClasses]}`} />
        </div>
        <span className="text-base font-medium text-foreground">{label}</span>
      </div>
    </AnimatedHeadline>
  );
};

export default function EarlyAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [heroVariant, setHeroVariant] = useState(getOrCreateEarlyAccessVariant());

  // Engagement tracking
  useTrackPageView('/early-access');
  const trackFormStart = useTrackFormStart();
  const trackFormSubmit = useTrackFormSubmit();

  // Fetch waitlist stats for FOMO counter using edge function (bypasses RLS)
  const { data: stats } = useQuery({
    queryKey: ["waitlist-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-waitlist-stats");
      if (error) {
        console.error("Error fetching waitlist stats:", error);
        return { total: 0 };
      }
      return { total: data?.totalCount || 0 };
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      team_size: "",
      reason_for_joining: "",
      reason_details: "",
      how_heard: "",
      desired_domain: "",
      company_domain: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Track form submission
    trackFormSubmit({
      role: data.role,
      team_size: data.team_size,
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
        name: data.name,
        email: data.email,
        team_size: data.team_size,
        role: data.role,
        reason_for_joining: data.reason_for_joining,
        reason_details: data.reason_details || null,
        how_heard: data.how_heard,
        company_domain: data.company_domain || null,
        desired_domain: data.desired_domain || null,
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
          name: data.name,
          email: data.email,
          team_size: data.team_size,
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
      <SEO 
        title="Get Early Access"
        description="Join the early circle for utm.one — the cleanest way to manage links, UTMs, QR codes, and analytics. Request early access to transform your campaign tracking."
        canonical="https://utm.one/early-access"
        keywords={['early access', 'utm tracking', 'link management', 'QR codes', 'campaign analytics', 'UTM builder']}
      />
      <Navigation />
      {/* FOLD 1 - Hero (A/B tested) */}
      <section className="relative bg-white py-24 md:py-32 px-6 overflow-hidden">
        <DiagonalLines />
        <div className="hero-glow" />
        <div className="max-w-[900px] mx-auto text-center relative z-10">
          <AnimatedHeadline>
            <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl mb-8 tracking-tighter hero-gradient leading-[1.05]">
              {heroVariant.headline}
            </h1>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
              {heroVariant.subheadline}
            </p>
          </AnimatedHeadline>
          <AnimatedHeadline delay={300}>
            <Button 
              size="lg" 
              className="rounded-full px-10 py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-blazeOrange hover:bg-blazeOrange/90 text-white font-bold"
              onClick={() => {
                document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heroVariant.cta}
            </Button>
            <p className="text-sm text-muted-foreground/70 mt-4">
              {heroVariant.microcopy}
            </p>
          </AnimatedHeadline>
          
          {/* FOMO Counter */}
          <AnimatedHeadline delay={400}>
            <a 
              href="#leaderboard"
              className="inline-block mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#leaderboard')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="font-bold text-foreground">
                {stats?.total && stats.total >= 1000 
                  ? `${Math.floor(stats.total / 1000)}K+` 
                  : stats?.total || 0} waiting
              </span> • <span className="underline">see where you stand</span>
            </a>
          </AnimatedHeadline>
        </div>
        {/* Hero glow effect - brand colors */}
        <div className="absolute inset-0 bg-gradient-radial from-blazeOrange/10 via-transparent to-transparent opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-wildSand to-transparent pointer-events-none" />
      </section>

      {/* Stats Bar */}
      <SocialProofStats />

      <GradientDivider />

      {/* FOLD 2 - Why Early Access Exists */}
      <section className="bg-muted/20 py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deepSea/10 text-deepSea text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              limited availability
            </div>
            <AnimatedHeadline>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
                we want the right people in first
              </h1>
            </AnimatedHeadline>
          </div>
          
          <AnimatedHeadline delay={100}>
            <p className="text-xl md:text-2xl text-muted-foreground text-center mb-12">
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
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-[1000px] mx-auto">
          <AnimatedHeadline>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16 text-center tracking-tight">
              you get more than a login
            </h1>
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

      <GradientDivider />

      {/* Referral Leaderboard */}
      <PublicLeaderboard />

      <GradientDivider />

      {/* FOLD 7 - Who This Is For (audience grid) */}
      <section className="bg-muted/20 py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-[800px] mx-auto relative z-10">
          <AnimatedHeadline>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16 text-center tracking-tight">
              who this is for
            </h1>
          </AnimatedHeadline>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <AudienceItem 
              icon={Users} 
              label="marketing teams who need governance" 
              delay={0}
              color="blazeOrange"
            />
            <AudienceItem 
              icon={Zap} 
              label="sales teams who need speed" 
              delay={50}
              color="deepSea"
            />
            <AudienceItem 
              icon={Shield} 
              label="compliance-focused organizations" 
              delay={100}
              color="primary"
            />
            <AudienceItem 
              icon={BarChart3} 
              label="data teams who need clean UTMs" 
              delay={150}
              color="blazeOrange"
            />
            <AudienceItem 
              icon={CheckCircle2} 
              label="agencies managing multiple clients" 
              delay={200}
              color="deepSea"
            />
            <AudienceItem 
              icon={Clock} 
              label="teams tired of broken links" 
              delay={250}
              color="primary"
            />
          </div>
          
          <AnimatedHeadline delay={350}>
            <p className="text-lg text-muted-foreground text-center mb-4">
              anyone who is tired of cleaning data at the end
            </p>
            <p className="text-xl text-foreground text-center font-semibold">
              if you care about clarity, you'll feel at home here.
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      {/* FOLD 8 - Final CTA with Comprehensive Form */}
      <section id="early-access-form" className="bg-white py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-[600px] mx-auto">
          {!isSubmitted ? (
            <>
              <AnimatedHeadline>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-center tracking-tight text-muted-foreground">
                  join the early circle
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-12 text-center tracking-tight">
                  be among the first to use utm.one
                </h1>
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
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Your full name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your full name"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@company.com"
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
                              <SelectItem value="marketing_ops">marketing ops</SelectItem>
                              <SelectItem value="developer">developer</SelectItem>
                              <SelectItem value="partner_manager">partner manager</SelectItem>
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
                      name="team_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Team size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="just_me">just me</SelectItem>
                              <SelectItem value="2-10">2-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-200">51-200</SelectItem>
                              <SelectItem value="201-500">201-500</SelectItem>
                              <SelectItem value="500+">500+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reason_for_joining"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Why utm.one?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="what brings you here?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="link_management">link management</SelectItem>
                              <SelectItem value="utm_tracking">UTM tracking</SelectItem>
                              <SelectItem value="qr_codes">QR codes</SelectItem>
                              <SelectItem value="analytics">analytics</SelectItem>
                              <SelectItem value="team_governance">team governance</SelectItem>
                              <SelectItem value="all">all of the above</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reason_details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Tell us more (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="share any details about your use case (max 500 characters)"
                              className="min-h-[100px] rounded-lg resize-none"
                              maxLength={500}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="how_heard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">How did you hear about utm.one?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select one" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="google_search">google search</SelectItem>
                              <SelectItem value="social_media">social media</SelectItem>
                              <SelectItem value="referral">referral</SelectItem>
                              <SelectItem value="product_hunt">product hunt</SelectItem>
                              <SelectItem value="blog_article">blog/article</SelectItem>
                              <SelectItem value="podcast">podcast</SelectItem>
                              <SelectItem value="other">other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="desired_domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Domain to shorten with (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="go.company.com or company.com"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">what domain do you want to use for short links?</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Company domain (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="company.com"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">helps us understand your organization</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-lg text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-blazeOrange hover:bg-blazeOrange/90 text-white font-bold"
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
