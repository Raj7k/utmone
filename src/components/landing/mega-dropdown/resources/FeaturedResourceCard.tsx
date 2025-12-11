import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Bot, GitBranch, FileBarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const featuredResources = [
  {
    icon: Bot,
    title: "LLM Ranking Playbook",
    desc: "AI search optimization",
    path: "/resources/playbooks/llm-ranking",
    badge: "NEW"
  },
  {
    icon: GitBranch,
    title: "B2B Attribution Framework",
    desc: "multi-touch models",
    path: "/resources/frameworks/b2b-attribution",
    badge: "NEW"
  },
  {
    icon: FileBarChart,
    title: "Salary Benchmark Report",
    desc: "marketing comp data",
    path: "/resources/reports/salary-benchmark",
    badge: "FEATURED"
  }
];

export function FeaturedResourceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl p-3
        bg-white/[0.02] border border-white/[0.08]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
    >
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2 px-1">Featured</p>
      <div className="flex flex-col gap-2">
        {featuredResources.map((resource, i) => (
          <Link
            key={resource.title}
            to={resource.path}
            className="group flex items-center gap-3 p-2 rounded-xl 
              bg-white/[0.03] border border-white/[0.1]
              hover:bg-white/[0.06] hover:border-white/[0.15]
              transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.12] transition-colors">
              <resource.icon className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">{resource.title}</span>
                <Badge className="px-1 py-0 text-[8px] h-3.5 bg-white/10 text-white/60 border-0">{resource.badge}</Badge>
              </div>
              <p className="text-[9px] text-white/40">{resource.desc}</p>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/40 transition-all duration-300 shrink-0" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
