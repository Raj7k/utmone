import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Monitor, CheckCircle2 } from "lucide-react";

interface ManualTest {
  id: string;
  category: 'mobile' | 'browser' | 'accessibility';
  label: string;
  description: string;
}

const manualTests: ManualTest[] = [
  // Mobile Responsiveness
  { id: 'm1', category: 'mobile', label: 'Dashboard on iPhone SE (375px)', description: 'Check if dashboard loads correctly' },
  { id: 'm2', category: 'mobile', label: 'Links table on tablet', description: 'Verify horizontal scroll works' },
  { id: 'm3', category: 'mobile', label: 'QR preview on mobile', description: 'Check if QR code preview fits viewport' },
  { id: 'm4', category: 'mobile', label: 'Mobile navigation', description: 'Test drawer open/close functionality' },
  { id: 'm5', category: 'mobile', label: 'Pull-to-refresh', description: 'Verify pull-to-refresh on links page' },
  { id: 'm6', category: 'mobile', label: 'Swipe gestures', description: 'Test swipe on analytics tabs' },
  
  // Cross-Browser
  { id: 'b1', category: 'browser', label: 'Chrome (latest)', description: 'Verify all features work' },
  { id: 'b2', category: 'browser', label: 'Safari (latest)', description: 'Check QR download works' },
  { id: 'b3', category: 'browser', label: 'Firefox (latest)', description: 'Verify form validation displays' },
  { id: 'b4', category: 'browser', label: 'Edge (latest)', description: 'Check auth flow completes' },
  
  // Accessibility
  { id: 'a1', category: 'accessibility', label: 'Keyboard navigation', description: 'Navigate through all forms with keyboard' },
  { id: 'a2', category: 'accessibility', label: 'Screen reader', description: 'Check if form errors are announced' },
  { id: 'a3', category: 'accessibility', label: 'Focus indicators', description: 'Verify visible focus on interactive elements' },
  { id: 'a4', category: 'accessibility', label: 'Skip to content', description: 'Test skip-to-content link works' }
];

export const ManualTestChecklist = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('manual-test-checklist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompleted(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse saved checklist:', e);
      }
    }
  }, []);

  // Save to localStorage when completed changes
  useEffect(() => {
    localStorage.setItem('manual-test-checklist', JSON.stringify(Array.from(completed)));
  }, [completed]);

  const handleToggle = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all manual tests?')) {
      setCompleted(new Set());
    }
  };

  const mobileTests = manualTests.filter(t => t.category === 'mobile');
  const browserTests = manualTests.filter(t => t.category === 'browser');
  const accessibilityTests = manualTests.filter(t => t.category === 'accessibility');

  const mobileProgress = (mobileTests.filter(t => completed.has(t.id)).length / mobileTests.length) * 100;
  const browserProgress = (browserTests.filter(t => completed.has(t.id)).length / browserTests.length) * 100;
  const accessibilityProgress = (accessibilityTests.filter(t => completed.has(t.id)).length / accessibilityTests.length) * 100;

  const overallProgress = (completed.size / manualTests.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manual Testing Progress</h3>
          <p className="text-sm text-muted-foreground">
            {completed.size}/{manualTests.length} tests completed ({overallProgress.toFixed(0)}%)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset All
        </Button>
      </div>

      <Progress value={overallProgress} className="h-2" />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Mobile Responsiveness</CardTitle>
            </div>
            <CardDescription>
              {mobileTests.filter(t => completed.has(t.id)).length}/{mobileTests.length} complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={mobileProgress} className="h-1" />
            {mobileTests.map(test => (
              <div key={test.id} className="flex items-start gap-3">
                <Checkbox
                  id={test.id}
                  checked={completed.has(test.id)}
                  onCheckedChange={() => handleToggle(test.id)}
                  className="mt-1"
                />
                <label htmlFor={test.id} className="cursor-pointer flex-1">
                  <div className="font-medium text-sm">{test.label}</div>
                  <div className="text-xs text-muted-foreground">{test.description}</div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              <CardTitle>Cross-Browser</CardTitle>
            </div>
            <CardDescription>
              {browserTests.filter(t => completed.has(t.id)).length}/{browserTests.length} complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={browserProgress} className="h-1" />
            {browserTests.map(test => (
              <div key={test.id} className="flex items-start gap-3">
                <Checkbox
                  id={test.id}
                  checked={completed.has(test.id)}
                  onCheckedChange={() => handleToggle(test.id)}
                  className="mt-1"
                />
                <label htmlFor={test.id} className="cursor-pointer flex-1">
                  <div className="font-medium text-sm">{test.label}</div>
                  <div className="text-xs text-muted-foreground">{test.description}</div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <CardTitle>Accessibility</CardTitle>
            </div>
            <CardDescription>
              {accessibilityTests.filter(t => completed.has(t.id)).length}/{accessibilityTests.length} complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={accessibilityProgress} className="h-1" />
            {accessibilityTests.map(test => (
              <div key={test.id} className="flex items-start gap-3">
                <Checkbox
                  id={test.id}
                  checked={completed.has(test.id)}
                  onCheckedChange={() => handleToggle(test.id)}
                  className="mt-1"
                />
                <label htmlFor={test.id} className="cursor-pointer flex-1">
                  <div className="font-medium text-sm">{test.label}</div>
                  <div className="text-xs text-muted-foreground">{test.description}</div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
