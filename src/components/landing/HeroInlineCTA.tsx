import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";

export const HeroInlineCTA = () => {
  const { openEmailCapture } = useModal();

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={openEmailCapture}
        size="lg"
        className="h-14 px-8 text-lg rounded-full font-medium bg-blazeOrange hover:bg-blazeOrange/90 text-white"
      >
        get early access
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
      <p className="text-sm text-muted-foreground">
        no credit card required • free forever for early adopters
      </p>
    </div>
  );
};