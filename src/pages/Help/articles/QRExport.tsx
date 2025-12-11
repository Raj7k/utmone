import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Download, FileImage, FileCode, FileText } from "lucide-react";

const QRExport = () => {
  const formats = [
    {
      icon: FileImage,
      name: "PNG",
      extension: ".png",
      bestFor: "Web, email, social media",
      sizes: "256px to 4096px",
      description: "Raster format with transparency support. Perfect for digital use."
    },
    {
      icon: FileCode,
      name: "SVG",
      extension: ".svg",
      bestFor: "Infinite scaling, web developers",
      sizes: "Vector (any size)",
      description: "Scalable vector format. Stays crisp at any size. Ideal for responsive web."
    },
    {
      icon: FileText,
      name: "PDF",
      extension: ".pdf",
      bestFor: "Print production, designers",
      sizes: "Vector-based",
      description: "Print-ready vector format. Works with any print shop or designer tool."
    }
  ];

  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "QR Codes", href: "/help/qr" }, { label: "Export Formats" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">QR Code Export Formats</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Download your QR codes in PNG (web), SVG (scalable), or PDF (print). Choose the right format for your use case and resolution requirements.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Available formats</h2>

        <div className="space-y-4 mb-8">
          {formats.map((format) => (
            <div key={format.name} className="border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-zinc-50 px-6 py-4 flex items-center gap-3 border-b border-zinc-200">
                <format.icon className="h-5 w-5 text-zinc-600" />
                <h3 className="font-semibold text-zinc-900 m-0">{format.name}</h3>
                <code className="text-xs bg-zinc-200 px-2 py-0.5 rounded ml-auto">{format.extension}</code>
              </div>
              <div className="p-6">
                <p className="text-zinc-600 mb-4">{format.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 m-0">Best for</p>
                    <p className="font-medium text-zinc-900 m-0">{format.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 m-0">Sizes</p>
                    <p className="font-medium text-zinc-900 m-0">{format.sizes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">PNG resolution options</h2>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Resolution</th>
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Use Case</th>
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">File Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-zinc-200">256 × 256px</td>
                <td className="p-3 border border-zinc-200">Email signatures, small web</td>
                <td className="p-3 border border-zinc-200">~5KB</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200">512 × 512px</td>
                <td className="p-3 border border-zinc-200">Web, presentations</td>
                <td className="p-3 border border-zinc-200">~15KB</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200">1024 × 1024px</td>
                <td className="p-3 border border-zinc-200">High-res web, small print</td>
                <td className="p-3 border border-zinc-200">~40KB</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200">2048 × 2048px</td>
                <td className="p-3 border border-zinc-200">Large format print</td>
                <td className="p-3 border border-zinc-200">~100KB</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200">4096 × 4096px</td>
                <td className="p-3 border border-zinc-200">Billboard, signage</td>
                <td className="p-3 border border-zinc-200">~300KB</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Exporting a QR code</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Open any link and click the <strong>QR Code</strong> tab</li>
          <li>Customize colors and add logo if desired</li>
          <li>Click <strong>Download</strong></li>
          <li>Select format (PNG, SVG, or PDF)</li>
          <li>For PNG, choose resolution</li>
          <li>Click <strong>Download</strong> to save</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "Print specifications", href: "/help/articles/qr-print-specs" },
          { title: "Bulk QR generation", href: "/help/articles/bulk-qr" },
          { title: "QR customization", href: "/help/articles/qr-customization" },
        ]}
      />
    </HelpLayout>
  );
};

export default QRExport;
