import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: string;
}

interface DomainDNSInstructionsProps {
  domain: string;
  verificationCode: string;
}

export const DomainDNSInstructions = ({
  domain,
  verificationCode,
}: DomainDNSInstructionsProps) => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const dnsRecords: DNSRecord[] = [
    {
      type: "A",
      name: "@",
      value: "185.158.133.1",
      ttl: "3600",
    },
    {
      type: "A",
      name: "www",
      value: "185.158.133.1",
      ttl: "3600",
    },
    {
      type: "TXT",
      name: "_verification",
      value: verificationCode,
      ttl: "3600",
    },
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied to clipboard",
      description: `${field} value copied successfully.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Add these DNS records to your domain registrar to verify ownership and enable URL
          shortening. DNS changes can take up to 72 hours to propagate.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>DNS Records for {domain}</CardTitle>
          <CardDescription>
            Add these records to your DNS provider (GoDaddy, Cloudflare, Namecheap, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dnsRecords.map((record, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{record.type} Record</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(record.value, `${record.type} record`)
                    }
                  >
                    {copiedField === `${record.type} record` ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Name/Host</div>
                    <div className="font-mono bg-background p-2 rounded border">
                      {record.name}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-muted-foreground mb-1">Value/Points To</div>
                    <div className="font-mono bg-background p-2 rounded border break-all">
                      {record.value}
                    </div>
                  </div>
                </div>

                {record.ttl && (
                  <div className="text-sm text-muted-foreground">
                    TTL: {record.ttl} seconds (or automatic)
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <strong>Step 1:</strong> Log in to your domain registrar (GoDaddy, Cloudflare,
              Namecheap, etc.)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <strong>Step 2:</strong> Find the DNS or Domain Settings section
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <strong>Step 3:</strong> Add each DNS record shown above
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <strong>Step 4:</strong> Wait for DNS propagation (up to 72 hours)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <strong>Step 5:</strong> Come back and click "Verify Domain"
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() =>
              window.open("https://dnschecker.org", "_blank")
            }
          >
            Check DNS Propagation
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
