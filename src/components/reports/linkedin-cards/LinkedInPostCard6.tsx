import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Zap } from "lucide-react";
import { LazyBarChart, LazyChartContainer, Bar, ResponsiveContainer, XAxis, YAxis, Cell } from "@/components/charts/LazyCharts";
import { shareOnLinkedIn, downloadCardAsImage } from "@/lib/utils/linkedinShare";

const data = [
  { skill: "AI/ML", premium: 58, color: "#FF5B04" },
  { skill: "GTM Strategy", premium: 45, color: "#FF5B04" },
  { skill: "Attribution", premium: 42, color: "#FF5B04" },
  { skill: "SQL/Data", premium: 28, color: "#075056" },
  { skill: "Salesforce", premium: 22, color: "#075056" },
  { skill: "Content", premium: -5, color: "#16232A" },
];

export const LinkedInPostCard6 = () => {
  const handleShare = () => {
    shareOnLinkedIn("AI/ML expertise = +58% salary premium. SQL/Data = +28%. Basic content writing = -5%. Skills determine pay more than titles. — via utm.one Salary Report 2026");
  };

  const handleDownload = () => {
    downloadCardAsImage("linkedin-card-6", "skill-salary-premium.png");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card id="linkedin-card-6" className="bg-gradient-to-br from-deepSea/5 to-blazeOrange/5 border-2 border-deepSea/20 hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Visual */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-4 border border-deepSea/10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-blazeOrange" />
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Skill Salary Premium (%)
                </p>
              </div>
              <LazyChartContainer height={180}>
                <ResponsiveContainer width="100%" height={180}>
                  <LazyBarChart data={data} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="skill" type="category" tick={{ fontSize: 10 }} width={70} />
                    <Bar dataKey="premium" radius={4}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </LazyBarChart>
                </ResponsiveContainer>
              </LazyChartContainer>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <p className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                AI/ML expertise = +58% salary premium. SQL/Data = +28%. Basic content writing =
                -5%. Skills determine pay more than titles.
              </p>
              <p className="text-sm text-secondary-label mb-6">
                Category A skills (AI/ML, GTM Strategy, Attribution Modeling) command 40-58%
                premiums. Category B skills (SQL, Salesforce) add 20-30%. Category C skills (basic
                content, social media) actually reduce pay. Learn strategically.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-deepSea text-deepSea hover:bg-deepSea/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Your Skill Stack
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
