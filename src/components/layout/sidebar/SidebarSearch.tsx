import { useNavigate, Link } from "react-router-dom";
import { formatText } from "@/utils/textFormatter";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Building2, Plus, X } from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { useEffect, useRef, useState } from "react";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { allNavigationWithCategories, settingsGroups, appNavigation, toolsNavigation, intelligenceNavigation, growthNavigation } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";

export const SidebarSearch = () => {
  const navigate = useNavigate();
  const { closeSearch } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    // Auto-focus search input when mounted
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleSelect = (href: string) => {
    navigate(href);
    closeSearch();
  };

  // Navigation sections
  const navigationSections = [
    { label: "App", items: appNavigation },
    { label: "Tools", items: toolsNavigation },
    { label: "Intelligence", items: intelligenceNavigation },
    { label: "Growth", items: growthNavigation },
  ];

  return (
    <aside className="w-[280px] h-screen bg-card border-r border-separator flex flex-col z-40">
      {/* Header with Logo and Close Button */}
      <div className="h-[72px] flex items-center justify-between px-4 border-b border-separator">
        <Link to="/dashboard" onClick={closeSearch}>
          <UtmOneLogo size="sm" />
        </Link>
        <button
          onClick={closeSearch}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-label hover:text-label hover:bg-muted transition-colors"
          aria-label="Close search"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Command className="h-full rounded-none border-0">
        <div className="border-b border-separator">
          <CommandInput 
            ref={inputRef}
            placeholder="Search navigation..." 
            className="h-12 border-0 focus:ring-0"
          />
          <p className="text-xs text-tertiary-label px-3 pb-2">Press ESC to close</p>
        </div>
        <CommandList className="max-h-none overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Main Navigation Sections */}
          {navigationSections.map((section) => (
            <CommandGroup key={section.label} heading={section.label.toUpperCase()}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    value={`${item.name} ${section.label}`}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                  >
                    <Icon className="h-4 w-4 text-secondary-label" />
                    <span>{formatText(item.name)}</span>
                    {item.isNew && (
                      <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/20 px-1.5 py-0">
                        New
                      </Badge>
                    )}
                    {item.badge === true && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}

          {/* Settings Groups */}
          {settingsGroups.map((group) => (
            <CommandGroup key={group.name} heading={`SETTINGS / ${group.name.toUpperCase()}`}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    value={`${item.name} Settings ${group.name}`}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                  >
                    <Icon className="h-4 w-4 text-secondary-label" />
                    <span>{formatText(item.name)}</span>
                    {item.isNew && (
                      <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/20 px-1.5 py-0">
                        New
                      </Badge>
                    )}
                    {typeof item.badge === 'string' && (
                      <Badge variant="outline" className="ml-auto bg-system-orange/10 text-system-orange border-system-orange/20 px-1.5 py-0">
                        {item.badge}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}

          {/* Team Section */}
          <CommandGroup heading="TEAM">
            <CommandItem 
              onSelect={() => {
                navigate('/client-workspaces');
                closeSearch();
              }}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-secondary-label" />
              <span>Switch workspace</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => {
                setCreateDialogOpen(true);
                closeSearch();
              }}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-secondary-label" />
              <span>Add new team</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
      />
    </aside>
  );
};
