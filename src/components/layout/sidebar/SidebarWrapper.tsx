// Sidebar wrapper component - isolates sidebar from main layout
import { SidebarProvider } from './SidebarProvider';
import { DashboardSidebarV2 } from './DashboardSidebarV2';

const SidebarWrapper = () => {
  return (
    <SidebarProvider>
      <div className="hidden lg:block flex-shrink-0">
        <DashboardSidebarV2 />
      </div>
    </SidebarProvider>
  );
};

export default SidebarWrapper;