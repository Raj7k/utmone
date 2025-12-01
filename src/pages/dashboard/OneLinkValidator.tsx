import { OneLinkValidator } from '@/components/url-shortener/OneLinkValidator';
import { PageHeader } from '@/components/layout/PageHeader';

export default function OneLinkValidatorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="onelink validator"
        description="URL duplicate detection, version management, and A/B testing optimization"
        breadcrumbs={[{ label: "onelink validator" }]}
      />
      <OneLinkValidator />
    </div>
  );
}
