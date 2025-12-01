import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttributionData {
  source: string;
  medium: string;
  campaign: string;
  total_conversions: number;
  credit: number;
  total_revenue: number;
}

interface AttributionTableProps {
  data: AttributionData[];
  isLoading: boolean;
}

export const AttributionTable = ({ data, isLoading }: AttributionTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">attribution results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">loading attribution data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">attribution results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">no attribution data available for this period</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">attribution results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>source</TableHead>
              <TableHead>medium</TableHead>
              <TableHead>campaign</TableHead>
              <TableHead className="text-right">conversions</TableHead>
              <TableHead className="text-right">attribution credit</TableHead>
              <TableHead className="text-right">revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.source || "Direct"}</TableCell>
                <TableCell>{row.medium || "—"}</TableCell>
                <TableCell>{row.campaign || "—"}</TableCell>
                <TableCell className="text-right">{row.total_conversions}</TableCell>
                <TableCell className="text-right">{row.credit.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  ${row.total_revenue?.toFixed(2) || "0.00"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
