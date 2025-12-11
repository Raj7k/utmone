import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, QrCode, BarChart3, Waves, DollarSign } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  tourId?: string;
}

const quickActions: QuickAction[] = [
  {
    id: "create-link",
    icon: Link2,
    label: "create link",
    description: "shorten any URL",
    href: "/dashboard/links",
  },
  {
    id: "qr-code",
    icon: QrCode,
    label: "QR code",
    description: "generate codes",
    href: "/dashboard/qr-codes",
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "analytics",
    description: "view insights",
    href: "/dashboard/intelligence",
  },
  {
    id: "events",
    icon: Waves,
    label: "event halo",
    description: "track events",
    href: "/dashboard/events",
  },
  {
    id: "sales",
    icon: DollarSign,
    label: "sales",
    description: "revenue tracking",
    href: "/dashboard/sales",
  },
];

export const DashboardQuickActions = () => {
  return (
    <div data-tour="quick-actions" className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground px-1">quick actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <Link
                to={action.href}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {action.label}
                </span>
                <span className="text-[11px] text-muted-foreground text-center mt-0.5">
                  {action.description}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
