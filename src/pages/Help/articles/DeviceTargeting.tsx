import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Smartphone, Monitor, Tablet, ExternalLink } from "lucide-react";

const DeviceTargeting = () => {
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
              <Smartphone className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Device targeting</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Send mobile and desktop visitors to different destinations from a single link.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Use cases</h2>
          <p className="text-zinc-600 mb-4">
            Device targeting is perfect for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>App downloads:</strong> Send iOS to App Store, Android to Play Store</li>
            <li><strong>Mobile-optimized pages:</strong> Different experiences by device</li>
            <li><strong>Desktop-only features:</strong> Redirect mobile users to mobile-friendly alternative</li>
            <li><strong>Deep links:</strong> Open native apps on mobile, website on desktop</li>
          </ul>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Example: App download link</h4>
            <p className="text-sm text-zinc-600 mb-3">Single link: <code>utm.one/download</code></p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-600">iOS →</span>
                <code className="bg-white px-2 py-1 rounded text-xs">apps.apple.com/app/yourapp</code>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-600">Android →</span>
                <code className="bg-white px-2 py-1 rounded text-xs">play.google.com/store/apps/yourapp</code>
              </div>
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-zinc-500" />
                <span className="text-zinc-600">Desktop →</span>
                <code className="bg-white px-2 py-1 rounded text-xs">yoursite.com/download</code>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up device targeting</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Open any link's detail page</li>
            <li>Click the <strong>Targeting</strong> tab</li>
            <li>Enable <strong>Device targeting</strong></li>
            <li>Set URLs for each device type</li>
            <li>Save changes</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Device categories</h2>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <Smartphone className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-medium text-zinc-900">Mobile</h4>
              <p className="text-sm text-zinc-500">iOS and Android phones</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <Tablet className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-medium text-zinc-900">Tablet</h4>
              <p className="text-sm text-zinc-500">iPads and Android tablets</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <Monitor className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h4 className="font-medium text-zinc-900">Desktop</h4>
              <p className="text-sm text-zinc-500">Windows, Mac, Linux</p>
            </div>
          </div>

          <ProTip>
            You can also target by operating system (iOS vs Android) for more granular 
            control over app store redirects.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">OS-specific targeting</h2>
          <p className="text-zinc-600 mb-4">
            For app downloads, use OS-specific rules:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>iOS:</strong> App Store or TestFlight links</li>
            <li><strong>Android:</strong> Play Store or APK downloads</li>
            <li><strong>Windows:</strong> Microsoft Store or direct download</li>
            <li><strong>macOS:</strong> Mac App Store or DMG download</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Combining with geo-targeting</h2>
          <p className="text-zinc-600 mb-4">
            Device and geo-targeting can work together:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <ExternalLink className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-sm text-zinc-600">
              Example: Send US iPhone users to the US App Store, UK iPhone users to the UK 
              App Store, and Android users everywhere to the Play Store.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Testing</h2>
          <p className="text-zinc-600 mb-4">
            Test your device targeting:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Use browser developer tools to emulate devices</li>
            <li>Test on actual mobile devices</li>
            <li>Use the targeting test feature in utm.one</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Pro feature:</strong> Device targeting is available on Growth plans and above.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default DeviceTargeting;
