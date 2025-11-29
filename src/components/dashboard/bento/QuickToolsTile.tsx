import { Zap, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickToolsTile = () => {
  const tools = [
    { name: "Create QR Code", href: "/dashboard/qr-codes", icon: QrCode },
  ];

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-title-3 font-display">Quick Tools</h3>
      </div>

      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.name}
              to={tool.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple hover:bg-slate-100 dark:hover:bg-slate-800 text-secondary-label hover:text-label"
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{tool.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
