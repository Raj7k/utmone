import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Key, 
  Webhook, 
  Shield, 
  Palette, 
  Users, 
  ShieldCheck, 
  CreditCard,
  Code2,
  ChevronDown,
  Activity,
  TrendingUp,
  Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const settingsGroups = [
  {
    name: "General",
    items: [
      { id: "domains", label: "Domains", icon: Globe },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "team", label: "Team", icon: Users },
    ],
  },
  {
    name: "Billing",
    items: [
      { id: "billing", label: "Plans & Billing", icon: CreditCard },
    ],
  },
  {
    name: "Tracking",
    items: [
      { id: "tracking", label: "Tracking Pixel", icon: Activity, badge: "!" },
      { id: "pipeline", label: "Pipeline Sync", icon: TrendingUp },
    ],
  },
  {
    name: "Developer",
    items: [
      { id: "developers", label: "API Keys", icon: Code2 },
      { id: "integrations", label: "Integrations", icon: Webhook },
    ],
  },
  {
    name: "Alerts",
    items: [
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    name: "Security",
    items: [
      { id: "security", label: "Security", icon: ShieldCheck },
      { id: "privacy", label: "Data & Privacy", icon: Shield },
    ],
  },
];

export const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    General: true,
    Tracking: true,
    Billing: true,
    Developer: true,
    Alerts: true,
    Security: true,
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  // Check if any item in group is active
  const hasActiveItem = (groupName: string) => {
    const group = settingsGroups.find(g => g.name === groupName);
    return group?.items.some(item => item.id === activeTab);
  };

  return (
    <aside className="w-64 border-r border-separator bg-system-background p-4">
      <div className="space-y-6">
        {settingsGroups.map((group) => {
          const isGroupOpen = openGroups[group.name] || hasActiveItem(group.name);
          
          return (
            <Collapsible key={group.name} open={isGroupOpen} onOpenChange={() => toggleGroup(group.name)}>
              <div className="space-y-1">
                <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-1.5 group">
                  <p className="text-xs font-medium text-tertiary-label uppercase tracking-wider">
                    {group.name}
                  </p>
                  <ChevronDown className={cn(
                    "h-3 w-3 text-tertiary-label transition-transform",
                    isGroupOpen && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-apple transition-apple",
                          isActive
                            ? "bg-muted text-foreground font-medium"
                            : "text-label hover:bg-fill-tertiary"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="outline" 
                            className="bg-system-orange/10 text-system-orange border-system-orange/20 px-1.5 py-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </aside>
  );
};
