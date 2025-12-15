import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { BrickBuilderWizard } from "@/components/brickmatrix/BrickBuilderWizard";

const BrickMatrix = () => {
  return (
    <PageContentWrapper
      title="brick builder"
      description="turn QR codes into buildable brick art"
      breadcrumbs={[{ label: "brick builder" }]}
    >
      <BrickBuilderWizard />
    </PageContentWrapper>
  );
};

export default BrickMatrix;
