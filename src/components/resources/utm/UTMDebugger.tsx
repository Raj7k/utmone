import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export const UTMDebugger = () => {
  const [url, setUrl] = useState("");
  const [debugResults, setDebugResults] = useState<any>(null);

  const debugUTM = () => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const utmParams: any = {};
      params.forEach((value, key) => {
        if (key.startsWith("utm_")) {
          utmParams[key] = value;
        }
      });

      const issues: any[] = [];
      const fixes: any = {};

      // Detect issues and generate fixes
      Object.entries(utmParams).forEach(([key, value]: [string, any]) => {
        // Capitalization
        if (value !== value.toLowerCase()) {
          issues.push({
            type: "capitalization",
            param: key,
            current: value,
            fix: value.toLowerCase()
          });
          fixes[key] = value.toLowerCase();
        }

        // Spaces
        if (value.includes(" ")) {
          issues.push({
            type: "spaces",
            param: key,
            current: value,
            fix: value.replace(/\s+/g, "-")
          });
          fixes[key] = value.replace(/\s+/g, "-");
        }

        // Special characters
        if (/[^a-z0-9-_]/.test(value.toLowerCase())) {
          const cleaned = value.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
          issues.push({
            type: "special-chars",
            param: key,
            current: value,
            fix: cleaned
          });
          fixes[key] = cleaned;
        }

        // Length
        if (value.length > 50) {
          issues.push({
            type: "too-long",
            param: key,
            current: value,
            fix: `${value.substring(0, 47)}...`
          });
        }

        // URL encoding
        if (value.includes("%20") || value.includes("+")) {
          issues.push({
            type: "encoding",
            param: key,
            current: value,
            fix: decodeURIComponent(value).replace(/\s+/g, "-").toLowerCase()
          });
        }
      });

      // Generate corrected URL
      const correctedParams = new URLSearchParams();
      Object.entries({ ...utmParams, ...fixes }).forEach(([key, value]: [string, any]) => {
        correctedParams.append(key, value);
      });
      
      const correctedUrl = `${urlObj.origin}${urlObj.pathname}?${correctedParams.toString()}`;

      setDebugResults({
        originalParams: utmParams,
        issues,
        correctedUrl,
        hasIssues: issues.length > 0
      });
    } catch (error) {
      toast.error("Invalid URL format");
    }
  };

  const copyFixed = () => {
    if (debugResults?.correctedUrl) {
      navigator.clipboard.writeText(debugResults.correctedUrl);
      toast.success("Corrected URL copied");
    }
  };

  const issueDescriptions: Record<string, string> = {
    capitalization: "Mixed case creates data fragmentation in GA4",
    spaces: "Spaces should be replaced with hyphens",
    "special-chars": "Special characters can break tracking",
    "too-long": "Parameter values should be under 50 characters",
    encoding: "URL encoding should be normalized"
  };

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div>
        <h4 className="font-semibold text-foreground mb-2">UTM Debugger</h4>
        <p className="text-sm text-muted-foreground">
          Paste a problematic UTM URL to identify and fix issues automatically
        </p>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="https://example.com?utm_source=LinkedIn&utm_medium=paid_social"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={debugUTM} disabled={!url} className="w-full">
          Debug UTM
        </Button>
      </div>

      {debugResults && (
        <div className="space-y-4">
          {/* Issues Found */}
          {debugResults.hasIssues ? (
            <>
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Issues Found ({debugResults.issues.length})
                </h5>
                {debugResults.issues.map((issue: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-50/50 border border-yellow-200/50 dark:bg-yellow-950/20 dark:border-yellow-800/50 rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {issue.param}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {issueDescriptions[issue.type]}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground shrink-0">Current:</span>
                        <code className="text-xs text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 px-2 py-1 rounded">
                          {issue.current}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground shrink-0">Fixed:</span>
                        <code className="text-xs text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/20 px-2 py-1 rounded">
                          {issue.fix}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Corrected URL */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-foreground">Corrected URL:</h5>
                <div className="flex items-start gap-2 p-3 bg-green-50/50 border border-green-200/50 dark:bg-green-950/20 dark:border-green-800/50 rounded-lg">
                  <code className="text-sm text-foreground flex-1 break-all">
                    {debugResults.correctedUrl}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyFixed}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-green-50/50 border border-green-200/50 dark:bg-green-950/20 dark:border-green-800/50 rounded-lg">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                No issues found! Your UTM structure is perfect.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
