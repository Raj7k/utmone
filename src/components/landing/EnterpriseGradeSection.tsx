import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Shield,
  Globe,
  Key,
  FileText,
  Database,
  Lock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { AnimatedSection } from "./StaticSection";

const ENTERPRISE_FEATURES = [
  {
    icon: Building2,
    title: "multi-workspace governance",
    description: "Separate teams, campaigns, and brands with centralized control"
  },
  {
    icon: Users,
    title: "role-based permissions",
    description: "Super Admin, Admin, Editor, Viewer — granular access control"
  },
  {
    icon: Shield,
    title: "sso & saml",
    description: "Enterprise identity providers supported out of the box"
  },
  {
    icon: Globe,
    title: "custom domains",
    description: "Unlimited branded domains with automatic SSL"
  },
  {
    icon: Key,
    title: "api access",
    description: "600 req/min free tier, GraphQL + REST endpoints"
  },
  {
    icon: FileText,
    title: "audit logging",
    description: "Complete trail of who created, edited, or deleted every link"
  },
  {
    icon: Database,
    title: "data warehouse sync",
    description: "Push to Snowflake, BigQuery, or your data lake"
  },
  {
    icon: Lock,
    title: "field-level encryption",
    description: "AES-256 encryption for all sensitive tokens and secrets"
  }
];

const COMPLIANCE_BADGES = [
  "GDPR Compliant",
  "SOC 2 Type II",
  "99.9% Uptime SLA",
  "WCAG AAA"
];

export const EnterpriseGradeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection className="py-16 md:py-24">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-16 pb-16 border-t border-b border-white/10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 space-y-4">
          <div
            className="transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-white/[0.06] border border-white/10 text-white-80">
              <Shield className="w-4 h-4" />
              enterprise grade
            </span>
          </div>
          
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold obsidian-platinum-text transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '0.1s'
            }}
          >
            built for teams that can't afford<br className="hidden md:block" /> broken data
          </h1>
          
          <p
            className="text-base md:text-lg max-w-3xl mx-auto text-white-50 transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '0.2s'
            }}
          >
            utm.one is the enterprise link infrastructure trusted by growth teams 
            managing millions of clicks and thousands of campaigns.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
          {ENTERPRISE_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-4 md:p-5 rounded-xl transition-all duration-300 min-h-[140px] obsidian-glass hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 0.05}s`
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 bg-white/10">
                  <Icon className="w-4 h-4 text-white-80" />
                </div>
                <h3 className="font-semibold mb-1 text-sm text-white-90">{feature.title}</h3>
                <p className="text-xs text-white-50">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Compliance Badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10 transition-all duration-500"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.4s'
          }}
        >
          {COMPLIANCE_BADGES.map((badge) => (
            <div 
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            >
              <CheckCircle2 className="w-3 h-3 text-white-70" />
              <span className="text-xs font-medium text-white-80">{badge}</span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-5 md:p-6 rounded-xl mb-10 bg-white/[0.03] border border-white/10 transition-all duration-500"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.5s'
          }}
        >
          {[
            { stat: "<100ms", label: "redirect latency" },
            { stat: "99.9%", label: "uptime guarantee" },
            { stat: "∞", label: "link retention" },
            { stat: "24/7", label: "priority support" }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white-90">
                {item.stat}
              </div>
              <div className="text-xs mt-0.5 text-white-50">{item.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center transition-all duration-500"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.6s'
          }}
        >
          <Link 
            to="/solutions/enterprise"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all text-sm bg-gradient-to-r from-white to-zinc-200 text-obsidian shadow-[0_0_30px_hsl(var(--white-10))] hover:scale-105 active:scale-95"
          >
            explore enterprise features
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs mt-2 text-white-40">
            or <Link to="/trust" className="hover:underline text-white-70">view our security portal</Link>
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
};
