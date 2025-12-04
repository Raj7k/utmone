import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle2, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVerifyDomain } from "@/hooks/useVerifyDomain";
import { cn } from "@/lib/utils";

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: string;
}

interface DomainDNSInstructionsProps {
  domain: string;
  verificationCode: string;
  domainId?: string;
}

export const DomainDNSInstructions = ({
  domain,
  verificationCode,
  domainId,
}: DomainDNSInstructionsProps) => {
  const { toast } = useToast();
  const [copiedRecords, setCopiedRecords] = useState<Set<string>>(new Set());
  const verifyDomain = useVerifyDomain();

  const dnsRecords: DNSRecord[] = [
    {
      type: "CNAME",
      name: "@",
      value: "go.utm.one",
      ttl: "3600",
    },
    {
      type: "TXT",
      name: "_utm-verification",
      value: verificationCode,
      ttl: "3600",
    },
  ];

  const copyToClipboard = (text: string, recordType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecords(prev => new Set(prev).add(recordType));
    toast({
      title: "Copied!",
      description: `${recordType} copied to clipboard.`,
    });
  };

  const allCopied = useMemo(() => 
    copiedRecords.has("CNAME") && copiedRecords.has("TXT"),
    [copiedRecords]
  );

  const copyProgress = useMemo(() => 
    `${copiedRecords.size}/2 records copied`,
    [copiedRecords]
  );

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Add these DNS records to your domain registrar to verify ownership and enable URL
          shortening. DNS changes can take up to 72 hours to propagate.
          <br />
          <strong>Note:</strong> For the TXT record, enter "_utm-verification" without your domain name - 
          your registrar will automatically append ".{domain}" to it.
          <br />
          <strong>CNAME for root domain:</strong> Some registrars don't support CNAME for root domains (@). 
          In that case, use ALIAS or ANAME record if available, or contact support.
        </AlertDescription>
      </Alert>

      {copiedRecords.size > 0 && (
        <Alert className={cn(
          "border-2 transition-colors",
          allCopied ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"
        )}>
          <CheckCircle2 className={cn(
            "h-4 w-4",
            allCopied ? "text-green-600" : "text-blue-600"
          )} />
          <AlertDescription className={allCopied ? "text-green-800" : "text-blue-800"}>
            <strong>{allCopied ? "All records copied!" : copyProgress}</strong>
            {allCopied && " Ready to verify your domain."}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>DNS Records for {domain}</CardTitle>
          <CardDescription>
            Add these records to your DNS provider (GoDaddy, Cloudflare, Namecheap, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dnsRecords.map((record, index) => {
              const isCopied = copiedRecords.has(record.type);
              
              return (
                <div
                  key={index}
                  className={cn(
                    "border-2 rounded-lg p-4 space-y-3 transition-all duration-300",
                    isCopied 
                      ? "bg-green-50 border-green-300" 
                      : "bg-muted/50 border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-lg">{record.type} Record</div>
                      {isCopied && (
                        <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded-full">
                          copied ✓
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(record.value, record.type)}
                    >
                      {isCopied ? (
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
            );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: 'rgba(34,197,94,0.8)' }} />
            <div className="text-sm">
              <strong>Step 1:</strong> Log in to your domain registrar (GoDaddy, Cloudflare,
              Namecheap, etc.)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: 'rgba(34,197,94,0.8)' }} />
            <div className="text-sm">
              <strong>Step 2:</strong> Find the DNS or Domain Settings section
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: 'rgba(34,197,94,0.8)' }} />
            <div className="text-sm">
              <strong>Step 3:</strong> Add each DNS record shown above
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: 'rgba(34,197,94,0.8)' }} />
            <div className="text-sm">
              <strong>Step 4:</strong> Wait for DNS propagation (up to 72 hours)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: 'rgba(34,197,94,0.8)' }} />
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

          {domainId && (
            <Button
              className="w-full mt-2"
              onClick={() => verifyDomain.mutate(domainId)}
              disabled={verifyDomain.isPending}
            >
              {verifyDomain.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify Domain Now
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
