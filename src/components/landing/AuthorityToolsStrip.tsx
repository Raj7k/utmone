import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calculator, Shield, Gamepad2, QrCode, ArrowRight, Users } from "lucide-react";

const tools = [
  {
    icon: Calculator,
    title: "ROI Calculator",
    description: "project your campaign returns",
    cta: "calculate your roi",
    link: "/tools/roi-calculator",
  },
  {
    icon: Shield,
    title: "Link Scanner",
    description: "audit your link hygiene",
    cta: "scan your links",
    link: "/tools/scanner",
  },
  {
    icon: Gamepad2,
    title: "GTM Casino",
    description: "simulate campaign outcomes",
    cta: "run simulations",
    link: "/tools/casino",
  },
  {
    icon: QrCode,
    title: "QR Crash Test",
    description: "stress-test your qr designs",
    cta: "test your qr",
    link: "/tools/qr-test",
  },
];

export const AuthorityToolsStrip = () => {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Usage counter */}
        <motion.div 
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/70">
              <motion.span
                className="font-semibold text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                500+
              </motion.span>
              {" "}marketers used these tools this month
            </span>
          </div>
        </motion.div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link to={tool.link} className="block h-full">
                <motion.div
                  className="h-full p-5 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 group"
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                    <tool.icon className="w-5 h-5 text-white/70" />
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-semibold text-white/90 mb-1 lowercase">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-white/50 mb-4 lowercase">
                    {tool.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors lowercase">
                    {tool.cta}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
