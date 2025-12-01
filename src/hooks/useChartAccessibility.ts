import { useMemo } from "react";

interface AccessibilityTableData {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}

/**
 * Hook to transform chart data into screen reader accessible table format
 */
export const useChartAccessibility = (
  data: any[] | undefined,
  caption: string,
  xKey: string,
  yKeys: string[]
): AccessibilityTableData | undefined => {
  return useMemo(() => {
    if (!data || data.length === 0) return undefined;

    // Extract headers: X-axis label + Y-axis labels
    const headers = [xKey, ...yKeys];

    // Transform data points into table rows
    const rows = data.map(point => {
      const row: (string | number)[] = [point[xKey]];
      yKeys.forEach(key => {
        row.push(point[key] ?? 0);
      });
      return row;
    });

    return {
      caption,
      headers,
      rows
    };
  }, [data, caption, xKey, yKeys]);
};

/**
 * Hook for pie/donut chart accessibility
 */
export const usePieChartAccessibility = (
  data: any[] | undefined,
  caption: string,
  nameKey: string,
  valueKey: string
): AccessibilityTableData | undefined => {
  return useMemo(() => {
    if (!data || data.length === 0) return undefined;

    const total = data.reduce((sum, item) => sum + (Number(item[valueKey]) || 0), 0);

    const headers = [nameKey, valueKey, "Percentage"];
    const rows = data.map(point => {
      const value = Number(point[valueKey]) || 0;
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
      return [
        String(point[nameKey]),
        value,
        `${percentage}%`
      ];
    });

    return {
      caption,
      headers,
      rows
    };
  }, [data, caption, nameKey, valueKey]);
};