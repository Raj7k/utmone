import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

export const EarlyAccessInlineCTA = () => {
  const { openEmailCapture } = useModal();

  return (
    <div className="flex justify-start mt-6">
      <Button
        onClick={openEmailCapture}
        size="lg"
        className="h-12 px-8 rounded-full font-medium bg-blazeOrange hover:bg-blazeOrange/90 text-white"
      >
        get early access
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};