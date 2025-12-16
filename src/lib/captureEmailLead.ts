import { supabase } from "@/integrations/supabase/client";
import { checkEmailQuality } from "@/shared-core/email/emailQuality";

interface CaptureEmailOptions {
  email: string;
  source: string;
  referralCode?: string | null;
  pageUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Capture an email lead immediately (fire-and-forget)
 * This stores the email even if the user doesn't complete the full signup
 */
export const captureEmailLead = async ({
  email,
  source,
  referralCode,
  pageUrl,
  metadata,
}: CaptureEmailOptions): Promise<void> => {
  try {
    const quality = checkEmailQuality(email, { allowDisposable: true });
    if (!quality.ok && quality.reason !== "disposable") {
      console.warn("Skipped capturing clearly invalid email", quality);
      return;
    }

    const normalizedEmail = quality.normalizedEmail || email.trim().toLowerCase();

    // Fire-and-forget - don't await, don't block the UI
    supabase.functions.invoke('capture-email-lead', {
      body: {
        email: normalizedEmail,
        source,
        referralCode,
        pageUrl: pageUrl || window.location.href,
        metadata: {
          ...metadata,
          normalized_email: normalizedEmail,
          email_quality_reason: quality.reason,
          is_disposable: quality.reason === "disposable",
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      },
    }).catch((err) => {
      // Log but don't throw - this is non-blocking
      console.warn('Email lead capture failed:', err);
    });
  } catch (error) {
    // Silently fail - don't block user flow
    console.warn('Email lead capture error:', error);
  }
};

/**
 * Mark an email lead as converted (called after full signup)
 */
export const markEmailLeadConverted = async (email: string): Promise<void> => {
  try {
    await supabase.functions.invoke('capture-email-lead', {
      body: {
        email,
        source: 'conversion',
        metadata: {
          converted: true,
          convertedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.warn('Failed to mark email lead as converted:', error);
  }
};
