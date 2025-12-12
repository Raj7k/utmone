import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { Globe, Beaker, Brain, Target } from "lucide-react";

const Advanced = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Advanced Features" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Advanced Features</h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400">Geo-targeting, A/B testing, AI co-pilot, predictive analytics, and more power tools for growth teams.</p>
    </div>
    <div className="space-y-3">
      <ExpandableArticle
        title="Geo-targeting rules"
        description="Redirect visitors to different URLs based on their country."
        icon={Globe}
        tier="starter"
      >
        <h3>What is geo-targeting?</h3>
        <p>Geo-targeting allows you to show different content to visitors based on their geographic location. A single short link can redirect to different pages based on country.</p>
        <h3>Use cases</h3>
        <ul>
          <li>Localized landing pages by language</li>
          <li>Regional offers and pricing</li>
          <li>Country-specific product pages</li>
          <li>Compliance (GDPR pages for EU visitors)</li>
        </ul>
        <h3>Setting up geo-targeting</h3>
        <ol>
          <li>Open a link's settings</li>
          <li>Go to the Targeting tab</li>
          <li>Click "Add country rule"</li>
          <li>Select the country and destination URL</li>
          <li>Set a default for unmatched countries</li>
        </ol>
      </ExpandableArticle>

      <ExpandableArticle
        title="Device targeting"
        description="Route traffic based on device, OS, or browser."
        icon={Target}
        tier="growth"
      >
        <h3>Available conditions</h3>
        <ul>
          <li><strong>Device type</strong> — Mobile, desktop, tablet</li>
          <li><strong>Operating system</strong> — iOS, Android, Windows, macOS</li>
          <li><strong>Browser</strong> — Chrome, Safari, Firefox, etc.</li>
        </ul>
        <h3>Common use cases</h3>
        <ul>
          <li>Send mobile users to app store</li>
          <li>Send desktop users to full website</li>
          <li>iOS users to App Store, Android to Play Store</li>
        </ul>
      </ExpandableArticle>

      <ExpandableArticle
        title="Link rotation"
        description="Split traffic between multiple destinations and measure performance."
        icon={Beaker}
        tier="growth"
      >
        <h3>What is link rotation?</h3>
        <p>Link rotation (also called A/B testing for links) splits traffic between multiple destination URLs. This helps you test which landing page converts better.</p>
        <h3>How to set up</h3>
        <ol>
          <li>Open link settings</li>
          <li>Go to A/B Test tab</li>
          <li>Add destination URLs</li>
          <li>Set traffic percentages (e.g., 50/50)</li>
          <li>Enable the test</li>
        </ol>
        <h3>Measuring results</h3>
        <p>View click and conversion data for each variant in the Analytics tab.</p>
      </ExpandableArticle>

      <ExpandableArticle
        title="Smart routing"
        description="AI-powered routing that automatically directs visitors to the best destination."
        icon={Brain}
        tier="business"
      >
        <h3>How smart routing works</h3>
        <p>Smart routing uses machine learning to predict which destination will convert best for each visitor, based on their device, location, time of day, and historical patterns.</p>
        <h3>When to use</h3>
        <ul>
          <li>You have multiple landing page variants</li>
          <li>You want to maximize conversions automatically</li>
          <li>You don't want to manually monitor A/B tests</li>
        </ul>
        <p>Smart routing continuously optimizes, sending more traffic to higher-performing destinations.</p>
      </ExpandableArticle>
    </div>

    <FeatureAvailability
      feature="Advanced Features"
      availability={{ free: false, starter: true, growth: true, business: true, enterprise: true }}
    />
  </HelpLayout>
);

export default Advanced;
