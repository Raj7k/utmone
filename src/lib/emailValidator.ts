import {
  CheckEmailQualityOptions,
  EmailQualityReason,
  checkEmailQuality,
} from "@/shared-core/email/emailQuality";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
  severity?: "error" | "warning";
  normalizedEmail?: string | null;
  reason?: EmailQualityReason;
  isDisposable?: boolean;
}

const REASON_COPY: Record<EmailQualityReason, string> = {
  ok: "",
  empty: "email is required",
  invalid_format: "please enter a valid email address",
  invalid_domain: "please check your email domain",
  disposable: "please use a work or personal email (temporary inboxes get blocked)",
  blocked: "please use a real email address",
};

export const validateEmailSmart = (
  email: string,
  options: CheckEmailQualityOptions = {},
): ValidationResult => {
  const quality = checkEmailQuality(email, options);
  const errorMessage = REASON_COPY[quality.reason];
  const shouldShowMessage = !quality.ok || quality.reason === "disposable";

  return {
    isValid: quality.ok,
    error: shouldShowMessage
      ? quality.suggestion
        ? `did you mean ${quality.suggestion}?`
        : errorMessage
      : undefined,
    suggestion: quality.suggestion,
    severity:
      quality.reason === "disposable"
        ? quality.ok
          ? "warning"
          : "error"
        : quality.suggestion
          ? "warning"
          : "error",
    normalizedEmail: quality.normalizedEmail,
    reason: quality.reason,
    isDisposable: quality.reason === "disposable",
  };
};

export const isEmailLikelyValid = (email: string): boolean => {
  const trimmed = email.trim();
  if (!trimmed || trimmed.length < 5 || !trimmed.includes("@")) return false;
  const [_, domain] = trimmed.split("@");
  return !!domain && domain.includes(".");
};
