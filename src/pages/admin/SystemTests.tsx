import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { runAllTests, TestResult } from "@/lib/testUtils";
import { TestResultCard } from "@/components/testing/TestResultCard";
import { TestDashboard } from "@/components/testing/TestDashboard";
import { TestCategoryTabs } from "@/components/testing/TestCategoryTabs";
import { ManualTestChecklist } from "@/components/testing/ManualTestChecklist";
import { runAllRLSTests } from "@/lib/rlsTests";
import { runAllHealthChecks } from "@/lib/dbHealthCheck";
import { testRedirectEdgeFunction, testLinkPreviewFunction, testBulkCreateLinks, testTeamInviteFunction } from "@/lib/edgeFunctionTests";
import { Loader2, Play, Download, History, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TestCategory, saveTestHistory, getTestHistory, exportTestResults } from "@/lib/testRunner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SystemTests() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testLinkId, setTestLinkId] = useState("");
  const [testShortUrl, setTestShortUrl] = useState("");
  const [activeCategory, setActiveCategory] = useState<TestCategory | 'all'>('all');
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const testHistory = getTestHistory();

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

  const runTests = async (category: TestCategory | 'all' = 'all') => {
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
      let testResults: TestResult[] = [];

      if (category === 'all') {
        // Run all tests
        const coreTests = await runAllTests(workspace.id, linkId, shortUrl);
        const rlsTests = await runAllRLSTests(workspace.id, linkId);
        const healthTests = await runAllHealthChecks();
        const edgeTests = [
          await testRedirectEdgeFunction(shortUrl),
          await testLinkPreviewFunction(),
          await testBulkCreateLinks(workspace.id),
          await testTeamInviteFunction(workspace.id)
        ];

        testResults = [...coreTests, ...rlsTests, ...healthTests, ...edgeTests];
      } else {
        // Run category-specific tests
        switch (category) {
          case 'redirects':
            testResults = [await testRedirectEdgeFunction(shortUrl)];
            break;
          case 'database':
            testResults = await runAllHealthChecks();
            break;
          case 'link-management':
            testResults = await runAllTests(workspace.id, linkId, shortUrl);
            break;
          // Add more category handlers as needed
        }
      }

      setResults(testResults);
      saveTestHistory(category, testResults);

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

  const handleExport = () => {
    if (results.length === 0) {
      toast({
        title: "No Results",
        description: "Run tests first before exporting results.",
        variant: "destructive"
      });
      return;
    }
    exportTestResults(results);
    toast({
      title: "Exported",
      description: "Test results exported successfully"
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-6xl">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">System Tests</h1>
        <p className="text-secondary-label">
          Comprehensive end-to-end testing suite for all major user flows
        </p>
      </div>

      <Tabs defaultValue="automated" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="automated">Automated Tests</TabsTrigger>
          <TabsTrigger value="manual">Manual Tests</TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Configure test parameters or use auto-detected values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
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
                    placeholder={sampleLink?.id || "Auto-detect"}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortUrl">Test Short URL (optional)</Label>
                  <Input
                    id="shortUrl"
                    value={testShortUrl}
                    onChange={(e) => setTestShortUrl(e.target.value)}
                    placeholder={sampleLink?.short_url || "Auto-detect"}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => runTests('all')}
                  disabled={isRunning || !workspace?.id}
                  className="flex-1 gap-2"
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
                
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={results.length === 0}
                  className="gap-2"
                  size="lg"
                >
                  <Download className="h-5 w-5" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <>
              <TestDashboard results={results} />

              <TestCategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              <div className="space-y-3">
                {results.map((result, index) => (
                  <TestResultCard key={index} result={result} />
                ))}
              </div>
            </>
          )}

          {results.length === 0 && !isRunning && (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-secondary-label">
                No test results yet. Click "Run All Tests" to start testing.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual">
          <ManualTestChecklist />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {testHistory.length === 0 ? (
            <Card className="p-12 text-center">
              <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-secondary-label">
                No test history yet. Run some tests to see history here.
              </p>
            </Card>
          ) : (
            testHistory.map((entry, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {entry.category === 'all' ? 'All Tests' : entry.category}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <CardDescription>
                    {entry.passRate.toFixed(1)}% pass rate • {entry.totalDuration}ms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-medium">Passed:</span> {entry.results.filter(r => r.passed).length}
                    </div>
                    <div>
                      <span className="font-medium">Failed:</span> {entry.results.filter(r => !r.passed).length}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> {entry.results.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
