import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { CheckCircle2, Copy, Share2, Twitter, Linkedin, Mail } from "lucide-react";
import { useTrackPageView, useTrackFormStart, useTrackFormSubmit, useTrackScrollDepth, useTrackTimeOnPage, useTrackClick } from "@/hooks/useWaitlistEngagement";

const formSchema = z.object({
  name: z.string()
    .min(2, "name must be at least 2 characters")
    .max(100, "name must be less than 100 characters"),
  email: z.string()
    .email("please enter a valid email address")
    .max(255, "email must be less than 255 characters"),
  team_size: z.string()
    .min(1, "please select your team size"),
  role: z.string()
    .min(1, "please select your role"),
  reason_for_joining: z.string()
    .min(1, "please select a reason"),
  reason_details: z.string()
    .max(500, "details must be less than 500 characters")
    .optional(),
  how_heard: z.string()
    .min(1, "please tell us how you heard about utm.one"),
  desired_domain: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(val), {
      message: "please enter a valid domain (e.g., company.com)"
    }),
  company_domain: z.string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(val), {
      message: "please enter a valid domain (e.g., company.com)"
    })
});

type FormData = z.infer<typeof formSchema>;

const BenefitCard = ({ number, title, description, delay = 0 }: { number: string; title: string; description: string; delay?: number }) => (
  <AnimatedHeadline delay={delay}>
    <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] transition-all duration-300">
      <div className="absolute top-6 right-6 text-7xl font-extrabold text-foreground/5 pointer-events-none">
        {number}
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-display font-semibold mb-4">{title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </AnimatedHeadline>
);

export default function EarlyAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");

  // Engagement tracking
  useTrackPageView('/early-access');
  useTrackScrollDepth();
  useTrackTimeOnPage();
  const trackFormStart = useTrackFormStart();
  const trackFormSubmit = useTrackFormSubmit();
  const trackClick = useTrackClick();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      team_size: "",
      role: "",
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
      reason: data.reason_for_joining,
      how_heard: data.how_heard,
    });

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

    // Insert the request into database
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
        desired_domain: data.desired_domain || null,
        company_domain: data.company_domain || null,
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

    // Send admin notification email
    try {
      const { error: emailError } = await supabase.functions.invoke('notify-admin-new-request', {
        body: {
          request_id: insertedData.id,
          name: data.name,
          email: data.email,
          team_size: data.team_size,
          role: data.role,
          reason: data.reason_for_joining,
          how_heard: data.how_heard,
          company_domain: data.company_domain || null
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the submission if email fails
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the submission if email fails
    }

    // Send confirmation email to applicant
    try {
      const { error: confirmationError } = await supabase.functions.invoke('send-applicant-confirmation', {
        body: {
          name: data.name,
          email: data.email,
          team_size: data.team_size,
          referral_code: insertedData.referral_code,
          request_id: insertedData.id,
        }
      });

      if (confirmationError) {
        console.error('Confirmation email error:', confirmationError);
        // Don't fail the submission if email fails
      }
    } catch (confirmationError) {
      console.error('Confirmation email error:', confirmationError);
      // Don't fail the submission if email fails
    }

    // Store referral code for display
    setReferralCode(insertedData.referral_code);
    setIsSubmitted(true);
    toast.success("request submitted successfully!");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <AnimatedHeadline>
            <div className="hero-glow">
              <h1 className="hero-gradient text-5xl md:text-6xl lg:text-8xl font-display font-bold mb-8 leading-tight">
                welcome to the early circle.
              </h1>
            </div>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              utm.one is launching in phases — and early access is limited to teams who want clarity from day one.
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      {/* Why Invite-Only Section */}
      <section className="bg-muted/20 py-40 px-6">
        <div className="max-w-[800px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">
              why invite-only?
            </h2>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <div className="space-y-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p>
                we're designing utm.one with the same care we bring to the product itself.
                every feature is tested, refined, and perfected with a small group of early users.
              </p>
              <p className="font-medium text-foreground">this ensures:</p>
              <ul className="space-y-4 pl-6">
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>cleaner workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>tighter governance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>smoother integrations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>stronger analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-foreground">•</span>
                  <span>flawless branding</span>
                </li>
              </ul>
              <p>before we open the doors wider.</p>
            </div>
          </AnimatedHeadline>
        </div>
      </section>

      {/* What Early Access Gives You Section */}
      <section className="bg-white py-40 px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center">
              what early access gives you
            </h2>
          </AnimatedHeadline>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BenefitCard
              number="01"
              title="priority onboarding"
              description="hands-on setup for domains, UTMs, and rules."
              delay={0}
            />
            <BenefitCard
              number="02"
              title="early product access"
              description="new features unlocked before public launch."
              delay={100}
            />
            <BenefitCard
              number="03"
              title="influence on roadmap"
              description="your input shapes the product."
              delay={200}
            />
            <BenefitCard
              number="04"
              title="direct access to our team"
              description="ops, design, engineering — line of sight."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Who We're Selecting Section */}
      <section className="bg-muted/20 py-32 px-6">
        <div className="max-w-[800px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">
              who we're selecting
            </h2>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <div className="space-y-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p className="text-center">teams that value:</p>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>disciplined UTMs</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>branded links</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>qr code quality</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>clean analytics</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>enterprise governance</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-foreground flex-shrink-0" />
                  <span>high-clarity marketing</span>
                </div>
              </div>
              <p className="text-center mt-8">if that's you, you're in the right place.</p>
            </div>
          </AnimatedHeadline>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white py-40 px-6">
        <div className="max-w-[600px] mx-auto">
          {!isSubmitted ? (
            <>
              <AnimatedHeadline>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
                  join the early circle
                </h2>
              </AnimatedHeadline>
              <AnimatedHeadline delay={200}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" onFocus={() => {
                    trackFormStart();
                  }}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium lowercase">name</FormLabel>
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
                          <FormLabel className="text-sm font-medium lowercase">email</FormLabel>
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
                          <FormLabel className="text-sm font-medium lowercase">your role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="marketing">marketing</SelectItem>
                              <SelectItem value="sales">sales</SelectItem>
                              <SelectItem value="ops">marketing ops / admin</SelectItem>
                              <SelectItem value="developer">developer / data engineer</SelectItem>
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
                          <FormLabel className="text-sm font-medium lowercase">team size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-200">51-200</SelectItem>
                              <SelectItem value="201-1000">201-1000</SelectItem>
                              <SelectItem value="1000+">1000+</SelectItem>
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
                          <FormLabel className="text-sm font-medium lowercase">why utm.one?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select primary reason" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="utm_consistency">need consistent UTM structure</SelectItem>
                              <SelectItem value="branded_qr">need branded QR codes</SelectItem>
                              <SelectItem value="governance">need link governance</SelectItem>
                              <SelectItem value="analytics">need better campaign analytics</SelectItem>
                              <SelectItem value="custom_domains">need custom branded domains</SelectItem>
                              <SelectItem value="team_collaboration">need team collaboration</SelectItem>
                              <SelectItem value="api_integration">need API/webhook integration</SelectItem>
                              <SelectItem value="other">other</SelectItem>
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
                          <FormLabel className="text-sm font-medium lowercase">
                            tell us more (optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="what challenges are you facing with link management today?"
                              className="min-h-[100px] rounded-lg resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            max 500 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="how_heard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium lowercase">
                            how did you hear about utm.one?
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="referral">referral / invite</SelectItem>
                              <SelectItem value="search">search engine</SelectItem>
                              <SelectItem value="social">social media</SelectItem>
                              <SelectItem value="community">slack / discord community</SelectItem>
                              <SelectItem value="blog">blog / article</SelectItem>
                              <SelectItem value="newsletter">newsletter</SelectItem>
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
                          <FormLabel className="text-sm font-medium lowercase">
                            domain you want to shorten with (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="go.company.com or company.com"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            the custom domain you'll use for short links
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium lowercase">
                            company domain (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="company.com"
                              className="h-12 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            your company's main website domain
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-full bg-foreground text-background hover:scale-[1.02] transition-transform duration-200 text-sm font-medium lowercase"
                    >
                      {isSubmitting ? "submitting..." : "request early access"}
                    </Button>
                  </form>
                </Form>
              </AnimatedHeadline>
            </>
          ) : (
            <AnimatedHeadline>
              <div className="text-center space-y-8">
                <CheckCircle2 className="w-16 h-16 mx-auto text-foreground" />
                <h2 className="text-4xl md:text-5xl font-bold">
                  you're in the queue.
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  we'll reach out when a spot opens. check your inbox for updates.
                </p>

                {/* Referral Section */}
                {referralCode && (
                  <div className="mt-12 p-8 bg-muted/20 rounded-2xl">
                    <h3 className="text-2xl font-semibold mb-4">
                      jump the queue
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      invite others to utm.one and move up in line. every successful referral boosts your priority.
                    </p>
                    
                    <div className="space-y-4">
                      {/* Referral Link */}
                      <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
                        <Input
                          value={`${window.location.origin}/invite/${referralCode}`}
                          readOnly
                          className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/invite/${referralCode}`);
                            toast.success("link copied!");
                            trackClick('copy_referral_link');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Social Share Buttons */}
                      <div className="flex items-center justify-center gap-3 pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            const url = `${window.location.origin}/invite/${referralCode}`;
                            const text = "I just joined the utm.one early access waitlist. Join me and get cleaner links, better UTMs, and branded QR codes!";
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                            trackClick('share_twitter');
                          }}
                        >
                          <Twitter className="h-4 w-4" />
                          twitter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            const url = `${window.location.origin}/invite/${referralCode}`;
                            const text = "I just joined the utm.one early access waitlist. Join me and get cleaner links, better UTMs, and branded QR codes!";
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                            trackClick('share_linkedin');
                          }}
                        >
                          <Linkedin className="h-4 w-4" />
                          linkedin
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            const url = `${window.location.origin}/invite/${referralCode}`;
                            const subject = "Join utm.one early access";
                            const body = `I just joined the utm.one early access waitlist.\n\nIt's an enterprise URL shortener with branded QR codes, enforced UTM structure, and clean analytics.\n\nJoin me: ${url}`;
                            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                            trackClick('share_email');
                          }}
                        >
                          <Mail className="h-4 w-4" />
                          email
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Link to="/">
                  <Button
                    variant="outline"
                    className="mt-8 h-12 px-8 rounded-full hover:scale-[1.02] transition-transform duration-200"
                  >
                    explore utm.one
                  </Button>
                </Link>
              </div>
            </AnimatedHeadline>
          )}
        </div>
      </section>

      {/* Footer Message */}
      <section className="bg-white py-12 px-6 border-t">
        <p className="text-sm text-muted-foreground text-center">
          we'll reach out when a spot opens.
        </p>
      </section>
    </div>
  );
}
