import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertCircle, Clock } from "lucide-react";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";

// Formats "2026-04-14T13:57:32Z" → "3m 42s" until that moment. Returns null
// if the target is in the past.
function formatRemaining(targetIso: string | null): string | null {
  if (!targetIso) return null;
  const ms = new Date(targetIso).getTime() - Date.now();
  if (ms <= 0) return null;
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function PasswordProtected() {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const linkId = searchParams.get('link');
  const hint = searchParams.get('hint');

  // Tick the countdown once per second while a lockout is active.
  useEffect(() => {
    if (!lockedUntil) {
      setRemaining(null);
      return;
    }
    const tick = () => {
      const r = formatRemaining(lockedUntil);
      setRemaining(r);
      if (!r) {
        // Lockout expired — clear and let the user try again.
        setLockedUntil(null);
        setAttemptError(null);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = !!lockedUntil && !!remaining;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isVerifying) return;

    setIsVerifying(true);
    setAttemptError(null);

    try {
      // The edge function returns HTTP 429 with { error, locked_until } when
      // the rate limiter has locked this (link, ip) pair out. supabase-js
      // surfaces non-2xx as `error`; the body is still parsed into `data`
      // when the function sets `Content-Type: application/json`.
      const { data, error } = await supabase.functions.invoke('verify-link-password', {
        body: { linkId, password },
      });

      // Detect 429/lockout regardless of whether supabase-js returns an error
      // or a data payload.
      const payload: any = data ?? (error as any)?.context?.response
        ? await (error as any)?.context?.response?.json().catch(() => null)
        : null;

      const lockIso: string | null =
        (data && (data as any).locked_until) || (payload && payload.locked_until) || null;

      if (lockIso) {
        setLockedUntil(lockIso);
        setAttemptError('too many attempts. please wait before trying again.');
        return;
      }

      if (error || !data?.valid) {
        setAttemptError('incorrect password. please try again.');
        return;
      }

      // Success — redirect to the destination.
      window.location.href = data.finalUrl;
    } catch (err: any) {
      console.error('[PasswordProtected] Verify failed:', err);
      setAttemptError('could not verify password. please try again.');
      notify.error('failed to verify password');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <ObsidianMarketingLayout showFloatingNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              {isLocked ? (
                <Clock className="w-6 h-6 text-destructive" />
              ) : (
                <Lock className="w-6 h-6 text-foreground" />
              )}
            </div>
            <CardTitle className="text-foreground">
              {isLocked ? '🔒 temporarily locked' : '🔒 password protected link'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLocked
                ? `for security, password attempts are paused. try again in ${remaining}.`
                : 'this link is password protected. please enter the password to continue.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {hint && !isLocked && (
                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">hint:</span> {hint}
                  </p>
                </div>
              )}

              {attemptError && (
                <div
                  role="alert"
                  className="p-3 bg-destructive/10 rounded-lg border border-destructive/30 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-destructive">
                    {attemptError}
                    {isLocked && remaining && (
                      <div className="text-xs text-destructive/80 mt-1">
                        unlocks in <span className="font-mono">{remaining}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Input
                type="password"
                placeholder={isLocked ? 'locked' : 'enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus={!isLocked}
                disabled={isLocked || isVerifying}
                className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground disabled:opacity-60"
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLocked || isVerifying || !password}
              >
                {isLocked ? `locked — try again in ${remaining}` : isVerifying ? 'verifying...' : 'unlock link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ObsidianMarketingLayout>
  );
}
