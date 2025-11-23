import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, MapPin } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { shareOnLinkedIn, downloadCardAsImage } from "@/lib/utils/linkedinShare";

const data = [
  { city: "SF", value: 135 },
  { city: "NYC", value: 128 },
  { city: "Austin", value: 105 },
  { city: "Remote", value: 86 },
  { city: "London", value: 81 },
  { city: "Mexico", value: 28 },
];

export const LinkedInPostCard1 = () => {
  const handleShare = () => {
    shareOnLinkedIn("Marketing Managers earn 4.8× more in California than Mexico—despite identical responsibilities. Geographic fragmentation is accelerating. — via utm.one Salary Report 2026");
  };

  const handleDownload = () => {
    downloadCardAsImage("linkedin-card-1", "geographic-salary-spread.png");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card id="linkedin-card-1" className="bg-gradient-to-br from-blazeOrange/5 to-deepSea/5 border-2 border-blazeOrange/20 hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Visual */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-4 border border-deepSea/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-blazeOrange" />
                <p className="text-xs font-semibold text-mirage uppercase tracking-wide">
                  Geographic Salary Spread
                </p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data}>
                  <XAxis dataKey="city" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Bar dataKey="value" fill="#FF5B04" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <p className="text-xl md:text-2xl font-bold text-mirage mb-4 leading-tight">
                Marketing Managers earn 4.8× more in California than Mexico—despite identical
                responsibilities. Geographic fragmentation is accelerating.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                The same Product Marketing Manager role pays $135K in San Francisco and $28K in
                Mexico City. This isn't about cost of living—it's about where companies choose to
                hire and how they value global talent.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-blazeOrange text-blazeOrange hover:bg-blazeOrange/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share This Insight
                </Button>
                <Button 
                  onClick={handleDownload}
                  variant="ghost" 
                  size="sm" 
                  className="text-deepSea hover:text-deepSea/80"
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
