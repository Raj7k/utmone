import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FlagDetailedAnalytics } from "@/components/admin/FlagDetailedAnalytics";

export default function FlagDetails() {
  const { flagKey } = useParams<{ flagKey: string }>();
  const navigate = useNavigate();

  if (!flagKey) {
    return <div>Flag not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/system')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          back to system monitoring
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          <code className="font-mono">{flagKey}</code>
        </h1>
        <p className="text-muted-foreground">
          detailed analytics and performance impact analysis
        </p>
      </div>

      <FlagDetailedAnalytics flagKey={flagKey} />
    </div>
  );
}
