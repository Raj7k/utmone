import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

export const useLinkWebhooks = (workspaceId: string) => {
  const { data: webhooks } = useQuery({
    queryKey: ["webhooks", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('webhook_subscriptions')
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  const triggerWebhook = async (event: string, data: any) => {
    if (!webhooks || webhooks.length === 0) return;

    const matchingWebhooks = webhooks.filter((w) => w.event_type.split(",").includes(event));

    for (const webhook of matchingWebhooks) {
      try {
        await supabase.functions.invoke("send-webhook", {
          body: {
            event,
            data,
            webhookUrl: webhook.webhook_url,
            secretEncrypted: webhook.secret_encrypted,
          },
        });
      } catch (error) {
        console.error("Webhook delivery failed:", error);
      }
    }
  };

  return { triggerWebhook };
};
