import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface RequestBuilderProps {
  method: string;
  setMethod: (method: string) => void;
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
  headers: string;
  setHeaders: (headers: string) => void;
  body: string;
  setBody: (body: string) => void;
  onSend: () => void;
  loading: boolean;
}

export function RequestBuilder({
  method,
  setMethod,
  endpoint,
  setEndpoint,
  headers,
  setHeaders,
  body,
  setBody,
  onSend,
  loading
}: RequestBuilderProps) {
  const endpoints = [
    { value: '/v1/links', label: 'List Links', method: 'GET' },
    { value: '/v1/links', label: 'Create Link', method: 'POST' },
    { value: '/v1/links/:id', label: 'Get Link', method: 'GET' },
    { value: '/v1/links/:id', label: 'Update Link', method: 'PATCH' },
    { value: '/v1/links/:id', label: 'Delete Link', method: 'DELETE' },
    { value: '/v1/links/:id/analytics', label: 'Get Analytics', method: 'GET' },
    { value: '/v1/events', label: 'Track Event', method: 'POST' },
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="grid grid-cols-[120px_1fr] gap-2">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>

        <Select value={endpoint} onValueChange={setEndpoint}>
          <SelectTrigger>
            <SelectValue placeholder="Select endpoint" />
          </SelectTrigger>
          <SelectContent>
            {endpoints.map((ep) => (
              <SelectItem key={`${ep.method}-${ep.value}`} value={ep.value}>
                {ep.method} {ep.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Full URL</Label>
        <Input
          value={`https://api.utm.one${endpoint}`}
          readOnly
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2 flex-1">
        <Label>Headers (JSON)</Label>
        <Textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"x-api-key": "utm_..."}'
          className="font-mono text-sm h-24"
        />
      </div>

      {(method === 'POST' || method === 'PATCH') && (
        <div className="space-y-2 flex-1">
          <Label>Request Body (JSON)</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"title": "...", "destination_url": "..."}'
            className="font-mono text-sm flex-1"
          />
        </div>
      )}

      <Button onClick={onSend} disabled={loading} className="w-full">
        {loading ? 'Sending...' : 'Send Request'}
      </Button>
    </div>
  );
}
