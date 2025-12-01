import { Zap, Link2, QrCode, BarChart3, Shield, Sparkles, Route } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "@/contexts/ModalContext";
import { MagneticCard } from "@/components/magnetic";

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
      name: "smart routing", 
      href: "/dashboard/links", 
      icon: Route,
      description: "AI-powered A/B testing"
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
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-title-3 font-display">quick actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          const CardContent = (
            <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center group">

              {/* Icon with gradient background */}
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              {/* Title */}
              <h4 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                {action.name}
              </h4>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          );

          if (action.href) {
            return (
              <MagneticCard key={action.name} strength={0.15} enableTilt={true} enableGlow={true}>
                <Link to={action.href} className="block h-full">
                  {CardContent}
                </Link>
              </MagneticCard>
            );
          }

          return (
            <MagneticCard key={action.name} strength={0.15} enableTilt={true} enableGlow={true}>
              <button onClick={action.onClick} className="w-full h-full">
                {CardContent}
              </button>
            </MagneticCard>
          );
        })}
      </div>
    </div>
  );
};