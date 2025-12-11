import { Download, FileText, Image, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { architects, categories } from '@/data/b2bArchitects';

export function DownloadCenter() {
  const handleDownloadPDF = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>25 B2B Marketing Architects - utm.one</title>
          <style>
            body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { font-size: 28px; margin-bottom: 10px; }
            h2 { font-size: 20px; margin-top: 30px; border-bottom: 2px solid #000; padding-bottom: 5px; }
            .architect { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
            .architect h3 { margin: 0 0 5px 0; }
            .architect p { margin: 5px 0; color: #666; }
            .quote { font-style: italic; margin-top: 10px; padding-left: 15px; border-left: 3px solid #ccc; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>25 B2B Marketing Architects Defining 2026</h1>
          <p>From utm.one — Your curriculum for the next era of B2B marketing.</p>
          
          ${Object.entries(categories).map(([key, cat]) => `
            <h2>${cat.icon} ${cat.label}</h2>
            ${architects.filter(a => a.category === key).map(a => `
              <div class="architect">
                <h3>${a.name}</h3>
                <p>${a.role} @ ${a.company}</p>
                <p><strong>Superpower:</strong> ${a.superpower}</p>
                <p class="quote">"${a.nugget}"</p>
                <p><a href="${a.linkedIn}">LinkedIn Profile</a></p>
              </div>
            `).join('')}
          `).join('')}
          
          <p style="margin-top: 40px; text-align: center; color: #888;">
            Generated from utm.one/resources/playbooks/b2b-architects-2026
          </p>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
    toast.success('PDF ready! Use your browser\'s print dialog to save.');
  };

  const handleDownloadCSV = () => {
    const headers = ['Name', 'Role', 'Company', 'Category', 'Superpower', 'LinkedIn', 'Nugget'];
    const rows = architects.map(a => [
      a.name,
      a.role,
      a.company,
      categories[a.category].label,
      a.superpower,
      a.linkedIn,
      `"${a.nugget.replace(/"/g, '""')}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'b2b-architects-2026.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  const handleDownloadJSON = () => {
    const data = {
      title: '25 B2B Marketing Architects Defining 2026',
      source: 'utm.one',
      architects: architects.map(a => ({
        ...a,
        categoryLabel: categories[a.category].label
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'b2b-architects-2026.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('JSON downloaded!');
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-xl mb-6">
          <Download className="w-7 h-7" />
        </div>
        
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
          Download Center
        </h2>
        <p className="font-sans text-gray-400 max-w-xl mx-auto mb-10">
          Take the playbook with you. Export the full list in your preferred format 
          for offline reference or team sharing.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="h-auto py-4 flex-col gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <FileText className="w-6 h-6" />
            <span className="font-sans font-medium">PDF / Print</span>
            <span className="text-xs text-gray-400">Full formatted list</span>
          </Button>

          <Button
            onClick={handleDownloadCSV}
            variant="outline"
            className="h-auto py-4 flex-col gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Archive className="w-6 h-6" />
            <span className="font-sans font-medium">CSV Export</span>
            <span className="text-xs text-gray-400">For spreadsheets</span>
          </Button>

          <Button
            onClick={handleDownloadJSON}
            variant="outline"
            className="h-auto py-4 flex-col gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Image className="w-6 h-6" />
            <span className="font-sans font-medium">JSON Data</span>
            <span className="text-xs text-gray-400">For developers</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
