import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, AlertCircle } from "lucide-react";

export const LinkedInPostCard3 = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <Card className="bg-gradient-to-br from-mirage/5 to-blazeOrange/5 border-2 border-mirage/20 hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Visual - Stats Card */}
            <div className="w-full md:w-1/3 bg-white rounded-xl p-6 border border-deepSea/10">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-blazeOrange" />
                <p className="text-xs font-semibold text-mirage uppercase tracking-wide">
                  Sales Reality Check
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-blazeOrange">$240-400K</p>
                  <p className="text-xs text-muted-foreground">Enterprise AE OTE Range</p>
                </div>
                <div className="pt-4 border-t border-deepSea/10">
                  <p className="text-3xl font-bold text-mirage">71%</p>
                  <p className="text-xs text-muted-foreground">Miss Their Quota</p>
                </div>
                <div className="pt-4 border-t border-deepSea/10">
                  <p className="text-xl font-bold text-deepSea">High Risk, High Reward</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3">
              <p className="text-xl md:text-2xl font-bold text-mirage mb-4 leading-tight">
                Enterprise AEs can earn $240-400K OTE. But 71% miss quota. The comp ceiling is
                high, but so is the risk.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Sales roles promise life-changing money, but the volatility is extreme. Only 29%
                of Enterprise AEs hit 100%+ quota. The median base is $120-180K—but most earn
                below OTE. Know what you're signing up for.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="border-mirage text-mirage hover:bg-mirage/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share This Reality Check
                </Button>
                <Button variant="ghost" size="sm" className="text-deepSea hover:text-deepSea/80">
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
