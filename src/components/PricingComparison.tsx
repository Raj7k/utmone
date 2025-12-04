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
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-heading-3">
          how utm.one compares
        </CardTitle>
        <p className="text-body-text" style={{ color: 'rgba(255,255,255,0.5)' }}>
          see how our generous free tier and flat team pricing beat the competition
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">feature</TableHead>
                <TableHead className="text-center font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>utm.one</TableHead>
                <TableHead className="text-center">bitly</TableHead>
                <TableHead className="text-center">rebrandly</TableHead>
                <TableHead className="text-center">short.io</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPETITOR_COMPARISON.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell className="text-center font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {row.paid.utm}
                  </TableCell>
                  <TableCell className="text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {row.paid.bitly}
                  </TableCell>
                  <TableCell className="text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {row.paid.rebrandly}
                  </TableCell>
                  <TableCell className="text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {row.paid.short}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 text-center">
          <p className="text-small-text" style={{ color: 'rgba(255,255,255,0.5)' }}>
            all prices shown are for paid plans. utm.one also offers a more generous free tier.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
