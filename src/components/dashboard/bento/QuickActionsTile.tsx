import { Zap, Link2, QrCode, BarChart3, Shield, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "@/contexts/ModalContext";

export const QuickActionsTile = () => {
  const { setCreateModalOpen } = useModal();
  const navigate = useNavigate();

  const actions = [
    { 
      name: "create link", 
      onClick: () => setCreateModalOpen(true), 
      icon: Link2,
      description: "shorten a url"
    },
    { 
      name: "generate qr code", 
      href: "/dashboard/qr-codes", 
      icon: QrCode,
      description: "branded qr codes"
    },
    { 
      name: "view analytics", 
      href: "/dashboard/analytics", 
      icon: BarChart3,
      description: "see your stats"
    },
    { 
      name: "check link health", 
      href: "/dashboard/link-health", 
      icon: Shield,
      description: "monitor uptime"
    },
    { 
      name: "build utm", 
      onClick: () => navigate("/tools?tool=utm"), 
      icon: Sparkles,
      description: "campaign parameters"
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-title-3 font-display">quick actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          
          if (action.href) {
            return (
              <Link
                key={action.name}
                to={action.href}
                className="flex items-start gap-3 px-3 py-3 rounded-lg text-body-apple transition-apple hover:bg-muted group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-label group-hover:text-primary transition-colors">
                    {action.name}
                  </div>
                  <div className="text-xs text-secondary-label">
                    {action.description}
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <button
              key={action.name}
              onClick={action.onClick}
              className="flex items-start gap-3 px-3 py-3 rounded-lg text-body-apple transition-apple hover:bg-muted group text-left"
            >
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-4 w-4 text-primary flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-label group-hover:text-primary transition-colors">
                  {action.name}
                </div>
                <div className="text-xs text-secondary-label">
                  {action.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
