import { Link } from "react-router-dom";
import { BookOpen, ClipboardList, FileText, Puzzle, FolderOpen, BookMarked, SearchCheck, Wrench, GraduationCap, FileBarChart, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { icon: HelpCircle, label: "Help Center", path: "/help", desc: "documentation & guides", isNew: true },
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

interface ResourceCategoryGridProps {
  variant?: "light" | "dark";
}

export function ResourceCategoryGrid({ variant = "dark" }: ResourceCategoryGridProps) {
  const isLight = variant === "light";
  
  return (
    <div
      className={cn(
        "rounded-2xl p-4 animate-fade-in-dropdown opacity-0",
        isLight
          ? "bg-zinc-50 border border-zinc-200"
          : "bg-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
      )}
      style={{ animationDelay: "0.1s" }}
    >
      <p className={cn(
        "text-[10px] font-medium uppercase tracking-wider mb-3 px-1",
        isLight ? "text-zinc-400" : "text-white/40"
      )}>Browse by Category</p>
      <div className="grid grid-cols-2 gap-1">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            to={cat.path}
            className={cn(
              "group flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
              isLight ? "hover:bg-zinc-100" : "hover:bg-white/[0.05]"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
              isLight 
                ? "bg-zinc-100 group-hover:bg-zinc-200" 
                : "bg-white/[0.06] group-hover:bg-white/[0.1]"
            )}>
              <cat.icon className={cn(
                "w-3.5 h-3.5 transition-colors",
                isLight 
                  ? "text-zinc-500 group-hover:text-zinc-700" 
                  : "text-white/60 group-hover:text-white/80"
              )} />
            </div>
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-[11px] font-medium transition-colors",
                isLight 
                  ? "text-zinc-700 group-hover:text-zinc-900" 
                  : "text-white/80 group-hover:text-white"
              )}>{cat.label}</span>
              {cat.isNew && (
                <span className="px-1 py-0.5 text-[8px] font-medium bg-emerald-500/20 text-emerald-400 rounded">new</span>
              )}
            </div>
            <p className={cn(
              "text-[9px]",
              isLight ? "text-zinc-400" : "text-white/40"
            )}>{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
