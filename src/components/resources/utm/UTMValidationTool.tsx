import { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const UTMValidationTool = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<any>(null);

  const validateUTM = () => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const utmParams = {
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_content: params.get("utm_content") || "",
        utm_term: params.get("utm_term") || ""
      };

      const issues: Array<{ type: "error" | "warning"; message: string; fix: string }> = [];
      let score = 100;

      // Check required parameters
      if (!utmParams.utm_source) {
        issues.push({
          type: "error",
          message: "Missing utm_source (required)",
          fix: "Add utm_source parameter to identify traffic origin"
        });
        score -= 25;
      }
      if (!utmParams.utm_medium) {
        issues.push({
          type: "error",
          message: "Missing utm_medium (required)",
          fix: "Add utm_medium parameter to identify channel type"
        });
        score -= 25;
      }
      if (!utmParams.utm_campaign) {
        issues.push({
          type: "error",
          message: "Missing utm_campaign (required)",
          fix: "Add utm_campaign parameter to group related links"
        });
        score -= 25;
      }

      // Check capitalization
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value && value !== value.toLowerCase()) {
          issues.push({
            type: "warning",
            message: `${key} uses mixed case: "${value}"`,
            fix: `Change to lowercase: "${value.toLowerCase()}"`
          });
          score -= 5;
        }
      });

      // Check special characters
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value && /[^a-z0-9-_]/.test(value)) {
          issues.push({
            type: "warning",
            message: `${key} contains special characters: "${value}"`,
            fix: "Use only lowercase letters, numbers, hyphens, and underscores"
          });
          score -= 5;
        }
      });

      // Check spaces
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value && value.includes(" ")) {
          issues.push({
            type: "warning",
            message: `${key} contains spaces: "${value}"`,
            fix: `Replace spaces with hyphens: "${value.replace(/ /g, "-")}"`
          });
          score -= 5;
        }
      });

      // Check length
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value && value.length > 50) {
          issues.push({
            type: "warning",
            message: `${key} is too long (${value.length} characters)`,
            fix: "Keep parameter values under 50 characters for readability"
          });
          score -= 3;
        }
      });

      setResults({
        utmParams,
        score: Math.max(0, score),
        issues,
        isValid: issues.filter(i => i.type === "error").length === 0
      });
    } catch (error) {
      setResults({
        score: 0,
        issues: [
          {
            type: "error",
            message: "Invalid URL format",
            fix: "Enter a complete URL starting with https://"
          }
        ],
        isValid: false
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div>
        <h4 className="font-semibold text-foreground mb-2">UTM Validation Tool</h4>
        <p className="text-sm text-muted-foreground">
          Paste your UTM-tagged URL to check for issues and get improvement suggestions
        </p>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="https://example.com/page?utm_source=linkedin&utm_medium=paid-social&utm_campaign=q1-launch"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="font-mono text-sm"
        />
        <Button onClick={validateUTM} disabled={!url} className="w-full">
          Validate UTM
        </Button>
      </div>

      {results && (
        <div className="space-y-4">
          {/* Score Badge */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/30">
            <span className="text-sm font-medium text-foreground">Health Score</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  results.score >= 80
                    ? "text-green-500"
                    : results.score >= 60
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {results.score}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          </div>

          {/* Issues */}
          {results.issues.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-foreground">
                Issues Found ({results.issues.length})
              </h5>
              {results.issues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    issue.type === "error"
                      ? "bg-red-50/50 border-red-200/50 dark:bg-red-950/20 dark:border-red-800/50"
                      : "bg-yellow-50/50 border-yellow-200/50 dark:bg-yellow-950/20 dark:border-yellow-800/50"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {issue.type === "error" ? (
                      <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {issue.message}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{issue.fix}</p>
                </div>
              ))}
            </div>
          )}

          {/* Success */}
          {results.issues.length === 0 && (
            <div className="flex items-center gap-2 p-4 bg-green-50/50 border border-green-200/50 dark:bg-green-950/20 dark:border-green-800/50 rounded-lg">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                Perfect! Your UTM structure follows best practices.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
