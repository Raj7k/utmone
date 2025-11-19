import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { QrCode } from "lucide-react";
import { useState } from "react";

interface QRCodeDialogProps {
  linkId: string;
  shortUrl: string;
  trigger?: React.ReactNode;
}

export const QRCodeDialog = ({ linkId, shortUrl, trigger }: QRCodeDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <QrCode className="h-4 w-4" />
            Generate QR
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Generate Branded QR Code</DialogTitle>
          <DialogDescription>
            Create a customized QR code for {shortUrl}
          </DialogDescription>
        </DialogHeader>
        <QRCodeGenerator linkId={linkId} shortUrl={shortUrl} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
