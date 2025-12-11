import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Smartphone, Monitor, Tablet, Globe } from "lucide-react";

const DeviceAnalytics = () => {
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
              <Smartphone className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Device analytics</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Understand what devices your audience uses to optimize their experience.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Device categories</h2>
          <p className="text-zinc-600 mb-4">
            utm.one automatically categorizes every click into one of three device types:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <Smartphone className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-medium text-zinc-900">Mobile</h4>
              <p className="text-sm text-zinc-500 mt-1">Smartphones and small screens</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <Monitor className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-medium text-zinc-900">Desktop</h4>
              <p className="text-sm text-zinc-500 mt-1">Laptops and desktop computers</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <Tablet className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-medium text-zinc-900">Tablet</h4>
              <p className="text-sm text-zinc-500 mt-1">iPads and Android tablets</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Browser breakdown</h2>
          <p className="text-zinc-600 mb-4">
            See which browsers your audience prefers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Chrome (including mobile Chrome)</li>
            <li>Safari (including iOS Safari)</li>
            <li>Firefox</li>
            <li>Edge</li>
            <li>Samsung Internet</li>
            <li>Opera</li>
            <li>Other/Unknown</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Operating system data</h2>
          <p className="text-zinc-600 mb-4">
            Track which operating systems your visitors use:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">Mobile OS</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• iOS (iPhone, iPad)</li>
                  <li>• Android</li>
                  <li>• Other mobile</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">Desktop OS</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Windows</li>
                  <li>• macOS</li>
                  <li>• Linux</li>
                  <li>• Chrome OS</li>
                </ul>
              </div>
            </div>
          </div>

          <ProTip>
            If you see high iOS traffic but low conversion, check if your landing page works well in Safari. iOS users are often more affluent but Safari has stricter privacy features.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Using device data</h2>
          <p className="text-zinc-600 mb-4">
            Actionable insights from device analytics:
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Mobile-first optimization:</strong> If 70%+ traffic is mobile, prioritize mobile experience</li>
            <li><strong>QR code placement:</strong> QR scans are almost always mobile—optimize for that</li>
            <li><strong>Email campaigns:</strong> Check if your email links work on both mobile and desktop</li>
            <li><strong>Social media:</strong> Instagram and TikTok traffic is nearly 100% mobile</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Device targeting</h2>
          <p className="text-zinc-600 mb-4">
            Use device data to power smart routing:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <Globe className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-zinc-600 text-sm">
              With utm.one's device targeting feature, you can send mobile users to your app store 
              and desktop users to your website—all from the same link.
            </p>
            <Link to="/help/articles/device-targeting" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
              Learn about device targeting →
            </Link>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Privacy considerations</h2>
          <p className="text-zinc-600 mb-4">
            Device detection is privacy-friendly:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Based on User-Agent string (standard HTTP header)</li>
            <li>No cookies or tracking required</li>
            <li>No personal data collected</li>
            <li>Aggregate statistics only</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default DeviceAnalytics;
