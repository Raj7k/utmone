import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  workspaceId: string;
}

export const ExportButton = ({ workspaceId }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch all links with their clicks
      const { data: links } = await supabase
        .from("links")
        .select(`
          *,
          link_clicks (*)
        `)
        .eq("workspace_id", workspaceId);

      if (!links || links.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no links or clicks to export.",
          variant: "destructive",
        });
        return;
      }

      // Create CSV header
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

      // Create CSV rows
      const rows = links.map(link => [
        link.title,
        link.short_url,
        link.destination_url,
        link.utm_source || "",
        link.utm_medium || "",
        link.utm_campaign || "",
        link.utm_term || "",
        link.utm_content || "",
        link.total_clicks || 0,
        link.unique_clicks || 0,
        link.status,
        new Date(link.created_at || "").toLocaleDateString(),
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
      ].join("\n");

      // Create blob and download
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
        title: "Export successful",
        description: "Your analytics data has been exported to CSV.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={exportToCSV} disabled={isExporting} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "Export to CSV"}
    </Button>
  );
};
