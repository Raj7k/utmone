import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { BrickBuilderContent } from "@/components/brickmatrix/BrickBuilderContent";

const BrickMatrix = () => {
  return (
    <PageContentWrapper
      title="brick builder"
      description="turn QR codes into buildable brick art"
      breadcrumbs={[{ label: "brick builder" }]}
    >
      <BrickBuilderContent />
    </PageContentWrapper>
  );
};

export default BrickMatrix;
