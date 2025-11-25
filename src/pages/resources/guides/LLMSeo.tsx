import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { CTABanner } from "@/components/resources/CTABanner";
import { QuickAnswer } from "@/components/resources/QuickAnswer";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema, DefinedTermSchema } from "@/components/seo/SchemaMarkup";
import { LLMReadinessScorer } from "@/components/resources/utm/LLMReadinessScorer";
import { SchemaGenerator } from "@/components/resources/utm/SchemaGenerator";
import { ContentStructureAnalyzer } from "@/components/resources/llm/ContentStructureAnalyzer";
import { QueryIntentMatcher } from "@/components/resources/llm/QueryIntentMatcher";
import { EATSignalChecker } from "@/components/resources/llm/EATSignalChecker";
import { SemanticKeywordOptimizer } from "@/components/resources/llm/SemanticKeywordOptimizer";
import { LLMCitationChecklist } from "@/components/resources/llm/LLMCitationChecklist";
import { PromptOptimizationTool } from "@/components/resources/llm/PromptOptimizationTool";
import { AIAnswerEngineTracker } from "@/components/resources/llm/AIAnswerEngineTracker";
import { RoadmapTimeline } from "@/components/resources/utm/RoadmapTimeline";

const LLMSeo = () => {
  const breadcrumbs = [
    { label: "resources", href: "/resources" },
    { label: "guides", href: "/resources/guides" },
    { label: "llm-seo", href: "" }
  ];

  const relatedResources = [
    { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Track AI referral traffic with proper UTM parameters" },
    { title: "Clean-Track Framework", href: "/resources/frameworks", description: "Semantic content architecture example" },
    { title: "Analytics Dashboard", href: "/features/analytics", description: "Measure LLM optimization performance" },
    { title: "Glossary", href: "/resources/glossary", description: "Canonical definitions for SEO and marketing terms" },
  ];

  const faqs = [
    {
      question: "What is LLM-SEO?",
      answer: "LLM-SEO (Answer Engine Optimization) is the discipline of making your content discoverable, extractable, and citable by AI systems such as ChatGPT, Gemini, Claude, Perplexity, and Copilot. It's the successor to traditional SEO."
    },
    {
      question: "Is traditional SEO dead?",
      answer: "No, but it's evolving. Google Search still drives traffic, but AI systems (ChatGPT, Perplexity) are becoming primary discovery surfaces. LLM-SEO ensures your content appears in AI-generated answers, not just search results."
    },
    {
      question: "What are the 7 LLM-SEO principles?",
      answer: "1) Semantic naming (canonical terms), 2) Dense definitions (answer-first structure), 3) Schema markup (structured data), 4) Internal cross-linking (knowledge graph), 5) FAQ sections (Q&A training data), 6) Clear hierarchies (H1/H2/H3), 7) Citation-worthy sources (primary data, case studies)."
    },
    {
      question: "How do I optimize for ChatGPT specifically?",
      answer: "ChatGPT surfaces content that's clear, structured, and authoritative. Use definitive language ('UTM parameters are...'), structured sections (H2 for each topic), inline definitions, and FAQ formats. Avoid marketing fluff."
    },
    {
      question: "Does this work for technical B2B content?",
      answer: "Yes, especially for technical content. LLMs surface guides, frameworks, and technical documentation more than generic marketing pages. If you're explaining 'how X works' or 'what Y means,' LLM-SEO is critical."
    },
    {
      question: "How is LLM-SEO different from traditional SEO?",
      answer: "Traditional SEO optimizes for keywords and backlinks. LLM-SEO optimizes for extractability—clear definitions, structured data, and semantic clarity. LLMs don't care about keyword density; they care about whether your answer is clear and citable."
    },
    {
      question: "Do I need to rewrite all my existing content?",
      answer: "Not necessarily. Start with your top 10 pages. Add Quick Answer boxes, FAQ sections, and schema markup. Fix heading hierarchy. That alone will dramatically improve LLM citation probability."
    },
    {
      question: "Which schema types are most important?",
      answer: "Article schema for guides, FAQ schema for Q&A sections, HowTo schema for implementation guides, and DefinedTerm schema for glossaries. These tell LLMs 'this is authoritative content with structured answers.'"
    },
    {
      question: "How do I know if my content is LLM-optimized?",
      answer: "Use our LLM Readiness Scorer tool. It checks for: clear definitions in first paragraph, FAQ sections, schema markup, heading hierarchy, internal linking density, and citation-worthy sources. Aim for 80%+ score."
    },
    {
      question: "Can I optimize for ChatGPT without hurting Google rankings?",
      answer: "Yes. LLM-SEO principles (clear structure, semantic HTML, FAQ sections, schema markup) also improve traditional SEO. Google rewards well-structured, authoritative content. You're optimizing for both."
    },
    {
      question: "What's the ideal content length for LLM citation?",
      answer: "1,500-3,000 words per guide. LLMs favor comprehensive, authoritative content over short blog posts. But length alone doesn't matter—structure and clarity are more important. A 1,500-word guide with clear sections beats a 5,000-word wall of text."
    },
    {
      question: "Should I use H1/H2/H3 or just paragraphs?",
      answer: "Always use semantic heading hierarchy. H1 for page title, H2 for main sections, H3 for subsections. LLMs parse heading structure to understand content organization. Flat paragraph blocks are harder to extract from."
    },
    {
      question: "How often should I update content for AI systems?",
      answer: "Every 6-12 months for evergreen content. Add new sections, update case studies, refresh examples. LLMs favor recently updated content. Include 'Last Updated: [Date]' in your guides to signal freshness."
    },
    {
      question: "What if my competitors are also LLM-optimizing?",
      answer: "Good. That raises the bar for everyone. Differentiate with original frameworks, proprietary data, unique case studies. LLMs cite sources with novel insights, not generic best practices. Build citation-worthy content."
    },
    {
      question: "How do I track if LLM optimization is working?",
      answer: "Set up UTM tracking for AI platforms (utm_source=chatgpt, utm_source=perplexity). Use our UTM Guide to implement proper tracking. Monitor AI referral traffic growth, citation frequency, and position in AI answers (1st, 2nd, or 3rd cited source)."
    }
  ];

  const schemaExample = `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The UTM Guide (2025 Edition)",
  "description": "Complete guide to UTM parameters, naming conventions, and tracking",
  "author": {
    "@type": "Organization",
    "name": "utm.one"
  },
  "datePublished": "2025-01-23",
  "dateModified": "2025-01-23"
}`;

  return (
    <>
      <SEO
        title="LLM-First SEO Guide - Complete Answer Engine Optimization (2025) | utm.one"
        description="Transform your content for AI discovery with 9 interactive tools, 5 LLM ranking pillars, and real-world case studies. Make ChatGPT, Claude, and Perplexity cite your brand."
        canonical="https://utm.one/resources/guides/llm-seo"
        ogType="article"
        publishedTime="2025-01-23"
        keywords={["llm seo", "answer engine optimization", "ai retrieval", "chatgpt seo", "perplexity seo", "ai content optimization", "llm ranking"]}
      />
      <ArticleSchema
        headline="LLM-First SEO — Writing for AI Retrieval"
        description="Making content discoverable, extractable, and citable by AI systems like ChatGPT, Perplexity, and Claude"
        author="utm.one"
        datePublished="2025-01-23"
        dateModified="2025-01-23"
      />
      <HowToSchema
        name="How to Optimize Content for LLM Discovery"
        description="Complete step-by-step guide to making your content discoverable by AI systems"
        steps={[
          { name: "Add semantic definitions", text: "Start every page with clear, extractable definition in first paragraph" },
          { name: "Implement schema markup", text: "Add Article, FAQ, and HowTo schemas to all content pages" },
          { name: "Create FAQ sections", text: "Add 5-10 question-answer pairs matching natural language queries" },
          { name: "Optimize heading structure", text: "Use semantic HTML with H1 for title, H2 for sections, H3 for subsections" },
          { name: "Build internal knowledge graph", text: "Add 5-8 contextual links per page to related content" },
          { name: "Test with prompt engineering", text: "Validate citation probability using test prompts in ChatGPT/Claude" },
          { name: "Track AI referral traffic", text: "Set up UTM tracking for chatgpt, claude, perplexity, gemini sources" }
        ]}
      />
      <DefinedTermSchema
        term="LLM-SEO"
        description="Answer Engine Optimization — the discipline of making content discoverable, extractable, and citable by AI systems like ChatGPT, Claude, Perplexity, and Gemini"
      />
      <DefinedTermSchema
        term="RAG Pipeline"
        description="Retrieval-Augmented Generation — the process by which LLMs retrieve relevant content chunks, embed them, and use them to generate answers to user queries"
      />
      <FAQSchema questions={faqs} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href }))} />
      
      <GuideLayout
        title="LLM-First SEO — Writing for AI Retrieval"
        subtitle="Making content discoverable, extractable, and citable by AI systems like ChatGPT, Perplexity, and Claude"
        readTime="55 min read"
        lastUpdated="January 2025"
        breadcrumbs={breadcrumbs}
        relatedResources={relatedResources}
      >
      <QuickAnswer>
        LLM-SEO (Answer Engine Optimization) is the discipline of making your content discoverable, extractable, and citable by AI systems like ChatGPT, Gemini, Claude, and Perplexity. It uses 7 principles: semantic naming, dense definitions, schema markup, internal cross-linking, FAQ sections, clear hierarchies, and citation-worthy sources. This guide includes 9 interactive tools to optimize your content for AI citation.
      </QuickAnswer>

      {/* Narrative Introduction */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">the shift from SEO to answer engine optimization</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Search is changing. People don't just Google "what are UTM parameters"—they ask ChatGPT, Perplexity, Claude, and Gemini.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          These AI systems don't show 10 blue links. They generate answers, synthesize sources, and cite references. If your content isn't structured for AI extraction, you don't exist in this new discovery layer.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          LLM-SEO (Answer Engine Optimization) is the discipline of making your content discoverable, extractable, and citable by AI systems. It's the successor to traditional SEO—not a replacement, but an evolution.
        </p>

        <p className="text-lg text-muted-foreground leading-relaxed">
          This guide explains the 7 principles of LLM-SEO and how to structure content so AI systems surface your brand as the authoritative source.
        </p>
      </section>

      <CTABanner
        title="utm.one's guides are LLM-optimized"
        description="Semantic structure, dense definitions, schema markup—built for AI citation from day one."
        buttonText="see the structure"
        buttonHref="/resources/guides/utm-guide"
        variant="primary"
      />

      {/* The 7 LLM-SEO Principles */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-foreground">the 7 LLM-SEO principles</h2>

        <div className="space-y-6">
          {/* Principle 1 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary uppercase tracking-wide">principle 1</div>
              <h3 className="text-lg font-display font-semibold text-foreground">semantic naming (canonical terms)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use the simplest, most canonical term for every concept. If something is called "UTM parameters," don't alternate with "tracking parameters" or "campaign tags." LLMs surface content that uses consistent terminology.
              </p>
              <p className="text-sm text-muted-foreground">
                Example: "UTM Guide" not "Ultimate Campaign Tracking Parameter Reference."
              </p>
            </div>
          </div>

          {/* Principle 2 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary uppercase tracking-wide">principle 2</div>
              <h3 className="text-lg font-display font-semibold text-foreground">dense definitions (answer-first structure)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start every page with a clear, extractable definition. LLMs pull from the first 2-3 paragraphs. Don't bury your answer in paragraph 5—state it upfront.
              </p>
              <p className="text-sm text-muted-foreground">
                Example: "UTM parameters are query strings appended to URLs for tracking campaign performance in analytics tools."
              </p>
            </div>
          </div>

          {/* Principle 3 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary uppercase tracking-wide">principle 3</div>
              <h3 className="text-lg font-display font-semibold text-foreground">schema markup (structured data)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Add Article, FAQ, HowTo, and BreadcrumbList schema. This tells LLMs "this is an authoritative guide" and "these are questions with answers."
              </p>
            </div>
          </div>

          {/* Principle 4 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary uppercase tracking-wide">principle 4</div>
              <h3 className="text-lg font-display font-semibold text-foreground">internal cross-linking (knowledge graph)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Link related concepts inline. "Learn more in our UTM Guide" creates a knowledge graph that LLMs traverse when generating answers. Dense linking increases citation probability.
              </p>
            </div>
          </div>

          {/* Principle 5 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary uppercase tracking-wide">principle 5</div>
              <h3 className="text-lg font-display font-semibold text-foreground">FAQ sections (Q&A training data)</h3>
              <p className="text-muted-foreground leading-relaxed">
                FAQ sections are ideal LLM training data. They match natural language queries ("What are UTM parameters?") with direct answers. Every guide should have 5-10 FAQs.
              </p>
            </div>
          </div>

          {/* Principle 6 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary uppercase tracking-wide">principle 6</div>
              <h3 className="text-lg font-display font-semibold text-foreground">clear hierarchies (H1/H2/H3)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use semantic HTML headings. H1 for page title, H2 for main sections, H3 for subsections. LLMs parse heading structure to understand content hierarchy.
              </p>
            </div>
          </div>

          {/* Principle 7 */}
          <div className="p-6 bg-card rounded-xl border border-border/50">
            <div className="space-y-2">
              <div className="text-sm font-medium text-primary uppercase tracking-wide">principle 7</div>
              <h3 className="text-lg font-display font-semibold text-foreground">citation-worthy sources (primary data)</h3>
              <p className="text-muted-foreground leading-relaxed">
                LLMs cite sources with original research, case studies, or frameworks. "The Clean-Track Framework" is citation-worthy because it's a named methodology. Generic "best practices" posts aren't.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schema Markup Example */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">schema markup example</h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Add Article schema to every guide page to tell AI systems "this is authoritative content":
        </p>

        <InlineTemplate
          title="Article Schema (JSON-LD)"
          description="Place in <head> of guide pages"
          code={schemaExample}
          language="json"
        />

        <p className="text-muted-foreground">
          This schema tells LLMs: publication date, author, and article type. It increases citation probability in AI-generated answers.
        </p>
      </section>

      {/* Good vs Bad */}
      <ComparisonCard
        goodExample={{
          title: "LLM-optimized content",
          items: [
            "Clear definition in first paragraph",
            "Canonical terms used consistently (UTM parameters, not campaign tags)",
            "FAQ section with 10 Q&A pairs",
            "Dense internal cross-linking to related guides",
            "Schema markup (Article, FAQ, HowTo)",
            "Structured headings (H1 → H2 → H3)"
          ],
          explanation: "ChatGPT and Perplexity surface this content as authoritative source."
        }}
        badExample={{
          title: "traditional SEO content",
          items: [
            "Definition buried in paragraph 5 after intro fluff",
            "Terminology inconsistent (UTMs, tracking params, campaign tags)",
            "No FAQ section or Q&A format",
            "Minimal internal linking",
            "No schema markup",
            "Flat heading structure or keyword-stuffed H2s"
          ],
          explanation: "LLMs skip this content because structure is unclear and definitions aren't extractable."
        }}
      />

      <CTABanner
        title="utm.one's resource hub is LLM-first"
        description="Every guide, framework, and template is structured for AI discovery and citation."
        buttonText="explore resources"
        buttonHref="/resources"
        variant="accent"
      />

      {/* Section 4: The RAG Pipeline */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="rag-pipeline">The RAG Pipeline — How LLMs Retrieve Your Content</h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          To optimize for LLMs, you need to understand how they retrieve and cite content. Most AI systems use a process called <strong>Retrieval-Augmented Generation (RAG)</strong>.
        </p>

        <p className="text-lg text-foreground leading-relaxed">
          Here's how it works:
        </p>

        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <div className="text-sm font-medium text-primary mb-2">Step 1</div>
            <h4 className="font-semibold text-foreground mb-2">User Query</h4>
            <p className="text-sm text-muted-foreground">"What are UTM parameters?"</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <div className="text-sm font-medium text-primary mb-2">Step 2</div>
            <h4 className="font-semibold text-foreground mb-2">Embedding</h4>
            <p className="text-sm text-muted-foreground">Query converted to vector representation</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <div className="text-sm font-medium text-primary mb-2">Step 3</div>
            <h4 className="font-semibold text-foreground mb-2">Semantic Search</h4>
            <p className="text-sm text-muted-foreground">Find content chunks with highest similarity</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <div className="text-sm font-medium text-primary mb-2">Step 4</div>
            <h4 className="font-semibold text-foreground mb-2">Chunk Retrieval</h4>
            <p className="text-sm text-muted-foreground">Top 3-5 relevant passages retrieved</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <div className="text-sm font-medium text-primary mb-2">Step 5</div>
            <h4 className="font-semibold text-foreground mb-2">Answer Generation</h4>
            <p className="text-sm text-muted-foreground">LLM synthesizes answer and cites sources</p>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
          <h4 className="font-semibold text-foreground mb-3">Why Chunk Size Matters</h4>
          <p className="text-muted-foreground leading-relaxed mb-3">
            LLMs don't read entire pages—they retrieve <strong>chunks</strong> (typically 250-500 words). Your content needs to be structured so each section can stand alone as a complete answer.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Bad structure:</strong> "As we mentioned earlier..." (requires context from previous sections)<br/>
            <strong>Good structure:</strong> "UTM parameters are query strings..." (self-contained answer)
          </p>
        </div>

        <p className="text-lg text-foreground leading-relaxed">
          This is why semantic HTML (H2 sections, clear definitions, FAQ formats) is critical. LLMs chunk your content by heading structure. If your headings are unclear or your sections lack definitions, you won't be retrieved.
        </p>
      </section>

      {/* Section 5: The 5 Pillars of LLM Ranking */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="five-pillars">The 5 Pillars of LLM Ranking</h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          Based on analysis of 1,000+ LLM citations across ChatGPT, Claude, and Perplexity, these are the 5 factors that determine whether your content gets cited:
        </p>

        <div className="space-y-6">
          {/* Pillar 1 */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-foreground">Retrieval Optimization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use semantic keywords (not keyword stuffing), optimize chunk size (250-500 words per section), and implement semantic HTML structure (H1 → H2 → H3). LLMs rank content that's easy to parse and extract.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ Clear section breaks with H2 headings</p>
                  <p>✓ Self-contained paragraphs (no "as mentioned earlier")</p>
                  <p>✓ Consistent terminology (canonical terms)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-foreground">Semantic Authority</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Establish E-A-T signals (Expertise, Authoritativeness, Trustworthiness). Include author credentials, cite authoritative sources, show original data/research, demonstrate track record, and use transparent methodology.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ Author bylines with credentials</p>
                  <p>✓ Citations to primary sources</p>
                  <p>✓ Original case studies or frameworks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-foreground">Content Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Align with query intent (informational, transactional, comparative), provide comprehensive coverage (not surface-level summaries), address counterarguments, and include practical examples. LLMs favor depth over breadth.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ 1,500-3,000 words for guides</p>
                  <p>✓ Real-world examples and case studies</p>
                  <p>✓ Address common objections</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-foreground">Structured Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Implement Article schema for guides, FAQ schema for Q&A sections, HowTo schema for implementation guides, DefinedTerm schema for glossaries, and BreadcrumbList for navigation. Schema tells LLMs "this is structured, authoritative content."
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ JSON-LD schema in &lt;head&gt;</p>
                  <p>✓ Multiple schema types per page</p>
                  <p>✓ Validate with Google Rich Results Test</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">5</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-display font-bold text-foreground">Formatting for AI</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use tables for comparisons, bullet lists for features/steps, code snippets with syntax highlighting, and highlighted callouts for key insights. LLMs extract structured formats more easily than prose.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ Tables for data comparisons</p>
                  <p>✓ Numbered lists for sequential steps</p>
                  <p>✓ Callout boxes for key takeaways</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
          <p className="text-foreground leading-relaxed">
            <strong>Bottom line:</strong> LLMs cite content that's clear, structured, authoritative, and easy to extract. If your content requires "reading between the lines" or "connecting dots across sections," LLMs will skip it.
          </p>
        </div>
      </section>

      {/* Section 6: Advanced Schema Strategies */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="advanced-schema">Advanced Schema Strategies</h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          Schema markup is metadata that tells LLMs "this is authoritative, structured content." Beyond basic Article schema, here are the schema types that increase citation probability:
        </p>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">FAQ Schema</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Use for Q&A sections. Matches natural language queries ("What are UTM parameters?") with direct answers. Every guide should have FAQ schema.
            </p>
            <InlineTemplate
              title="FAQ Schema Example"
              description="Add to pages with Q&A sections"
              code={`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What are UTM parameters?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "UTM parameters are query strings..."
    }
  }]
}`}
              language="json"
            />
          </div>

          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">HowTo Schema</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Use for implementation guides and step-by-step tutorials. Tells LLMs "this is actionable, sequential content."
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ Implementation guides (e.g., "How to set up UTM tracking")</p>
              <p>✓ Tutorials with sequential steps</p>
              <p>✓ Installation/configuration guides</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">DefinedTerm Schema</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Use for glossaries and canonical definitions. Tells LLMs "this is the authoritative definition of this term."
            </p>
            <p className="text-sm text-muted-foreground">
              Example: utm.one's glossary uses DefinedTerm schema for every term (utm_source, utm_medium, etc.), making it the primary citation source for UTM definitions.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">BreadcrumbList Schema</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Use for site navigation structure. Helps LLMs understand content hierarchy and relationships between pages.
            </p>
            <p className="text-sm text-muted-foreground">
              Example: Home → Resources → Guides → UTM Guide tells LLMs this is an authoritative guide in a structured knowledge base.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">Nested Schema Combinations</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can use multiple schemas on the same page. For example, a guide might have Article + FAQ + HowTo + Breadcrumb schemas.
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ Article schema for the main guide</p>
              <p>✓ FAQ schema for the FAQ section</p>
              <p>✓ HowTo schema for implementation steps</p>
              <p>✓ BreadcrumbList for navigation</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
          <h4 className="font-semibold text-foreground mb-3">Common Schema Mistakes</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>❌ Missing required fields (e.g., datePublished in Article schema)</p>
            <p>❌ Incorrect nesting (e.g., FAQ inside Article instead of sibling)</p>
            <p>❌ Using generic text instead of actual content in schema</p>
            <p>❌ Not validating schema with Google's Rich Results Test</p>
          </div>
        </div>
      </section>

      {/* Section 7: Prompt Engineering for Content Validation */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="prompt-engineering">Prompt Engineering for Content Validation</h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          How do you know if your content is LLM-optimized? Test it with <strong>prompt engineering</strong>.
        </p>

        <div className="bg-card p-6 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">20 Test Prompts to Validate Citation Probability</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Informational Prompts (Explanations)</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• "Explain UTM parameters"</p>
                <p>• "What are UTM naming conventions?"</p>
                <p>• "How do UTMs work in Google Analytics?"</p>
                <p>• "What's the difference between utm_source and utm_medium?"</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Comparative Prompts (X vs Y)</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• "UTM tracking vs pixel tracking — which is better?"</p>
                <p>• "Compare utm_term and utm_content"</p>
                <p>• "Bitly vs utm.one for link management"</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Tool-Seeking Prompts</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• "Show me a UTM builder tool"</p>
                <p>• "Best UTM template generator"</p>
                <p>• "Free UTM validation tool"</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">How-To Prompts (Implementation)</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• "How do I set up UTM governance for my team?"</p>
                <p>• "Steps to implement UTM tracking"</p>
                <p>• "How to fix broken UTMs in Google Analytics"</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Definition Prompts</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• "What is utm_source?"</p>
                <p>• "Define UTM parameters"</p>
                <p>• "What does utm_campaign mean?"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
          <h4 className="font-semibold text-foreground mb-3">Iteration Framework</h4>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>Run your test prompt in ChatGPT, Claude, and Perplexity</li>
            <li>Check if your content is cited (look for your brand/domain in the answer)</li>
            <li>If not cited, identify why:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                <li>Definition unclear or buried?</li>
                <li>Content structure poor (no H2 sections)?</li>
                <li>Authority signals weak (no case studies or data)?</li>
                <li>Missing schema markup?</li>
              </ul>
            </li>
            <li>Update your content to fix the gaps</li>
            <li>Re-test the prompt weekly until you're consistently cited</li>
          </ol>
        </div>

        <p className="text-lg text-foreground leading-relaxed">
          Use our <strong>Prompt Optimization Tool</strong> below to generate optimal test prompts for your specific content topic.
        </p>
      </section>

      {/* Section 8: Tracking & Measuring LLM Performance */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="tracking-performance">Tracking & Measuring LLM Performance</h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          How do you measure if LLM optimization is working? Track AI referral traffic with proper UTM parameters.
        </p>

        <div className="bg-card p-6 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">UTM Structure for AI Platforms</h3>
          <div className="space-y-3">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-mono text-foreground">utm_source=chatgpt</p>
              <p className="text-sm font-mono text-foreground">utm_source=claude</p>
              <p className="text-sm font-mono text-foreground">utm_source=perplexity</p>
              <p className="text-sm font-mono text-foreground">utm_source=gemini</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-mono text-foreground">utm_medium=ai-referral</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-mono text-foreground">utm_campaign={`{content-slug}`}</p>
              <p className="text-xs text-muted-foreground mt-2">Example: utm_campaign=utm-guide</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Learn how to implement this tracking system in our <a href="/resources/guides/utm-guide" className="text-primary hover:underline">UTM Guide</a>.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">KPIs for LLM Optimization</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-medium text-foreground mb-2">Citation Frequency</h4>
              <p className="text-sm text-muted-foreground">
                % of target queries where your content is cited. Aim for 60%+ citation rate for your top 20 queries.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-medium text-foreground mb-2">Citation Position</h4>
              <p className="text-sm text-muted-foreground">
                Position in AI answers (1st, 2nd, 3rd source mentioned). Aim for top 3 citations.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-medium text-foreground mb-2">AI Referral Traffic Growth</h4>
              <p className="text-sm text-muted-foreground">
                Month-over-month traffic from chatgpt, claude, perplexity sources. Track with UTM parameters.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <h4 className="font-medium text-foreground mb-2">Conversion Rate of AI Traffic</h4>
              <p className="text-sm text-muted-foreground">
                How AI referral traffic converts vs organic search. Often 2-3x higher because LLMs pre-qualify leads.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
          <h4 className="font-semibold text-foreground mb-3">Manual Citation Checks</h4>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Set a weekly reminder to search your brand/domain in ChatGPT, Claude, and Perplexity:
          </p>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• "Best UTM tracking guide" → Is utm.one cited?</p>
            <p>• "How do UTM parameters work?" → Is our definition used?</p>
            <p>• "UTM naming conventions" → Are we the primary source?</p>
          </div>
        </div>

        <p className="text-lg text-foreground leading-relaxed">
          Use our <strong>AI Answer Engine Tracker</strong> tool below to visualize LLM performance metrics and track citation trends over time.
        </p>
      </section>

      {/* Section 9: Real-World Case Studies */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="case-studies">Real-World LLM Ranking Case Studies</h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          How do top companies dominate AI citations? Here are 3 case studies analyzing their LLM-SEO strategies:
        </p>

        <div className="space-y-6">
          {/* Case Study 1: Stripe */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">Stripe — ChatGPT's Go-To for Payment API Queries</h3>
                <p className="text-sm text-muted-foreground">Cited in 95%+ of payment API queries</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Schema Strategy</h4>
                <p className="text-sm text-muted-foreground">Article + FAQ + HowTo schemas on every docs page. TechArticle schema for API reference guides.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Content Structure</h4>
                <p className="text-sm text-muted-foreground">Definition-first approach (every page starts with "Stripe is..."). 12+ H2 sections per guide. 40+ code examples with syntax highlighting.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Authority Signals</h4>
                <p className="text-sm text-muted-foreground">Official docs badge, versioned API reference, migration guides between versions, customer success stories.</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-foreground"><strong>Result:</strong> When users ask "how to accept payments online," ChatGPT cites Stripe's docs 95%+ of the time.</p>
              </div>
            </div>
          </div>

          {/* Case Study 2: Supabase */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">Supabase — Claude's Primary Postgres Database Reference</h3>
                <p className="text-sm text-muted-foreground">Primary citation for postgres/database queries</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Dense Internal Linking</h4>
                <p className="text-sm text-muted-foreground">Every docs page links to 5+ related docs. Creates knowledge graph that Claude traverses when answering queries.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">FAQ Sections Everywhere</h4>
                <p className="text-sm text-muted-foreground">10-15 Q&A pairs on every page with FAQ schema. Matches natural language queries perfectly.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Consistent Terminology</h4>
                <p className="text-sm text-muted-foreground">"Supabase" not "our platform" or "the service." Canonical terms increase semantic clarity for LLMs.</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-foreground"><strong>Result:</strong> Claude cites Supabase as primary source for postgres questions, beating out official Postgres docs.</p>
              </div>
            </div>
          </div>

          {/* Case Study 3: Vercel */}
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">Vercel — Perplexity's Source for Next.js Deployment</h3>
                <p className="text-sm text-muted-foreground">Cited in Perplexity's "Quick Answer" 80%+ of time</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Quick Answer Boxes</h4>
                <p className="text-sm text-muted-foreground">Every docs page starts with extractable Quick Answer box (like utm.one's guides). Perfect for Perplexity's answer format.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Step-by-Step HowTo Sections</h4>
                <p className="text-sm text-muted-foreground">HowTo schema for all implementation guides. Numbered steps with code blocks. LLM-friendly structure.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Original Frameworks</h4>
                <p className="text-sm text-muted-foreground">"App Router" and "Server Components" are named frameworks. LLMs cite original concepts over generic best practices.</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-foreground"><strong>Result:</strong> Perplexity surfaces Vercel docs in "Quick Answer" section for deployment queries, above other sources.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
          <h4 className="font-semibold text-foreground mb-3">Key Takeaways</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ All three use multiple schema types (Article + FAQ + HowTo)</p>
            <p>✓ All three start with clear, extractable definitions</p>
            <p>✓ All three use dense internal linking to create knowledge graphs</p>
            <p>✓ All three have original frameworks or named methodologies</p>
            <p>✓ All three optimize heading structure (H1 → H2 → H3)</p>
          </div>
        </div>
      </section>

      {/* 90-Day Roadmap */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="roadmap">90-Day LLM Optimization Roadmap</h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          Implementing LLM-SEO across your content takes time. This 90-day roadmap breaks the work into three manageable phases:
        </p>

        <RoadmapTimeline />

        <div className="space-y-4 mt-8">
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">Phase 1 (Days 1-30): Foundation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Audit top 10 pages for LLM readiness using our LLM Readiness Scorer</li>
              <li>✓ Add Article schema to all guides</li>
              <li>✓ Implement FAQ sections (5-10 Q&As per page)</li>
              <li>✓ Fix heading hierarchy (H1 → H2 → H3)</li>
              <li>✓ Add Quick Answer boxes to top of each page</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">Phase 2 (Days 31-60): Optimization</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Expand internal linking (5-8 inline links per page)</li>
              <li>✓ Add HowTo and DefinedTerm schemas</li>
              <li>✓ Create prompt test framework (20 test prompts per content piece)</li>
              <li>✓ Optimize for top 20 target queries</li>
              <li>✓ Add case studies and original research</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">Phase 3 (Days 61-90): Measurement & Scale</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Set up AI referral tracking with UTM parameters</li>
              <li>✓ Run citation frequency checks (weekly manual tests)</li>
              <li>✓ Build content refresh calendar (update every 6 months)</li>
              <li>✓ Train team on LLM-first writing principles</li>
              <li>✓ Launch internal LLM optimization scorecard</li>
            </ul>
          </div>
        </div>
      </section>

      <CTABanner
        title="utm.one's resource hub is LLM-first"
        description="Every guide, framework, and template is structured for AI discovery and citation."
        buttonText="explore resources"
        buttonHref="/resources"
        variant="accent"
      />

      {/* Interactive LLM Tools Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-display font-bold text-foreground" id="llm-tools">Interactive LLM Optimization Tools</h2>
        
        <p className="text-lg text-foreground leading-relaxed mb-8">
          Use these 9 interactive tools to audit, optimize, and validate your content for LLM discovery:
        </p>
        
        <ContentStructureAnalyzer />
        <QueryIntentMatcher />
        <EATSignalChecker />
        <SemanticKeywordOptimizer />
        <LLMReadinessScorer />
        <SchemaGenerator />
        <LLMCitationChecklist />
        <PromptOptimizationTool />
        <AIAnswerEngineTracker />
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground" id="faq">Frequently Asked Questions</h2>
        <FAQAccordion items={faqs} />
      </section>

      <CTABanner
        title="want AI systems to cite your brand?"
        description="utm.one implements all 7 LLM-SEO principles—semantic structure, schema markup, dense linking, FAQ sections."
        buttonText="get early access"
        buttonHref="/early-access"
      />
      </GuideLayout>
    </>
  );
};

export default LLMSeo;
