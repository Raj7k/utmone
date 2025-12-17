import { Link } from "react-router-dom";
import { Calculator, Shield, Gamepad2, QrCode, ArrowRight, Users } from "lucide-react";
import { useInView } from "@/hooks/useInView";

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
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section className="w-full py-16 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Usage counter */}
        <div 
          className={`flex items-center justify-center gap-3 mb-10 transition-all duration-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/70">
              <span className="font-semibold text-white">500+</span>
              {" "}marketers used these tools this month
            </span>
          </div>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <div
              key={tool.title}
              className={`transition-all duration-400 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
            >
              <Link to={tool.link} className="block h-full">
                <div className="h-full p-5 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 hover:scale-[1.02]">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                    <tool.icon className="w-5 h-5 text-white/70" />
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-semibold text-white/90 mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-white/50 mb-4">
                    {tool.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors">
                    {tool.cta}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
