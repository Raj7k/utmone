import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GraphQLExplorerProps {
  query: string;
  setQuery: (query: string) => void;
  variables: string;
  setVariables: (variables: string) => void;
  onExecute: () => void;
  loading: boolean;
}

export function GraphQLExplorer({
  query,
  setQuery,
  variables,
  setVariables,
  onExecute,
  loading
}: GraphQLExplorerProps) {
  const examples = [
    {
      name: 'List Links',
      query: `query ListLinks($page: Int, $perPage: Int) {
  links(page: $page, perPage: $perPage) {
    id
    title
    short_url
    destination_url
    total_clicks
    unique_clicks
    created_at
  }
}`,
      variables: '{\n  "page": 1,\n  "perPage": 50\n}'
    },
    {
      name: 'Get Link',
      query: `query GetLink($id: String!) {
  link(id: $id) {
    id
    title
    short_url
    destination_url
    final_url
    total_clicks
    unique_clicks
    created_at
  }
}`,
      variables: '{\n  "id": "your-link-id"\n}'
    },
    {
      name: 'Link Analytics',
      query: `query LinkAnalytics($id: String!) {
  linkAnalytics(id: $id) {
    totalClicks
    uniqueClicks
    devices
    countries
  }
}`,
      variables: '{\n  "id": "your-link-id"\n}'
    },
    {
      name: 'Create Link',
      query: `mutation CreateLink($input: CreateLinkInput!) {
  createLink(input: $input) {
    id
    short_url
    final_url
    created_at
  }
}`,
      variables: `{
  "input": {
    "title": "My Link",
    "destination_url": "https://example.com",
    "slug": "example",
    "utm_source": "api",
    "utm_medium": "graphql",
    "utm_campaign": "test"
  }
}`
    }
  ];

  const loadExample = (exampleName: string) => {
    const example = examples.find(ex => ex.name === exampleName);
    if (example) {
      setQuery(example.query);
      setVariables(example.variables);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="space-y-2">
        <Label>Example Queries</Label>
        <Select onValueChange={loadExample}>
          <SelectTrigger>
            <SelectValue placeholder="Load an example" />
          </SelectTrigger>
          <SelectContent>
            {examples.map((ex) => (
              <SelectItem key={ex.name} value={ex.name}>
                {ex.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1">
        <Label>Query</Label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your GraphQL query..."
          className="font-mono text-sm flex-1 min-h-[200px]"
        />
      </div>

      <div className="space-y-2 flex-1">
        <Label>Variables (JSON)</Label>
        <Textarea
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
          placeholder='{"key": "value"}'
          className="font-mono text-sm h-24"
        />
      </div>

      <Button onClick={onExecute} disabled={loading} className="w-full">
        {loading ? 'Executing...' : 'Execute Query'}
      </Button>
    </div>
  );
}
