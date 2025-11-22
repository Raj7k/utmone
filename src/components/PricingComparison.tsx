import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPETITOR_COMPARISON } from "@/lib/planConfig";

export const PricingComparison = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">
          how utm.one compares
        </CardTitle>
        <p className="text-body-text text-muted-foreground">
          see how our generous free tier and flat team pricing beat the competition
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">feature</TableHead>
                <TableHead className="text-center font-bold text-primary">utm.one</TableHead>
                <TableHead className="text-center">bitly</TableHead>
                <TableHead className="text-center">rebrandly</TableHead>
                <TableHead className="text-center">short.io</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPETITOR_COMPARISON.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell className="text-center font-semibold text-primary">
                    {row.paid.utm}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {row.paid.bitly}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {row.paid.rebrandly}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {row.paid.short}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 text-center">
          <p className="text-small-text text-muted-foreground">
            all prices shown are for paid plans. utm.one also offers a more generous free tier.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
