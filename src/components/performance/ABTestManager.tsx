import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useABTests } from "@/hooks/useABTests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, FlaskConical, Play, Pause, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export function ABTestManager() {
  const { currentWorkspace } = useWorkspace();
  const { tests, isLoading, createTest, updateTest } = useABTests(currentWorkspace?.id || "");
  const [open, setOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    createTest.mutate({
      workspace_id: currentWorkspace?.id || "",
      link_id: "", // Would be selected from a link picker
      test_name: testName,
      description,
      status: "draft",
      traffic_split: { A: 50, B: 50 },
    });
    setOpen(false);
    setTestName("");
    setDescription("");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "secondary",
      running: "default",
      paused: "outline",
      completed: "secondary",
    };
    return colors[status] || "secondary";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-3 w-3" />;
      case "paused":
        return <Pause className="h-3 w-3" />;
      case "completed":
        return <Trophy className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              A/B Tests
            </CardTitle>
            <CardDescription>
              Test different destinations to optimize link performance
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create A/B Test</DialogTitle>
                <DialogDescription>
                  Test multiple destination URLs to find the best performer
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Test Name</Label>
                  <Input
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Homepage vs Landing Page"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Testing which destination converts better..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!testName}>
                  Create Test
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading tests...</div>
          ) : tests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No A/B tests yet. Create your first test to optimize link performance.
            </div>
          ) : (
            <div className="space-y-3">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {test.test_name}
                        <Badge variant={getStatusColor(test.status) as any} className="text-xs">
                          {getStatusIcon(test.status)}
                          <span className="ml-1">{test.status}</span>
                        </Badge>
                      </div>
                      {test.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {test.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {test.status === "running" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Traffic Split</span>
                      </div>
                      <Progress value={50} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span>Variant A: 50%</span>
                        <span>Variant B: 50%</span>
                      </div>
                    </div>
                  )}

                  {test.winner_variant_id && (
                    <div className="text-sm p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">Winner declared</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
