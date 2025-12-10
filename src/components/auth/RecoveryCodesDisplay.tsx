import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, CheckCircle2 } from "lucide-react";
import { notify } from "@/lib/notify";

interface RecoveryCodesDisplayProps {
  codes: string[];
}

export function RecoveryCodesDisplay({ codes }: RecoveryCodesDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codesText = codes.join('\n');
    await navigator.clipboard.writeText(codesText);
    setCopied(true);
    notify.success("copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const codesText = [
      "utm.one Recovery Codes",
      "Generated: " + new Date().toISOString(),
      "",
      "IMPORTANT: Store these codes in a safe place.",
      "Each code can only be used once.",
      "",
      ...codes.map((code, i) => `${i + 1}. ${code}`),
      "",
      "If you lose access to your authenticator app,",
      "use one of these codes to sign in."
    ].join('\n');

    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utm-one-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify.success("recovery codes downloaded");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 p-4 bg-muted/30 rounded-lg border border-border">
        {codes.map((code, i) => (
          <code
            key={i}
            className="px-2 py-1 text-sm font-mono bg-card rounded border border-border text-center"
          >
            {code}
          </code>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "copied" : "copy codes"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          download
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        store these codes securely. each code can only be used once.
      </p>
    </div>
  );
}