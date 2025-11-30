import { BulkUploadTabs } from '@/components/bulk-upload/BulkUploadTabs';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';

export default function BulkCreatePage() {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-tertiary-label">loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-semibold text-label mb-2">
          bulk create
        </h1>
        <p className="text-secondary-label">
          create multiple short links at once with advanced features
        </p>
      </div>
      
      <BulkUploadTabs workspaceId={currentWorkspace.id} />
    </div>
  );
}
