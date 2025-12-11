import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const QuickWins = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Getting Started", href: "/help/getting-started" }, { label: "Quick wins" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Quick wins</h1>
      <p className="lead text-lg text-zinc-500">5 things you can do in your first 10 minutes to get immediate value.</p>
      
      <h2>1. Shorten your most-shared link</h2>
      <p>Take the URL you share most often (your homepage, signup page, or top product) and create a branded short link. You'll immediately start tracking every click.</p>
      
      <h2>2. Install the Chrome extension</h2>
      <p>Right-click any page to create a short link without leaving your browser. Perfect for when you're researching or browsing.</p>
      
      <h2>3. Generate a QR code</h2>
      <p>Create a QR code for your new short link. Add your logo and download it for use in presentations, business cards, or print materials.</p>
      
      <h2>4. Share with UTM parameters</h2>
      <p>Add utm_source and utm_medium to see where your traffic comes from. Even a basic setup gives you valuable attribution data.</p>
      
      <h2>5. Check your first click</h2>
      <p>Click your own link to see how tracking works. Watch it appear in your dashboard with device, location, and referrer data.</p>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Chrome extension setup", href: "/help/articles/chrome-extension" },
      { title: "Creating QR codes", href: "/help/articles/creating-qr-codes" },
    ]} />
  </HelpLayout>
);

export default QuickWins;
