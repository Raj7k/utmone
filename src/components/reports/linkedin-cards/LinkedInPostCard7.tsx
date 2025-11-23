import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, DollarSign } from "lucide-react";
import { shareOnLinkedIn, downloadCardAsImage } from "@/lib/utils/linkedinShare";

export const LinkedInPostCard7 = () => {
  const handleShare = () => {
    shareOnLinkedIn("The average negotiation adds $8K-$15K to offers. But 63% of people don't negotiate. Don't leave money on the table. — via utm.one Salary Report 2026");
  };

  const handleDownload = () => {
    downloadCardAsImage("linkedin-card-7", "negotiation-roi.png");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card id="linkedin-card-7" className="bg-gradient-to-br from-blazeOrange/5 to-deepSea/5 border-2 border-blazeOrange/20 hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Visual - Stats Box */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-6 border border-deepSea/10">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-blazeOrange" />
                <p className="text-xs font-semibold text-mirage uppercase tracking-wide">
                  Negotiation ROI
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-blazeOrange">$8-15K</p>
                  <p className="text-sm text-muted-foreground mt-1">Average Increase From Negotiating</p>
                </div>
                <div className="pt-4 border-t border-deepSea/10">
                  <p className="text-4xl font-bold text-mirage">63%</p>
                  <p className="text-sm text-muted-foreground mt-1">Don't Negotiate At All</p>
                </div>
                <div className="pt-4 border-t border-deepSea/10">
                  <p className="text-lg font-bold text-deepSea">Don't Leave Money on the Table</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <p className="text-xl md:text-2xl font-bold text-mirage mb-4 leading-tight">
                The average negotiation adds $8K-$15K to offers. But 63% of people don't negotiate.
                Don't leave money on the table.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Most companies expect you to negotiate—the first offer is rarely the best offer.
                Even a 5-minute counter-offer email can add $8-15K in base salary, which compounds
                over your career. Over 10 years, that's $80-150K+ you're giving up by not asking.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-blazeOrange text-blazeOrange hover:bg-blazeOrange/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Negotiation Tips
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
