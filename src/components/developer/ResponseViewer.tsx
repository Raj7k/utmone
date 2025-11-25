import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ResponseViewerProps {
  status?: number;
  body: string;
  headers?: Record<string, string>;
  responseTime?: number;
}

export function ResponseViewer({ status, body, headers, responseTime }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!status) {
    return (
      <div className="h-full flex items-center justify-center text-secondary-label">
        Send a request to see the response
      </div>
    );
  }

  const statusColor = status >= 200 && status < 300 ? 'default' : 'destructive';

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={statusColor}>{status}</Badge>
          {responseTime && (
            <span className="text-sm text-secondary-label">{responseTime}ms</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <Tabs defaultValue="body" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>
        <TabsContent value="body" className="flex-1 mt-2">
          <ScrollArea className="h-[400px] w-full rounded border">
            <pre className="p-4 text-sm font-mono">
              {JSON.stringify(JSON.parse(body || '{}'), null, 2)}
            </pre>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="headers" className="flex-1 mt-2">
          <ScrollArea className="h-[400px] w-full rounded border">
            <pre className="p-4 text-sm font-mono">
              {JSON.stringify(headers || {}, null, 2)}
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
