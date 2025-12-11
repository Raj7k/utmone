import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const ChromeExtension = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "Chrome extension setup" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Chrome extension setup</h1>
      <p className="lead text-lg text-zinc-500">Create short links without leaving your browser. Right-click any page to shorten instantly.</p>
      
      <h2>Installation</h2>
      <ol>
        <li>Visit the Chrome Web Store and search for "utm.one"</li>
        <li>Click "Add to Chrome"</li>
        <li>Sign in with your utm.one account</li>
        <li>The extension icon appears in your toolbar</li>
      </ol>
      
      <h2>Features</h2>
      <ul>
        <li><strong>One-click shortening</strong> — Click the icon to shorten the current page</li>
        <li><strong>Right-click menu</strong> — Right-click any link to shorten it</li>
        <li><strong>Smart detection</strong> — Auto-detects UTM source from the site you're on</li>
        <li><strong>Quick copy</strong> — Short link copied to clipboard automatically</li>
      </ul>
      
      <h2>Smart context detection</h2>
      <p>When you shorten a link from twitter.com, we automatically set utm_source to "twitter". Same for LinkedIn, YouTube, and other major platforms.</p>
      
      <h2>Keyboard shortcut</h2>
      <p>Press <code>Ctrl+Shift+U</code> (or <code>Cmd+Shift+U</code> on Mac) to open the shortener sidebar without clicking.</p>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Creating short links", href: "/help/articles/creating-links" },
      { title: "Quick wins", href: "/help/articles/quick-wins" },
    ]} />
  </HelpLayout>
);

export default ChromeExtension;
