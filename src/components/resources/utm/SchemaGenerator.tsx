import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const SchemaGenerator = () => {
  const [schemaType, setSchemaType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [copied, setCopied] = useState(false);

  const generateSchema = () => {
    if (!schemaType) return "";

    const base = {
      "@context": "https://schema.org",
      "@type": schemaType
    };

    if (schemaType === "Article") {
      return JSON.stringify(
        {
          ...base,
          headline: title || "Your Article Title",
          description: description || "Your article description",
          author: {
            "@type": "Person",
            name: author || "Author Name"
          },
          datePublished: datePublished || new Date().toISOString().split("T")[0],
          url: url || "https://utm.one/your-page"
        },
        null,
        2
      );
    } else if (schemaType === "FAQPage") {
      return JSON.stringify(
        {
          ...base,
          mainEntity: [
            {
              "@type": "Question",
              name: "What are UTM parameters?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "UTM parameters are tags added to URLs to track where website traffic comes from."
              }
            },
            {
              "@type": "Question",
              name: "Why are UTMs important?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "UTMs enable accurate campaign attribution and performance tracking in analytics tools."
              }
            }
          ]
        },
        null,
        2
      );
    } else if (schemaType === "HowTo") {
      return JSON.stringify(
        {
          ...base,
          name: title || "How to Create UTM Parameters",
          description: description || "Step-by-step guide to creating UTM parameters",
          step: [
            {
              "@type": "HowToStep",
              name: "Step 1",
              text: "Define your naming conventions",
              position: 1
            },
            {
              "@type": "HowToStep",
              name: "Step 2",
              text: "Create templates for common campaigns",
              position: 2
            },
            {
              "@type": "HowToStep",
              name: "Step 3",
              text: "Generate and test your UTM links",
              position: 3
            }
          ]
        },
        null,
        2
      );
    }

    return "";
  };

  const schema = generateSchema();

  const copySchema = () => {
    navigator.clipboard.writeText(schema);
    setCopied(true);
    toast.success("Schema copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div>
        <h4 className="font-semibold text-foreground mb-2">Schema Markup Generator</h4>
        <p className="text-sm text-muted-foreground">
          Generate JSON-LD schema for campaign landing pages to improve LLM discoverability
        </p>
      </div>

      {/* Schema Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="schema-type">Schema Type</Label>
        <Select value={schemaType} onValueChange={setSchemaType}>
          <SelectTrigger id="schema-type">
            <SelectValue placeholder="Select schema type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Article">Article</SelectItem>
            <SelectItem value="FAQPage">FAQ Page</SelectItem>
            <SelectItem value="HowTo">How-To Guide</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {schemaType && (
        <>
          {/* Input Fields */}
          <div className="grid gap-4">
            {schemaType === "Article" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Article Headline</Label>
                  <Input
                    id="title"
                    placeholder="The Complete UTM Guide for Marketers"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Comprehensive guide to UTM parameters, naming conventions, and governance."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    placeholder="Jane Smith"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Page URL</Label>
                  <Input
                    id="url"
                    placeholder="https://utm.one/resources/guides/utm-guide"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date Published</Label>
                  <Input
                    id="date"
                    type="date"
                    value={datePublished}
                    onChange={(e) => setDatePublished(e.target.value)}
                  />
                </div>
              </>
            )}

            {(schemaType === "HowTo" || schemaType === "FAQPage") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="How to Create UTM Parameters"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Step-by-step guide..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          {/* Generated Schema */}
          {schema && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Generated JSON-LD:</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copySchema}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border/30 overflow-auto">
                <pre className="text-xs text-foreground">
                  <code>{schema}</code>
                </pre>
              </div>
              <p className="text-xs text-muted-foreground">
                Add this schema to your page's &lt;head&gt; section wrapped in &lt;script type="application/ld+json"&gt; tags
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
