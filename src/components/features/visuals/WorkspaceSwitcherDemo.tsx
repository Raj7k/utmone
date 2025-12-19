import { useState } from "react";
import { Building2, ChevronDown, Check, Users, BarChart3, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSSAnimatePresence } from "@/components/landing/motion";

const workspaces = [
  { 
    id: "acme", 
    name: "Acme Corp", 
    domain: "go.acme.io", 
    links: 1247, 
    members: 8,
    color: "from-blue-500 to-cyan-500" 
  },
  { 
    id: "globex", 
    name: "Globex Industries", 
    domain: "link.globex.com", 
    links: 892, 
    members: 5,
    color: "from-purple-500 to-pink-500" 
  },
  { 
    id: "initech", 
    name: "Initech Solutions", 
    domain: "go.initech.co", 
    links: 2341, 
    members: 12,
    color: "from-amber-500 to-orange-500" 
  },
];

export const WorkspaceSwitcherDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(workspaces[0]);

  const handleSelect = (workspace: typeof workspaces[0]) => {
    setSelected(workspace);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Glass container */}
      <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }} />
        </div>

        {/* Header with switcher */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-wider">Active Workspace</span>
            <span className="text-xs text-white/40">{workspaces.length} clients</span>
          </div>
          
          {/* Workspace Switcher */}
          <div className="relative mt-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
                isOpen 
                  ? "bg-white/10 border-primary/50" 
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                selected.color
              )}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{selected.name}</p>
                <p className="text-xs text-white/50">{selected.domain}</p>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-white/40 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown */}
            <CSSAnimatePresence show={isOpen} animation="slide-up">
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-white/10 rounded-lg overflow-hidden z-10">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSelect(workspace)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 transition-colors",
                      workspace.id === selected.id 
                        ? "bg-primary/10" 
                        : "hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      workspace.color
                    )}>
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">{workspace.name}</p>
                      <p className="text-xs text-white/50">{workspace.domain}</p>
                    </div>
                    {workspace.id === selected.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CSSAnimatePresence>
          </div>
        </div>

        {/* Workspace Stats */}
        <div className="p-6">
          <div
            key={selected.id}
            className="grid grid-cols-3 gap-4 animate-fade-slide-up"
            style={{ animationDuration: '400ms' }}
          >
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-white">{selected.links.toLocaleString()}</p>
              <p className="text-xs text-white/40">Active Links</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-lg font-bold text-white">{selected.members}</p>
              <p className="text-xs text-white/40">Team Members</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-white">1</p>
              <p className="text-xs text-white/40">Custom Domain</p>
            </div>
          </div>

          {/* Isolation badge */}
          <div className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400">RLS-enforced data isolation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
