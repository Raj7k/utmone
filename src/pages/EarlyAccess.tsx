import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { EarlyAccessStepForm } from "@/components/early-access/EarlyAccessStepForm";
import { HowItWorksSteps } from "@/components/early-access/HowItWorksSteps";
import { ViralDashboardPreview } from "@/components/early-access/ViralDashboardPreview";
import { GoldenTicket } from "@/components/early-access/GoldenTicket";
import { DoubleSidedReward } from "@/components/early-access/DoubleSidedReward";
import { EarlyAccessFAQ } from "@/components/early-access/EarlyAccessFAQ";
import { ShareReferralModal } from "@/components/waitlist/ShareReferralModal";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Sparkles, Shield, AlertCircle, TrendingUp, Share2, Trophy } from "lucide-react";
import { useTrackPageView } from "@/hooks/useWaitlistEngagement";
import { motion } from "framer-motion";

const ValueBullet = ({ text }: { text: string }) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-3"
  >
    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
    <span className="text-lg text-secondary-label">{text}</span>
  </motion.li>
);

export default function EarlyAccess() {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [userName, setUserName] = useState("");
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const prefillEmail = searchParams.get('email');
  const refCode = searchParams.get('ref');

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

  const handleSuccess = (data: { id: string; referral_code: string; name: string }) => {
    setReferralCode(data.referral_code);
    setUserName(data.name);
    setIsSubmitted(true);
  };

  const scrollToForm = () => {
    document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Early Access — utm.one"
        description="join the early access list and skip the line by inviting a few friends. the cleanest way to track your campaigns is almost here."
        canonical="https://utm.one/early-access"
        keywords={['early access', 'utm tracking', 'link management', 'QR codes', 'campaign analytics']}
      />
      <Navigation />
      <FloatingNavigation />

      {/* SECTION 1 - HERO (Personalized + Gamified) */}
      <section className="relative bg-gradient-to-br from-white via-primary/5 to-blazeOrange/10 py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Referrer Landing Mode */}
          {referrerName && (
            <AnimatedHeadline>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-6 w-6 text-green-600" />
                  <p className="text-2xl font-display font-bold text-green-900">
                    you've been invited by {referrerName}
                  </p>
                </div>
                <p className="text-lg text-green-700">
                  join now and get <span className="font-bold">1 month free</span> when early access opens.
                </p>
              </div>
            </AnimatedHeadline>
          )}

          <AnimatedHeadline>
            <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tighter hero-gradient leading-[1.05]">
              the cleanest way to track your campaigns is almost here.
            </h1>
          </AnimatedHeadline>
          
          <AnimatedHeadline delay={100}>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-12 leading-relaxed">
              join the early access list and skip the line by inviting a few friends.
            </p>
          </AnimatedHeadline>

          {/* Value Bullets */}
          <AnimatedHeadline delay={200}>
            <ul className="space-y-3 mb-12 max-w-xl mx-auto">
              <ValueBullet text="clean-track built in" />
              <ValueBullet text="link shortener + QR + tracking in one" />
              <ValueBullet text="perfect for marketers, founders, and agencies" />
              <ValueBullet text="simple, beautiful, and accurate from day one" />
            </ul>
          </AnimatedHeadline>

          <AnimatedHeadline delay={300}>
            <Button
              size="lg"
              onClick={scrollToForm}
              className="rounded-full px-10 py-7 text-xl bg-blazeOrange hover:bg-blazeOrange/90 text-white font-bold shadow-lg hover:shadow-xl"
            >
              join early access
            </Button>
          </AnimatedHeadline>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blazeOrange/20 rounded-full blur-3xl opacity-30" />
      </section>

      {/* SECTION 2 - HOW IT WORKS */}
      <HowItWorksSteps />

      {/* SECTION 3 - VIRAL DASHBOARD PREVIEW */}
      <ViralDashboardPreview />

      {/* SECTION 4 - GOLDEN TICKET */}
      <section className="bg-muted/20 py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              your golden ticket to skip the entire line
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto">
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
              <div key={index} className="bg-card border border-border rounded-xl p-4">
                <p className="text-sm text-secondary-label">{feature}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 - DOUBLE-SIDED REWARD */}
      <DoubleSidedReward />

      {/* SECTION 6 - WHY BUILD VIRAL WAITLIST */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8">
              why build a viral waitlist at all?
            </h2>
            <p className="text-xl text-secondary-label leading-relaxed">
              utm.one is built for teams who care about clean, trustworthy tracking. we don't want noise in our data — and we don't want noise in our launch.
            </p>
            <p className="text-xl text-secondary-label leading-relaxed mt-6">
              a viral waitlist rewards the people who help us shape the product early.
            </p>
            <p className="text-xl text-secondary-label leading-relaxed mt-6">
              it also keeps the early access community small, focused, and full of power users who value clean-track best practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7 - BEHIND THE SCENES (TRUST) */}
      <section className="bg-muted/20 py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
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
              <div key={index} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                <p className="text-secondary-label">{item}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 8 - VIRAL ENGINE */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              one share can move you 500 places.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border-2 border-primary/30 rounded-2xl p-8"
          >
            <p className="text-xl text-secondary-label mb-6">your dashboard includes:</p>
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
                  <p className="text-secondary-label">{item}</p>
                </li>
              ))}
            </ul>

            <div className="bg-muted/20 rounded-xl p-6 border border-border">
              <p className="text-sm text-tertiary-label mb-2">sample text for social share:</p>
              <p className="text-base text-foreground italic">
                "i just joined the private beta for utm.one — the new clean-track powered link shortener. use my link to skip the line."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9 - WHY PEOPLE ARE JOINING */}
      <section className="bg-muted/20 py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8">
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
              "analytics that always match your spend",
              "short links + QR + partner tracking in one place",
              "perfect for marketers, founders, creators, and agencies",
            ].map((reason, index) => (
              <li key={index} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-secondary-label">{reason}</p>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* SECTION 10 - ENTER WAITLIST FORM */}
      <section id="early-access-form" className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <>
              {referrerName && (
                <AnimatedHeadline>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <p className="font-semibold text-green-900">
                        you've been invited by {referrerName}
                      </p>
                    </div>
                    <p className="text-sm text-green-700">
                      join now to get <strong>1 month of Pro free</strong> when we launch
                    </p>
                  </div>
                </AnimatedHeadline>
              )}

              <AnimatedHeadline>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-12 text-center">
                  enter the waitlist
                </h2>
              </AnimatedHeadline>

              <EarlyAccessStepForm onSuccess={handleSuccess} prefillEmail={prefillEmail} />
              
              <p className="text-sm text-center text-tertiary-label mt-4">
                we'll send you your position instantly.
              </p>
            </>
          ) : (
            <AnimatedHeadline>
              <div className="text-center space-y-6 py-12">
                <CheckCircle2 className="w-20 h-20 text-primary mx-auto" />
                <h2 className="text-4xl md:text-5xl font-display font-bold">
                  you're in! 🎉
                </h2>
                <p className="text-xl text-secondary-label">
                  check your email for your waitlist position and golden ticket.
                </p>
                
                {referralCode && (
                  <div className="mt-12 space-y-6">
                    <GoldenTicket
                      userName={userName}
                      referralCode={referralCode}
                      referralCount={0}
                      status="locked"
                    />
                    
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8">
                      <h3 className="text-2xl font-display font-bold mb-3">
                        skip the line now
                      </h3>
                      <p className="text-secondary-label mb-6">
                        share your unique link — refer 3 friends and unlock instant access + 1 month Pro free!
                      </p>
                      <ShareReferralModal referralCode={referralCode} userName={userName} />
                    </div>
                  </div>
                )}
              </div>
            </AnimatedHeadline>
          )}
        </div>
      </section>

      {/* SECTION 12 - FAQ */}
      <EarlyAccessFAQ />

      {/* SECTION 13 - FOOTER CTA */}
      <section className="bg-gradient-to-br from-primary/10 to-blazeOrange/10 py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8">
              join early access now. unlock your golden ticket.
            </h2>
            <Button
              size="lg"
              onClick={scrollToForm}
              className="rounded-full px-12 py-8 text-xl bg-blazeOrange hover:bg-blazeOrange/90 text-white font-bold shadow-xl hover:shadow-2xl"
            >
              join the waitlist
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
