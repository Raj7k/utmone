import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const LinkPreview = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Link preview & sharing" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Link preview & sharing</h1>
      <p className="lead text-lg text-zinc-500">Preview how your links appear in social media cards before sharing.</p>
      
      <h2>Social preview cards</h2>
      <p>When you share a link on social media, it shows:</p>
      <ul>
        <li><strong>Title</strong> — From destination page or custom</li>
        <li><strong>Description</strong> — Summary text</li>
        <li><strong>Image</strong> — OG image from destination or custom upload</li>
      </ul>
      
      <h2>Customizing previews</h2>
      <ol>
        <li>Open link settings</li>
        <li>Go to "Social Preview" tab</li>
        <li>Override title, description, or image</li>
        <li>Preview how it looks on Twitter, LinkedIn, Facebook</li>
      </ol>
      
      <h2>Default behavior</h2>
      <p>By default, we fetch preview data from your destination page's Open Graph tags. This includes:</p>
      <ul>
        <li><code>og:title</code></li>
        <li><code>og:description</code></li>
        <li><code>og:image</code></li>
      </ul>
      
      <h2>Cache clearing</h2>
      <p>Social platforms cache preview cards. After changes:</p>
      <ul>
        <li>Twitter: Use Card Validator to refresh</li>
        <li>Facebook: Use Sharing Debugger</li>
        <li>LinkedIn: Use Post Inspector</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Creating links", href: "/help/articles/creating-links" },
      { title: "QR codes", href: "/help/articles/creating-qr-codes" },
    ]} />
  </HelpLayout>
);

export default LinkPreview;
