import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";
import { SEO } from "@/components/seo/SEO";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { EarlyAccessStepForm } from "@/components/early-access/EarlyAccessStepForm";
import { SuccessScreen } from "@/components/early-access/SuccessScreen";
import { HowItWorksSteps } from "@/components/early-access/HowItWorksSteps";
import { ViralDashboardPreview } from "@/components/early-access/ViralDashboardPreview";
import { GoldenTicket } from "@/components/early-access/GoldenTicket";
import { DoubleSidedReward } from "@/components/early-access/DoubleSidedReward";
import { EarlyAccessFAQ } from "@/components/early-access/EarlyAccessFAQ";
import { ShareReferralModal } from "@/components/waitlist/ShareReferralModal";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Sparkles, Shield, AlertCircle, TrendingUp, Share2, Trophy, ArrowRight } from "lucide-react";
import { useTrackPageView } from "@/hooks/useWaitlistEngagement";
import { motion } from "framer-motion";

export default function EarlyAccess() {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [userName, setUserName] = useState("");
  const [queuePosition, setQueuePosition] = useState(0);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const prefillEmail = searchParams.get('email');
  const refCode = searchParams.get('ref');
  const hasEmailParam = Boolean(prefillEmail);
  const [showFormInHero, setShowFormInHero] = useState(hasEmailParam);

  // Engagement tracking
  useTrackPageView('/early-access');

  // Fetch referrer info if ref code exists
  useEffect(() => {
    if (refCode) {
      fetchReferrerInfo(refCode);
    }
  }, [refCode]);

  const fetchReferrerInfo = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('early_access_requests')
        .select('name')
        .eq('referral_code', code)
        .single();
      
      if (!error && data) {
        setReferrerName(data.name);
      }
    } catch (error) {
      console.error('Error fetching referrer:', error);
    }
  };

  // Auto-scroll to top when form mode is active
  useEffect(() => {
    if (prefillEmail && showFormInHero) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [prefillEmail, showFormInHero]);

  const handleSuccess = (data: { 
    id: string; 
    referral_code: string; 
    name: string;
    position: number;
    email: string;
  }) => {
    setReferralCode(data.referral_code);
    setUserName(data.name);
    setQueuePosition(data.position);
    setEmail(data.email);
    setIsSubmitted(true);
  };

  const scrollToForm = () => {
    document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ObsidianMarketingLayout>
      <SEO
        title="Early Access — utm.one"
        description="tracking is messy. utm.one launches soon. get early access. skip the waitlist with 3 referrals."
        canonical="https://utm.one/early-access"
        keywords={['early access', 'utm tracking', 'link management', 'QR codes', 'campaign analytics']}
      />

      {/* SECTION 1 - HERO (Personalized + Gamified) */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {showFormInHero ? (
            /* FORM MODE: Show form or success when email parameter exists */
            !isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto"
              >
                {/* Referrer Landing Mode */}
                {referrerName && (
                  <div className="bg-card backdrop-blur-xl border border-border/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-6 w-6 text-foreground" />
                      <p className="text-2xl font-display font-bold text-foreground">
                        you've been invited by {referrerName}
                      </p>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      join now and get <span className="font-bold text-foreground">1 month free</span> when early access opens.
                    </p>
                  </div>
                )}

                <h1 className="font-display font-bold text-5xl md:text-6xl mb-4 tracking-tighter hero-gradient">
                  let's get you signed up
                </h1>
                <p className="text-xl mb-12 text-muted-foreground">
                  just a few quick details and you're in.
                </p>

                <EarlyAccessStepForm onSuccess={handleSuccess} prefillEmail={prefillEmail || email} />
                
                <p className="text-sm text-center mt-4 text-muted-foreground/80">
                  we'll send you your position instantly.
                </p>
              </motion.div>
            ) : (
              <SuccessScreen
                userName={userName}
                referralCode={referralCode}
                queuePosition={queuePosition}
                email={email}
              />
            )
          ) : (
            /* NORMAL MODE: Show full hero content */
            <>
              {/* Referrer Landing Mode */}
              {referrerName && (
                <AnimatedHeadline>
                  <div className="bg-card backdrop-blur-xl border border-border/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-6 w-6 text-foreground" />
                      <p className="text-2xl font-display font-bold text-foreground">
                        you've been invited by {referrerName}
                      </p>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      join now and get <span className="font-bold text-foreground">1 month free</span> when early access opens.
                    </p>
                  </div>
                </AnimatedHeadline>
              )}

              <AnimatedHeadline>
                <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tighter hero-gradient leading-[1.05]">
                  tracking is messy. we're fixing it.
                </h1>
              </AnimatedHeadline>
              
              <AnimatedHeadline delay={100}>
                <p className="text-2xl md:text-3xl mb-12 leading-relaxed text-muted-foreground">
                  utm.one launches soon. get early access. skip the waitlist with 3 referrals.
                </p>
              </AnimatedHeadline>

              {/* Inline Email CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-[600px] mx-auto mb-6"
              >
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const emailValue = formData.get('email') as string;
                    // Update URL with email param and switch to form mode
                    window.history.pushState({}, '', `/early-access?email=${encodeURIComponent(emailValue)}`);
                    setEmail(emailValue);
                    setShowFormInHero(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-card backdrop-blur-xl border border-border shadow-sm rounded-2xl p-4 hover:border-border/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      name="email"
                      placeholder="enter your email..."
                      className="flex-1 h-12 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground focus:bg-muted/30 focus:border-border/50 transition-all"
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full lowercase whitespace-nowrap"
                    >
                      join early access
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>

              {/* Secondary Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <button 
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 text-sm font-medium lowercase transition-colors text-muted-foreground hover:text-foreground"
                >
                  see how it works
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </>
          )}
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-muted/5 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-muted/5 rounded-full blur-3xl opacity-30" />
      </section>

      {/* SECTION 2 - HOW IT WORKS */}
      <HowItWorksSteps />

      {/* SECTION 3 - VIRAL DASHBOARD PREVIEW */}
      <ViralDashboardPreview />

      {/* SECTION 4 - GOLDEN TICKET */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-foreground">
              your golden ticket to skip the entire line
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
              every user gets a golden ticket with their name on it. it stays locked until you refer 3 people. after that, it transforms into an animated "ACCESS GRANTED" badge in green.
            </p>
          </motion.div>

          <GoldenTicket
            userName="Your Name"
            referralCode="DEMO-123"
            referralCount={0}
            status="locked"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 grid md:grid-cols-5 gap-4 text-center"
          >
            {[
              "your name on the ticket",
              "your referral code",
              "live progress bar",
              "unlock animation",
              "auto-approval email",
            ].map((feature, index) => (
              <div key={index} className="bg-card backdrop-blur-xl border border-border rounded-xl p-4">
                <p className="text-sm text-muted-foreground">{feature}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 - DOUBLE-SIDED REWARD */}
      <DoubleSidedReward />

      {/* SECTION 6 - WHY BUILD VIRAL WAITLIST */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 text-foreground">
              why build a viral waitlist at all?
            </h2>
            <p className="text-xl leading-relaxed text-muted-foreground">
              utm.one is built for teams who care about clean, trustworthy tracking. we don't want noise in our data — and we don't want noise in our launch.
            </p>
            <p className="text-xl leading-relaxed mt-6 text-muted-foreground">
              a viral waitlist rewards the people who help us shape the product early.
            </p>
            <p className="text-xl leading-relaxed mt-6 text-muted-foreground">
              it also keeps the early access community small, focused, and full of power users who value clean-track best practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7 - BEHIND THE SCENES (TRUST) */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-foreground">
              zero spam. zero tricks. pure transparency.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              "no buying referrals",
              "no bot detection loopholes",
              "no fake positions",
              "every referral is verified",
              "same IP = auto disqualified",
              "duplicate emails = rejected",
              "you can see your movement live",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-card backdrop-blur-xl border border-border rounded-xl p-4">
                <Shield className="w-5 h-5 shrink-0 text-muted-foreground" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 8 - VIRAL ENGINE */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-foreground">
              one share can move you 500 places.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card backdrop-blur-xl border border-border rounded-2xl p-8"
          >
            <p className="text-xl text-muted-foreground mb-6">your dashboard includes:</p>
            <ul className="space-y-3 mb-8">
              {[
                "your unique link",
                "one-click share to LinkedIn & Twitter",
                "prewritten post text",
                "email invite tool",
                "progress bar",
                "referral counter",
                "leaderboard movement animation",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>

            <div className="bg-muted/5 rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground/70 mb-2">sample text for social share:</p>
              <p className="text-base text-foreground italic">
                "i just joined the private beta for utm.one — the new clean-track powered link shortener. use my link to skip the line."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9 - WHY PEOPLE ARE JOINING */}
      <section className="bg-muted/5 py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 text-foreground">
              why people are joining the waitlist
            </h2>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            {[
              "clean, predictable tracking (no messy UTMs)",
              "no more duplicate campaign names",
              "auto-generated short links",
              "branded QR codes",
              "real-time analytics",
              "team access controls",
              "they're tired of spreadsheets",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* SECTION 10 - FAQ */}
      <EarlyAccessFAQ />

      {/* SECTION 11 - FINAL CTA */}
      <section id="early-access-form" className="py-24 md:py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-foreground">
              ready to claim your spot?
            </h2>
            <p className="text-xl text-muted-foreground">
              the sooner you join, the higher you start. simple as that.
            </p>
          </motion.div>

          {!isSubmitted ? (
            <EarlyAccessStepForm onSuccess={handleSuccess} prefillEmail={email || prefillEmail} />
          ) : (
            <SuccessScreen
              userName={userName}
              referralCode={referralCode}
              queuePosition={queuePosition}
              email={email}
            />
          )}
        </div>
      </section>
    </ObsidianMarketingLayout>
  );
}
