/**
 * AI Time Optimizer Page
 * Gaussian Process predictions for optimal link sharing times
 */

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { AITimeRecommendations } from '@/components/analytics/AITimeRecommendations';
import { ConfidenceChart } from '@/components/analytics/ConfidenceChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, BookOpen } from 'lucide-react';

export default function AITimeOptimizer() {
  const { currentWorkspace } = useWorkspaceContext();

  if (!currentWorkspace) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-title-2">no workspace selected</CardTitle>
            <CardDescription>please select a workspace to view ai predictions</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 rounded-lg p-2">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-large-title font-display font-bold text-label">ai time optimizer</h1>
        </div>
        <p className="text-body-apple text-secondary-label max-w-3xl">
          gaussian process predictions from "algorithms for optimization" - predicts optimal times to share your links with uncertainty quantification
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList>
          <TabsTrigger value="recommendations">
            <TrendingUp className="h-4 w-4 mr-2" />
            recommendations
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <Sparkles className="h-4 w-4 mr-2" />
            weekly pattern
          </TabsTrigger>
          <TabsTrigger value="about">
            <BookOpen className="h-4 w-4 mr-2" />
            how it works
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <AITimeRecommendations workspaceId={currentWorkspace.id} days={30} />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConfidenceChart workspaceId={currentWorkspace.id} days={30} selectedDay={1} />
            <ConfidenceChart workspaceId={currentWorkspace.id} days={30} selectedDay={2} />
            <ConfidenceChart workspaceId={currentWorkspace.id} days={30} selectedDay={3} />
            <ConfidenceChart workspaceId={currentWorkspace.id} days={30} selectedDay={4} />
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-title-2">how ai time optimizer works</CardTitle>
              <CardDescription>powered by gaussian process regression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-title-3 font-display font-semibold mb-3">gaussian process regression</h3>
                <p className="text-body-apple text-secondary-label mb-4">
                  based on chapter 18 of "algorithms for optimization", gaussian processes (gps) are a powerful method for modeling time-series data with uncertainty quantification. 
                  unlike simple averages, gps provide both a prediction and confidence interval for every time slot.
                </p>
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
                  <p className="text-tertiary-label mb-2">mathematical formulation:</p>
                  <code className="text-label">
                    μ(x*) = k(x*, X)ᵀ K⁻¹ y<br />
                    σ²(x*) = k(x*,x*) - k(x*, X)ᵀ K⁻¹ k(X,x*)
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-title-3 font-display font-semibold mb-3">rbf kernel</h3>
                <p className="text-body-apple text-secondary-label mb-4">
                  the radial basis function (rbf) kernel measures similarity between time slots. time slots that are close together (e.g., tuesday 2pm and tuesday 3pm) 
                  have high correlation in click patterns.
                </p>
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
                  <code className="text-label">
                    k(x, x') = σ² × exp(-||x - x'||² / (2l²))
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-title-3 font-display font-semibold mb-3">expected improvement</h3>
                <p className="text-body-apple text-secondary-label mb-4">
                  from chapter 19, expected improvement (ei) balances exploration vs exploitation. it suggests time slots that are both high-performing (exploitation) 
                  and under-explored (exploration). high ei means "worth trying - could be great but we don't have much data."
                </p>
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
                  <code className="text-label">
                    EI(x) = σ(x) × [z × Φ(z) + φ(z)]<br />
                    where z = (μ(x) - best_so_far) / σ(x)
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-title-3 font-display font-semibold mb-3">confidence intervals</h3>
                <p className="text-body-apple text-secondary-label">
                  95% confidence intervals show prediction uncertainty. wider intervals mean higher uncertainty, narrower intervals mean the model is confident. 
                  this helps you understand prediction reliability.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <p className="text-sm text-label">
                  <strong className="text-primary">competitive advantage:</strong> no other link shortener uses gaussian process regression for time predictions. 
                  most use simple historical averages which ignore uncertainty and fail to explore new opportunities.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
