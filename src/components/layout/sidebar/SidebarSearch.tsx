import { useNavigate } from "react-router-dom";
import { formatText } from "@/utils/textFormatter";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  LayoutGrid, 
  Link2, 
  BarChart3, 
  QrCode, 
  Target,
  Layers,
  Brain,
  Megaphone,
  Clock,
  Briefcase, 
  CreditCard, 
  User,
  Building2,
  Plus
} from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { useEffect, useRef } from "react";

const allNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid, category: "Workspace" },
  { name: "Links", href: "/dashboard/links", icon: Link2, category: "Workspace" },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, category: "Workspace" },
  { name: "Approvals", href: "/dashboard/approvals", icon: Clock, category: "Workspace" },
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode, category: "Tools" },
  { name: "Targeting", href: "/dashboard/targeting", icon: Target, category: "Tools" },
  { name: "Bulk Create", href: "/dashboard/bulk-create", icon: Layers, category: "Tools" },
  { name: "OneLink Validator", href: "/dashboard/onelink-validator", icon: Brain, category: "Tools" },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone, category: "Growth" },
  { name: "Workspace Settings", href: "/settings/workspace", icon: Briefcase, category: "Settings" },
  { name: "Billing", href: "/settings/billing", icon: CreditCard, category: "Settings" },
  { name: "Account", href: "/settings/profile", icon: User, category: "Settings" },
];

export const SidebarSearch = () => {
  const navigate = useNavigate();
  const { closeSearch } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus search input when mounted
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleSelect = (href: string) => {
    navigate(href);
    closeSearch();
  };

  const groupedNavigation = allNavigation.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof allNavigation>);

  return (
    <aside className="w-[280px] h-screen bg-card border-r border-separator flex flex-col z-40">
      <Command className="h-full rounded-none border-0">
        <div className="border-b border-separator">
          <CommandInput 
            ref={inputRef}
            placeholder="Search navigation..." 
            className="h-[72px] border-0 focus:ring-0"
          />
        </div>
        <CommandList className="max-h-none">
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedNavigation).map(([category, items]) => (
            <CommandGroup key={category} heading={category.toUpperCase()}>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    value={`${item.name} ${category}`}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                  >
                    <Icon className="h-4 w-4 text-secondary-label" />
                    <span>{formatText(item.name)}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
          <CommandGroup heading="TEAM">
            <CommandItem className="flex items-center gap-3 px-3 py-2.5">
              <Building2 className="h-4 w-4 text-secondary-label" />
              <span>Switch workspace</span>
            </CommandItem>
            <CommandItem className="flex items-center gap-3 px-3 py-2.5">
              <Plus className="h-4 w-4 text-secondary-label" />
              <span>Add new team</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </aside>
  );
};
