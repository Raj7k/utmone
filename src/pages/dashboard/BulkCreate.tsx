import { BulkUploadTabs } from '@/components/bulk-upload/BulkUploadTabs';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { PageContentWrapper } from '@/components/layout/PageContentWrapper';
import { DashboardContentLoader } from '@/components/loading/DashboardContentLoader';

export default function BulkCreatePage() {
  const { currentWorkspace, isLoading } = useWorkspaceContext();

  return (
    <PageContentWrapper
      title="bulk create"
      description="create multiple short links at once with smart routing and A/B testing"
      breadcrumbs={[{ label: "bulk create" }]}
    >
      {isLoading || !currentWorkspace ? (
        <DashboardContentLoader context="bulk" minHeight="50vh" />
      ) : (
        <BulkUploadTabs workspaceId={currentWorkspace.id} />
      )}
    </PageContentWrapper>
  );
}
