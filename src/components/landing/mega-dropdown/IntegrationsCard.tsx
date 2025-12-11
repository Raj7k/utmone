import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

// Real brand SVG logos (monochromatic white)
const integrations = [
  { 
    name: "Zapier", 
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M15.54 12l2.83-2.83a1.004 1.004 0 000-1.42l-2.83-2.83L12.71 7.75l1.42 1.42-1.42 1.41L9.88 7.75 7.05 4.92a1.004 1.004 0 00-1.42 0L2.8 7.75a1.004 1.004 0 000 1.42l2.83 2.83 2.83-2.83 1.42 1.42-1.42 1.41 2.83 2.83 2.83-2.83a1.004 1.004 0 000-1.42l2.83-2.83zM12 14.83l-1.42-1.42L12 12l1.42 1.41L12 14.83zm0-5.66L10.58 7.75 12 6.33l1.42 1.42L12 9.17z"/>
      </svg>
    )
  },
  { 
    name: "Slack", 
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    )
  },
  { 
    name: "HubSpot", 
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.164 7.93V5.084a2.198 2.198 0 0 0 1.267-1.978v-.067a2.2 2.2 0 0 0-2.2-2.2h-.066a2.2 2.2 0 0 0-2.2 2.2v.067a2.196 2.196 0 0 0 1.267 1.978v2.846a6.468 6.468 0 0 0-2.906 1.456l-7.64-5.95a2.569 2.569 0 1 0-1.165 1.523l7.48 5.826a6.482 6.482 0 0 0-.143 1.37c0 .48.054.949.157 1.402l-2.64 1.142a2.126 2.126 0 1 0 .776 1.634l-.002-.092 2.758-1.194a6.503 6.503 0 1 0 5.257-8.047zm-1.141 9.506a3.485 3.485 0 1 1-.005-6.97 3.485 3.485 0 0 1 .005 6.97z"/>
      </svg>
    )
  },
  { 
    name: "Salesforce", 
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.16 5.22c-.345 0-.69-.045-1.02-.105a3.9 3.9 0 0 1-3.315 1.86c-.57 0-1.11-.135-1.605-.36a4.62 4.62 0 0 1-4.125 2.535c-2.175 0-4.005-1.5-4.53-3.525a5.166 5.166 0 0 1-.885.075C1.439 16.785 0 15.33 0 13.515s1.44-3.27 3.36-3.27c.27 0 .525.03.78.075.48-2.34 2.565-4.095 5.055-4.095.405 0 .795.045 1.17.135a4.128 4.128 0 0 1-.36-1.695z"/>
      </svg>
    )
  },
  { 
    name: "Notion", 
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.746 0-.933-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.094-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933zM2.24 1.688l13.075-.933c1.682-.14 2.12.093 2.834.653l3.876 2.847c.56.42.747.56.747 1.027v15.247c0 .98-.373 1.54-1.635 1.633l-15.503.887c-.933.047-1.4-.093-1.866-.7l-2.476-3.22c-.467-.653-.653-1.12-.653-1.633V3.321c0-.7.373-1.54 1.541-1.633z"/>
      </svg>
    )
  },
];

export function IntegrationsCard() {
  return (
    <Link to="/features/integrations" className="block">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-white/90 mb-0.5">Integrations</h3>
            <p className="text-xs text-white/50">Connect your stack</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.span 
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              50+ apps
            </motion.span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/40 transition-all duration-200" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.25 + i * 0.04 }}
              className="group/icon flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200 cursor-pointer text-white/60 hover:text-white/100"
              title={integration.name}
            >
              {integration.logo}
            </motion.div>
          ))}
          
          {/* More indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.45 }}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.02] border border-dashed border-white/[0.1] text-white/30 text-xs font-mono"
          >
            +45
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
