import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, MapPin, Smartphone, Router } from "lucide-react";

const GeoTargeting = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/advanced" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Geo-targeting</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Redirect visitors to different destinations based on their geographic location.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is geo-targeting?</h2>
          <p className="text-zinc-600 mb-4">
            Geo-targeting lets you send visitors from different countries to different URLs 
            using a single utm.one link. Perfect for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Localized landing pages by country</li>
            <li>Region-specific pricing pages</li>
            <li>Language-specific content</li>
            <li>Compliance with regional regulations</li>
          </ul>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Example</h4>
            <p className="text-sm text-zinc-600 mb-3">Single link: <code>utm.one/pricing</code></p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇺🇸</span>
                <span className="text-zinc-600">US visitors →</span>
                <code className="bg-white px-2 py-1 rounded">yoursite.com/pricing-usd</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇬🇧</span>
                <span className="text-zinc-600">UK visitors →</span>
                <code className="bg-white px-2 py-1 rounded">yoursite.co.uk/pricing</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇩🇪</span>
                <span className="text-zinc-600">Germany visitors →</span>
                <code className="bg-white px-2 py-1 rounded">yoursite.de/preise</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌍</span>
                <span className="text-zinc-600">Everyone else →</span>
                <code className="bg-white px-2 py-1 rounded">yoursite.com/pricing</code>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up geo-targeting</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Open any link's detail page</li>
            <li>Click the <strong>Targeting</strong> tab</li>
            <li>Enable <strong>Geo-targeting</strong></li>
            <li>Click <strong>Add rule</strong></li>
            <li>Select a country and enter the destination URL</li>
            <li>Repeat for additional countries</li>
            <li>Save changes</li>
          </ol>

          <ProTip>
            The default destination (original URL) is used for any country without a specific 
            rule. Make sure your default works for most visitors.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">How location is detected</h2>
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Location is detected using IP geolocation at the edge. Detection happens 
                instantly with no delay to the redirect.
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Country detection is 99.9% accurate</li>
            <li>VPN users will see content for their VPN exit country</li>
            <li>Mobile users show carrier or ISP location</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Rule priority</h2>
          <p className="text-zinc-600 mb-4">
            Rules are evaluated in order:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Specific country rules (if visitor matches)</li>
            <li>Region rules (if configured)</li>
            <li>Default destination (fallback)</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Testing geo-targeting</h2>
          <p className="text-zinc-600 mb-4">
            Test your rules before launching:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Use the <strong>Test</strong> button in targeting settings</li>
            <li>Select a country to simulate</li>
            <li>See which URL would be served</li>
            <li>Use a VPN to test real redirects</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Analytics</h2>
          <p className="text-zinc-600 mb-4">
            Geo-targeting is fully tracked in analytics:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>See clicks by country in the geographic breakdown</li>
            <li>Filter by destination URL to see country distribution</li>
            <li>Compare performance across localized pages</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Pro feature:</strong> Geo-targeting is available on Growth plans and above.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default GeoTargeting;
