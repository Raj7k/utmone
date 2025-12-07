import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Globe, 
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
  Bell,
  Chrome,
  User,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const settingsGroups = [
  {
    name: "General",
    items: [
      { id: "profile", label: "Profile", icon: User },
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
      { id: "extension", label: "Browser Extension", icon: Chrome, badge: "new" },
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

// Flatten items for mobile select
const allItems = settingsGroups.flatMap(group => 
  group.items.map(item => ({ ...item, group: group.name }))
);

export const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
  const isMobile = useIsMobile();
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

  const hasActiveItem = (groupName: string) => {
    const group = settingsGroups.find(g => g.name === groupName);
    return group?.items.some(item => item.id === activeTab);
  };

  const activeItem = allItems.find(item => item.id === activeTab);

  // Mobile: Render as Select dropdown
  if (isMobile) {
    return (
      <Select value={activeTab} onValueChange={onTabChange}>
        <SelectTrigger className="w-full h-12 bg-card border-border">
          <div className="flex items-center gap-3">
            {activeItem && (
              <>
                <activeItem.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{activeItem.label}</span>
              </>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[60vh]">
          {settingsGroups.map((group) => (
            <div key={group.name}>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.name}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <SelectItem 
                    key={item.id} 
                    value={item.id}
                    className="py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className="ml-auto bg-primary/10 text-primary border-primary/20 px-1.5 py-0 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </div>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Desktop: Render as sidebar
  return (
    <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-sm">settings</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {settingsGroups.map((group) => {
            const isGroupOpen = openGroups[group.name] || hasActiveItem(group.name);
            
            return (
              <Collapsible key={group.name} open={isGroupOpen} onOpenChange={() => toggleGroup(group.name)}>
                <div className="space-y-1">
                  <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 group rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.name}
                    </p>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                      isGroupOpen && "rotate-180"
                    )} />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => onTabChange(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "px-1.5 py-0 text-xs",
                                isActive 
                                  ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                                  : "bg-primary/10 text-primary border-primary/20"
                              )}
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
      </ScrollArea>
    </aside>
  );
};
