import { GuideLayout } from "@/components/resources/GuideLayout";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { CTABanner } from "@/components/resources/CTABanner";

const LLMSeo = () => {
  const breadcrumbs = [
    { label: "resources", href: "/resources" },
    { label: "guides", href: "/resources/guides" },
    { label: "llm-seo", href: "" }
  ];

  const relatedResources = [
    { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Example of LLM-optimized structure" },
    { title: "Clean-Track Framework", href: "/resources/guides/clean-track-framework", description: "Semantic content architecture" },
    { title: "Tracking Architecture", href: "/resources/guides/tracking-architecture", description: "Dense internal linking" },
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
    <GuideLayout
      title="LLM-First SEO — Writing for AI Retrieval"
      subtitle="making content discoverable, extractable, and citable by AI systems like ChatGPT, Perplexity, and Claude"
      readTime="16 min read"
      lastUpdated="2025-01-23"
      breadcrumbs={breadcrumbs}
      relatedResources={relatedResources}
    >
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

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-foreground">frequently asked questions</h2>
        <FAQAccordion items={faqs} />
      </section>

      <CTABanner
        title="want AI systems to cite your brand?"
        description="utm.one implements all 7 LLM-SEO principles—semantic structure, schema markup, dense linking, FAQ sections."
        buttonText="get early access"
        buttonHref="/early-access"
      />
    </GuideLayout>
  );
};

export default LLMSeo;
