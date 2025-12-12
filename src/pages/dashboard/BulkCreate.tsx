import { BulkUploadTabs } from '@/components/bulk-upload/BulkUploadTabs';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';
import { Skeleton } from '@/components/ui/skeleton';

export default function BulkCreatePage() {
  const { currentWorkspace, isLoading } = useWorkspaceContext();

  // Progressive render - show layout with skeleton
  return (
    <PageContentWrapper
      title="bulk create"
      description="create multiple short links at once with smart routing and A/B testing"
      breadcrumbs={[{ label: "bulk create" }]}
    >
      {isLoading || !currentWorkspace ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <BulkUploadTabs workspaceId={currentWorkspace.id} />
      )}
    </PageContentWrapper>
  );
}
