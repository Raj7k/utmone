import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { runAllTests, TestResult } from "@/lib/testUtils";
import { TestResultCard } from "@/components/testing/TestResultCard";
import { Loader2, Play, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function SystemTests() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testLinkId, setTestLinkId] = useState("");
  const [testShortUrl, setTestShortUrl] = useState("");
  const { toast } = useToast();

  // Get user's workspace
  const { data: workspace } = useQuery({
    queryKey: ["user-workspace"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Get a sample link for testing
  const { data: sampleLink } = useQuery({
    queryKey: ["sample-link", workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return null;

      const { data, error } = await supabase
        .from("links")
        .select("id, short_url")
        .eq("workspace_id", workspace.id)
        .eq("status", "active")
        .limit(1)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!workspace?.id
  });

  const runTests = async () => {
    if (!workspace?.id) {
      toast({
        title: "Error",
        description: "No workspace found. Please create a workspace first.",
        variant: "destructive"
      });
      return;
    }

    const linkId = testLinkId || sampleLink?.id;
    const shortUrl = testShortUrl || sampleLink?.short_url;

    if (!linkId || !shortUrl) {
      toast({
        title: "Missing Test Data",
        description: "Please provide a link ID and short URL, or create a link first.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setResults([]);

    try {
      const testResults = await runAllTests(workspace.id, linkId, shortUrl);
      setResults(testResults);

      const passedCount = testResults.filter(r => r.passed).length;
      const totalCount = testResults.length;

      toast({
        title: "Tests Complete",
        description: `${passedCount}/${totalCount} tests passed`,
        variant: passedCount === totalCount ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Suite Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">System Tests</h1>
        <p className="text-secondary-label">
          Run critical path tests to verify core functionality
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>
            Configure test parameters or use auto-detected values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspaceId">Workspace ID</Label>
            <Input
              id="workspaceId"
              value={workspace?.id || ""}
              disabled
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkId">Test Link ID (optional)</Label>
            <Input
              id="linkId"
              value={testLinkId}
              onChange={(e) => setTestLinkId(e.target.value)}
              placeholder={sampleLink?.id || "Auto-detect from workspace"}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortUrl">Test Short URL (optional)</Label>
            <Input
              id="shortUrl"
              value={testShortUrl}
              onChange={(e) => setTestShortUrl(e.target.value)}
              placeholder={sampleLink?.short_url || "Auto-detect from workspace"}
              className="font-mono text-sm"
            />
          </div>

          <Button
            onClick={runTests}
            disabled={isRunning || !workspace?.id}
            className="w-full gap-2"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Run All Tests
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Test Results</span>
                <div className="flex items-center gap-2">
                  {passedCount === totalCount ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">All Passed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{passedCount}/{totalCount} Passed</span>
                    </div>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                Total duration: {results.reduce((sum, r) => sum + r.duration, 0)}ms
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {results.map((result, index) => (
              <TestResultCard key={index} result={result} />
            ))}
          </div>
        </>
      )}

      {results.length === 0 && !isRunning && (
        <Card className="p-12 text-center">
          <p className="text-secondary-label">
            No test results yet. Click "Run All Tests" to start testing.
          </p>
        </Card>
      )}
    </div>
  );
}
