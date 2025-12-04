import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, BookOpen, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIToolMatrix } from "@/components/resources/AIToolMatrix";
import { WorkflowVisualizer } from "@/components/resources/WorkflowVisualizer";
import { PromptLibrary } from "@/components/resources/PromptLibrary";
import { ContentQualityChecklist } from "@/components/resources/ContentQualityChecklist";
import { EffortCalculator } from "@/components/resources/EffortCalculator";
import { PitfallWarningCards } from "@/components/resources/PitfallWarningCards";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Helmet } from "react-helmet";

const AIMarketingPlaybook = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Marketing Playbook: Content Creation in the AI Era | utm.one</title>
        <meta
          name="description"
          content="Master AI-driven content marketing with our comprehensive playbook. 30+ tools, 8-step workflow, interactive examples, and proven strategies for thought leadership."
        />
        <link rel="canonical" href="https://utm.one/resources/playbooks/ai-marketing" />
        
        {/* Schema.org HowTo Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "AI Marketing Playbook: Content Creation in the AI Era",
            "description": "8-step workflow to combine human creativity with AI efficiency for content marketing and thought leadership",
            "totalTime": "PT2H",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Ideation & Research",
                "text": "Use AI to enrich content ideas and gather research",
                "tool": ["ChatGPT", "Perplexity", "BuzzSumo"]
              },
              {
                "@type": "HowToStep",
                "name": "Outlining & Structuring",
                "text": "Create content structure with AI assistance",
                "tool": ["ChatGPT", "Claude", "Jasper"]
              },
              {
                "@type": "HowToStep",
                "name": "Draft Creation",
                "text": "Generate initial drafts rapidly using AI",
                "tool": ["ChatGPT", "Jasper", "Claude"]
              },
              {
                "@type": "HowToStep",
                "name": "Editing & Human Enrichment",
                "text": "Transform AI drafts into authentic content",
                "tool": ["Grammarly", "LanguageTool"]
              },
              {
                "@type": "HowToStep",
                "name": "SEO Optimization",
                "text": "Optimize content for search visibility",
                "tool": ["Surfer SEO", "Frase", "MarketMuse"]
              },
              {
                "@type": "HowToStep",
                "name": "Visuals & Media Generation",
                "text": "Create compelling visuals to enhance content",
                "tool": ["Midjourney", "DALL-E 3", "Canva AI"]
              },
              {
                "@type": "HowToStep",
                "name": "Personalization & Distribution",
                "text": "Adapt content for different channels and audiences",
                "tool": ["ChatGPT", "Jasper", "Zapier"]
              },
              {
                "@type": "HowToStep",
                "name": "Monitoring & Optimization",
                "text": "Track performance and refine your approach",
                "tool": ["Google Analytics 4", "Amplitude", "BuzzSumo"]
              }
            ]
          })}
        </script>

        {/* Schema.org Article Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "AI Marketing Playbook: Content Creation & Thought Leadership in the AI Era",
            "description": "Comprehensive guide for leveraging AI in content marketing with 8-step workflow, 30+ tools, and proven strategies",
            "author": {
              "@type": "Organization",
              "name": "utm.one"
            },
            "publisher": {
              "@type": "Organization",
              "name": "utm.one",
              "logo": {
                "@type": "ImageObject",
                "url": "https://utm.one/logo.png"
              }
            },
            "datePublished": "2025-01-23",
            "dateModified": "2025-01-23"
          })}
        </script>

        {/* Schema.org BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Resources",
                "item": "https://utm.one/resources"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Playbooks",
                "item": "https://utm.one/resources/playbooks"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "AI Marketing Playbook",
                "item": "https://utm.one/resources/playbooks/ai-marketing"
              }
            ]
          })}
        </script>
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link>
            <span>/</span>
            <Link to="/resources/playbooks" className="hover:text-foreground transition-colors">Playbooks</Link>
            <span>/</span>
            <span className="text-foreground">AI Marketing</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="text-white animate-pulse" style={{ background: 'rgba(59,130,246,1)' }}>NEW</Badge>
            <Badge variant="secondary">Most Read</Badge>
            <Badge variant="outline">25-page guide</Badge>
            <Badge variant="outline">30+ AI tools</Badge>
            <Badge variant="outline">8-step workflow</Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase mb-6">
            ai marketing playbook: content creation in the ai era
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mb-8">
            the 8-step workflow to combine human creativity with ai efficiency for content marketing and thought leadership
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <span>25 min read</span>
            <span>Updated January 2025</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Start the Workflow
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-background">
        <div className="max-w-[900px] mx-auto px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold">
            the content flood: everyone can create, few can stand out
          </h2>
          
          <p className="text-lg text-foreground max-w-[720px] mx-auto">
            Once your AI-generated content is created, make sure it's discoverable by AI search engines. See our <Link to="/resources/playbooks/llm-ranking" className="font-semibold hover:underline" style={{ color: 'rgba(59,130,246,1)' }}>LLM Ranking Playbook</Link> for a complete 90-day implementation guide to rank in ChatGPT, Claude, and Perplexity.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <Card className="p-6 text-center space-y-2">
              <p className="text-3xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>0 hours</p>
              <p className="text-sm text-muted-foreground">AI removed the production bottleneck</p>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <p className="text-3xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>10x</p>
              <p className="text-sm text-muted-foreground">More content published daily</p>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <p className="text-3xl font-bold" style={{ color: 'rgba(59,130,246,1)' }}>-40%</p>
              <p className="text-sm text-muted-foreground">SEO traffic decline as LLMs serve direct answers</p>
            </Card>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px] mx-auto pt-4">
            Generative AI removed the production bottleneck. But paradoxically, standing out has become harder—with so much generic material published, audiences are overwhelmed and tune out the noise. The old playbook of pumping out SEO-keyword-filled articles is no longer enough.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                7 core principles of ai-driven content
              </h2>
            <p className="text-lg text-muted-foreground max-w-[640px] mx-auto">
              To succeed with AI in content creation and thought leadership, keep these key principles in mind
            </p>
          </div>

          <StaggerContainer className="space-y-8">
            <StaggerItem>
              <FeatureCard
                number="01"
                title="Quality Over Quantity – Authentic Content Wins"
                description="Resist the urge to publish endless AI-generated posts. If your content has no clear perspective, it's not helping. Use AI to assist, but make work only your company could make—infuse your insights, stories, and expertise."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                number="02"
                title="AI as an Amplifier, Not a Replacement"
                description="Think of AI as your creative assistant, not substitute. AI handles the repetitive 80%, but the last 20%—the part that makes it resonate—still needs a human brain. Use AI for heavy lifting so you can focus on strategy, storytelling, and creative polish."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                number="03"
                title="Prompting and Iteration Are Critical Skills"
                description="Don't accept the first draft. Keep refining prompts and ask for nuance. Treat AI like a junior copywriter that needs direction. It often takes several prompt-revise cycles to get output that doesn't sound like bland regurgitation."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                number="04"
                title="Customize AI to Your Brand and Domain"
                description="Train AI with your brand guidelines, style examples, and domain knowledge. The more context you provide upfront, the better outputs you'll get. Many tools let you create custom instructions or knowledge bases."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                number="05"
                title="Human-in-the-Loop is Non-Negotiable"
                description="Always review AI outputs for accuracy, tone, and brand safety. AI can hallucinate facts, produce biased content, or miss cultural nuances. Human judgment remains essential for quality assurance."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                number="06"
                title="Strategy First, Tools Second"
                description="Don't let shiny AI tools dictate your content strategy. Start with clear goals, audience understanding, and differentiation strategy. Then choose tools that support your strategy, not the other way around."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                number="07"
                title="Continuous Learning and Adaptation"
                description="AI capabilities evolve rapidly. What works today may be outdated in six months. Commit to ongoing experimentation, skill development, and process refinement to stay ahead."
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 8-Step Workflow */}
      <section className="py-20 bg-background" id="workflow">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              the 8-step ai content workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-[640px] mx-auto">
              A practical, repeatable process for creating authentic, high-impact content with AI
            </p>
          </div>

          <WorkflowVisualizer />
        </div>
      </section>

      {/* AI Toolkit */}
      <section className="py-20 bg-muted/20" id="tools">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              30+ ai tools for every stage
            </h2>
            <p className="text-lg text-muted-foreground max-w-[640px] mx-auto">
              Essential tools for content creation, from writing to design to analytics
            </p>
          </div>

          <AIToolMatrix />
        </div>
      </section>

      {/* Prompt Library */}
      <section className="py-20 bg-background" id="prompts">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              prompt library: copy & use
            </h2>
            <p className="text-lg text-muted-foreground max-w-[640px] mx-auto">
              20+ battle-tested prompts for every stage of content creation
            </p>
          </div>

          <PromptLibrary />
        </div>
      </section>

      {/* Quality Checklist */}
      <section className="py-20 bg-muted/20" id="checklist">
        <div className="max-w-[800px] mx-auto px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              content readiness checklist
            </h2>
            <p className="text-lg text-muted-foreground max-w-[640px] mx-auto">
              10 essential checks before publishing AI-assisted content
            </p>
          </div>

          <ContentQualityChecklist />
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-background" id="calculator">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              calculate your time savings
            </h2>
            <p className="text-lg text-muted-foreground max-w-[640px] mx-auto">
              See the ROI of AI-assisted content creation for your team
            </p>
          </div>

          <EffortCalculator />
        </div>
      </section>

      {/* Best Practices vs Pitfalls */}
      <section className="py-20 bg-muted/20" id="pitfalls">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              common pitfalls to avoid
            </h2>
            <p className="text-lg text-muted-foreground max-w-[640px] mx-auto">
              Learn from these mistakes and apply the fixes immediately
            </p>
          </div>

          <PitfallWarningCards />
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              related resources
            </h2>
            <p className="text-lg text-muted-foreground">
              Continue your content marketing education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/resources/playbooks/utm-governance-playbook">
              <Card className="p-6 space-y-3 hover:shadow-lg transition-all">
                <BookOpen className="w-10 h-10" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="font-semibold">UTM Governance Playbook</h3>
                <p className="text-sm text-muted-foreground">
                  Track campaign performance with consistent naming
                </p>
              </Card>
            </Link>

            <Link to="/resources/playbooks/llm-ranking">
              <Card className="p-6 space-y-3 hover:shadow-lg transition-all">
                <Sparkles className="w-10 h-10" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="font-semibold">LLM Ranking Playbook</h3>
                <p className="text-sm text-muted-foreground">
                  Optimize your AI content for ChatGPT and Claude discovery
                </p>
              </Card>
            </Link>

            <Link to="/resources/glossary/content">
              <Card className="p-6 space-y-3 hover:shadow-lg transition-all">
                <CheckCircle2 className="w-10 h-10" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="font-semibold">Content (utm_content)</h3>
                <p className="text-sm text-muted-foreground">
                  Understand UTM content parameter for A/B testing
                </p>
              </Card>
            </Link>

            <Link to="/resources/guides/growth-analytics">
              <Card className="p-6 space-y-3 hover:shadow-lg transition-all">
                <TrendingUp className="w-10 h-10" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="font-semibold">Growth Analytics Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Measure content marketing ROI effectively
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-b from-muted/20 to-background text-center">
        <div className="max-w-[720px] mx-auto px-8 space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold">
            Start Creating Better Content with AI
          </h2>
          <p className="text-lg text-muted-foreground">
            Apply these principles, use the workflow, and watch your content quality soar while your team's efficiency doubles.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/early-access">Get Early Access</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/resources/playbooks">Explore Other Playbooks</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIMarketingPlaybook;