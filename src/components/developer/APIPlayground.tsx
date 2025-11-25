import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestBuilder } from "./RequestBuilder";
import { ResponseViewer } from "./ResponseViewer";
import { GraphQLExplorer } from "./GraphQLExplorer";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function APIPlayground() {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/v1/links');
  const [headers, setHeaders] = useState('{"x-api-key": "utm_your_key_here"}');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const [graphqlQuery, setGraphqlQuery] = useState('');
  const [graphqlVariables, setGraphqlVariables] = useState('{}');

  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const parsedHeaders = JSON.parse(headers);
      const url = `https://api.utm.one${endpoint}`;

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders
        }
      };

      if ((method === 'POST' || method === 'PATCH') && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const responseTime = Date.now() - startTime;
      const responseBody = await res.text();

      setResponse({
        status: res.status,
        body: responseBody,
        headers: Object.fromEntries(res.headers.entries()),
        responseTime
      });
    } catch (error: any) {
      setResponse({
        status: 0,
        body: JSON.stringify({ error: error.message }),
        headers: {},
        responseTime: Date.now() - startTime
      });
    } finally {
      setLoading(false);
    }
  };

  const executeGraphQL = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const parsedHeaders = JSON.parse(headers);
      const parsedVariables = JSON.parse(graphqlVariables);

      const res = await fetch('https://api.utm.one/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: parsedVariables
        })
      });

      const responseTime = Date.now() - startTime;
      const responseBody = await res.text();

      setResponse({
        status: res.status,
        body: responseBody,
        headers: Object.fromEntries(res.headers.entries()),
        responseTime
      });
    } catch (error: any) {
      setResponse({
        status: 0,
        body: JSON.stringify({ error: error.message }),
        headers: {},
        responseTime: Date.now() - startTime
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = () => {
    const parsedHeaders = JSON.parse(headers);
    const headerString = Object.entries(parsedHeaders)
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(' \\\n  ');

    let curl = `curl -X ${method} https://api.utm.one${endpoint} \\\n  ${headerString}`;

    if ((method === 'POST' || method === 'PATCH') && body) {
      curl += ` \\\n  -d '${body}'`;
    }

    navigator.clipboard.writeText(curl);
    toast.success('cURL command copied to clipboard');
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">API Playground</h2>
        <Button variant="outline" onClick={copyCurl}>
          <Copy className="h-4 w-4 mr-2" />
          Copy cURL
        </Button>
      </div>

      <Tabs defaultValue="rest" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rest">REST API</TabsTrigger>
          <TabsTrigger value="graphql">GraphQL</TabsTrigger>
        </TabsList>

        <TabsContent value="rest">
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            <Card className="p-4 overflow-auto">
              <h3 className="font-semibold mb-4">Request</h3>
              <RequestBuilder
                method={method}
                setMethod={setMethod}
                endpoint={endpoint}
                setEndpoint={setEndpoint}
                headers={headers}
                setHeaders={setHeaders}
                body={body}
                setBody={setBody}
                onSend={sendRequest}
                loading={loading}
              />
            </Card>

            <Card className="p-4 overflow-auto">
              <h3 className="font-semibold mb-4">Response</h3>
              <ResponseViewer
                status={response?.status}
                body={response?.body}
                headers={response?.headers}
                responseTime={response?.responseTime}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="graphql">
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            <Card className="p-4 overflow-auto">
              <h3 className="font-semibold mb-4">Query</h3>
              <GraphQLExplorer
                query={graphqlQuery}
                setQuery={setGraphqlQuery}
                variables={graphqlVariables}
                setVariables={setGraphqlVariables}
                onExecute={executeGraphQL}
                loading={loading}
              />
            </Card>

            <Card className="p-4 overflow-auto">
              <h3 className="font-semibold mb-4">Response</h3>
              <ResponseViewer
                status={response?.status}
                body={response?.body}
                headers={response?.headers}
                responseTime={response?.responseTime}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
