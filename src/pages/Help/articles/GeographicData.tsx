import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, MapPin, Flag } from "lucide-react";

const GeographicData = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link 
          to="/help/analytics" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analytics
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Geographic data</h1>
          </div>
          <p className="text-lg text-zinc-600">
            See where your clicks come from with country, region, and city-level geographic analytics.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">How location is detected</h2>
          <p className="text-zinc-600 mb-4">
            utm.one uses IP-based geolocation to determine where each click originates. This provides:
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Flag className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Country</p>
                  <p className="text-sm text-zinc-500">99.9% accuracy for country-level detection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Region/State</p>
                  <p className="text-sm text-zinc-500">~90% accuracy for region-level detection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">City</p>
                  <p className="text-sm text-zinc-500">~75% accuracy for city-level detection</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing geographic data</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Navigate to <strong>Intelligence → Overview</strong></li>
            <li>Find the <strong>Geographic Distribution</strong> card</li>
            <li>View the interactive world map</li>
            <li>Click on any country to drill down to regions/cities</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">The world map</h2>
          <p className="text-zinc-600 mb-4">
            The interactive map shows click density by region:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Darker colors indicate higher click volume</li>
            <li>Hover over any country to see exact numbers</li>
            <li>Click to zoom into regional view</li>
            <li>Use the legend to understand the color scale</li>
          </ul>

          <ProTip>
            If you're running geo-targeted campaigns, compare your expected audience location 
            with actual click locations. Big discrepancies might indicate bot traffic or 
            misaligned targeting.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Top countries table</h2>
          <p className="text-zinc-600 mb-4">
            Below the map, you'll find a sortable table showing:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Column</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">Country</td>
                  <td className="p-3 text-zinc-600">Country name with flag emoji</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Clicks</td>
                  <td className="p-3 text-zinc-600">Total clicks from that country</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">% of total</td>
                  <td className="p-3 text-zinc-600">Percentage of all clicks</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Trend</td>
                  <td className="p-3 text-zinc-600">Change vs. previous period</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Using geographic data</h2>
          <p className="text-zinc-600 mb-4">
            Actionable insights from location analytics:
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Market expansion:</strong> Identify countries with growing interest</li>
            <li><strong>Ad targeting:</strong> Focus budget on countries with highest engagement</li>
            <li><strong>Content localization:</strong> Prioritize translations for top countries</li>
            <li><strong>Event planning:</strong> Use Event Halo to measure offline event impact by city</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Geo-targeting links</h2>
          <p className="text-zinc-600 mb-4">
            Take action on your geographic insights:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <Globe className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-zinc-600 text-sm">
              With geo-targeting, you can redirect visitors to different destinations based on 
              their country. Send US visitors to your .com site and UK visitors to your .co.uk site.
            </p>
            <Link to="/help/articles/geo-targeting" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
              Set up geo-targeting →
            </Link>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Privacy & accuracy</h2>
          <p className="text-zinc-600 mb-4">
            Important notes about geographic data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Location is based on IP address, not GPS</li>
            <li>VPN users will show their VPN exit location</li>
            <li>Mobile users on cellular may show carrier location</li>
            <li>No personal data is stored—only aggregate location stats</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default GeographicData;
