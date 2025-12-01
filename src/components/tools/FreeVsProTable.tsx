import { CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Feature {
  name: string;
  free: boolean;
  pro: boolean | string; // true/false or descriptive text
}

interface FreeVsProTableProps {
  features: Feature[];
}

export const FreeVsProTable = ({ features }: FreeVsProTableProps) => {
  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            free vs pro comparison
          </h2>
          <p className="text-body text-secondary-label max-w-[640px] mx-auto">
            see what you unlock when you upgrade to pro.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-6 font-display font-semibold text-foreground">
                    feature
                  </th>
                  <th className="text-center p-6 font-display font-semibold text-foreground w-1/4">
                    free
                  </th>
                  <th className="text-center p-6 font-display font-semibold text-primary w-1/4">
                    pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr 
                    key={index}
                    className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-6 text-sm text-foreground">
                      {feature.name}
                    </td>
                    <td className="p-6 text-center">
                      {feature.free ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {typeof feature.pro === 'string' ? (
                        <span className="text-sm font-medium text-primary">
                          {feature.pro}
                        </span>
                      ) : feature.pro ? (
                        <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-muted/20 border-t border-border text-center">
            <Link to="/pricing">
              <Button size="lg" variant="marketing">
                upgrade to pro →
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};
