import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const CreateLink = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Link Management", href: "/help/links" },
          { label: "Creating Your First Link" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Creating Your First Link</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Create trackable short links in under 30 seconds. Every link automatically includes 
          UTM parameters, analytics, and optional QR code generation.
        </p>

        <FeatureAvailability tier="free" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Quick Create</h2>
        <p className="text-zinc-600 mb-4">
          The fastest way to create a link is via the Quick Create tile on your dashboard:
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Paste Your Destination URL</h3>
              <p className="text-zinc-600">Enter the full URL you want to shorten (e.g., https://example.com/landing-page)</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">AI Auto-Fills UTM Parameters</h3>
              <p className="text-zinc-600">Our AI Co-Pilot analyzes your URL and suggests appropriate UTM parameters based on the content and context.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Customize Your Slug (Optional)</h3>
              <p className="text-zinc-600">Choose a memorable slug like "summer-sale" or let us generate a random one. Click the wand icon for AI suggestions.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">4</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Click Create</h3>
              <p className="text-zinc-600">Your link is instantly created and copied to clipboard. A QR code is automatically generated.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Link Anatomy</h2>
        <p className="text-zinc-600 mb-4">Every utm.one link consists of:</p>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6 font-mono text-sm">
          <div className="text-zinc-600">
            <span className="text-blue-600">https://</span>
            <span className="text-green-600">utm.one</span>
            <span className="text-zinc-400">/</span>
            <span className="text-purple-600">summer-sale</span>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div><span className="text-green-600 font-semibold">Domain:</span> Your custom domain or utm.one</div>
            <div><span className="text-purple-600 font-semibold">Slug:</span> The unique identifier for this link</div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Advanced Options</h2>
        <p className="text-zinc-600 mb-4">Click "Advanced" to access additional link settings:</p>
        
        <div className="space-y-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Link Expiration</h3>
            <p className="text-zinc-600 text-sm">Set a date/time when the link becomes inactive. Perfect for time-limited campaigns or offers.</p>
            <span className="inline-block mt-2 text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Starter+</span>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Click Limit</h3>
            <p className="text-zinc-600 text-sm">Automatically deactivate after a certain number of clicks. Useful for exclusive offers or limited availability.</p>
            <span className="inline-block mt-2 text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Starter+</span>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Password Protection</h3>
            <p className="text-zinc-600 text-sm">Require visitors to enter a password before accessing the destination. Great for internal or confidential content.</p>
            <span className="inline-block mt-2 text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Growth+</span>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Geo-Targeting</h3>
            <p className="text-zinc-600 text-sm">Send visitors to different URLs based on their country. Perfect for localized campaigns.</p>
            <span className="inline-block mt-2 text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Growth+</span>
          </div>
        </div>

        <ProTip>
          Use descriptive slugs for links you'll share publicly (e.g., "webinar-dec") and random slugs 
          for internal tracking. Descriptive slugs build trust and increase click-through rates.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">After Creation</h2>
        <p className="text-zinc-600 mb-4">Once your link is created, you can:</p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><strong>Copy to clipboard:</strong> Instantly paste anywhere</li>
          <li><strong>Download QR code:</strong> Get PNG, SVG, or PDF versions</li>
          <li><strong>View analytics:</strong> See real-time click data</li>
          <li><strong>Edit link:</strong> Update destination, UTMs, or settings</li>
          <li><strong>Add to campaign:</strong> Group with related links</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Always use UTM parameters for campaign tracking</li>
          <li>Keep slugs short and memorable (under 20 characters)</li>
          <li>Use lowercase letters and hyphens only</li>
          <li>Organize links into campaigns for easy management</li>
          <li>Test your link before sharing widely</li>
        </ul>

        <RelatedArticles
          articles={[
            { title: "Custom Slugs Explained", href: "/help/links/custom-slugs" },
            { title: "Link Expiration & Limits", href: "/help/links/expiration" },
            { title: "Geo-Targeting Rules", href: "/help/advanced/geo-targeting" },
            { title: "Bulk Link Creation", href: "/help/links/bulk-create" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default CreateLink;
