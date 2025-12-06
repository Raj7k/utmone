import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, Globe } from "lucide-react";
import { shareOnLinkedIn, downloadCardAsImage } from "@/lib/utils/linkedinShare";

const cities = [
  { city: "San Francisco", salary: "$135K", multiplier: "1.40×" },
  { city: "New York", salary: "$128K", multiplier: "1.35×" },
  { city: "Austin", salary: "$105K", multiplier: "1.10×" },
  { city: "London", salary: "$81K", multiplier: "0.85×" },
  { city: "Bangalore", salary: "$32K", multiplier: "0.32×" },
];

export const LinkedInPostCard5 = () => {
  const handleShare = () => {
    shareOnLinkedIn("San Francisco PMM: $135K. Bangalore PMM: $32K. Same company, same role, 4.2× difference. — via utm.one Salary Report 2026");
  };

  const handleDownload = () => {
    downloadCardAsImage("linkedin-card-5", "city-salary-comparison.png");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card id="linkedin-card-5" className="bg-gradient-to-br from-blazeOrange/5 to-foreground/5 border-2 border-blazeOrange/20 hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Visual - City Rankings */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-4 border border-deepSea/10">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-blazeOrange" />
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Top 5 PMM Cities
                </p>
              </div>
              <div className="space-y-3">
                {cities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{city.city}</p>
                      <p className="text-xs text-secondary-label">{city.multiplier} baseline</p>
                    </div>
                    <p className="text-base font-bold text-deepSea">{city.salary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <p className="text-xl md:text-2xl font-bold text-foreground mb-4 leading-tight">
                San Francisco PMM: $135K. Bangalore PMM: $32K. Same company, same role, 4.2×
                difference.
              </p>
              <p className="text-sm text-secondary-label mb-6">
                Location is the single biggest factor in compensation. A Product Marketing Manager
                role varies by 420% depending on geography—even within the same company. Remote
                work hasn't eliminated this gap; it's just shifted negotiations.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-blazeOrange text-blazeOrange hover:bg-blazeOrange/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share This Data
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
