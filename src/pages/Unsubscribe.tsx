import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };

    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <Link to="/" className="inline-block text-xl font-display font-bold text-foreground">
          utm.one
        </Link>

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">verifying your request...</p>
          </div>
        )}

        {status === "valid" && (
          <div className="space-y-4">
            <Mail className="w-10 h-10 mx-auto text-foreground" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              unsubscribe from emails
            </h1>
            <p className="text-muted-foreground">
              you'll stop receiving app emails from utm.one. authentication emails (password reset, etc.) are not affected.
            </p>
            <Button
              onClick={handleUnsubscribe}
              disabled={processing}
              className="w-full"
              variant="destructive"
            >
              {processing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> processing...</>
              ) : (
                "confirm unsubscribe"
              )}
            </Button>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-10 h-10 mx-auto text-green-500" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              you've been unsubscribed
            </h1>
            <p className="text-muted-foreground">
              you won't receive any more app emails from us.
            </p>
          </div>
        )}

        {status === "already" && (
          <div className="space-y-4">
            <CheckCircle className="w-10 h-10 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              already unsubscribed
            </h1>
            <p className="text-muted-foreground">
              you're already unsubscribed from app emails.
            </p>
          </div>
        )}

        {status === "invalid" && (
          <div className="space-y-4">
            <XCircle className="w-10 h-10 mx-auto text-destructive" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              invalid link
            </h1>
            <p className="text-muted-foreground">
              this unsubscribe link is invalid or has expired.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-10 h-10 mx-auto text-destructive" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              something went wrong
            </h1>
            <p className="text-muted-foreground">
              please try again later or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
