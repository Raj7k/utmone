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
    <AnimatedSection className="py-16 md:py-24">
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingTop: '4rem', paddingBottom: '4rem' }}
      >
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)'
              }}
            >
              <Shield className="w-4 h-4" />
              enterprise grade
            </span>
          </motion.div>
          
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            built for teams that can't afford<br className="hidden md:block" /> broken data
          </motion.h1>
          
          <motion.p
            className="text-base md:text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            utm.one is the enterprise link infrastructure trusted by growth teams 
            managing millions of clicks and thousands of campaigns.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
          {ENTERPRISE_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="p-4 md:p-5 rounded-xl transition-all min-h-[140px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  background: 'rgba(24,24,27,0.4)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
                }}
              >
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                </div>
                <h3 className="font-semibold mb-1 lowercase text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{feature.title}</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {COMPLIANCE_BADGES.map((badge) => (
            <div 
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <CheckCircle2 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.7)' }} />
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{badge}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-5 md:p-6 rounded-xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {[
            { stat: "<100ms", label: "redirect latency" },
            { stat: "99.9%", label: "uptime guarantee" },
            { stat: "∞", label: "link retention" },
            { stat: "24/7", label: "priority support" }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div 
                className="text-xl md:text-2xl lg:text-3xl font-display font-bold"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {item.stat}
              </div>
              <div className="text-xs mt-0.5 lowercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</div>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all lowercase text-sm"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF, #E4E4E7)',
              color: '#050505',
              boxShadow: '0 0 30px rgba(255,255,255,0.1)'
            }}
          >
            explore enterprise features
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            or <Link to="/trust" className="hover:underline" style={{ color: 'rgba(255,255,255,0.7)' }}>view our security portal</Link>
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
