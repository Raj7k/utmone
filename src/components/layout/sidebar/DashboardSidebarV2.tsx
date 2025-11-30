import { AnimatePresence, motion } from "framer-motion";
import { useSidebar } from "./SidebarProvider";
import { CollapsedSidebar } from "./CollapsedSidebar";
import { ExpandedSidebar } from "./ExpandedSidebar";
import { SidebarSearch } from "./SidebarSearch";

export const DashboardSidebarV2 = () => {
  const { sidebarState, closeSearch } = useSidebar();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sidebarState === 'searching' && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" 
          onClick={closeSearch}
          aria-hidden="true"
        />
      )}
      <motion.div
        key={sidebarState}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="h-screen relative z-40"
      >
        {sidebarState === 'collapsed' && <CollapsedSidebar />}
        {sidebarState === 'expanded' && <ExpandedSidebar />}
        {sidebarState === 'searching' && <SidebarSearch />}
      </motion.div>
    </AnimatePresence>
  );
};
