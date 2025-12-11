import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ProTip } from "@/components/help/ProTip";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const QRReliability = () => {
  const tests = [
    { name: "Blur resistance", description: "Can the code be scanned when slightly out of focus?" },
    { name: "Angle tolerance", description: "Does it scan when viewed at 45° angles?" },
    { name: "Lighting conditions", description: "Works in low light and bright sunlight?" },
    { name: "Distance scaling", description: "Scannable from expected viewing distances?" },
    { name: "Damage tolerance", description: "Still works with minor scratches or wear?" },
    { name: "Color contrast", description: "Sufficient contrast between foreground and background?" }
  ];

  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes", href: "/help/qr" }, { label: "Reliability Scoring" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">QR Reliability Scoring</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Before you print, our scanner tests your QR code against real-world conditions—blur, lighting, angles, and wear. Get a reliability score and fix issues before production.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Reliability score</h2>

        <div className="bg-zinc-900 text-white rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-300">QR Reliability Score</span>
            <span className="text-3xl font-bold text-emerald-400">94/100</span>
          </div>
          <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }}></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>5 tests passed</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>1 warning</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <XCircle className="h-4 w-4 text-zinc-500" />
              <span>0 failures</span>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">What we test</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {tests.map((test) => (
            <div key={test.name} className="border border-zinc-200 rounded-lg p-4">
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">{test.name}</h3>
              <p className="text-sm text-zinc-600 m-0">{test.description}</p>
            </div>
          ))}
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Score ranges</h2>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="font-bold text-emerald-700 w-20">90-100</span>
            <span className="text-emerald-800">Excellent. Safe for all printing conditions.</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="font-bold text-emerald-700 w-20">70-89</span>
            <span className="text-emerald-800">Good. Works well in most conditions.</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="font-bold text-amber-700 w-20">50-69</span>
            <span className="text-amber-800">Fair. May have issues in poor conditions.</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <span className="font-bold text-rose-700 w-20">0-49</span>
            <span className="text-rose-800">Poor. Likely to fail. Adjust design before printing.</span>
          </div>
        </div>

        <ProTip>
          Always test your QR code at the actual print size. A code that scores 95 at 2 inches may fail at 0.5 inches due to module density.
        </ProTip>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Running a reliability test</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Open your QR code in the editor</li>
          <li>Click <strong>Test Reliability</strong></li>
          <li>Wait for all 6 tests to complete (~5 seconds)</li>
          <li>Review your score and any warnings</li>
          <li>Adjust colors or error correction if needed</li>
          <li>Re-test until score is 70+</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "Print specifications", href: "/help/articles/qr-print-specs" },
          { title: "QR customization", href: "/help/articles/qr-customization" },
          { title: "Adding logos", href: "/help/articles/qr-logos" },
        ]}
      />
    </HelpLayout>
  );
};

export default QRReliability;
