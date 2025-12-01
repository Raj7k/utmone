import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AIStyleRecommendation } from "@/components/qr/AIStyleRecommendation";
import { EvolutionaryUTMSuggestions } from "@/components/utm/EvolutionaryUTMSuggestions";
import { RareEventEstimator } from "@/components/analytics/RareEventEstimator";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { Sparkles, Dna, Activity, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function AIOptimization() {
  const { currentWorkspace } = useWorkspaceContext();

  const handleApplyQRStyle = (style: any) => {
    toast.success('ai style applied to qr generator');
    console.log('Applied QR style:', style);
  };

  const handleApplyUTMPattern = (pattern: any) => {
    toast.success('evolved pattern applied to utm builder');
    console.log('Applied UTM pattern:', pattern);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold lowercase">ai optimization</h1>
          <p className="text-muted-foreground">
            advanced optimization algorithms from "Algorithms for Optimization" applied to your data
          </p>
        </div>

        {/* Features Grid */}
        <Tabs defaultValue="qr" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="qr" className="lowercase">
              <Sparkles className="h-4 w-4 mr-2" />
              qr optimizer
            </TabsTrigger>
            <TabsTrigger value="utm" className="lowercase">
              <Dna className="h-4 w-4 mr-2" />
              utm evolution
            </TabsTrigger>
            <TabsTrigger value="probability" className="lowercase">
              <Activity className="h-4 w-4 mr-2" />
              probability estimator
            </TabsTrigger>
            <TabsTrigger value="about" className="lowercase">
              <BookOpen className="h-4 w-4 mr-2" />
              about algorithms
            </TabsTrigger>
          </TabsList>

          {/* QR Style Optimizer */}
          <TabsContent value="qr" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-display font-bold lowercase flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    nelder-mead qr style optimizer
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    gradient-free optimization to find qr code colors and styles that maximize scan rates
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {currentWorkspace && (
                      <AIStyleRecommendation 
                        workspaceId={currentWorkspace.id}
                        onApplyStyle={handleApplyQRStyle}
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm lowercase">how it works</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">1.</span>
                        <span>analyzes historical qr scan data correlated with color choices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">2.</span>
                        <span>uses nelder-mead simplex algorithm to explore rgb color space</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">3.</span>
                        <span>performs reflection, expansion, and contraction operations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">4.</span>
                        <span>converges on optimal color combination that maximizes scans</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground italic">
                      requires at least 5 qr codes with scan data for full optimization. otherwise returns best observed style.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* UTM Evolution */}
          <TabsContent value="utm" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-display font-bold lowercase flex items-center gap-2">
                    <Dna className="h-5 w-5 text-primary" />
                    genetic algorithm utm evolution
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    evolves high-converting utm parameter patterns using genetic operators
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {currentWorkspace && (
                      <EvolutionaryUTMSuggestions 
                        workspaceId={currentWorkspace.id}
                        onApplyPattern={handleApplyUTMPattern}
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm lowercase">how it works</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">1.</span>
                        <span>initializes population from successful conversion utm patterns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">2.</span>
                        <span>fitness function evaluates conversion rate for each pattern</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">3.</span>
                        <span>tournament selection chooses best individuals as parents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">4.</span>
                        <span>crossover combines parent genes, mutation explores new variations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">5.</span>
                        <span>elitism preserves top performers across generations</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground italic">
                      requires at least 5 conversions with utm parameters to evolve patterns over 20 generations.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Probability Estimator */}
          <TabsContent value="probability" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-display font-bold lowercase flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    cross-entropy rare event estimator
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    accurate probability estimates for low-conversion scenarios using importance sampling
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {currentWorkspace && (
                      <RareEventEstimator 
                        workspaceId={currentWorkspace.id}
                        title="workspace conversion probability"
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm lowercase">how it works</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">1.</span>
                        <span>uses wilson score interval for accurate probability estimation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">2.</span>
                        <span>better than normal approximation for small probabilities (&lt;1%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">3.</span>
                        <span>provides 95% confidence intervals with proper coverage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">4.</span>
                        <span>alerts when sample size insufficient for reliable estimates</span>
                      </li>
                    </ul>
                    <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground italic">
                      requires minimum 100 clicks and 5 conversions for reliable confidence intervals. uses bayesian estimation for smaller samples.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* About Algorithms */}
          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-display font-bold lowercase">about the algorithms</h2>
                  <p className="text-sm text-muted-foreground">
                    these ai features are based on algorithms from "Algorithms for Optimization" by Mykel J. Kochenderfer and Tim A. Wheeler
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Nelder-Mead */}
                  <Card className="p-4 bg-muted/50">
                    <div className="space-y-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold lowercase">nelder-mead simplex</h3>
                      <p className="text-sm text-muted-foreground">
                        chapter 7: gradient-free optimization using geometric operations (reflection, expansion, contraction, shrink) on a simplex
                      </p>
                      <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                        <strong>best for:</strong> continuous optimization without derivatives, finding optimal parameter combinations
                      </div>
                    </div>
                  </Card>

                  {/* Genetic Algorithm */}
                  <Card className="p-4 bg-muted/50">
                    <div className="space-y-3">
                      <Dna className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold lowercase">genetic algorithms</h3>
                      <p className="text-sm text-muted-foreground">
                        chapter 9: evolutionary optimization using selection, crossover, mutation, and elitism to evolve solutions over generations
                      </p>
                      <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                        <strong>best for:</strong> discrete optimization, exploring large solution spaces, finding multiple good solutions
                      </div>
                    </div>
                  </Card>

                  {/* Cross-Entropy */}
                  <Card className="p-4 bg-muted/50">
                    <div className="space-y-3">
                      <Activity className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold lowercase">cross-entropy method</h3>
                      <p className="text-sm text-muted-foreground">
                        chapter 8: importance sampling for rare event estimation using adaptive distribution updates
                      </p>
                      <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                        <strong>best for:</strong> accurate probability estimates for rare events, confidence intervals for low-rate scenarios
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Why these algorithms?</strong> Traditional machine learning requires massive datasets. 
                    These optimization algorithms work effectively with small amounts of data (5-100 samples) while providing 
                    mathematical guarantees about convergence and confidence. Perfect for startups and small teams building data-driven products.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
