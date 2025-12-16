import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, QrCode, BarChart3, DollarSign, LucideIcon } from "lucide-react";

interface QuickAction {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  tourId?: string;
  shortcut?: string;
}

const getModKey = () => {
  const isMac = typeof window !== 'undefined' && navigator.platform.includes('Mac');
  return isMac ? '⌘' : 'Ctrl';
};

const quickActions: QuickAction[] = [
  {
    id: 'create-link',
    icon: Link2,
    label: 'create link',
    description: 'shorten any URL',
    href: '/dashboard/links',
    tourId: 'quick-actions',
    shortcut: '1',
  },
  {
    id: 'qr-code',
    icon: QrCode,
    label: 'QR code',
    description: 'generate QR codes',
    href: '/dashboard/qr-codes',
    shortcut: '2',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'analytics',
    description: 'view performance',
    href: '/dashboard/intelligence',
    shortcut: '3',
  },
  {
    id: 'sales',
    icon: DollarSign,
    label: 'sales',
    description: 'revenue tracking',
    href: '/dashboard/sales',
    shortcut: '4',
  },
];

export const DashboardQuickActions = () => {
  const mod = getModKey();

  return (
    <div 
      data-tour="quick-actions"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
    >
      {quickActions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={action.href}
            className="group flex flex-col items-center justify-center p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 text-center h-full min-h-[120px]"
          >
            <action.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
            <span className="text-sm font-medium text-foreground">{action.label}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{action.description}</span>
            {action.shortcut && (
              <kbd className="mt-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70 bg-muted/50 border border-border/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {mod}+{action.shortcut}
              </kbd>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
