import { useSidebar } from "./SidebarProvider";
import { CollapsedSidebar } from "./CollapsedSidebar";
import { ExpandedSidebar } from "./ExpandedSidebar";
import { SidebarSearch } from "./SidebarSearch";

export const DashboardSidebarV2 = () => {
  const { sidebarState, closeSearch } = useSidebar();

  return (
    <>
      {sidebarState === 'searching' && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm sidebar-backdrop" 
          onClick={closeSearch}
          aria-hidden="true"
        />
      )}
      <div className="h-screen relative z-40 sidebar-enter">
        {sidebarState === 'collapsed' && <CollapsedSidebar />}
        {sidebarState === 'expanded' && <ExpandedSidebar />}
        {sidebarState === 'searching' && <SidebarSearch />}
      </div>
    </>
  );
};
