import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ValidationBadge } from "./ValidationBadge";
import type { URLValidation } from "@/hooks/useBulkValidation";

interface URLPreviewTableProps {
  validations: URLValidation[];
  onRemove: (index: number) => void;
}

export const URLPreviewTable = ({ validations, onRemove }: URLPreviewTableProps) => {
  if (validations.length === 0) return null;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="font-display font-semibold">original URL</TableHead>
              <TableHead className="font-display font-semibold">domain</TableHead>
              <TableHead className="font-display font-semibold">validation</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validations.map((validation, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs max-w-md truncate">
                  {validation.url}
                </TableCell>
                <TableCell className="text-sm text-secondary-label">
                  {validation.domain || "—"}
                </TableCell>
                <TableCell>
                  <ValidationBadge
                    status={
                      !validation.isValid
                        ? "invalid"
                        : validation.isDuplicate
                        ? "duplicate"
                        : "valid"
                    }
                    message={validation.error || undefined}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
