import { BulkUploadTabs } from '@/components/bulk-upload/BulkUploadTabs';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';

export default function BulkCreatePage() {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">loading workspace...</p>
      </div>
    );
  }

  return (
    <PageContentWrapper
      title="bulk create"
      description="create multiple short links at once with smart routing and A/B testing"
      breadcrumbs={[{ label: "bulk create" }]}
    >
      <BulkUploadTabs workspaceId={currentWorkspace.id} />
    </PageContentWrapper>
  );
}
