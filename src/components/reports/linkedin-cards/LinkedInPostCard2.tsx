import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts";
import { shareOnLinkedIn, downloadCardAsImage } from "@/lib/utils/linkedinShare";

const data = [
  { role: "PMM", b2b: 125, b2c: 95 },
  { role: "Demand Gen", b2b: 110, b2c: 88 },
  { role: "Content", b2b: 95, b2c: 105 },
  { role: "Growth", b2b: 120, b2c: 102 },
];

export const LinkedInPostCard2 = () => {
  const handleShare = () => {
    shareOnLinkedIn("B2B marketers earn 20-35% more than B2C counterparts at every level. The gap starts at entry level and compounds with experience. — via utm.one Salary Report 2026");
  };

  const handleDownload = () => {
    downloadCardAsImage("linkedin-card-2", "b2b-vs-b2c-pay-gap.png");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card id="linkedin-card-2" className="bg-gradient-to-br from-deepSea/5 to-blazeOrange/5 border-2 border-deepSea/20 hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Visual */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-4 border border-deepSea/10">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-deepSea" />
                <p className="text-xs font-semibold text-mirage uppercase tracking-wide">
                  B2B vs B2C Pay Gap
                </p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data}>
                  <XAxis dataKey="role" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="b2b" fill="#FF5B04" radius={4} name="B2B" />
                  <Bar dataKey="b2c" fill="#075056" radius={4} name="B2C" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <p className="text-xl md:text-2xl font-bold text-mirage mb-4 leading-tight">
                B2B Product Marketers earn $125K median. B2C? $95K. Same title, 24% pay gap. The
                industry you choose matters more than your skills.
              </p>
              <p className="text-sm text-secondary-label mb-6">
                B2B SaaS companies pay premium salaries for roles like Product Marketing, Demand
                Generation, and Marketing Ops. B2C excels in Content and Brand. Choose your
                specialization wisely.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-deepSea text-deepSea hover:bg-deepSea/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share on LinkedIn
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
