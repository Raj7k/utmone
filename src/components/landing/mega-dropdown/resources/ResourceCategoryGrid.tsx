import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ClipboardList, FileText, Puzzle, FolderOpen, BookMarked, SearchCheck, Wrench, GraduationCap, FileBarChart } from "lucide-react";

const categories = [
  { icon: BookOpen, label: "Guides", path: "/resources/guides", desc: "step-by-step learning" },
  { icon: ClipboardList, label: "Playbooks", path: "/resources/playbooks", desc: "ready-to-use strategies" },
  { icon: FileText, label: "Templates", path: "/resources/templates", desc: "plug & play documents" },
  { icon: Puzzle, label: "Checklists", path: "/resources/checklists", desc: "never miss a step" },
  { icon: FolderOpen, label: "Frameworks", path: "/resources/frameworks", desc: "structured thinking" },
  { icon: BookMarked, label: "Examples", path: "/resources/examples", desc: "real implementations" },
  { icon: SearchCheck, label: "Glossary", path: "/resources/glossary", desc: "marketing definitions" },
  { icon: Wrench, label: "Tools", path: "/tools", desc: "interactive utilities" },
  { icon: FileBarChart, label: "Reports", path: "/resources/reports", desc: "data-driven insights" },
  { icon: GraduationCap, label: "Academy", path: "/resources/academy", desc: "structured courses" },
];

export function ResourceCategoryGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl p-4
        bg-white/[0.02] border border-white/[0.08]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
    >
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-3 px-1">Browse by Category</p>
      <div className="grid grid-cols-2 gap-1">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            to={cat.path}
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.05] transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
              <cat.icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">{cat.label}</span>
              <p className="text-[9px] text-white/40">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
