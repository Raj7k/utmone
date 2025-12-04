import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Compare = () => {
  const linkTools = [
    {
      name: "Bitly",
      href: "/compare/bitly",
      category: "link shorteners",
      differentiator: "predictive analytics, clean-track governance"
    },
    {
      name: "Rebrandly",
      href: "/compare/rebrandly",
      category: "branded links",
      differentiator: "link immunity, attribution graph"
    },
    {
      name: "Short.io",
      href: "/compare/short-io",
      category: "enterprise links",
      differentiator: "bayesian A/B testing, smart routing"
    },
    {
      name: "bl.ink",
      href: "/compare/bl-ink",
      category: "enterprise links",
      differentiator: "zero broken links, field-level encryption"
    }
  ];

  const affiliateTools = [
    {
      name: "Rewardful",
      href: "/compare/rewardful",
      category: "affiliate tracking",
      differentiator: "clean-track partner attribution"
    },
    {
      name: "PartnerStack",
      href: "/compare/partnerstack",
      category: "partner ecosystem",
      differentiator: "multi-touch attribution, real-time webhooks"
    },
    {
      name: "FirstPromoter",
      href: "/compare/firstpromoter",
      category: "affiliate programs",
      differentiator: "identity resolution, journey valuation"
    },
    {
      name: "Tolt",
      href: "/compare/tolt",
      category: "simple tracking",
      differentiator: "enterprise governance, bayesian attribution"
    }
  ];

  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Compare utm.one - Link Management & Partner Attribution Alternatives"
        description="See how utm.one compares to Bitly, Rebrandly, Short.io, bl.ink for link management, and Rewardful, PartnerStack, FirstPromoter, Tolt for partner attribution."
        canonical="/compare"
      />

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-text-content mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold lowercase mb-6 hero-gradient">
              compare utm.one
            </h1>
            <p className="text-xl md:text-2xl text-white/60 lowercase max-w-3xl mx-auto">
              see how utm.one's clean-track framework and AI intelligence compare to traditional link management and partner tracking tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Link Management Tools */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4 text-white">
              vs. link management
            </h2>
            <p className="text-lg text-white/60 lowercase max-w-2xl">
              utm.one delivers link shortening plus predictive analytics, link immunity, and clean-track governance that traditional tools don't offer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {linkTools.map((tool, index) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={tool.href}
                  className="group block p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-2 text-white group-hover:text-white/80 transition-colors">
                        utm.one vs {tool.name}
                      </h3>
                      <p className="text-sm text-white/40 lowercase">
                        {tool.category}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(34,197,94,0.8)' }} />
                    <p className="text-white/60 lowercase">
                      <span className="text-white font-medium">utm.one adds:</span> {tool.differentiator}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Attribution Tools */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4 text-white">
              vs. partner attribution
            </h2>
            <p className="text-lg text-white/60 lowercase max-w-2xl">
              utm.one brings bayesian attribution, identity resolution, and journey valuation to partner tracking—not just click counting.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {affiliateTools.map((tool, index) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={tool.href}
                  className="group block p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-2 text-white group-hover:text-white/80 transition-colors">
                        utm.one vs {tool.name}
                      </h3>
                      <p className="text-sm text-white/40 lowercase">
                        {tool.category}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(34,197,94,0.8)' }} />
                    <p className="text-white/60 lowercase">
                      <span className="text-white font-medium">utm.one adds:</span> {tool.differentiator}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-text-content mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-6 text-white">
              see the difference yourself
            </h2>
            <p className="text-lg text-white/60 lowercase mb-8 max-w-2xl mx-auto">
              start with utm.one's free tier—no credit card required. experience clean-track governance and AI intelligence on your first link.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Compare;