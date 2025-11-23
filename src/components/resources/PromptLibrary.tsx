import { useState } from "react";
import { Copy, Check, Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Prompt {
  title: string;
  category: string;
  prompt: string;
  context: string;
}

const prompts: Prompt[] = [
  // Research
  {
    title: "Market Research Deep Dive",
    category: "Research",
    prompt: "Find recent statistics and trends about [topic] from the past 12 months. Include data points with sources, key market dynamics, and emerging patterns. Focus on [specific industry/vertical].",
    context: "Use for initial content research and data gathering"
  },
  {
    title: "Competitor Content Analysis",
    category: "Research",
    prompt: "Analyze the top 5 content pieces ranking for [keyword]. What topics do they cover? What's missing? What unique angle could we take that differentiates our approach?",
    context: "Identify content gaps and opportunities"
  },
  {
    title: "Audience Pain Point Discovery",
    category: "Research",
    prompt: "What are the top 10 challenges that [target audience] faces with [topic]? For each challenge, explain why it matters and what the consequences are of not solving it.",
    context: "Understand audience problems deeply"
  },

  // Outlining
  {
    title: "Comprehensive Content Outline",
    category: "Outlining",
    prompt: "Create a detailed outline for a [content type] on [topic] targeting [audience]. Include 5-7 main sections with 3-4 subsections each. Each section should have a clear purpose and flow logically to the next.",
    context: "Structure long-form content effectively"
  },
  {
    title: "Thought Leadership Structure",
    category: "Outlining",
    prompt: "Outline a thought leadership piece that positions our company as experts in [niche]. Start with a provocative statement, build to our unique framework/methodology, include case studies, and end with a clear POV on the future.",
    context: "Create authoritative industry content"
  },

  // Drafting
  {
    title: "Section First Draft",
    category: "Drafting",
    prompt: "Write the [section name] section in a [tone] tone. Include these data points: [list]. Target audience is [description]. Length: [word count] words. Make it engaging and avoid generic AI phrases.",
    context: "Generate initial content drafts"
  },
  {
    title: "Introduction Hook",
    category: "Drafting",
    prompt: "Write 3 different opening paragraphs for a blog post about [topic]. Each should use a different hook: (1) surprising statistic, (2) provocative question, (3) relatable story. Make them compelling and specific.",
    context: "Create strong content openings"
  },

  // SEO
  {
    title: "Keyword-Focused Section",
    category: "SEO",
    prompt: "Rewrite this section to naturally incorporate these keywords: [list]. Maintain readability and don't force keywords. Ensure the content still flows naturally and adds value to readers.",
    context: "Optimize content without keyword stuffing"
  },
  {
    title: "Meta Description Generator",
    category: "SEO",
    prompt: "Write 5 compelling meta descriptions (under 160 characters) for this content: [title/summary]. Each should include the primary keyword [keyword] and create urgency or curiosity to drive clicks.",
    context: "Create click-worthy search snippets"
  },

  // Social
  {
    title: "LinkedIn Post Adaptation",
    category: "Social",
    prompt: "Turn this blog post into 5 LinkedIn posts. Each post should: start with a hook, include a personal insight or story, have clear formatting with line breaks, end with a question to drive engagement. Make them feel conversational, not promotional.",
    context: "Repurpose content for LinkedIn"
  },
  {
    title: "Twitter Thread Builder",
    category: "Social",
    prompt: "Create a Twitter/X thread (8-10 tweets) from this content: [paste excerpt]. Start with an attention-grabbing hook tweet. Break down key insights into digestible tweets. End with a CTA to read the full article.",
    context: "Create engaging Twitter threads"
  },

  // Editing
  {
    title: "Tone and Voice Refinement",
    category: "Editing",
    prompt: "Rewrite this section to match our brand voice: [describe voice - e.g., confident yet approachable, data-driven but not dry, etc.]. Remove generic AI phrases like 'delve into', 'unlock potential', 'game-changer'. Make it sound more human.",
    context: "Align content with brand voice"
  },
  {
    title: "Clarity Enhancement",
    category: "Editing",
    prompt: "Review this paragraph for clarity and simplicity. Identify jargon, complex sentences, or confusing phrases. Suggest simpler alternatives that maintain professionalism but improve readability for [target audience].",
    context: "Improve content readability"
  },

  // Repurposing
  {
    title: "Multi-Channel Content Adaptation",
    category: "Repurposing",
    prompt: "Repurpose this blog post for: (1) Email newsletter summary (300 words), (2) LinkedIn carousel post outline (8 slides), (3) Short-form video script (90 seconds), (4) Infographic key points (5 stats). Maintain core message across all formats.",
    context: "Maximize content ROI across channels"
  },
  {
    title: "Webinar to Content Series",
    category: "Repurposing",
    prompt: "I have a webinar transcript: [paste]. Create: (1) A blog post outline hitting main points, (2) 5 social quote graphics with text, (3) An FAQ section from Q&A, (4) 3 follow-up email topics for attendees.",
    context: "Extract maximum value from webinar content"
  },

  // Analysis
  {
    title: "Content Performance Analysis",
    category: "Analysis",
    prompt: "Analyze this content performance data: [paste metrics]. What patterns do you see? Which topics resonated most? What content formats performed best? What should we do more/less of? Provide 3 specific recommendations.",
    context: "Turn analytics into actionable insights"
  },
  {
    title: "Headline Testing",
    category: "Analysis",
    prompt: "Generate 10 alternative headlines for this article: [current title and topic]. Test different formulas: (1-2) Numbered lists, (3-4) How-to format, (5-6) Question format, (7-8) Provocative statements, (9-10) Benefit-driven. Explain why each might work.",
    context: "Optimize headlines for engagement"
  }
];

const categories = ["All", "Research", "Outlining", "Drafting", "SEO", "Social", "Editing", "Repurposing", "Analysis"];

export const PromptLibrary = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(search.toLowerCase()) ||
                         prompt.prompt.toLowerCase().includes(search.toLowerCase()) ||
                         prompt.context.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(title);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search prompts by title, content, or use case..."
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
        Showing {filteredPrompts.length} of {prompts.length} prompts
      </p>

      {/* Prompt Cards */}
      <div className="space-y-4">
        {filteredPrompts.map((item, index) => (
          <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground italic">{item.context}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <code className="text-sm text-foreground/90 block whitespace-pre-wrap">
                {item.prompt}
              </code>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyPrompt(item.prompt, item.title)}
                  className="text-xs"
                >
                  {copiedPrompt === item.title ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs"
                >
                  <a
                    href={`https://chat.openai.com/?q=${encodeURIComponent(item.prompt)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Try in ChatGPT
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No prompts found matching your criteria</p>
        </div>
      )}
    </div>
  );
};