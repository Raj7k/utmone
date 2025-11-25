import { useParams } from "react-router-dom";
import { EnhancedTargetingRulesManager } from "@/components/links/EnhancedTargetingRulesManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Targeting() {
  const { linkId } = useParams<{ linkId?: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">targeting rules</h1>
        <p className="text-muted-foreground mt-2">
          create conditional redirects based on country, device, browser, and more
        </p>
      </div>

      {linkId ? (
        <EnhancedTargetingRulesManager linkId={linkId} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>select a link</CardTitle>
            <CardDescription>
              choose a link from your links page to manage its targeting rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              targeting rules allow you to redirect users to different destinations based on their
              location, device, operating system, browser, or language.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
