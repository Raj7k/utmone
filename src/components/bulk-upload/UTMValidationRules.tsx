import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export interface UTMValidationRule {
  parameter: "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content";
  required: boolean;
  pattern?: string;
  allowedValues?: string[];
  errorMessage?: string;
}

interface UTMValidationRulesProps {
  rules: UTMValidationRule[];
  onChange: (rules: UTMValidationRule[]) => void;
}

const DEFAULT_RULES: UTMValidationRule[] = [
  { parameter: "utm_source", required: true },
  { parameter: "utm_medium", required: true },
  { parameter: "utm_campaign", required: true },
  { parameter: "utm_term", required: false },
  { parameter: "utm_content", required: false },
];

export function UTMValidationRules({ rules, onChange }: UTMValidationRulesProps) {
  const [testValue, setTestValue] = useState("");
  const [testParameter, setTestParameter] = useState<string>("utm_source");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const currentRules = rules.length > 0 ? rules : DEFAULT_RULES;

  const updateRule = (parameter: string, updates: Partial<UTMValidationRule>) => {
    const updatedRules = currentRules.map((rule) =>
      rule.parameter === parameter ? { ...rule, ...updates } : rule
    );
    onChange(updatedRules);
  };

  const getRule = (parameter: string) => {
    return currentRules.find((r) => r.parameter === parameter) || DEFAULT_RULES.find((r) => r.parameter === parameter)!;
  };

  const validateValue = (value: string, parameter: string): { valid: boolean; message: string } => {
    const rule = getRule(parameter);

    if (rule.required && !value) {
      return { valid: false, message: `${parameter} is required` };
    }

    if (rule.pattern) {
      try {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(value)) {
          return {
            valid: false,
            message: rule.errorMessage || `${parameter} does not match the required pattern`,
          };
        }
      } catch (e) {
        return { valid: false, message: "invalid regex pattern" };
      }
    }

    if (rule.allowedValues && rule.allowedValues.length > 0) {
      if (!rule.allowedValues.includes(value)) {
        return {
          valid: false,
          message: `${parameter} must be one of: ${rule.allowedValues.join(", ")}`,
        };
      }
    }

    return { valid: true, message: `${parameter} is valid` };
  };

  const handleTest = () => {
    const result = validateValue(testValue, testParameter);
    setValidationResult(result);
    if (result.valid) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">UTM validation rules</h3>
      <p className="text-sm text-muted-foreground mb-6">
        define validation rules for UTM parameters to maintain consistency
      </p>

      <div className="space-y-6">
        {currentRules.map((rule) => (
          <div key={rule.parameter} className="space-y-3 pb-6 border-b last:border-b-0">
            <div className="flex items-center justify-between">
              <Label className="font-medium">{rule.parameter}</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">required</span>
                <Switch
                  checked={rule.required}
                  onCheckedChange={(checked) =>
                    updateRule(rule.parameter, { required: checked })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`${rule.parameter}-pattern`} className="text-sm">
                regex pattern (optional)
              </Label>
              <Input
                id={`${rule.parameter}-pattern`}
                placeholder="e.g., ^[a-z0-9-]+$ (lowercase alphanumeric with hyphens)"
                value={rule.pattern || ""}
                onChange={(e) =>
                  updateRule(rule.parameter, { pattern: e.target.value || undefined })
                }
                className="mt-1 font-mono text-xs"
              />
            </div>

            <div>
              <Label htmlFor={`${rule.parameter}-allowed`} className="text-sm">
                allowed values (comma-separated, optional)
              </Label>
              <Input
                id={`${rule.parameter}-allowed`}
                placeholder="e.g., email,social,paid,organic"
                value={rule.allowedValues?.join(",") || ""}
                onChange={(e) =>
                  updateRule(rule.parameter, {
                    allowedValues: e.target.value ? e.target.value.split(",").map((v) => v.trim()) : undefined,
                  })
                }
                className="mt-1"
              />
              {rule.allowedValues && rule.allowedValues.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {rule.allowedValues.map((val) => (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {val}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor={`${rule.parameter}-error`} className="text-sm">
                custom error message (optional)
              </Label>
              <Input
                id={`${rule.parameter}-error`}
                placeholder="e.g., utm_source must be lowercase with hyphens only"
                value={rule.errorMessage || ""}
                onChange={(e) =>
                  updateRule(rule.parameter, { errorMessage: e.target.value || undefined })
                }
                className="mt-1"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Test Validation */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-semibold mb-3">test validation</h4>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-md text-sm"
            value={testParameter}
            onChange={(e) => setTestParameter(e.target.value)}
          >
            {currentRules.map((rule) => (
              <option key={rule.parameter} value={rule.parameter}>
                {rule.parameter}
              </option>
            ))}
          </select>
          <Input
            placeholder="enter test value..."
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTest}>test</Button>
        </div>
        {validationResult && (
          <div
            className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
              validationResult.valid ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
            }`}
          >
            {validationResult.valid ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-sm">{validationResult.message}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
