import { motion } from "framer-motion";
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
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

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
  return (
    <AnimatedSection className="py-12 md:py-20 lg:py-32 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              enterprise grade
            </span>
          </motion.div>
          
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold lowercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            built for teams that can't afford<br className="hidden md:block" /> broken data
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-background/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            utm.one is the enterprise link infrastructure trusted by growth teams 
            managing millions of clicks and thousands of campaigns.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {ENTERPRISE_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="p-5 md:p-6 rounded-xl bg-background/5 border border-background/10 hover:bg-background/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-background mb-1 lowercase">{feature.title}</h3>
                <p className="text-sm text-background/60">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {COMPLIANCE_BADGES.map((badge) => (
            <div 
              key={badge}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 border border-background/20"
            >
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-background/80">{badge}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-8 rounded-2xl bg-background/5 border border-background/10 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { stat: "<100ms", label: "redirect latency" },
            { stat: "99.9%", label: "uptime guarantee" },
            { stat: "∞", label: "link retention" },
            { stat: "24/7", label: "priority support" }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary">{item.stat}</div>
              <div className="text-sm text-background/60 mt-1 lowercase">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            to="/solutions/enterprise"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors lowercase"
          >
            explore enterprise features
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-background/50 mt-3">
            or <Link to="/trust" className="text-primary hover:underline">view our security portal</Link>
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
