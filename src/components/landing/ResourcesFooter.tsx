import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { BookOpen, FileText, Layout, CheckSquare, Network, BookMarked, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * ResourcesFooter - Light mode footer for Resources section
 * Clean, minimal design with black text on white background
 */
export const ResourcesFooter = () => {
  const resourceLinks = [
    { label: "Guides", href: "/resources/guides", icon: BookOpen },
    { label: "Playbooks", href: "/resources/playbooks", icon: FileText },
    { label: "Templates", href: "/resources/templates", icon: Layout },
    { label: "Checklists", href: "/resources/checklists", icon: CheckSquare },
    { label: "Frameworks", href: "/resources/frameworks", icon: Network },
    { label: "Glossary", href: "/resources/glossary", icon: BookMarked },
  ];

  const productLinks = [
    { label: "Short Links", href: "/features/short-links" },
    { label: "UTM Builder", href: "/features/utm-builder" },
    { label: "QR Generator", href: "/features/qr-generator" },
    { label: "Analytics", href: "/features/analytics" },
    { label: "Pricing", href: "/pricing" },
  ];

  const companyLinks = [
    { label: "About", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Changelog", href: "/changelog" },
    { label: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Security", href: "/legal/data-security" },
  ];

  return (
    <footer className="relative border-t border-zinc-200 bg-zinc-50">
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="max-w-[1280px] mx-auto px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="md:col-span-4"
          >
            <UtmOneLogo size="lg" variant="dark" />
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed max-w-[280px]">
              clarity creates confidence. utm.one gives every link a meaning machines can understand and humans can trust.
            </p>
          </motion.div>

          {/* Resources */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            className="md:col-span-2"
          >
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">resources</h3>
            <div className="space-y-2">
              {resourceLinks.map((link) => (
                <Link 
                  key={link.href}
                  to={link.href} 
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Product */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
            className="md:col-span-2"
          >
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">product</h3>
            <div className="space-y-2">
              {productLinks.map((link) => (
                <Link 
                  key={link.href}
                  to={link.href} 
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Company */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
            className="md:col-span-2"
          >
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">company</h3>
            <div className="space-y-2">
              {companyLinks.map((link) => (
                <Link 
                  key={link.href}
                  to={link.href} 
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
            className="md:col-span-2"
          >
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">legal</h3>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <Link 
                  key={link.href}
                  to={link.href} 
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} utm.one. all rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors flex items-center gap-1">
              back to main site <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
