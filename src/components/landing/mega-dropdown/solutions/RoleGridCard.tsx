import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, Settings, Briefcase, Code, DollarSign, Handshake, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const roles = [
  { icon: Megaphone, label: "Marketing", path: "/solutions/marketers", desc: "campaign tracking" },
  { icon: Settings, label: "Marketing Ops", path: "/solutions/marketing-ops", desc: "UTM governance" },
  { icon: Briefcase, label: "Sales", path: "/solutions/sales", desc: "lead attribution" },
  { icon: Code, label: "Developers", path: "/solutions/developers", desc: "API & SDK" },
  { icon: DollarSign, label: "RevOps", path: "/solutions/revops", desc: "revenue intelligence" },
  { icon: Handshake, label: "Partners", path: "/solutions/partner-managers", desc: "partner tracking" },
  { icon: Target, label: "Field Marketing", path: "/solutions/field-marketing", desc: "event attribution", isNew: true },
];

export function RoleGridCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-4
        bg-white/[0.02] border border-white/[0.08]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
    >
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-3 px-1">By Role</p>
      <div className="grid grid-cols-2 gap-1">
        {roles.map((role) => (
          <Link
            key={role.label}
            to={role.path}
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.05] transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
              <role.icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">{role.label}</span>
                {role.isNew && (
                  <Badge className="px-1 py-0 text-[8px] h-3.5 bg-white/10 text-white/70 border-0">NEW</Badge>
                )}
              </div>
              <p className="text-[9px] text-white/40">{role.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
