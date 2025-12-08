import { motion } from "framer-motion";
import { Mail, Share2, Zap } from "lucide-react";

const steps = [
  {
    icon: Mail,
    number: "1",
    title: "join the waitlist",
    description: "enter your email → get your spot → unlock your referral dashboard instantly.",
  },
  {
    icon: Share2,
    number: "2",
    title: "share your unique link",
    description: "every friend who signs up using your link moves you up the line.",
  },
  {
    icon: Zap,
    number: "3",
    title: "refer 3 friends and skip the wait",
    description: "hit 3 referrals → your status flips to 'access granted' automatically → you get in instantly.",
  },
];

export function HowItWorksSteps() {
  return (
    <section className="py-24 md:py-32 px-6 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-white">
            how early access works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="rounded-2xl p-8 h-full hover:shadow-lg transition-shadow bg-zinc-900/40 backdrop-blur-xl border border-white/10">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-primary/10">
                    <step.icon className="w-8 h-8 text-primary/80" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm bg-primary/80">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-white">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
