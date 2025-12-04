import { useState } from "react";
import { Search, ExternalLink, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Tool {
  name: string;
  category: string;
  useCase: string;
  bestFor: string;
  pricing: string;
  url: string;
}

const tools: Tool[] = [
  // Writing LLMs
  { name: "ChatGPT (GPT-4)", category: "Writing LLMs", useCase: "Research, brainstorming, drafting, optimization", bestFor: "Content generation, social copy, outlines", pricing: "Free / $20/mo", url: "https://chat.openai.com" },
  { name: "Anthropic Claude", category: "Writing LLMs", useCase: "Long-form content, document summarization", bestFor: "Guides, whitepapers with high token limits", pricing: "Free / Pro tiers", url: "https://claude.ai" },
  { name: "Google Gemini", category: "Writing LLMs", useCase: "Real-time search integration, multimodal", bestFor: "SEO-aligned content, Google Workspace", pricing: "Free / Pro", url: "https://gemini.google.com" },
  { name: "Jasper", category: "Writing LLMs", useCase: "Brand voice templates, marketing copy", bestFor: "Consistent tone, ad variants, team collaboration", pricing: "From $39/mo", url: "https://jasper.ai" },
  { name: "Copy.ai", category: "Writing LLMs", useCase: "Short-form copy, social posts", bestFor: "Quick taglines, product descriptions", pricing: "Free / Paid", url: "https://copy.ai" },
  { name: "Writesonic", category: "Writing LLMs", useCase: "Blog posts, landing pages", bestFor: "Fast content generation", pricing: "Free / Paid", url: "https://writesonic.com" },
  
  // Image & Design
  { name: "Midjourney", category: "Image & Design", useCase: "High-quality artistic images", bestFor: "Blog hero images, creative concepts", pricing: "From $10/mo", url: "https://midjourney.com" },
  { name: "DALL·E 3", category: "Image & Design", useCase: "Controlled compositions, image editing", bestFor: "Marketing images, backgrounds", pricing: "Via Bing/OpenAI", url: "https://openai.com/dall-e-3" },
  { name: "Stable Diffusion", category: "Image & Design", useCase: "Open-source generation, custom models", bestFor: "Advanced customization needs", pricing: "Free / Services vary", url: "https://stability.ai" },
  { name: "Leonardo.ai", category: "Image & Design", useCase: "Game assets, product images", bestFor: "Consistent style outputs", pricing: "Free / Paid", url: "https://leonardo.ai" },
  { name: "Canva (AI features)", category: "Image & Design", useCase: "Quick designs, Magic Media generation", bestFor: "Social graphics, presentations", pricing: "Free / Pro $13/mo", url: "https://canva.com" },
  { name: "AdCreative.ai", category: "Image & Design", useCase: "Ad creative variants", bestFor: "Testing ad designs at scale", pricing: "From $29/mo", url: "https://adcreative.ai" },
  
  // Video & Audio
  { name: "Synthesia", category: "Video & Audio", useCase: "AI avatar videos, text-to-video", bestFor: "Explainer videos, spokesperson content", pricing: "From $30/mo", url: "https://synthesia.io" },
  { name: "HeyGen", category: "Video & Audio", useCase: "Video avatars, multilingual videos", bestFor: "Personalized video outreach", pricing: "Free / Paid", url: "https://heygen.com" },
  { name: "Descript", category: "Video & Audio", useCase: "Video/audio editing via text", bestFor: "Podcast editing, webinar clips", pricing: "Free / $12/mo", url: "https://descript.com" },
  { name: "ElevenLabs", category: "Video & Audio", useCase: "High-quality text-to-speech", bestFor: "Audio articles, voice cloning", pricing: "Free / From $5/mo", url: "https://elevenlabs.io" },
  { name: "Play.ht", category: "Video & Audio", useCase: "Natural voice generation", bestFor: "Voiceovers, audio content", pricing: "Free / Paid", url: "https://play.ht" },
  { name: "Lumen5", category: "Video & Audio", useCase: "Blog to video conversion", bestFor: "Quick video summaries from text", pricing: "Free / From $19/mo", url: "https://lumen5.com" },
  { name: "Pictory", category: "Video & Audio", useCase: "Video creation from scripts", bestFor: "Social video content", pricing: "From $19/mo", url: "https://pictory.ai" },
  
  // SEO & Optimization
  { name: "Surfer SEO", category: "SEO & Optimization", useCase: "Content optimization, real-time scoring", bestFor: "SEO-optimized blog posts", pricing: "From $69/mo", url: "https://surferseo.com" },
  { name: "MarketMuse", category: "SEO & Optimization", useCase: "Content planning, gap analysis", bestFor: "Content strategy, topic clusters", pricing: "Custom pricing", url: "https://marketmuse.com" },
  { name: "Frase", category: "SEO & Optimization", useCase: "SEO briefs, content optimization", bestFor: "Research and SEO writing", pricing: "From $15/mo", url: "https://frase.io" },
  { name: "Grammarly", category: "SEO & Optimization", useCase: "Grammar, tone detection", bestFor: "Final proofreading, style consistency", pricing: "Free / $12/mo", url: "https://grammarly.com" },
  
  // Analytics & Insights
  { name: "BuzzSumo", category: "Analytics & Insights", useCase: "Content research, trending topics", bestFor: "Ideation, competitor analysis", pricing: "From $99/mo", url: "https://buzzsumo.com" },
  { name: "Mention", category: "Analytics & Insights", useCase: "Social listening, brand monitoring", bestFor: "Real-time audience insights", pricing: "From $29/mo", url: "https://mention.com" },
  { name: "Amplitude", category: "Analytics & Insights", useCase: "Product analytics with AI querying", bestFor: "Data insights without SQL", pricing: "Free / Custom", url: "https://amplitude.com" },
  
  // Automation
  { name: "Zapier", category: "Automation", useCase: "AI workflow automation", bestFor: "Connecting tools, auto-publishing", pricing: "Free / From $20/mo", url: "https://zapier.com" },
  { name: "Make (Integromat)", category: "Automation", useCase: "Visual automation builder", bestFor: "Complex multi-step workflows", pricing: "Free / Paid", url: "https://make.com" },
  
  // Specialized
  { name: "Salesforce Einstein", category: "CRM with AI", useCase: "Lead scoring, engagement timing", bestFor: "CRM-integrated marketing", pricing: "Part of Salesforce", url: "https://salesforce.com" },
  { name: "HubSpot AI", category: "CRM with AI", useCase: "Content assistant, email generation", bestFor: "HubSpot ecosystem users", pricing: "Part of HubSpot", url: "https://hubspot.com" },
  { name: "Persado", category: "Specialized", useCase: "Message optimization, emotional language", bestFor: "Enterprise campaign optimization", pricing: "Enterprise only", url: "https://persado.com" },
  { name: "Crayon", category: "Competitive Intel", useCase: "Competitor tracking, content alerts", bestFor: "Market intelligence", pricing: "From $250/mo", url: "https://crayon.co" },
];

const categories = ["All", "Writing LLMs", "Image & Design", "Video & Audio", "SEO & Optimization", "Analytics & Insights", "Automation", "CRM with AI", "Specialized", "Competitive Intel"];

export const AIToolMatrix = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                         tool.useCase.toLowerCase().includes(search.toLowerCase()) ||
                         tool.bestFor.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search tools by name, use case, or features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTools.length} of {tools.length} tools
      </p>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool, index) => (
          <Card key={index} className="p-6 space-y-3 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{tool.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: 'rgba(59,130,246,1)' }}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground/70">Use Cases:</span>
                <p className="text-muted-foreground">{tool.useCase}</p>
              </div>
              <div>
                <span className="font-medium text-foreground/70">Best For:</span>
                <p className="text-muted-foreground">{tool.bestFor}</p>
              </div>
              <div>
                <span className="font-medium text-foreground/70">Pricing:</span>
                <p className="text-muted-foreground">{tool.pricing}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No tools found matching your criteria</p>
        </div>
      )}
    </div>
  );
};