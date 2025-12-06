import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Rocket } from "lucide-react";
import { LazyLineChart, LazyChartContainer, Line, ResponsiveContainer, XAxis, YAxis, Legend } from "@/components/charts/LazyCharts";
import { shareOnLinkedIn, downloadCardAsImage } from "@/lib/utils/linkedinShare";

const data = [
  { year: "2020", india: 85, us: 110, europe: 95 },
  { year: "2022", india: 110, us: 125, europe: 108 },
  { year: "2024", india: 142, us: 142, europe: 118 },
  { year: "2026", india: 175, us: 158, europe: 128 },
];

export const LinkedInPostCard4 = () => {
  const handleShare = () => {
    shareOnLinkedIn("RevOps salaries grew 32% YoY in India, 22% in US, 18% in Europe. Demand > Supply = salary inflation. — via utm.one Salary Report 2026");
  };

  const handleDownload = () => {
    downloadCardAsImage("linkedin-card-4", "revops-salary-growth.png");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card id="linkedin-card-4" className="bg-gradient-to-br from-deepSea/5 to-blazeOrange/5 border-2 border-deepSea/20 hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Visual */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-4 border border-deepSea/10">
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="h-4 w-4 text-deepSea" />
                <p className="text-xs font-semibold text-mirage uppercase tracking-wide">
                  RevOps Salary Growth
                </p>
              </div>
              <LazyChartContainer height={180}>
                <ResponsiveContainer width="100%" height={180}>
                  <LazyLineChart data={data}>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Line type="monotone" dataKey="india" stroke="#FF5B04" strokeWidth={2} name="India" />
                    <Line type="monotone" dataKey="us" stroke="#075056" strokeWidth={2} name="US" />
                    <Line type="monotone" dataKey="europe" stroke="#16232A" strokeWidth={2} name="Europe" />
                  </LazyLineChart>
                </ResponsiveContainer>
              </LazyChartContainer>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <p className="text-xl md:text-2xl font-bold text-mirage mb-4 leading-tight">
                RevOps salaries grew 32% YoY in India, 22% in US, 18% in Europe. Demand &gt; Supply
                = salary inflation.
              </p>
              <p className="text-sm text-secondary-label mb-6">
                RevOps is the fastest-growing GTM role globally. India leads growth (32% YoY),
                followed by US (22%) and Europe (18%). Companies are desperate for talent that can
                unify sales, marketing, and customer success operations.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-deepSea text-deepSea hover:bg-deepSea/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share With Your RevOps Network
                </Button>
                <Button 
                  onClick={handleDownload}
                  variant="ghost" 
                  size="sm" 
                  className="text-blazeOrange hover:text-blazeOrange/80"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download as Image
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
