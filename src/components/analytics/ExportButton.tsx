import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportLinksToXLSX } from "@/lib/excelExport";

interface ExportButtonProps {
  workspaceId: string;
}

export const ExportButton = ({ workspaceId }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const fetchLinksData = async () => {
    const { data: links } = await supabase
      .from("links")
      .select("*")
      .eq("workspace_id", workspaceId);

    if (!links || links.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no links to export.",
        variant: "destructive",
      });
      return null;
    }

    return links.map(link => ({
      title: link.title,
      short_url: link.short_url || "",
      destination_url: link.destination_url,
      utm_source: link.utm_source,
      utm_medium: link.utm_medium,
      utm_campaign: link.utm_campaign,
      utm_term: link.utm_term,
      utm_content: link.utm_content,
      total_clicks: link.total_clicks || 0,
      unique_clicks: link.unique_clicks || 0,
      status: link.status || "active",
      created_at: link.created_at || "",
    }));
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const linksData = await fetchLinksData();
      if (!linksData) return;

      const headers = [
        "Link Title",
        "Short URL",
        "Destination URL",
        "UTM Source",
        "UTM Medium",
        "UTM Campaign",
        "UTM Term",
        "UTM Content",
        "Total Clicks",
        "Unique Clicks",
        "Status",
        "Created At",
      ];

      const rows = linksData.map(link => [
        link.title,
        link.short_url,
        link.destination_url,
        link.utm_source || "",
        link.utm_medium || "",
        link.utm_campaign || "",
        link.utm_term || "",
        link.utm_content || "",
        link.total_clicks,
        link.unique_clicks,
        link.status,
        new Date(link.created_at).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics_export_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Your analytics data has been exported to CSV.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToXLSX = async () => {
    setIsExporting(true);
    try {
      const linksData = await fetchLinksData();
      if (!linksData) return;

      exportLinksToXLSX(linksData);

      toast({
        title: "Export Successful",
        description: "Your analytics data has been exported to Excel.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export Data"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToXLSX}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
