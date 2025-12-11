import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const CustomSlugs = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Custom slugs" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Custom slugs</h1>
      <p className="lead text-lg text-zinc-500">Choose between descriptive slugs and random strings based on your needs.</p>
      
      <h2>Descriptive slugs</h2>
      <p>Human-readable identifiers like <code>/summer-sale</code> or <code>/free-trial</code></p>
      <ul>
        <li>✅ Build trust with viewers</li>
        <li>✅ Higher click-through rates</li>
        <li>✅ Memorable and shareable</li>
        <li>⚠️ Can be guessed by competitors</li>
      </ul>
      
      <h2>Random slugs</h2>
      <p>Auto-generated strings like <code>/x7Kp2m</code> or <code>/Ab3CdE</code></p>
      <ul>
        <li>✅ Impossible to guess</li>
        <li>✅ Good for internal tracking</li>
        <li>✅ Shorter URLs</li>
        <li>⚠️ Less trustworthy appearance</li>
      </ul>
      
      <h2>Best practices</h2>
      <ul>
        <li>Use descriptive slugs for public-facing campaigns</li>
        <li>Use random slugs for internal links and tracking pixels</li>
        <li>Keep slugs lowercase with hyphens (not underscores)</li>
        <li>Avoid special characters</li>
      </ul>
      
      <h2>Reserved slugs</h2>
      <p>Some slugs are reserved: <code>/api</code>, <code>/login</code>, <code>/help</code>, etc.</p>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Creating links", href: "/help/articles/creating-links" },
      { title: "AI vanity slugs", href: "/help/articles/ai-copilot" },
    ]} />
  </HelpLayout>
);

export default CustomSlugs;
