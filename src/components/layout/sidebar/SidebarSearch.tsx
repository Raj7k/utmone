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
import { allNavigationWithCategories } from "@/config/navigation";

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

  // Group navigation by category
  const groupedNavigation = allNavigationWithCategories.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof allNavigationWithCategories>);

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
                    {item.isNew && (
                      <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
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
