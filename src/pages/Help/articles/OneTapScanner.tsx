import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Scan, Zap, ThermometerSun, Mic } from "lucide-react";

const OneTapScanner = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/events" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Scan className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">One-Tap Scanner</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Scan event badges in under 5 seconds with AI-powered OCR and instant lead capture.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">The scanning experience</h2>
          <p className="text-zinc-600 mb-4">
            One-Tap Scanner is designed for speed. The flow is simple:
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Scan className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium">Scan</p>
              </div>
              <span className="text-zinc-300">→</span>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ThermometerSun className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium">Tag</p>
              </div>
              <span className="text-zinc-300">→</span>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Done</p>
              </div>
            </div>
            <p className="text-center text-sm text-zinc-500 mt-4">Average time per lead: &lt;5 seconds</p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Using the scanner</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Open your event in utm.one</li>
            <li>Tap the <strong>Scanner</strong> button</li>
            <li>Point your camera at the badge</li>
            <li>AI extracts name, company, and email automatically</li>
            <li>Tag the lead temperature (Hot/Warm/Cold)</li>
            <li>Optionally add a voice note</li>
            <li>Done! Scan the next badge</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Lead temperature</h2>
          <p className="text-zinc-600 mb-4">
            Quickly qualify leads on the spot:
          </p>
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <span className="text-2xl">🔥</span>
              <h4 className="font-medium text-zinc-900 mt-2">Hot</h4>
              <p className="text-sm text-zinc-500">Ready to buy, schedule call today</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <span className="text-2xl">☀️</span>
              <h4 className="font-medium text-zinc-900 mt-2">Warm</h4>
              <p className="text-sm text-zinc-500">Interested, needs nurturing</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-center">
              <span className="text-2xl">❄️</span>
              <h4 className="font-medium text-zinc-900 mt-2">Cold</h4>
              <p className="text-sm text-zinc-500">Just collecting info</p>
            </div>
          </div>

          <ProTip>
            Tag leads immediately after the conversation while context is fresh. Your future 
            self will thank you when following up after the event.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Voice notes</h2>
          <div className="flex items-start gap-3 mb-4">
            <Mic className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Tap the microphone icon to record a quick voice note about the conversation. 
                Notes are automatically transcribed and attached to the lead.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">AI OCR capabilities</h2>
          <p className="text-zinc-600 mb-4">
            The scanner uses AI to extract information from various badge formats:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Standard conference badges</li>
            <li>Business cards</li>
            <li>Name tags with QR codes</li>
            <li>Handwritten name badges</li>
            <li>Multi-language text</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Offline mode</h2>
          <p className="text-zinc-600 mb-4">
            No WiFi at the venue? No problem:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Scans are saved locally on your device</li>
            <li>Data syncs automatically when connection returns</li>
            <li>Never lose a lead due to poor connectivity</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Enrichment</h2>
          <p className="text-zinc-600 mb-4">
            After scanning, enrich leads with additional data:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <p className="text-sm text-zinc-600">
              Connect Apollo.io, Clay, or ZoomInfo to automatically find email addresses, 
              phone numbers, and LinkedIn profiles from just name + company.
            </p>
            <Link to="/help/articles/lead-enrichment" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
              Set up enrichment →
            </Link>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default OneTapScanner;
