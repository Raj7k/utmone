import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface LinkExportData {
  title: string;
  short_url: string;
  destination_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  total_clicks: number;
  unique_clicks: number;
  status: string;
  created_at: string;
}

interface ClickExportData {
  clicked_at: string;
  link_title: string;
  short_url: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  referrer?: string;
}

interface CampaignExportData {
  utm_campaign: string;
  utm_source?: string;
  utm_medium?: string;
  total_links: number;
  total_clicks: number;
  unique_clicks: number;
}

export const exportLinksToXLSX = (links: LinkExportData[], filename?: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    links.map(link => ({
      'Link Title': link.title,
      'Short URL': link.short_url,
      'Destination URL': link.destination_url,
      'UTM Source': link.utm_source || '',
      'UTM Medium': link.utm_medium || '',
      'UTM Campaign': link.utm_campaign || '',
      'UTM Term': link.utm_term || '',
      'UTM Content': link.utm_content || '',
      'Total Clicks': link.total_clicks,
      'Unique Clicks': link.unique_clicks,
      'Status': link.status,
      'Created At': format(new Date(link.created_at), 'yyyy-MM-dd HH:mm:ss'),
    }))
  );

  // Auto-size columns
  const maxWidth = 50;
  const columnWidths = [
    { wch: 30 }, // Link Title
    { wch: 40 }, // Short URL
    { wch: maxWidth }, // Destination URL
    { wch: 20 }, // UTM Source
    { wch: 20 }, // UTM Medium
    { wch: 25 }, // UTM Campaign
    { wch: 20 }, // UTM Term
    { wch: 20 }, // UTM Content
    { wch: 12 }, // Total Clicks
    { wch: 12 }, // Unique Clicks
    { wch: 10 }, // Status
    { wch: 20 }, // Created At
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Links');

  const fileName = filename || `links_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportClicksToXLSX = (clicks: ClickExportData[], filename?: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    clicks.map(click => ({
      'Clicked At': format(new Date(click.clicked_at), 'yyyy-MM-dd HH:mm:ss'),
      'Link Title': click.link_title,
      'Short URL': click.short_url,
      'Country': click.country || 'Unknown',
      'City': click.city || 'Unknown',
      'Device': click.device_type || 'Unknown',
      'Browser': click.browser || 'Unknown',
      'OS': click.os || 'Unknown',
      'Referrer': click.referrer || 'Direct',
    }))
  );

  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 40 },
    { wch: 15 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 40 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clicks');

  const fileName = filename || `clicks_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportCampaignsToXLSX = (campaigns: CampaignExportData[], filename?: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    campaigns.map(campaign => ({
      'Campaign': campaign.utm_campaign,
      'Source': campaign.utm_source || '',
      'Medium': campaign.utm_medium || '',
      'Total Links': campaign.total_links,
      'Total Clicks': campaign.total_clicks,
      'Unique Clicks': campaign.unique_clicks,
      'Avg Clicks per Link': (campaign.total_clicks / campaign.total_links).toFixed(2),
    }))
  );

  worksheet['!cols'] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaigns');

  const fileName = filename || `campaigns_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Generate XLSX buffer for email attachments (server-side)
export const generateLinksXLSXBuffer = (links: LinkExportData[]): Uint8Array => {
  const worksheet = XLSX.utils.json_to_sheet(
    links.map(link => ({
      'Link Title': link.title,
      'Short URL': link.short_url,
      'Destination URL': link.destination_url,
      'UTM Source': link.utm_source || '',
      'UTM Medium': link.utm_medium || '',
      'UTM Campaign': link.utm_campaign || '',
      'UTM Term': link.utm_term || '',
      'UTM Content': link.utm_content || '',
      'Total Clicks': link.total_clicks,
      'Unique Clicks': link.unique_clicks,
      'Status': link.status,
      'Created At': link.created_at,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Links');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Uint8Array;
};
