import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, Settings, Briefcase, Code, DollarSign, Handshake, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const roles = [
  { icon: Megaphone, label: "Marketing", path: "/solutions/marketers", desc: "campaign tracking" },
  { icon: Settings, label: "Marketing Ops", path: "/solutions/marketing-ops", desc: "UTM governance" },
  { icon: Briefcase, label: "Sales", path: "/solutions/sales", desc: "lead attribution" },
  { icon: Code, label: "Developers", path: "/solutions/developers", desc: "API & SDK" },
  { icon: DollarSign, label: "RevOps", path: "/solutions/revops", desc: "revenue intelligence" },
  { icon: Handshake, label: "Partners", path: "/solutions/partner-managers", desc: "partner tracking" },
  { icon: Target, label: "Field Marketing", path: "/solutions/field-marketing", desc: "event attribution", isNew: true },
];

interface RoleGridCardProps {
  variant?: "light" | "dark";
}

export function RoleGridCard({ variant = "dark" }: RoleGridCardProps) {
  const isLight = variant === "light";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn(
        "rounded-2xl p-4",
        isLight
          ? "bg-zinc-50 border border-zinc-200"
          : "bg-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
      )}
    >
      <p className={cn(
        "text-[10px] font-medium uppercase tracking-wider mb-3 px-1",
        isLight ? "text-zinc-400" : "text-white/40"
      )}>By Role</p>
      <div className="grid grid-cols-2 gap-1">
        {roles.map((role) => (
          <Link
            key={role.label}
            to={role.path}
            className={cn(
              "group flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
              isLight ? "hover:bg-zinc-100" : "hover:bg-white/[0.05]"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
              isLight ? "bg-zinc-100 group-hover:bg-zinc-200" : "bg-white/[0.06] group-hover:bg-white/[0.1]"
            )}>
              <role.icon className={cn(
                "w-3.5 h-3.5 transition-colors",
                isLight ? "text-zinc-500 group-hover:text-zinc-700" : "text-white/60 group-hover:text-white/80"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-[11px] font-medium transition-colors",
                  isLight ? "text-zinc-700 group-hover:text-zinc-900" : "text-white/80 group-hover:text-white"
                )}>{role.label}</span>
                {role.isNew && (
                  <Badge className={cn(
                    "px-1 py-0 text-[8px] h-3.5 border-0",
                    isLight ? "bg-zinc-200 text-zinc-600" : "bg-white/10 text-white/70"
                  )}>NEW</Badge>
                )}
              </div>
              <p className={cn("text-[9px]", isLight ? "text-zinc-400" : "text-white/40")}>{role.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
